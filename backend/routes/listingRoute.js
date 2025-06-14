const express = require("express");
const Listing = require("../modals/listing");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      pricePerNight,
      hostId,
      availableFrom,
      availableTo,
      images,
    } = req.body;

    if (
      !title.trim() ||
      !description.trim() ||
      !location.trim() ||
      !hostId ||
      !availableFrom ||
      !availableTo
    ) {
      throw new Error("All Basic details not provided");
    }

    if (!pricePerNight || isNaN(Number(pricePerNight))) {
      throw new Error("Price per night is not valid");
    }

    if (!images || !images?.length < 3) {
      throw new Error(" minimum 3 images are required");
    }

    if (new Date(availableFrom) > new Date(availableTo)) {
      throw new Error("Available To date must be after Available From");
    }

    const listing = new Listing({
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      pricePerNight: Number(pricePerNight),
      hostId,
      availableFrom,
      availableTo,
      images,
    });
    await listing.save();

    res
      .status(200)
      .json({ success: true, message: "Listing Created", listing });
      
  } catch (error) {
    console.log("Error in creating listing", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
