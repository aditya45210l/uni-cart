import mongoose, { Schema, Document, Model } from 'mongoose';

// Updated IUser Interface
export interface IUser extends Document {
    // ... other fields
    shippingAddress?: {
        fullName: string;
        address: string;     // Changed from 'street'
        addressLine2?: string; // Added this field
        locality?: string;    // Added this field
        city: string;
        state: string;
        pinCode: string;     // Changed from 'postalCode'
        country: string;
        phone: string;
    };
    // ... other fields
}
const UserSchema: Schema = new Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
    },
shippingAddress: {
    fullName: String,
    address: String,      // Changed from 'street'
    addressLine2: String, // Added this field
    locality: String,     // Added this field
    city: String,
    state: String,
    pinCode: String,      // Changed from 'postalCode'
    country: String,
    phone: String,
},
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;