import express from "express"
import dotenv from "dotenv"
dotenv.config()
import authRoutes from "./routes/authRoutes.js"
import bookRoute from "./routes/bookRoute.js"
import {DB} from "./lib/db.js"
const app = express()

app.use(express.json());


app.use("/api/auth",authRoutes)
app.use("/api/books",bookRoute)

app.listen(process.env.PORT, () => {
    console.log(`Server Up and Running, Port: ${process.env.PORT}`);
    DB() 
});