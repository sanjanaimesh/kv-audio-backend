import express from 'express';
import { createOrder, getOrderQuotation, getOrders } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post("/",createOrder)
orderRouter.post('/quotation', getOrderQuotation);
orderRouter.get("/all", getOrders);

export default orderRouter