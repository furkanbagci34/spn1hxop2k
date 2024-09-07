import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {AssetsSchema} from "src/shema/assets-shema";
import {CurrencyTypeSchema} from "src/shema/currency-type.shema";

@Module({
	imports: [
		// RedisModule,
		MongooseModule.forFeature([
			{name: "Assets", schema: AssetsSchema},
			{name: "CurrencyType", schema: CurrencyTypeSchema}
		])
	],
	providers: [
		// ChatGateway,
		// RedisService
	]
})
export class ChatModule {}
