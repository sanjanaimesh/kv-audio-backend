
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

export function registerUser(req, res) {
    //user ට තමා collection එකත් එක්ක සම්බන්දේ තියෙන්නෙ
    //const newUser = new User(req.body) //Db එකේ සේව් කරන්න පුලුවන් විදියේ user කෙනෙක් හදා ගන්නවා
    const data = req.body;
    data.password = bcrypt.hashSync(data.password, 10); //password එක encrypt කරලා save කරන්න ඕනේ

    const newUser = new User(data);

    newUser.save()
        .then(() => {
            res.json({
                message: "User registered successfully"
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: "Could not register user"
            });
        });
}

export function logingUser(req, res) {
  const data = req.body;

  User.findOne({ email: data.email }).then((user) => {
    if (user == null) {
      console.log("Login request data:", data);
      return res.status(401).json({
        error: "User not found",
      });
    }

    // 🔒 Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        error: "Your account has been blocked. Please contact support.",
      });
    }

    // 🔑 Compare password
    const isPasswordCorrect = bcrypt.compareSync(data.password, user.password);

    if (isPasswordCorrect) {
      const token = jwt.sign(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
          phone: user.phone,
        },
        process.env.JWT_SECRET
      );

      return res.json({
        message: "Login Success",
        token: token,
        user: user,
      });
    } else {
      return res.status(401).json({
        error: "Incorrect Password",
      });
    }
  });
}



export function isItAdmin(req) {
    let isAdmin = false;

    if (req.user != null) {
        if (req.user.role == "admin") {
            isAdmin = true;
        }
    }

    return isAdmin;

}

export function isItcustomer(req) {
    let iscustomer = false;

    if (req.user != null) {
        if (req.user.role == "customer") {
            iscustomer = true;
        }
    }
    return iscustomer;
}

export async function getAllUsers(req,res){
  if(isItAdmin(req)){
    try{
        const users = await User.find();
        res.json(users);
    }catch(e){
        res.status(500).json({error :"Failed to get user"})
    }
  }else{
    res.json({
        message:"Unauthorized"
    })
  }


}

export async function blockUnblockUser(req, res) {
  try {
    if (!isItAdmin(req)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const email = req.params.email;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle the isBlocked status
    user.isBlocked = !user.isBlocked;

    await user.save();

    res.json({
      message: user.isBlocked
        ? "User has been blocked"
        : "User has been unblocked",
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    console.error("Error blocking/unblocking user:", error);
    res.status(500).json({ message: "Failed to update user status" });
  }
}
