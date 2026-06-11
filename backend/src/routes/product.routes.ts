import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { body } from 'express-validator';

const router = Router();
const productController = new ProductController();

const createProductValidation = [
    body('name').notEmpty().withMessage('Product name is required').isLength({ max: 128 }),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('supplier_id').custom((value) => value === null || typeof value === 'number').withMessage('Supplier ID must be a number or null'),
    body('categoryIds').isArray().withMessage('Category IDs must be an array of numbers')
];

const updateProductValidation = [
    body('name').optional().notEmpty().isLength({ max: 128 }),
    body('price').optional().isFloat({ min: 0 }),
    body('supplier_id').optional().custom((value) => value === null || typeof value === 'number'),
    body('categoryIds').optional().isArray()
];

// Public routes
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Protected routes
router.use(authMiddleware);
router.post('/', createProductValidation, validateRequest, productController.create);
router.put('/:id', updateProductValidation, validateRequest, productController.update);
router.delete('/:id', productController.delete);

export default router;