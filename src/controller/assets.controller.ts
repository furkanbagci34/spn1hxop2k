import {Body, Controller, Post, Get, Put, Delete, Param, UseGuards, Request} from "@nestjs/common";
import AssetsService from "src/services/assets.service";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";

@Controller("assets")
@UseGuards(JwtAuthGuard)
export default class AssetsController {
	constructor(private readonly assetsService: AssetsService) {}

	@Post("add")
	async addAsset(
		@Request() req,
		@Body("currencyType") currencyType: string,
		@Body("quantity") quantity: number,
		@Body("buyPrice") buyPrice: number
	) {
		const userEmail = req.user.email;
		return await this.assetsService.addAsset(userEmail, currencyType, quantity, buyPrice);
	}

	@Put("update/:id")
	async updateAsset(
		@Request() req,
		@Param("id") id: string,
		@Body("quantity") quantity: number,
		@Body("buyPrice") buyPrice: number
	) {
		const userEmail = req.user.email;
		return await this.assetsService.updateAsset(id, quantity, buyPrice, userEmail);
	}

	@Delete("delete/:id")
	async deleteAsset(@Request() req, @Param("id") id: string) {
		const userEmail = req.user.email;
		return await this.assetsService.deleteAsset(id, userEmail);
	}

	@Get()
	async getAssets(@Request() req) {
		const userEmail = req.user.email;
		return await this.assetsService.getAssets(userEmail);
	}
}
