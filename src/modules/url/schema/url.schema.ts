import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({ timestamps: true })
export class Url {

    @Prop({ required: true })
    originalUrl: string;

    @Prop({ required: true, unique: true })
    shortCode: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true })
    userId: string;

    @Prop({ default: 0 })
    visits: number;

    @Prop({ default: null })
    expiresAt?: Date;

    @Prop()
    createdAt?: Date;
}
export type UrlDocument = Url & Document;
export const UrlSchema = SchemaFactory.createForClass(Url)
