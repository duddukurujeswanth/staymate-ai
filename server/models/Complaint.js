import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  status: { type: String, required: true },
  comment: { type: String },
  date: { type: Date, default: Date.now }
});

const complaintSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tenantName: { type: String, required: true },
  roomNumber: { type: String, required: true },
  pgId: { type: mongoose.Schema.Types.ObjectId, ref: 'PG', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // WiFi, Food, Cleaning, Water, Electricity, Security, Furniture, Other
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
  imageUrl: { type: String, default: '' },
  logs: { type: [logSchema], default: [] }
}, {
  timestamps: true
});

const Complaint = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
export default Complaint;
