import {Body, Controller, Post} from "@nestjs/common";
import AuthService from "../services/auth.service";

@Controller("auth")
export default class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	public async registerUser(@Body() userData: {email: string; password: string}) {
		return this.authService.createUser(userData.email, userData.password);
	}

	@Post("login")
	public async login(@Body() loginData: {email: string; password: string}) {
		return this.authService.login(loginData.email, loginData.password);
	}
}
