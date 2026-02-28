import { Controller, Get, Param, Query } from '@nestjs/common'
// Rate limiting is applied globally via ThrottlerModule
import { PublicService } from './public.service'

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('blogs/:slug')
  async getBlog(@Param('slug') slug: string) {
    return this.publicService.getBySlug(slug)
  }

  @Get('feed')
  async feed(@Query('page') page = '1', @Query('limit') limit = '10') {
    const p = Math.max(parseInt(page, 10) || 1, 1)
    const l = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50)
    return this.publicService.getFeed(p, l)
  }
}
