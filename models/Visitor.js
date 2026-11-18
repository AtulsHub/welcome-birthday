import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 30 },
  visitorId: { type: String, required: true, unique: true, index: true },
  visitedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  giftOpenedAt: { type: Date, default: null },
  giftOpenedCount: { type: Number, default: 0, min: 0 },
  cheerSentAt: { type: Date, default: null },
});

const cachedModel = mongoose.models.Visitor;
if (cachedModel && (
  !cachedModel.schema.path('giftOpenedAt') ||
  !cachedModel.schema.path('giftOpenedCount') ||
  !cachedModel.schema.path('cheerSentAt')
)) {
  mongoose.deleteModel('Visitor');
}

export default mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);
