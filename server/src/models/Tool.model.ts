import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema(
  {
    toolId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Power Tools', 'Hand Tools', 'Measuring Tools', 'Safety Equipment', 'Electrical Tools'],
    },
    status: {
      type: String,
      required: true,
      enum: ['Available', 'Issued', 'Missing'],
      default: 'Available',
    },
  },
  { timestamps: true }
);

export const Tool = mongoose.model('Tool', toolSchema);
