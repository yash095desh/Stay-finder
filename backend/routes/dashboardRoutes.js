const express = require("express");
const User = require("../modals/user");
const Booking = require("../modals/bookings");
const Listing = require("../modals/listing");

const router = express.Router();

router.get("/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) throw new Error("User ID not provided");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    if (user.role !== "host") throw new Error("User is not a host");

    const listings = await Listing.find({ hostId: userId }) || [];

    const bookings = await Booking.find({
      listingId: { $in: listings.map((l) => l._id) },
    })
    .populate("userId")
    .populate("listingId");

    const totalEarnings = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const upcomingBookings = bookings
    .filter((b) => new Date(b.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));



    res.status(200).json({
      success: true,
      totalListings: listings,
      upcomingBookings,
      totalEarnings,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get("/bookings-by-month/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) throw new Error("User ID not provided");

    const user = await User.findById(userId);
    if (!user || user.role !== "host") throw new Error("Invalid or unauthorized user");

    const listings = await Listing.find({ hostId: userId });
    const bookings = await Booking.find({
      listingId: { $in: listings.map((l) => l._id) },
    }).populate("listingId");

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthlyData = {};

    // Initialize months and listing titles
    months.forEach((month, i) => {
      monthlyData[i] = { month };
      listings.forEach((l) => {
        monthlyData[i][l.title] = 0;
      });
    });

    bookings.forEach((b) => {
      const monthIndex = new Date(b.startDate).getMonth();
      const listingTitle = b.listingId?.title;
      if (listingTitle && monthlyData[monthIndex]) {
        monthlyData[monthIndex][listingTitle]++;
      }
    });

    const result = Object.values(monthlyData).slice(0, new Date().getMonth() + 1);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("Bookings by month error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;
