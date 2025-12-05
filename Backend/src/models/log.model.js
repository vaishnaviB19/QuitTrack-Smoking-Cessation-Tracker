import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  mood: {
    type: String,
    enum: ["happy", "stressed", "sad", "bored", "anxious", "neutral","tired"],
    default: "neutral",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  cigarettesSmoked: { type: Number, default: 0 },
  savings: { type: Number, default: 0 },
});

 const Log = mongoose.model("Log", logSchema);
 export default Log;
