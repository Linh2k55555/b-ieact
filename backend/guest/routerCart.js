import express from 'express';
import { addToCart, removeFromCart,  } from './cart.js';

const router = express.Router();

// Các route của guest cart
router.post('/add', addToCart);
router.delete('/remove', removeFromCart);

export default router;
