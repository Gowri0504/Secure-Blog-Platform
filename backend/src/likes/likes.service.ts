import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async like(userId: string, blogId: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id: blogId } })
    if (!blog) throw new NotFoundException()
    if (blog.userId === userId) throw new ForbiddenException()
    await this.prisma.like.create({
      data: { userId, blogId }
    }).catch(() => {})
    const count = await this.prisma.like.count({ where: { blogId } })
    return { likeCount: count }
  }

  async unlike(userId: string, blogId: string) {
    await this.prisma.like.deleteMany({ where: { userId, blogId } })
    const count = await this.prisma.like.count({ where: { blogId } })
    return { likeCount: count }
  }
}
