const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDB = require("./lib/connectToDB");
const userRouter = require("./routes/userRoutes.js")
const listingRoute = require("./routes/listingRoute.js");
const bookingsRoute = require("./routes/bookingRoute.js");
const dashboardRoute = require("./routes/dashboardRoutes.js")
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())
connectToDB(); 

app.get((req,res)=>{
    res.status(200).send("Hello Server is running")
})

app.use("/api/user",userRouter)
app.use("/api/listing",listingRoute)
app.use("/api/bookings",bookingsRoute)
app.use("/api/dashboard/",dashboardRoute)


app.listen(PORT,()=>{
    console.log(`Server is running on port :${PORT}⚡`)
})