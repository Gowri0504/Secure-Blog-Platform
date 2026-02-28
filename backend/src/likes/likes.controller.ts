import { Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common'
import { LikesService } from './likes.service'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { Request } from 'express'

@UseGuards(JwtAuthGuard)
@Controller('blogs/:id')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('like')
  async like(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as { userId: string }).userId
    return this.likesService.like(userId, id)
  }

  @Delete('like')
  async unlike(@Req() req: Request, @Param('id') id: string) {
    const userId = (req.user as { userId: string }).userId
    return this.likesService.unlike(userId, id)
  }
}
