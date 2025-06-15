const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length >= 3;
        },
        message: "At least 3 images are required.",
      },
    },
    location: {
      country: { type: String, required: true },
      state: { type: String }, // optional
      city: { type: String, required: true },
      address: { type: String, required: true },
    },
    pricePerNight: { type: Number, required: true }, // changed to Number
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    availableFrom: Date,
    availableTo: Date,
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
