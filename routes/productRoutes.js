import express from 'express';
import {isAdmin, requireSignIn ,} from '../middlewares/authMiddlewares.js'
import { brainTreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFilterController, productListController, productPhotoController, relatedProductController, searchProductController, UpdateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable';

const router = express.Router();

// Routes

// Create product post method
router.post('/create-product',
     requireSignIn ,
     isAdmin ,
     formidable(),
     createProductController 
    );

    // Update product post method
router.put('/update-product/:pid',
    requireSignIn ,
    isAdmin ,
    formidable(),
    UpdateProductController 
   );

    // Get all products 
    router.get('/get-product', getProductController)

// Get Single Product
router.get('/get-product/:slug', getSingleProductController)

// Get Photo
router.get('/product-photo/:pid' , productPhotoController)

// Delete Product
router.delete('/delete-product/:pid' , deleteProductController)

// Filter Products
router.post('/product-filters' , productFilterController)

// Product count (Pagination)
router.get('/product-count' ,productCountController )

// Product per page
router.get('/product-list/:page' , productListController)

// Search Product
router.get('/search/:keyword' , searchProductController)

// Similar Products
router.get('/related-product/:pid/:cid' , relatedProductController)

// category wise Product
router.get('/product-category/:slug' ,productCategoryController)

//Payment Routes
// token
router.get('/braintree/token' , braintreeTokenController);  

// Payment 
router.post('/braintree/payment' , requireSignIn , brainTreePaymentController)

export default router;