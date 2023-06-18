import { Injectable } from "@nestjs/common";
import { SuccessResult, ErrorResult } from "src/objects/Result";
import { Model } from 'mongoose';
import { UserDocument } from '../shema/user.shema';
import { UserFriendDocument } from '../shema/user-friends.shema';
import { InjectModel } from "@nestjs/mongoose";
import { JwtTokenValidator } from "src/validators/jwt.token-validator";

@Injectable()
export default class LoginService {

    constructor(
        @InjectModel('User') private readonly userModel: Model<UserDocument>,
        @InjectModel('UserFriend') private readonly userFriendModel: Model<UserFriendDocument>,)
        { 
    }

    tokenValidator = new JwtTokenValidator();
    
	public async login(username: string, password: string) {

        const user = await this.userModel.findOne({ username }).exec();

		if (!user) {
			return new ErrorResult("INVALID_USER");
		}

        if (user && user.password !== password) {
            return new ErrorResult("INVALID_PASSWORD");
        }
		
        const token = this.tokenValidator.generateToken(user.username)

		return new SuccessResult({ accessToken: token });
	}

    async createUser(username: string, password: string) {

        return new Promise((resolve) => {

            const createdUser = new this.userModel({username,password});

            createdUser.save().then(() => 
            {
                resolve(new SuccessResult())
            }).catch( (e) => {
                if(e.code == 11000)
                {
                    resolve(new ErrorResult("DUBLICATE_USERNAME"));
                }
                resolve(new ErrorResult(e.message));
            });
        })
    }

    async addFriend(username: string, friendUsername: string) {

        return new Promise((resolve) => {
            const addedFriend = new this.userFriendModel({ username, friendUsername });
            const addedFriendReverse = new this.userFriendModel({ username: friendUsername, friendUsername: username });
        
            addedFriend.save()
                .then(() => {
                    addedFriendReverse.save()
                        .then(() => {
                            resolve(new SuccessResult());
                        })
                        .catch((e) => {
                            resolve(new ErrorResult(e.message));
                        });
                })
                .catch((e) => {
                    resolve(new ErrorResult(e.message));
                });
        });
    }
}