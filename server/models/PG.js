import mongoose from 'mongoose';

const pgSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String },
  amenities: { type: [String], default: [] },
  images: { type: [String], default: [] }
}, {
  timestamps: true
});

const PG = mongoose.models.PG || mongoose.model('PG', pgSchema);
export default PG;
