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

    async del(key: string): Promise<any> {
        return this.redisClient.del(key);
    }

    async sadd(key: string, members: string[]): Promise<number> {

        const isKeyExists = await this.redisClient.exists(key);

        if (isKeyExists) {
            await this.redisClient.del(key);
        }

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

    async exists(key: string): Promise<boolean> {
        const result = await this.redisClient.exists(key);
        return result === 1;
    }

    async rpush(key: string, values: string[]): Promise<number> {
        return this.redisClient.rpush(key, ...values);
    }

    async lrange(key: string, start: number, stop: number): Promise<string[]> {
        return this.redisClient.lrange(key, start, stop);
    }
}
