import product from "../models/product.js";
import { isItAdmin } from "./userController.js";

export function addProduct(req, res) {
    if (req.user == null) {
        res.status(401).json({
            message: "Please logind and try again"
        })
        return;
    }
    if (req.user.role != "admin") {
        res.status(403).json({
            message: "You are not authorized to add products"
        })
        return;
    }
    const data = req.body;
    const newProduct = new product(data);
    newProduct.save()
        .then(
            () => {
                res.json({
                    message: "Product added successfully"
                })
            }
        ).catch((error) => {
            res.status(500).json({
                error: "Could not add product"
            });
        })

}

export async function getProducts(req, res) {
 

    try {
        if (isItAdmin(req)) {
            const products = await product.find();
            res.json(products);
            return;
        } else {
            const products = await product.find({ availability: true });
            res.json(products);
            return;
        }

    } catch (e) {
        res.status(500).json({
            error: "Failed to get products"
        });
    }
}

export async function updateProduct(req,res){
    try{
        if(isItAdmin(req)){
            const key = req.params.key;
            const data = req.body;

            await product.updateOne({key:key},data)
            res.json({message : "Product updated successfully"});
            return;
        }else{
            res.status(403).json({message : "You are not authorized to update products"});
            return;
        }
    }catch{
        res.status(500).json({error : "Could not update product"});
    }
}

export async function deleteProduct(req,res){
    try{
        if(isItAdmin(req)){
            const key = req.params.key
            await product.deleteOne({key:key})
            res.json({message : "Product deleted successfully"});
        }else{
            res.status(403).json({message : "You are not authorized to delete products"});
        }


    }catch{

    }
}