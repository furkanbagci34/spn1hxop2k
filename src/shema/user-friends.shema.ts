import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserFriendDocument = UserFriend & Document;

@Schema()
export class UserFriend {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    friendUsername: string;
}

export const UserFriendShema = SchemaFactory.createForClass(UserFriend);
