import mongoose from 'mongoose';

const viewerSchema = new mongoose.Schema({
  ip: { type: String, required: true },
  location: { type: Object, default: null },
  userAgent: { type: String, default: '' },
  path: { type: String, default: '' },
  referrer: { type: String, default: '' },
  visitedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Viewer', viewerSchema); 