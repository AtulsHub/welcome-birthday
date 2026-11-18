import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 30 },
  visitorId: { type: String, required: true, unique: true, index: true },
  visitedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);
