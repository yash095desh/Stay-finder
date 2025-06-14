const mongoose = require("mongoose")

async function connectToDB(){
    try{
        if(!process.env.MONGO_URL)throw new Error("DB Url not found");
        
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DB Connected Successfully")

    }catch(error){
        console.log("Error while connecting to DB",error)
    }
}

module.exports = connectToDB;