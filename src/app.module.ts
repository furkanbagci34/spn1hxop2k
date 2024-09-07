import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {ChatModule} from "./modules/chat.module";
import LoginModule from "./modules/login.module";
import AssetsModule from "./modules/login.module";
// import { RedisModule } from './modules/redis.module';
// import { RedisService } from './services/redis.service';
import {mongoDb} from "./objects/Config";

@Module({
	imports: [
		MongooseModule.forRoot(mongoDb.connectionString),
		// RedisModule,
		ChatModule,
		LoginModule,
		AssetsModule
	],
	controllers: [AppController],
	providers: [
		AppService
		// RedisService
	]
})
export class AppModule {}
