import {verify, sign} from "jsonwebtoken";

export interface TokenValidator {
	isValidToken(token: string): Promise<any>;
	generateToken(email: string): string;
}

export class JwtTokenValidator implements TokenValidator {
	public generateToken(email: string): string {
		const secretKey = process.env.JWT_KEY;
		const token = sign({email}, secretKey, {expiresIn: "1w"});

		return token;
	}

	public async isValidToken(token: string): Promise<any> {
		if (!token) {
			return false;
		}

		try {
			const decodedToken = verify(token, process.env.JWT_KEY);

			if (!decodedToken) {
				return false;
			}

			return decodedToken;
		} catch (error) {
			return false;
		}
	}
}
