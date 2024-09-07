import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {JwtModule} from "@nestjs/jwt";
import AuthController from "src/controller/auth.controller";
import AuthService from "src/services/auth.service";
import {UserSchema} from "src/shema/user.shema";

@Module({
	imports: [
		MongooseModule.forFeature([{name: "User", schema: UserSchema}]),
		JwtModule.register({
			secret: "DFG235RGH2567IUIDFG213DFG235RGH2567IUIDFG213",
			signOptions: {expiresIn: "365d"}
		})
	],
	controllers: [AuthController],
	providers: [AuthService]
})
export default class AuthModule {}
