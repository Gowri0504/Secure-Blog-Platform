import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Queue } from 'bullmq'

export const SUMMARY_QUEUE = 'summary'

@Global()
@Module({
  providers: [
    {
      provide: SUMMARY_QUEUE,
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('REDIS_URL') || 'redis://localhost:6379'
        return new Queue(SUMMARY_QUEUE, { connection: { url } })
      },
      inject: [ConfigService]
    }
  ],
  exports: [SUMMARY_QUEUE]
})
export class QueueModule {}
