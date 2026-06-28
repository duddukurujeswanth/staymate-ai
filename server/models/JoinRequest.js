import mongoose from 'mongoose';

const joinRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  occupation: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  preferredSharing: { type: String, required: true },
  preferredMoveInDate: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, {
  timestamps: true
});

const JoinRequest = mongoose.models.JoinRequest || mongoose.model('JoinRequest', joinRequestSchema);
export default JoinRequest;
