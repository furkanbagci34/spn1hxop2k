import {Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {Model} from "mongoose";
import {AssetsDocument} from "../shema/assets-shema";
import {CurrencyType} from "../shema/currency-type.shema";
import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export default class AssetsService {
	constructor(
		@InjectModel("Assets") private readonly assetsModel: Model<AssetsDocument>,
		@InjectModel("CurrencyType") private readonly currencyTypeModel: Model<CurrencyType>
	) {}

	async addAsset(userEmail: string, currencyType: string, quantity: number, buyPrice: number) {
		const newAsset = new this.assetsModel({
			userEmail,
			currencyType,
			quantity,
			buyPrice
		});
		return await newAsset.save();
	}

	async updateAsset(id: string, quantity: number, buyPrice: number, userEmail: string) {
		const asset = await this.assetsModel.findOne({_id: id, userEmail});
		if (!asset) {
			throw new NotFoundException("Asset not found or you don't have permission");
		}
		asset.quantity = quantity;
		asset.buyPrice = buyPrice;
		return await asset.save();
	}

	async deleteAsset(id: string, userEmail: string) {
		const result = await this.assetsModel.findOneAndDelete({_id: id, userEmail});
		if (!result) {
			throw new NotFoundException("Asset not found or you don't have permission");
		}
		return {message: "Asset deleted successfully"};
	}

	async getAssets(userEmail: string) {
		return await this.assetsModel.find({userEmail}).exec();
	}
}
