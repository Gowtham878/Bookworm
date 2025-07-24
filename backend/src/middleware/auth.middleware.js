import jwt from "jsonwebtoken";
import "dotenv/config"
import User from "../models/user.js"

const authenticator = async (req,res,next) =>{
    try{

        const token = req.header("Authorization").replace("Bearer ","")
        if(!token) return res.status(401).json({message:"No Authentication token, access denied"})
        
        // decode the token
        const decoded = jwt.verify(token,process.env.SessionKey)

        //find the user

        const user = await User.findById(decoded.userId).select("-password")
        if(!user) return res.status(401).json({message:"Token invalid"})
        
        // foward the final user details
        req.user = user
        next()


    }
    catch(error){
        console.log(error)
        res.status(401).json({message:"Token invalid"})

    }
}

export default authenticator