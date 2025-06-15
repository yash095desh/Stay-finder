const express = require("express");
const User = require("../modals/user");


const router = express.Router();


router.post("/storeUser", async(req,res)=>{
    try {
        const {clerkId , name , email, image} = req.body;

        if(!clerkId || !email) throw new Error("ClerkId or email not provided");

        let user = await User.findOne({clerkId});

        if(!user){
            user = new User({
                clerkId,
                name,
                email,
                imageUrl: image,
            })
            await user.save();
        }
        
        res.status(200).json({success:true, user})

    } catch (error) {
        console.log("Error in storing user:",error)
        res.status(500).json({success:false, message:error.message})
    }
})

module.exports = router;