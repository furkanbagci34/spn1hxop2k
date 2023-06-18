import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './modules/chat.module';
import  LoginModule from './modules/login.module';
import { RedisModule } from './modules/redis.module';
import { RedisService } from './services/redis.service';
@Module({
    imports: [
        MongooseModule.forRoot("mongodb://127.0.0.1:27017/nestjs-socket"),
        RedisModule,
        ChatModule,LoginModule,

    ],
    controllers: [AppController],
    providers: [AppService,RedisService ]
})
export class AppModule {}
