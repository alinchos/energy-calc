import mongoose from 'mongoose';

const MeterSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tariffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tariff', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['single-zone', 'dual-zone'], default: 'single-zone' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Meter || mongoose.model('Meter', MeterSchema);