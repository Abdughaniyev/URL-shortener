import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type AuthDocument = Auth & Document;

@Schema({ timestamps: true })
export class Auth {

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: [String], default: [] })
    refreshTokens?: string[];
}

export const AuthSchema = SchemaFactory.createForClass(Auth)