import {Injectable, ConflictException, UnauthorizedException} from "@nestjs/common";
import {Model} from "mongoose";
import {UserDocument} from "../shema/user.shema";
import {InjectModel} from "@nestjs/mongoose";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export default class AuthService {
	constructor(
		@InjectModel("User") private readonly userModel: Model<UserDocument>,
		private jwtService: JwtService
	) {}

	public async login(email: string, password: string) {
		const user = await this.userModel.findOne({email}).exec();

		if (!user) {
			throw new UnauthorizedException("Invalid credentials");
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new UnauthorizedException("Invalid credentials");
		}

		const payload = {email: user.email, sub: user._id};
		return {
			access_token: this.jwtService.sign(payload)
		};
	}

	async createUser(email: string, password: string) {
		const existingUser = await this.userModel.findOne({email}).exec();
		if (existingUser) {
			throw new ConflictException("Email already exists");
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new this.userModel({email, password: hashedPassword});
		await newUser.save();
		return {message: "User created successfully"};
	}
}
