import express from "express"
import Book from '../models/book.js'
import cloudinary from "../lib/cloudinary.js";
import Authenticate from "../middleware/auth.middleware.js";


const router = express.Router()

router.get('/addbook',async(req,res)=>{
    res.send("Register")
})
router.post('/addbook',Authenticate,async (req,res)=>{
    try{
        const {tittle,caption,coverpage,rating} = req.body
        if(!tittle||!caption||!coverpage||!rating){
            res.status(401).json({message:"Please provide all details!"})
        }

        //fetching the coverpage
        const cloudinaryrespnse = await cloudinary.uploader.upload(coverpage)
        const imageurl = await cloudinaryrespnse.secure_url

        //save details to database
        const newbook = new Book({
            tittle,
            caption,
            coverpage: imageurl,
            rating,
            user:req.user._id,
        })

        await newbook.save()

        res.status(201).json(newbook)
        
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Internal Server Error"})
    }
})

router.get('/books',Authenticate,async (req,res)=>{
    try{
        const page = req.query.page
        const limit = req.query.limit
        const skip = (page-1) * limit

        const books = await Book.find()
        .sort({ createdAt:-1 })
        .skip(skip)
        .populate("user","username profileImage")

        const totalBooks = await books.countDocuments()
        
        res.status(302).json({message:"Books found"})
        res.send({
            books,
            currentPage:page,   
            totalBooks,
            totalPages: Math.ceil(totalBooks/limit)
        })

    }
    catch(error){
        console.log(error)
        res.status(501).json({message:"No books found"})
    }
    
})

router.delete('/:id',Authenticate, async (req,res)=>{
    try{

        const book = await Book.findById(req.params.id)
        if(!book) return res.status(404).json({message:"Book not found"})

        // check if the user is the owner of the book
        if(book.user.toString() != req.user._id.toString()) return res.status(401).json({message:"Unauthorized"})
        

        //delete the book and image from the cloudinary

        //image
        if(book.coverpage && book.coverpage.includes("cloudinary")){
            try{
                const publicId = book.coverpage.split("/").pop().split(".")[0]
                await cloudinary.uploader.destroy(publicId)
            }
            catch(error){
                console.log("Error deleting the image in cloudinary",error)
            }
        }

        //book
        await book.deleteOne()
        
        res.json({message:"Book deleted successfully"})
    }
    catch(error){
        console.log("Error deleting the book")
        res.status(501).json({message:"Internal Server error "})
    }
})

export default router