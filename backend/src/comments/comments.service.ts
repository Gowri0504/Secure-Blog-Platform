import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { CreateCommentDto } from './dto/create-comment.dto'

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async add(userId: string, blogId: string, dto: CreateCommentDto) {
    const blog = await this.prisma.blog.findUnique({ where: { id: blogId } })
    if (!blog || !blog.isPublished) throw new NotFoundException()
    await this.prisma.comment.create({
      data: { userId, blogId, content: dto.content }
    })
    const count = await this.prisma.comment.count({ where: { blogId } })
    return { commentCount: count }
  }

  async list(blogId: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id: blogId } })
    if (!blog || !blog.isPublished) throw new NotFoundException()
    const items = await this.prisma.comment.findMany({
      where: { blogId },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, email: true } } }
    })
    return items.map(c => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      author: { id: c.user.id, email: c.user.email }
    }))
  }
}
