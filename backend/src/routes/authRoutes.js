import express from "express"
import User from '../models/user.js'
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (userId) =>{
    jwt.sign({userId},process.env.Sessionkey,{expiresIn:"1d"})
}

const router = express.Router()

router.get('/register',async(req,res)=>{
    res.send("Register")
})
router.post('/register',async (req,res)=>{
    try{
        const {email,username,password} = req.body
        
        if(!email|| !username|| !password){
            return res.status(400).json({message:"All details must be provided"})
        }
        if( password.length < 8){
            return res.status(400).json({message:"Password must be minimum 8 characters"})
        }
        if( username.length < 3){
            return res.status(400).json({message:"Username must be minimum 3 characters"})
        }
        //checking if user exists
        const existingemail = await User.findOne({email})
        console.log(existingemail)
        if(existingemail){
            return res.status(400).json({message:"Email already exists"})

        }
        const existinguser = await User.findOne({username})
        if(existinguser){
            return res.status(400).json({message:"Username already exists"})

        }
        //creating the user

        //creating random profile image
        const profileImage = `https://api.dicebear.com/9.x/open-peeps/svg?seed=${username}`
        //
        const user = new User({
            email,
            username,
            password,
            profileImage,
        })
        
        await user.save()

        const token = generateToken(user._id)

        res.status(201).json({
            token,
            _id:user._id,
            username: user.username,
            email:user.email,
            profileImage: user.profileImage,
        })
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
})

router.get('/login',(req,res)=>{
    res.send("login")
})

router.post('/login',async (req,res)=>{
    try{
        const {email,password} = req.body
        
        if(!email|| !password){
            return res.status(400).json({message:"All details must be provided"})
        }
        if( password.length < 8){
            return res.status(400).json({message:"Password must be minimum 8 characters"})
        }
        if( email.length < 3){
            return res.status(400).json({message:"enter a proper email address"})
        }
        //checking if user exists
        var existinguser = await User.findOne({email})
        //console.log(existinguser,username)
        if(!existinguser){
            return res.status(400).json({message:"User does not exists"})

        }
        const isPasswordValid = await bcrypt.compare(password, existinguser.password);
        if (isPasswordValid) {
            return res.status(200).json({ 
            message: "User exists",
            token,
            _id:User._id,
            username: Userser.username,
            email:User.email,
            profileImage: User.profileImage, });
        }

        else{
            return res.status(400).json({message:"Wrong password"})
        }

        /*res.status(201).json({
            token,
            _id:user._id,
            username: user.username,
            email:user.email,
            profileImage: user.profileImage,
        })*/
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
})

export default router