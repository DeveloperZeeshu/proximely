import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
    userId: Schema.Types.ObjectId
    valid: boolean
    userAgent?: string
    ip?: string
    refreshTokenHash: string
    lastUsedAt: Date
    expiresAt: Date
    createdAt: Date
    updatedAt: Date
}

const sessionSchema = new Schema<ISession>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    valid: {
        type: Boolean,
        default: true,
        index: true
    },
    userAgent: {
        type: String,
        trim: true,
    },
    ip: {
        type: String,
        trim: true,
    },
    refreshTokenHash: {
        type: String,
        trim: true,
        required: true
    },
    lastUsedAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true
    }
},
    {
        timestamps: true
    }
)

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
sessionSchema.index({ userId: 1, valid: 1 })
sessionSchema.index({ refreshTokenHash: 1 })

export const Session = mongoose.models.Session || mongoose.model<ISession>('Session', sessionSchema)
export default Session
