import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
    
    constructor(@Inject('REDIS') private readonly redisClient: Redis) {}

    async set(key: string, value: any): Promise<string> {
        return this.redisClient.set(key, JSON.stringify(value));
    }

    async get(key: string): Promise<any> {
        const result = await this.redisClient.get(key);
        return JSON.parse(result);
    }

    async sadd(key: string, members: string[]): Promise<number> {
        return this.redisClient.sadd(key, ...members);
    }

    async srem(key: string, members: string[]): Promise<number> {
        return this.redisClient.srem(key, ...members);
    }

    async smembers(key: string): Promise<string[]> {
        return this.redisClient.smembers(key);
    }
    
    async sunion(...keys: string[]): Promise<string[]> {
        return this.redisClient.sunion(...keys);
    }
}
