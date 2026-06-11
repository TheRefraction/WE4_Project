import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { body } from 'express-validator';

const router = Router();
const categoryController = new CategoryController();

const categoryValidation = [
    body('name')
        .notEmpty().withMessage('Category name is required')
        .isLength({ max: 128 }).withMessage('Category name cannot exceed 128 characters')
];

router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

router.use(authMiddleware);

router.post('/', categoryValidation, validateRequest, categoryController.create);
router.put('/:id', categoryValidation, validateRequest, categoryController.update);
router.delete('/:id', categoryController.delete);

export default router;