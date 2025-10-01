import

export async function createOrder(req,res){
    const data = req.body;
    const orderInfo = {
        orderedItems:[]
    }

    if(req.user == null){
        res.status(401).json({
            message : "please loging and try againg"
        })
        return
    }
    orderInfo.email=req.user.email;

    const lastOrder = Order.find().sort({orderNumber:-1}).limit(1);
    if(lastOrder.length == 0){
        orderInfo.orderId = "ORD0001"
    }else{
        const lastOrderId = lastOrder[0].orderId;
        const lastOrderNumberInString = lastOrderId.replace("ORD","") 
        const lastOrderNumber = parseInt(lastOrderNumberInString)
        const currentOrdernumber = lastOrderNumber+1;
        const fomattedNumber = String(currentOrdernumber).padStart(4,'0');
        orderInfo.orderId = "ORD"+fomattedNumber
      
    }

    let oneDayCost = 0;
    for(let i=0; i<data.OrderedItems.length;i++){
       try{
        const product = await product.findOne({key:data.OrderedItems[i].key})
        if(product==null){
            res.status(404).json({
                message:"Product with key"+data.OrderedItems[i].key+ "not Found"
            })
            return
        }
        if(product.availability== false){
            res.json({
                message:"Product with key"+data.OrderedItems[i].key+ "not availble"
            })
        }
        orderInfo.orderedItems.push({
            product:{
                key:product.key,
                name:product.name,
                image:product.image[0],
                price:product.price
            },
            quantity : data.orderedItems[i].qty
        })

        oneDayCost += product.price*data.orderedItems[i].qty;


       }
       catch(e){
            res.status(500).json({
                message:"faild to create order"
            })
       }
    }

    orderInfo.days = data.days;
    orderInfo.startingDate = data.startingDate;
    orderInfo.endingDate = data.endingDate;
    orderInfo.totalCost = oneDayCost*data.days

    try{
        const newOrder = new Order(orderInfo);
        await newOrder.save();
        res,json({
            message: "order create successfully"
        })
    }catch(e){
        res.status(500).json({
            message:"failed to create order"
        })
    }



}