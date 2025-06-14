const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String, required: true }, 
    imageUrl: { type: String },
    role: {
      type: String,
      enum: ["host", "guest"], 
      default: "guest",        
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
