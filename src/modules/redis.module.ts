import { Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { redis } from '../objects/Config'
@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: (): Redis => {
        return new Redis(redis.connectionString);
      },
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
