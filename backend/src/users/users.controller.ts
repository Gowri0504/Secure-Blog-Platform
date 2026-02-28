import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { PrismaService } from '../common/prisma.service'
import { Request } from 'express'

@UseGuards(JwtAuthGuard)
@Controller('me')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get('blogs')
  async myBlogs(@Req() req: Request) {
    const userId = (req.user as { userId: string }).userId
    const items = await this.prisma.blog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, isPublished: true }
    })
    return { items }
  }
}
