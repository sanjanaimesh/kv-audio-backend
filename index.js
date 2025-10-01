import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import UserRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import reviewRouter from "./routes/reviewRouter.js";
import inquiryRouter from "./routes/inquiryRoutes.js";
import cors from "cors";
import orderRouter from "./routes/orderRouter.js";
dotenv.config(); // Load environment variables from .env file




const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {

    let token = req.header("authorization");

    if (token != null) {
        token = token.replace("Bearer ", "");

        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if(!err){
                
                req.user = decode;
            }

        });
    }
    next();    

})

let mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl)
let connection = mongoose.connection
connection.once("open", () => {
    console.log("MongoDB wada bn")
})

app.use("/api/users", UserRouter);
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRouter)
app.use("/api/inquiries", inquiryRouter)
app.use("/api/orders",orderRouter)

app.listen(3000, (req, res) => {
    console.log("Port running 3000")
})

//sanjana1example@gmail.com 123! - customer
//sanjana2example@gmail.com 123! - admin