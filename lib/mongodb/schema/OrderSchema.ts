import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderProduct {
  productId: string;
  productUrl: string;
  productName: string;
  productImage: string;
  quantity: number;
  priceUSD: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  products: IOrderProduct[];
  totalPriceUSD: number;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  payment: {
    txHash: string;
    chain: string;
    status: 'pending' | 'confirmed' | 'failed';
  };
  status: 'created' | 'paid' | 'processing' | 'completed' | 'refunded';
  refundTx?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderProductSchema: Schema = new Schema({
  productId: String,
  productUrl: String,
  productName: String,
  productImage: String,
  quantity: Number,
  priceUSD: Number,
});

const OrderSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [OrderProductSchema],
    totalPriceUSD: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      fullName: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String,
    },
    payment: {
      txHash: String,
      chain: String,
      status: {
        type: String,
        enum: ['pending', 'confirmed', 'failed'],
        default: 'pending',
      },
    },
    status: {
      type: String,
      enum: ['created', 'paid', 'processing', 'completed', 'refunded'],
      default: 'created',
    },
    refundTx: String,
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;