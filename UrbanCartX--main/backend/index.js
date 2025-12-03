import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userExtraRoutes from './routes/userExtraRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

dotenv.config()
console.log("ENV TEST:", process.env.CLOUDINARY_CLOUD_NAME);
let port = process.env.PORT || 8000;


let app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["https://urbancartx-frontendu.onrender.com" , "https://urbancartx-adminm.onrender.com"],
    credentials: true
}))

app.use("/api/auth",authRoutes)
app.use("/api/user",userRoutes)
app.use("/api/product",productRoutes)
app.use("/api/order", orderRoutes); 
app.use("/api/user", userExtraRoutes); 
app.use("/api/settings", settingsRoutes);

app.listen(port , ()=>{
    console.log("Hello from server");
    connectDB();
})



