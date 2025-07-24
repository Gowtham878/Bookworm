import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique: true,
    },
    email:{
        required:true,
        type:String,
        unique:true,
    },
    password:{
        type:String,
        minLength:8,
        required:true,
    },
    profileImage:{
        type:String,
    }
},{timestamps:true})

userSchema.pre("save", async function(next) {
    try {
        if (!this.isModified("password")) return next();

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        console.log("Password has been encrypted");
        next();
    } catch (error) {
        console.log(error);
    }
});

const User = mongoose.model("User",userSchema)

export default User