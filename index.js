import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import UserRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file




const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {

    let token = req.header("authorization");

    if (token != null) {
        token = token.replace("Bearer ", "");

        jwt.verify(token, "kv-Secrect-891", (err, decode) => {
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

app.listen(3000, (req, res) => {
    console.log("Port running 3000")
})