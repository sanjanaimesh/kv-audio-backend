import express from 'express';
import { createOrder, getOrderQuotation } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post("/",createOrder)
orderRouter.post('/quotation', getOrderQuotation);

export default orderRouter