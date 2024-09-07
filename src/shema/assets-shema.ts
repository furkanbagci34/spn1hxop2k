import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type AssetsDocument = Assets & Document;

@Schema()
export class Assets {
	@Prop({required: true})
	userEmail: string;

	@Prop({required: true})
	currencyType: string;

	@Prop({required: true})
	quantity: number;

	@Prop({required: true})
	buyPrice: number;

	@Prop({default: Date.now})
	buyDate: Date;

	@Prop({default: Date.now})
	createdAt: Date;
}

export const AssetsSchema = SchemaFactory.createForClass(Assets);
