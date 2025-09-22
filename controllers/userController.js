import e from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    User.findOne({
        email: data.email
    }).then(
        (user) => {
            if (user == null) {
                res.status(401).json({
                    error: "user not found"
                })

            } else {
                const isPasswordCorrect = bcrypt.compareSync(data.password, user.password);

                if (isPasswordCorrect) {
                    const token = jwt.sign({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: user.role
                    },"kv-Secrect-891")   
                    res.json({
                        message: "Login Success", token : token
                    })
                } else {
                    res.status(401).json({
                        error: "Incorrect Password"
                    })
                }
            }

        }
    )
}