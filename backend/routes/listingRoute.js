const express = require("express");
const Listing = require("../modals/listing");

const router = express.Router();

router.post("/create-new", async (req, res) => {
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

    // Validate basic string fields
    if (
      !title?.trim() ||
      !description?.trim() ||
      !hostId ||
      !availableFrom ||
      !availableTo
    ) {
      throw new Error("All basic details must be provided");
    }

    // Validate location object
    if (
      !location ||
      !location.country?.trim() ||
      !location.city?.trim() ||
      !location.address?.trim()
    ) {
      throw new Error("Country, city, and address are required in location");
    }

    if (!pricePerNight || isNaN(Number(pricePerNight))) {
      throw new Error("Price per night is not valid");
    }

    if (!images || images.length < 3) {
      throw new Error("Minimum 3 images are required");
    }

    if (new Date(availableFrom) > new Date(availableTo)) {
      throw new Error("Available To date must be after Available From");
    }

    const listing = new Listing({
      title: title.trim(),
      description: description.trim(),
      location: {
        country: location.country.trim(),
        state: location.state?.trim() || "", // optional
        city: location.city.trim(),
        address: location.address.trim(),
      },
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
    console.error("Error in creating listing:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;
