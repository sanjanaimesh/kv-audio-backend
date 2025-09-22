import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import UserRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";




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

let mongoUrl = "mongodb+srv://admin:123@cluster0.avjvoe3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

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