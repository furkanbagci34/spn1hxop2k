import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {AssetsSchema} from "src/shema/assets-shema";
import {CurrencyTypeSchema} from "src/shema/currency-type.shema";
import AssetsController from "src/controller/assets.controller";
import AssetsService from "src/services/assets.service";
import {JwtModule} from "@nestjs/jwt";

@Module({
	imports: [
		MongooseModule.forFeature([
			{name: "Assets", schema: AssetsSchema},
			{name: "CurrencyType", schema: CurrencyTypeSchema}
		]),
		JwtModule.register({
			secret: "DFG235RGH2567IUIDFG213DFG235RGH2567IUIDFG213",
			signOptions: {expiresIn: "365d"}
		})
	],
	controllers: [AssetsController],
	providers: [AssetsService]
})
export class AssetsModule {}
