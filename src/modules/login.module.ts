import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import LoginController from "src/controller/login.controller";
import LoginService from "src/services/login.service";
import { UserSchema } from "src/shema/user.shema";
import { UserFriendShema } from "src/shema/user-friends.shema";

@Module({
    imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema},{name: 'UserFriend', schema: UserFriendShema}])],
	controllers: [LoginController],
	providers: [LoginService],
})
export default class LoginModule { }