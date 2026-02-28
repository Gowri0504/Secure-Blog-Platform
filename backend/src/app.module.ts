import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { LoggerModule } from 'nestjs-pino'
import { PrismaModule } from './common/prisma.module'
import { QueueModule } from './common/queue.module'
import { SummaryWorker } from './common/summary.worker'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { BlogsModule } from './blogs/blogs.module'
import { LikesModule } from './likes/likes.module'
import { CommentsModule } from './comments/comments.module'
import { PublicModule } from './public/public.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined
      }
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 60
      }
    ]),
    PrismaModule,
    QueueModule,
    AuthModule,
    UsersModule,
    BlogsModule,
    LikesModule,
    CommentsModule,
    PublicModule
  ],
  providers: [SummaryWorker]
})
export class AppModule {}
