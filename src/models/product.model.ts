import { PRODUCT_CATEGORIES_VALUE, ProductCategory } from "@/lib/constants"
import mongoose, { Document, Schema } from "mongoose"

export interface IProduct extends Document {
    shopId: mongoose.Types.ObjectId
    name: string
    category: ProductCategory
    description: string
    price: number
    currency: 'USD' | 'EUR' | 'INR'
    imageUrl: string
    isAvailable: boolean
    isDeleted: boolean
    createdAt: Date
    updatedAt: Date
}

const productSchema = new Schema<IProduct>(
    {
        shopId: {
            type: Schema.Types.ObjectId,
            ref: 'Shop',
            required: true,
            index: true
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            enum: PRODUCT_CATEGORIES_VALUE,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        currency: {
            type: String,
            enum: ['USD', 'EUR', 'INR'],
            default: 'INR'
        },

        imageUrl: {
            type: String,
            trim: true,
            default: '',
        },

        isAvailable: {
            type: Boolean,
            default: true,
        },

        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

productSchema.index({ category: 1 });
productSchema.index({ shopId: 1, isAvailable: 1 });


export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
export default Product
