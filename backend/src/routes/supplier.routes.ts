import { Router } from 'express';
import { SupplierController } from '../controllers/supplier.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { body } from 'express-validator';

const router = Router();
const supplierController = new SupplierController();

const supplierValidation = [
    body('name').notEmpty().withMessage('Supplier name is required').isLength({ max: 255 }),
    body('contactInfo.email').isEmail().withMessage('A valid email is required'),
    body('contactInfo.phone').notEmpty().withMessage('Phone number is required')
];

const supplierUpdateValidation = [
    body('name').optional().notEmpty().isLength({ max: 255 }),
    body('contactInfo.email').optional().isEmail(),
    body('contactInfo.phone').optional().notEmpty()
];

// Public routes
router.get('/', supplierController.getAll);
router.get('/:id', supplierController.getById);

// Protected routes
router.use(authMiddleware);
router.post('/', supplierValidation, validateRequest, supplierController.create);
router.put('/:id', supplierUpdateValidation, validateRequest, supplierController.update);
router.delete('/:id', supplierController.delete);

export default router;