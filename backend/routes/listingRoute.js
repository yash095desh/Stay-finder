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

router.get("/search", async (req, res) => {
  try {
    let { location, price, date } = req.query;
    const query = {};

    // Convert 'null' or empty strings to actual undefined
    location = location && location !== "null" && location.trim() !== "" ? location : undefined;
    price = price && price !== "null" && price.trim() !== "" ? price : undefined;
    date = date && date !== "null" && date.trim() !== "" ? date : undefined;


    // Location filter
    if (location && location.trim() !== "") {
      query.$or = [
        { "location.city": { $regex: location, $options: "i" } },
        { "location.address": { $regex: location, $options: "i" } },
        { "location.state": { $regex: location, $options: "i" } },
        { "location.country": { $regex: location, $options: "i" } },
      ];
    }

    // Price filter
    if (price && price.includes("-")) {
      const [min, max] = price.split("-").map(Number);
      query.pricePerNight = {
        $gte: !isNaN(min) ? min : 0,
        $lte: !isNaN(max) ? max : Number.MAX_SAFE_INTEGER,
      };
    }

    // Date filter
    if (date && !isNaN(new Date(date))) {
      const parsedDate = new Date(date);

      // Ensure both `availableFrom` and `availableTo` exist and cover the selected date
      query.availableFrom = { $lte: parsedDate };
      query.availableTo = { $gte: parsedDate };
    }

    // If no filters are provided, return all listings
    const isEmptyQuery =
      !location && !price && (!date || isNaN(new Date(date)));
    
    const listings = isEmptyQuery
      ? await Listing.find({})
      : await Listing.find(query);

    res.status(200).json({ success: true, listings });
  } catch (error) {
    console.error("Error in getting listings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id",async(req, res)=>{
  try {
    const { id } = req.params;

    if(!id){
      throw new Error("Listing Id not provided");
    }

    const listing = await Listing.findById(id).populate("hostId");

    res.status(200).json({success: true , listing})

  } catch (error) {
    console.log("Error in fetching listing:",error)
    res.status(500).json({success:false, message: error.message})
  }
})

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
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
      !title?.trim() ||
      !description?.trim() ||
      !hostId ||
      !availableFrom ||
      !availableTo
    ) {
      throw new Error("All basic details must be provided");
    }

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

    if (!images || images.length < 1) {
      throw new Error("At least 1 image is required");
    }

    if (new Date(availableFrom) > new Date(availableTo)) {
      throw new Error("Available To date must be after Available From");
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description.trim(),
        location: {
          country: location.country.trim(),
          state: location.state?.trim() || "",
          city: location.city.trim(),
          address: location.address.trim(),
        },
        pricePerNight: Number(pricePerNight),
        hostId,
        availableFrom,
        availableTo,
        images,
      },
      { new: true }
    );

    if (!updatedListing) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Listing updated", listing: updatedListing });
  } catch (error) {
    console.error("Error in updating listing:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Listing ID is required" });
    }

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Error in deleting the listing:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});






module.exports = router;
