import mongoose from "mongoose";
mongoose.set('strictQuery', false)
export const DB= async()=>{
    try{
        const connection =  mongoose.connect(process.env.DB_URL)
        console.log("Successfully connected to DB")
    }
    catch(error){
        console.log("Connection to DB failed",error)
        process.exit(1)
    }
}