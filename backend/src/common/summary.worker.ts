import { Injectable, OnModuleInit } from '@nestjs/common'
import { Worker } from 'bullmq'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from './prisma.service'
import { Logger } from 'nestjs-pino'

@Injectable()
export class SummaryWorker implements OnModuleInit {
  constructor(private config: ConfigService, private prisma: PrismaService, private logger: Logger) {}

  async onModuleInit() {
    const url = this.config.get<string>('REDIS_URL') || 'redis://localhost:6379'
    const worker = new Worker(
      'summary',
      async job => {
        const { blogId, content } = job.data as { blogId: string; content: string }
        const summary = content.slice(0, 200)
        await this.prisma.blog.update({ where: { id: blogId }, data: { summary } })
      },
      { connection: { url } }
    )
    worker.on('completed', job => {
      this.logger.log({ event: 'job_completed', queue: 'summary', jobId: job.id })
    })
    worker.on('failed', (job, err) => {
      this.logger.error({ event: 'job_failed', queue: 'summary', jobId: job?.id, error: err?.message })
    })
  }
}
