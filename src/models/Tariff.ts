import mongoose from 'mongoose';

const TariffSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  dayRate: { type: Number, required: true },
  nightRate: { type: Number, default: 0 },
  description: { type: String },
});

export default mongoose.models.Tariff || mongoose.model('Tariff', TariffSchema);