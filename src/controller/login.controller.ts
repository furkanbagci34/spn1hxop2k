import {Body, Controller, Post} from "@nestjs/common";
import LoginService from "src/services/login.service";

@Controller("login")
export default class LoginController {
	constructor(private readonly loginService: LoginService) {}

	@Post("register")
	public async registerUser(@Body("email") email: string, @Body("password") password: string) {
		const result = await this.loginService.createUser(email, password);
		return result;
	}

	@Post("login")
	public async login(@Body("username") username: string, @Body("password") password: string) {
		const result = await this.loginService.login(username, password);
		return result;
	}

	@Post("addFriend")
	public async addFriend(
		@Body("username") username: string,
		@Body("friendUsername") friendUsername: string
	) {
		const result = await this.loginService.addFriend(username, friendUsername);
		return result;
	}
}
