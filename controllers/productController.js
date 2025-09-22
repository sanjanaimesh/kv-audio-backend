import product from "../models/product.js";

export function addProduct(req, res) {
    if(req.user== null){
        res.status(401).json({
            message: "Please logind and try again"
        })
        return;
    }
    if(req.user.role != "admin"){
        res.status(403).json({
            message: "You are not authorized to add products"
        }) 
        return;
    }
    const data = req.body;
    const newProduct = new product(data);
    newProduct.save()
    .then(
        ()=>{
            res.json({
                message: "Product added successfully"
            })
        }
    ).catch((error)=>{
        res.status(500).json({
            error: "Could not add product"
        });
    })

}