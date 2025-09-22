import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true, //එක email එකක් පමණක් තියෙන්න ඕනේ
        },
        password : {
            type: String,
            required : true
        },
        role : {
            type: String,
            required : true,
            default : "customer"
        },
        firstName : {
            type: String,
            required : true
        },
        lastName :{
            type: String,
            required : true
        },
        address : {  
            type : String,
            required : true
        },
        phone : {
            type : String,
            required : true
        }
    }
);

// හරි syntax: mongoose.model(modelName, schema)
const User = mongoose.model("User", userSchema); 
export default User;