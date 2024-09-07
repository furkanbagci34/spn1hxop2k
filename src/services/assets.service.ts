import {Injectable} from "@nestjs/common";
import {SuccessResult, ErrorResult} from "src/objects/Result";
import {Model} from "mongoose";
import {AssetsDocument} from "../shema/assets-shema";
import {CurrencyType} from "../shema/currency-type.shema";
import {InjectModel} from "@nestjs/mongoose";
import {JwtTokenValidator} from "src/validators/jwt.token-validator";

@Injectable()
export default class LoginService {
	constructor(
		@InjectModel("AssetsDocument") private readonly userModel: Model<AssetsDocument>,
		@InjectModel("CurrencyType")
		private readonly CurrencyTypeModel: Model<CurrencyType>
	) {}

	tokenValidator = new JwtTokenValidator();

	public async addCurrency(email: string, password: string) {
		const user = await this.userModel.findOne({email}).exec();

		if (!user) {
			return new ErrorResult("INVALID_USER");
		}

		if (user && user.password !== password) {
			return new ErrorResult("INVALID_PASSWORD");
		}

		const token = this.tokenValidator.generateToken(user.email);

		return new SuccessResult({accessToken: token});
	}

	async createUser(email: string, password: string) {
		return new Promise(resolve => {
			const createdUser = new this.userModel({email, password});

			createdUser
				.save()
				.then(() => {
					resolve(new SuccessResult());
				})
				.catch(e => {
					if (e.code == 11000) {
						resolve(new ErrorResult("DUBLICATE_MAIL"));
					}
					resolve(new ErrorResult(e.message));
				});
		});
	}
}
