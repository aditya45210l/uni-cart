import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
  productId: string;
  productUrl: string;
  productName: string;
  productImage: string;
  quantity: number;
  priceUSD: number;
  addedAt: Date;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalPriceUSD: number;
  status: 'active' | 'checkedOut';
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema: Schema = new Schema({
  productId: {
    type: String,
    required: true,
  },
  productUrl: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  priceUSD: {
    type: Number,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const CartSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [CartItemSchema],
    totalPriceUSD: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'checkedOut'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total price before saving
CartSchema.pre('save', function (next) {
  this.totalPriceUSD = this.items.reduce(
    (total, item) => total + item.priceUSD * item.quantity,
    0
  );
  next();
});

const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
export default Cart;