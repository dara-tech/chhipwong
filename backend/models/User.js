import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profilePic: { 
    type: String, 
    default: "" 
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ['super_admin', 'admin', 'user', 'payment_viewer'], default: 'user' },
  lastLogin: { type: Date, default: null },
  lastLoginIp: { type: String, default: null },
  lastLoginLocation: { type: Object, default: null },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
