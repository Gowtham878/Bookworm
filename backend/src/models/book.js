import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    tittle:{
        type:String,
        required:true,
        unique: true,
    },
    caption:{
        required:true,
        type:String,
        unique:true,
    },
    coverpage:{
        type:String,
        minLength:8,
        required:true,
    },
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})


const Book = mongoose.model("book",bookSchema)

export default Book