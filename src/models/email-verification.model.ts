import mongoose, { Schema } from 'mongoose'

export interface IEmailVerification extends Document {
  userId: Schema.Types.ObjectId
  tokenHash: string
  expiresAt: Date
}

const emailVerificationSchema = new Schema<IEmailVerification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
      unique: true
    },

    tokenHash: {
      type: String,
      required: true,
      index: true
    },

    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
)

emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const EmailVerification =
  mongoose.models.EmailVerification ||
  mongoose.model<IEmailVerification>('EmailVerification', emailVerificationSchema)

export default EmailVerification
