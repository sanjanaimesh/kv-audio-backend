import mongoose from "mongoose";

//මේ හදා ගත්තෙ ස්කීමා එක
const reviewSchema = new mongoose.Schema(
    {
        email:{type:String, required:true,unique:true},
        name:{type:String, required:true},
        rating:{type:Number, required:true},
        comment:{type:String, required:true},
        date:{type: Date, required:true, default:Date.now()},
        isApproved:{type:Boolean, required:true, default:false},
        profilePicture :{type : String, required : true, default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS06TGTOlnRnEavBmnT7MIC1fre5hAhE3HfTQ&s"}

    }
)

//දැන් හදාගන්නේ මොඩ්ල් එක

const Review = mongoose.model("Review", reviewSchema); 

export default Review;