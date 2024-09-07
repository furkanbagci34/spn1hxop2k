import {Body, Controller, Post} from "@nestjs/common";
import AssetsService from "src/services/assets.service";

@Controller("assets")
export default class AssetsController {
	constructor(private readonly assetsService: AssetsService) {}

	@Post("add")
	public async registerUser(@Body("email") email: string, @Body("password") password: string) {
		const result = await this.assetsService.addAssets(email, password);
		return result;
	}

	@Post("delete")
	public async login(@Body("username") username: string, @Body("password") password: string) {
		const result = await this.assetsService.login(username, password);
		return result;
	}

	@Post("update")
	public async addFriend(
		@Body("username") username: string,
		@Body("friendUsername") friendUsername: string
	) {
		const result = await this.assetsService.addFriend(username, friendUsername);
		return result;
	}
}
