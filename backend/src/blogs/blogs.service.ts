import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { CreateBlogDto } from './dto/create-blog.dto'
import { UpdateBlogDto } from './dto/update-blog.dto'
import slugify from 'slugify'
import { Queue } from 'bullmq'
import { Inject } from '@nestjs/common'
import { SUMMARY_QUEUE } from '../common/queue.module'

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService, @Inject(SUMMARY_QUEUE) private summaryQueue: Queue) {}

  async create(userId: string, dto: CreateBlogDto) {
    const slugBase = slugify(dto.title, { lower: true, strict: true })
    let slug = slugBase
    let i = 1
    while (await this.prisma.blog.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${i++}`
    }
    const blog = await this.prisma.blog.create({
      data: {
        userId,
        title: dto.title,
        slug,
        content: dto.content,
        isPublished: dto.isPublished ?? false
      }
    })
    if (blog.isPublished) {
      await this.summaryQueue.add('generate', { blogId: blog.id, content: blog.content })
    }
    return blog
  }

  async update(userId: string, id: string, dto: UpdateBlogDto) {
    const blog = await this.prisma.blog.findUnique({ where: { id } })
    if (!blog) throw new NotFoundException()
    if (blog.userId !== userId) throw new ForbiddenException()
    let slug = blog.slug
    if (dto.title && dto.title !== blog.title) {
      const slugBase = slugify(dto.title, { lower: true, strict: true })
      slug = slugBase
      let i = 1
      while (await this.prisma.blog.findUnique({ where: { slug } })) {
        slug = `${slugBase}-${i++}`
      }
    }
    const updated = await this.prisma.blog.update({
      where: { id },
      data: {
        title: dto.title ?? blog.title,
        slug,
        content: dto.content ?? blog.content,
        isPublished: dto.isPublished ?? blog.isPublished
      }
    })
    if (!blog.isPublished && updated.isPublished) {
      await this.summaryQueue.add('generate', { blogId: updated.id, content: updated.content })
    }
    return updated
  }

  async delete(userId: string, id: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id } })
    if (!blog) throw new NotFoundException()
    if (blog.userId !== userId) throw new ForbiddenException()
    await this.prisma.blog.delete({ where: { id } })
    return { success: true }
  }
}
