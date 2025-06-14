const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDB = require("./lib/connectToDB");
const userRouter = require("./routes/userRoutes.js")
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


app.listen(PORT,()=>{
    console.log(`Server is running on port :${PORT}⚡`)
})