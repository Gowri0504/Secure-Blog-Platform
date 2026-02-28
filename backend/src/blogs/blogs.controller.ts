import { Body, Controller, Delete, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { BlogsService } from './blogs.service'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { CreateBlogDto } from './dto/create-blog.dto'
import { UpdateBlogDto } from './dto/update-blog.dto'
import { Request } from 'express'

@UseGuards(JwtAuthGuard)
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateBlogDto) {
    const userId = (req.user as { userId: string }).userId
    const blog = await this.blogsService.create(userId, dto)
    return { id: blog.id, slug: blog.slug }
  }

  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateBlogDto) {
    const userId = (req.user as { userId: string }).userId
    const blog = await this.blogsService.update(userId, id, dto)
    return { id: blog.id, slug: blog.slug }
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as { userId: string }).userId
    return await this.blogsService.delete(userId, id)
  }
}
