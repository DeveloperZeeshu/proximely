import mongoose, { Document, Schema } from "mongoose";
import { SchemaDefinitionProperty } from "mongoose";

const passwordHashSchema: SchemaDefinitionProperty<string> = {
    type: String,
    trim: true,
    required(this: IUser) {
        return this.authProvider === 'CREDENTIALS'
    }
}

type BaseUser = {
    email: string
    emailVerifiedAt: Date | null
    roles: ('USER' | 'ADMIN')[]
    isActive: boolean
    isDeleted: boolean
    createdAt: Date
    updatedAt: Date
}

type CredentialsUser = BaseUser & {
    authProvider: 'CREDENTIALS'
    passwordHash: string
}

type GoogleUser = BaseUser & {
    authProvider: 'GOOGLE'
    providerId: string
    passwordHash?: never
}

export type IUser = (CredentialsUser | GoogleUser) & Document

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        index: true
    },
    emailVerifiedAt: {
        type: Date,
        default: null
    },

    // passwordHash is required only for credentials-based auth
    passwordHash: passwordHashSchema,

    authProvider: {
        type: String,
        enum: ['CREDENTIALS', 'GOOGLE'],
        required: true
    },
    providerId: {
        type: String,
        trim: true
    },

    roles: {
        type: [String],
        enum: ['USER', 'ADMIN'],
        default: ['USER'],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


userSchema.index({ providerId: 1 }, { unique: true, sparse: true })
userSchema.index({ email: 1, authProvider: 1 }, { unique: true })


export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)
export default User

