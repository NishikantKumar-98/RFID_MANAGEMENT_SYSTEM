import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    toolId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Issue', 'Return'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

export const Transaction = mongoose.model('Transaction', transactionSchema);
