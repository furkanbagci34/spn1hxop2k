import { Module } from '@nestjs/common';
import { Redis } from 'ioredis';

@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: (): Redis => {
        return new Redis({
          host: 'localhost',
          port: 6379,
          db: 0,
        });
      },
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
