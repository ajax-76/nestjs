import { Optional } from '@nestjs/common';
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    rateLimit: { type: Number, Optional: true },
    expirationTime: { type: Date, Optional: true },
    accessKey: { type: String, Optional: true },
    isEnable:{type:Boolean,Optional:true}
});