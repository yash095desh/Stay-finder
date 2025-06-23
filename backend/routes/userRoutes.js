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

router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, imageUrl, role } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const updates = {};
    if (name) updates.name = name;
    if (imageUrl) updates.imageUrl = imageUrl;

    // Only allow role update if it's explicitly set to "host"
    if (role && role === "host") {
      updates.role = "host";
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;