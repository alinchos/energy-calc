import mongoose from 'mongoose';

const ReadingSchema = new mongoose.Schema(
  {
    meterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Meter', required: true },
    date: { type: Date, required: true, default: Date.now },
    valueDay: { type: Number, required: true },
    valueNight: { type: Number, default: 0 },
    consumptionDay: { type: Number, required: true },
    consumptionNight: { type: Number, default: 0 },
    totalCost: { type: Number, required: true },
  },
  { timestamps: true }
);

ReadingSchema.index({ meterId: 1, date: -1 });

export default mongoose.models.Reading || mongoose.model('Reading', ReadingSchema);