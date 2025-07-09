const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDB = require("./lib/connectToDB");
const userRouter = require("./routes/userRoutes.js");
const listingRoute = require("./routes/listingRoute.js");
const bookingsRoute = require("./routes/bookingRoute.js");
const dashboardRoute = require("./routes/dashboardRoutes.js");
const paymentRoute = require("./routes/paymentRoute.js");
const { serve } = require("inngest/express");
const { expireBooking } = require("./inngest/functions/expireBooking.js");
const { inngest } = require("./inngest/client.js");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
connectToDB();

app.use((req, res, next) => {
  if (req.originalUrl === "/api/payment/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.get((req, res) => {
  res.status(200).send("Hello Server is running");
});

app.use("/api/user", userRouter);
app.use("/api/listing", listingRoute);
app.use("/api/bookings", bookingsRoute);
app.use("/api/dashboard/", dashboardRoute);
app.use("/api/payment", paymentRoute);

app.use("/api/inngest", serve({ client: inngest, functions: [expireBooking] }));

app.listen(PORT, () => {
  console.log(`Server is running on port :${PORT}⚡`);
});
