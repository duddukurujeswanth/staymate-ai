import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  pgId: { type: mongoose.Schema.Types.ObjectId, ref: 'PG', required: true },
  roomNumber: { type: String, required: true },
  sharingType: { type: String, required: true }, // e.g., '1 Sharing', '2 Sharing', etc.
  rent: { type: Number, required: true },
  totalBeds: { type: Number, required: true },
  occupiedBeds: { type: Number, default: 0 }
}, {
  timestamps: true
});

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);
export default Room;
