import express from "express";
import { isItAdmin, isItcustomer } from "./userController.js";
import Inquiry from "../models/inquiry.js";

export async function addInruiry(req, res) {
    try {
        if (isItcustomer(req)) {
            const data = req.body;
            data.email = req.user.email;
            data.phone = req.user.phone;

            let id = 0;
            const inquiries = await Inquiry.find().sort({ id: -1 }).limit(1);
            if (inquiries.length == 0) {
                id = 1;
            } else {
                id = inquiries[0].id + 1;
            }

            data.id = id;
            const newInquiry = new Inquiry(data);
            const response = await newInquiry.save();
            res.json({
                message: "Inquiry added successfully",
                id: response.id
            });
            return;

        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Could not add inquiry" });
        return;
    }
}

export async function getInquiries(req, res) {
    try {
        if (isItcustomer(req)) {
            const inquiries = await Inquiry.find({ email: req.user.email });
            res.json(inquiries);
            return;
        } else if (isItAdmin(req)) {
            const inquiries = await Inquiry.find();
            res.json(inquiries);
            return;
        } else {
            res.status(403).json({ error: "You are not authorized to view inquiries" });
            return;
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Could not get inquiries" });
    }
}

export async function deleteInquiry(req, res) {
    try {
        if (isItAdmin(req)) {
            const id = req.params.id;
            await Inquiry.deleteOne({ id: id });
            res.json({ message: "Inquiry deleted successfully" });
            return;
        } else if (isItcustomer(req)) {
            const id = req.params.id;

            const induiry = await Inquiry.findOne({ id: id });
            if (induiry == null) {
                res.status(404).json({ error: "Inquiry not found" });
                return;
            } else {
                if (induiry.email == req.user.email) {
                    await Inquiry.deleteOne({ id: id });
                    res.json({ message: "Inquiry deleted successfully" });
                    return;
                } else {
                    res.status(403).json({ error: "You are not authorized to delete this inquiry" });
                    return;
                }
            }

        } else {
            res.status(403).json({ error: "You are not authorized to delete inquiries" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ error: "Could not delete inquiry" });
    }
}

export async function updateInquiry(req, res) {
    try {
        if (isItAdmin(req)) {
            const id = req.params.id;
            const data = req.body;
            await Inquiry.updateOne({ id: id }, data);
            res.json({ message: "Inquiry updated successfully" });
        } else if (isItcustomer(req)) {
            const id = req.params.id;
            const data = req.body;
            const induiry = await Inquiry.findOne({ id: id });
            if (induiry == null) {
                res.status(404).json({ error: "Inquiry not found" });
                return;
            } else {
                if (induiry.email == req.user.email) {
                    await Inquiry.updateOne({ id: id }, { message: data.message });
                    res.json({ message: "Inquiry updated successfully" });
                    return;
                } else {
                    res.status(403).json({ error: "You are not authorized to update this inquiry" });
                    return;
                }
            }
        }else{
            res.status(403).json({ error: "You are not authorized to update inquiries" });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Could not update inquiry" });
    }

}