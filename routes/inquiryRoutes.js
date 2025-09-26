import express from "express";
import { addInruiry, deleteInquiry, getInquiries, updateInquiry } from "../controllers/inquiryController.js";

const inquiryRouter = express.Router();

inquiryRouter.post("/",addInruiry)
inquiryRouter.get("/",getInquiries)
inquiryRouter.delete("/:id",deleteInquiry)
inquiryRouter.put("/:id",updateInquiry)
export default inquiryRouter;