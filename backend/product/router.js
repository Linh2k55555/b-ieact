import express from 'express';
import Product from './model.js';  // Make sure you import the correct model

const router = express.Router();

// Route to fetch all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();  // Retrieve products from the database
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

export default router;
