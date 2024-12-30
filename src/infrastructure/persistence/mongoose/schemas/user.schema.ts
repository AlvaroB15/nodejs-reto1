import * as mongoose from "mongoose";
import {Schema} from "mongoose";

export interface IUserDocument extends Document {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    _id: any;
}

export const UserSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String }
});

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
