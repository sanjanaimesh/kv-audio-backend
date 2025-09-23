import e from "express";
import Review from "../models/review.js";

export function addReview(req, res) {
    if (req.user == null) {
        res.status(401).json({
            messagge: "Please logind and try again"
        });
        return;
    }

    const data = req.body;

    data.name = req.user.firstName + " " + req.user.lastName;
    data.profilePicture = req.user.profilePicture;
    data.email = req.user.email;

    const newReview = new Review(data);

    newReview.save().then(
        () => {
            res.json({
                message: "Review added successfully"
            }).catch(
                () => {
                    res.status(500).json({ error: "Could not add review" })
                }
            )
        }
    )

}

export function getReviews(req, res) {
    const user = req.user;
    if (user == null || user.role != "admin") {
        Review.find({ isApproved: true }).then((reviews) => {
            res.json(reviews);
        })
        return;
    } else {
        Review.find().then((reviews) => {
            res.json(reviews);
        })
    }
}

export function deleteReview(req, res) {
    const email = req.params.email;

    if (req.user == null) {
        res.status(401).json({ message: "Please login and try again" });
        return;
    }

    if (req.user.role == "admin") {
        Review.deleteOne({ email: email }).then(() => {
            res.json({ message: "Review deleted successfully" });
        }).catch(() => {
            res.status(500).json({ error: "Could not delete review" });
        });
        return;

    }

    if (req.user.role == "customer") {

        if (req.user.email == email) {
            Review.deleteOne({ email: email }).then(() => {
                res.json({ message: "Review deleted successfully" });
            }).catch(() => {
                res.status(500).json({ error: "Could not delete review" });
            });
            
        }else{
            res.status(403).json({ message: "You are not authorized to delete this review" });
        }

    }


}

export function approveReview(req, res) {
    const email = req.params.email;

    if(req.user == null){
        res.status(401).json({ message: "Please login and try again" });
        return;
    }
    if(req.user.role == "admin"){
        Review.updateOne({
            email : email
        },{
            isApproved : true
        }).then(() => {
            res.json({ message: "Review approved successfully" });
        })

    }else{
        res.status(403).json({ message: "You are not authorized to approve reviews" });
    }
}