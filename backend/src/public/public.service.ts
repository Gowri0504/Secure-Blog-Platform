import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'

@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}

  async getBySlug(slug: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { slug },
      include: {
        user: { select: { id: true, email: true } },
        _count: { select: { likes: true, comments: true } }
      }
    })
    if (!blog || !blog.isPublished) throw new NotFoundException()
    return {
      id: blog.id,
      title: blog.title,
      content: blog.content,
      summary: blog.summary,
      author: { id: blog.user.id, email: blog.user.email },
      likeCount: blog._count.likes,
      commentCount: blog._count.comments,
      createdAt: blog.createdAt
    }
  }

  async getFeed(page: number, limit: number) {
    const skip = (page - 1) * limit
    const [items, total] = await this.prisma.$transaction([
      this.prisma.blog.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, email: true } },
          _count: { select: { likes: true, comments: true } }
        }
      }),
      this.prisma.blog.count({ where: { isPublished: true } })
    ])
    return {
      items: items.map(b => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        summary: b.summary,
        author: { id: b.user.id, email: b.user.email },
        likeCount: b._count.likes,
        commentCount: b._count.comments,
        createdAt: b.createdAt
      })),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}
