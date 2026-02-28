import { Module } from '@nestjs/common'
import { BlogsService } from './blogs.service'
import { BlogsController } from './blogs.controller'
import { SUMMARY_QUEUE } from '../common/queue.module'

@Module({
  controllers: [BlogsController],
  providers: [BlogsService, { provide: 'SUMMARY_QUEUE_TOKEN', useExisting: SUMMARY_QUEUE }]
})
export class BlogsModule {}
