import { Module } from '@nestjs/common';
// import { ChatGateway } from '../gateways/chat.gateway';
// import { RedisModule } from '../modules/redis.module';
// import { RedisService } from 'src/services/redis.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserFriendShema } from 'src/shema/user-friends.shema';

@Module({
  imports: [
    // RedisModule,
    MongooseModule.forFeature([
      { name: 'UserFriend', schema: UserFriendShema },
    ]),
  ],
  providers: [
    // ChatGateway,
    // RedisService
  ],
})
export class ChatModule {}
