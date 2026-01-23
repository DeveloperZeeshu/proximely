
import mongoose, { Document, Schema } from 'mongoose'

/* ----------------------------- Types ----------------------------- */

export interface ShopLocation {
  type: 'Point'
  coordinates: [number, number] // [lng, lat]
}

export type ShopCategory =
  | 'General Store'
  | 'Supermarket'
  | 'Electronics'
  | 'Pharmacy'
  | 'Fashion & Apparel'
  | 'Beauty & Personal Care'
  | 'Home & Kitchen'
  | 'Pet Supplies'
  | 'Hardware & DIY'
  | 'Sports & Fitness'
  | 'Stationery'
  | 'Bakery'
  | 'Automotive'
  | 'Toy Store'

export type OnboardingStep =
  | 'BASIC_INFO'
  | 'ADDRESS'
  | 'LOCATION'
  | 'APPEARANCE'
  | 'DONE'

export interface IShop extends Document {
  ownerId: Schema.Types.ObjectId

  /* BASIC INFO */
  shopName?: string
  ownerName?: string
  phone?: string
  category?: ShopCategory

  /* ADDRESS */
  address?: string
  city?: string
  state?: string
  zipcode?: string

  /* LOCATION */
  location?: ShopLocation

  /* APPEARANCE */
  profileImageUrl?: string
  bannerImageUrl?: string

  /* LIFECYCLE */
  onboardingStep: OnboardingStep
  isProfileComplete: boolean
  isActive: boolean
  isDeleted: boolean
}

/* ----------------------------- Schema ----------------------------- */

const shopSchema = new Schema<IShop>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },

    /* -------- BASIC INFO -------- */

    shopName: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    ownerName: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100
    },

    phone: {
      type: String,
      trim: true
    },

    category: {
      type: String,
      enum: [
        'General Store',
        'Supermarket',
        'Electronics',
        'Pharmacy',
        'Fashion & Apparel',
        'Beauty & Personal Care',
        'Home & Kitchen',
        'Pet Supplies',
        'Hardware & DIY',
        'Sports & Fitness',
        'Stationery',
        'Bakery',
        'Automotive',
        'Toy Store'
      ],
      index: true
    },

    /* -------- ADDRESS -------- */

    address: {
      type: String,
      trim: true
    },

    city: {
      type: String,
      trim: true,
      lowercase: true
    },

    state: {
      type: String,
      trim: true,
      lowercase: true
    },

    zipcode: {
      type: String,
      trim: true
    },

    /* -------- LOCATION -------- */

    location: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: (val: number[]) => val.length === 2,
          message: 'Coordinates must be [lng, lat]'
        }
      }
    },

    /* -------- APPEARANCE -------- */

    profileImageUrl: {
      type: String,
      trim: true,
      default: ''
    },

    bannerImageUrl: {
      type: String,
      trim: true,
      default: ''
    },

    /* -------- LIFECYCLE -------- */

    onboardingStep: {
      type: String,
      enum: ['BASIC_INFO', 'ADDRESS', 'LOCATION', 'APPEARANCE', 'DONE'],
      default: 'BASIC_INFO',
      index: true
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
      index: true
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
)

/* ----------------------------- Indexes ----------------------------- */

shopSchema.index({ location: '2dsphere' })

/* ----------------------------- Export ----------------------------- */

export const Shop =
  mongoose.models.Shop || mongoose.model<IShop>('Shop', shopSchema)

export default Shop
