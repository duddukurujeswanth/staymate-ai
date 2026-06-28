import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['owner', 'tenant'], default: 'tenant' },
  phone: { type: String },
  pgId: { type: mongoose.Schema.Types.ObjectId, ref: 'PG', default: null },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
  roomNumber: { type: String, default: null },
  sharingType: { type: String, default: null },
  rentPaid: { type: Boolean, default: false },
  rentAmount: { type: Number, default: 0 },
  joiningDate: { type: Date, default: null }
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
