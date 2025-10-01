import Product from "../models/product.js";  // ✅ Capital P එකෙන් import කරන්න
import { isItAdmin } from "./userController.js";

export function addProduct(req, res) {
    if (req.user == null) {
        res.status(401).json({
            message: "Please login and try again"
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
    const newProduct = new Product(data);  // ✅
    newProduct.save()
        .then(() => {
            res.json({
                message: "Product added successfully"
            })
        }).catch((error) => {
            res.status(500).json({
                error: "Could not add product"
            });
        })
}

export async function getProducts(req, res) {
    try {
        if (isItAdmin(req)) {
            const products = await Product.find();  // ✅
            res.json(products);
            return;
        } else {
            const products = await Product.find({ availability: true });  // ✅
            res.json(products);
            return;
        }
    } catch (e) {
        res.status(500).json({
            error: "Failed to get products"
        });
    }
}

export async function updateProduct(req, res){
    try{
        if(isItAdmin(req)){
            const key = req.params.key;
            const data = req.body;

            await Product.updateOne({key: key}, data);  // ✅
            res.json({message: "Product updated successfully"});
            return;
        } else {
            res.status(403).json({message: "You are not authorized to update products"});
            return;
        }
    } catch(e) {  // ✅ Error parameter add කරන්න
        console.log(e);
        res.status(500).json({error: "Could not update product"});
    }
}

export async function deleteProduct(req, res){
    try{
        if(isItAdmin(req)){
            const key = req.params.key;
            await Product.deleteOne({key: key});  // ✅
            res.json({message: "Product deleted successfully"});
        } else {
            res.status(403).json({message: "You are not authorized to delete products"});
        }
    } catch(e) {  // ✅ Error parameter add කරන්න
        console.log(e);
        res.status(500).json({error: "Could not delete product"});
    }
}

export async function getProduct(req, res){
    try{
        const key = req.params.key;
        
        
        const foundProduct = await Product.findOne({key: key});  // ✅ Variable name වෙනස් කරලා
        
        

        if(foundProduct == null){
            res.status(404).json({
                message: "product not found"
            })
            return;
        }
        res.json(foundProduct);
        return;

    } catch(e) {
        console.log("Error:", e);
        res.status(500).json({
            message: "Failed to get product"
        })
    }
}