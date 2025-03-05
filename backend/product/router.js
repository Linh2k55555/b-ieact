import express from "express";
import { addProduct, deleteProduct, getProducts, getProductsById, updateProduct } from "./controller.js";

const router = express.Router();

router.get(`/products`, getProducts);
router.get(`/products/:id`, getProductsById);
router.post(`/products`, addProduct);//thêm sản phẩm
router.put(`/products/:id`, updateProduct); //cập nhật sản phâmr 
router.delete(`/products/:id`, deleteProduct);//xoá sản phẩm
router.get('/products', async (req, res) => {
    try {
      const products = await Product.find(); // Fetch products from DB
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products' });
    }
  });
export default router;