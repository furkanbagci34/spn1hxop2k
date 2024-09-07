import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type CurrencyTypeDocument = CurrencyType & Document;

@Schema()
export class CurrencyType {
	@Prop({required: true, unique: true}) // Döviz türü kodu benzersiz olmalı
	code: string;

	@Prop({required: true})
	name: string; // Döviz türü ismi
}

export const CurrencyTypeSchema = SchemaFactory.createForClass(CurrencyType);
