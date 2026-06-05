import {Router, Request, Response} from 'express';
import {ProductController} from '../controllers/ProductController';

const router = Router();
const productController = new ProductController();


router.get('/', productController.getAllProducts);
router.get('/filter', productController.getFilteredProducts);
router.get('/:id/supplier', productController.getProductByIdWithSupplier);
router.get('/:id', productController.getProductById);


export default router;