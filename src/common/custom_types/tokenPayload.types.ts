import { Types } from "mongoose";

export interface TokenPayload {
    userId: string | Types.ObjectId;
    email: string;
    role?: string;
}
