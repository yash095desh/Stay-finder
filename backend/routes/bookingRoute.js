const express = require("express");
const Booking = require("../modals/bookings");
const User = require("../modals/user");
const Listing = require("../modals/listing");
 
const router = express.Router();

router.get("/getAll/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;

    if (!listingId) {
      return res.status(400).json({ success: false, message: "Listing ID not provided" });
    }

    const bookings = await Booking.find({ listingId })             

    res.status(200).json({ success: true, bookings });

  } catch (error) {
    console.error("Error in getting bookings of listing:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/specific/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      throw new Error("Booking ID not provided");
    }

    const booking = await Booking.findById(bookingId)
      .populate("userId", "name email")
      .populate("listingId", "title location pricePerNight");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, booking });

  } catch (error) {
    console.error("Error in getting specific booking", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/check/:userId/:listingId", async (req, res) => {
  try {
    const { userId, listingId } = req.params;

    if (!userId || !listingId) {
      return res.status(400).json({ success: false, message: "userId and listingId required" });
    }

    const booking = await Booking.findOne({
      userId,
      listingId,
      endDate: { $lte: new Date() }, // ensure endDate is in the past
    })
      .populate("userId", "name email")
      .populate("listingId", "title location");

    if (!booking) {
      return res.status(200).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("Error in getting booking details:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/user/:userId",async(req, res)=>{
  try {
    const {userId} = req.params;

    if(!userId)throw new Error("userId not provided")

      const bookings = await Booking.find({userId})
      .populate("listingId","title location")

      res.status(200).json({success: true, bookings})

  } catch (error) {
    console.log("Error while getting user bookings:",error)
    res.status(500).json({success:false , message: error.message})
  }
});

router.post("/create-new", async (req, res) => {
  try {
    const { userId, listingId, startDate, endDate } = req.body;

    if (!userId) throw new Error("userId not provided");
    if (!listingId) throw new Error("listingId not provided");
    if (!startDate || !endDate) throw new Error("Check-in or check-out date not provided");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const listing = await Listing.findById(listingId);
    if (!listing) throw new Error("Listing not found");

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) throw new Error("Invalid date range");

    
    const overlapping = await Booking.findOne({
      listingId,
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } },
      ],
    });

    if (overlapping) {
      return res.status(409).json({
        success: false,
        message: "Listing already booked for selected dates",
      });
    }

    
    const msPerDay = 1000 * 60 * 60 * 24;
    const totalNights = Math.round((end - start) / msPerDay);
    const totalAmount = totalNights * listing.pricePerNight;

    const booking = new Booking({
      userId,
      listingId,
      startDate: start,
      endDate: end,
      totalPrice: totalAmount,
      status: "confirmed",
    });

    await booking.save();

    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("Error while creating the booking:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;