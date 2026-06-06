import {Router, Request, Response} from 'express';
import {ProductController} from '../controllers/ProductController';

const router = Router();
const productController = new ProductController();


router.get('/', productController.getAllProducts);
router.get('/admin', productController.getFilteredProducts); 
router.get('/filter', productController.getFilteredProducts);
router.get('/:id/supplier', productController.getProductByIdWithSupplier);
router.get('/:id', productController.getProductById);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

export default router;