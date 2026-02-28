import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { CommentsService } from './comments.service'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { CreateCommentDto } from './dto/create-comment.dto'
import { Request } from 'express'

@Controller('blogs/:id/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async add(@Req() req: Request, @Param('id') id: string, @Body() dto: CreateCommentDto) {
    const userId = (req.user as { userId: string }).userId
    return this.commentsService.add(userId, id, dto)
  }

  @Get()
  async list(@Param('id') id: string) {
    return this.commentsService.list(id)
  }
}
