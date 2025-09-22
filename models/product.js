import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name :{
            type : String,
            required : true
        },
        price : {
            type : Number,
            required : true
        },
        descrition : {
            type : String,
            required : true
        }
    }
)

const product = mongoose.model("Product", productSchema);
export default product;