import Order from "../models/order.js";
import Product from "../models/product.js";

export async function createOrder(req, res) {
  const data = req.body;
  const orderInfo = {
    orderedItems: [],
  };

  // check user login
  if (!req.user) {
    return res.status(401).json({
      message: "Please login and try again",
    });
  }
  orderInfo.email = req.user.email;

  // get last order for new orderId
  const lastOrder = await Order.find().sort({ orderId: -1 }).limit(1);
  if (lastOrder.length === 0) {
    orderInfo.orderId = "ORD0001";
  } else {
    const lastOrderId = lastOrder[0].orderId;
    const lastOrderNumberInString = lastOrderId.replace("ORD", "");
    const lastOrderNumber = parseInt(lastOrderNumberInString);
    const currentOrderNumber = lastOrderNumber + 1;
    const formattedNumber = String(currentOrderNumber).padStart(4, "0");
    orderInfo.orderId = "ORD" + formattedNumber;
  }

  let oneDayCost = 0;

  // loop through ordered items
  for (let i = 0; i < data.orderedItems.length; i++) {
    try {
      const product = await Product.findOne({ key: data.orderedItems[i].key });

      if (!product) {
        return res.status(404).json({
          message: "Product with key " + data.orderedItems[i].key + " not found",
        });
      }

      if (product.availability === false) {
        return res.status(400).json({
          message:
            "Product with key " + data.orderedItems[i].key + " not available",
        });
      }

      orderInfo.orderedItems.push({
        product: {
          key: product.key,
          name: product.name,
          image: product.image[0],
          price: product.price,
        },
        quantity: data.orderedItems[i].qty,
      });

      oneDayCost += product.price * data.orderedItems[i].qty;
    } catch (e) {
      return res.status(500).json({
        message: "Failed to create order",
        error: e.message,
      });
    }
  }

  orderInfo.days = data.days;
  orderInfo.startingDate = data.startingDate;
  orderInfo.endingDate = data.endingDate;

  // ❌ orderInfo.totalCost -> schema එකේ field name එක totalAmount නිසා totalAmount ගන්න ඕන
  orderInfo.totalAmount = oneDayCost * data.days;

  try {
    const newOrder = new Order(orderInfo);
    await newOrder.save();
    return res.json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed to save order",
      error: e.message,
    });
  }
}
