import {Router} from 'express'
import { CustomizationController } from '../controllers/customizationslot.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { body } from 'express-validator';

const router = Router()
const controller = new CustomizationController();

const slotValidation = [
    body('product_id').isInt().withMessage('Product ID must be an integer'),
    body('category_id').isInt().withMessage('Category ID must be an integer'),
    body('min_select').optional().isInt({ min: 0 }).withMessage('min_select must be >= 0'),
    body('max_select').optional().isInt({ min: 0 }).withMessage('max_select must be >= 0'),
    body('display_order').optional().isInt({ min: 0 }).withMessage('display_order must be >= 0')
];

const optionValidation = [
    body('product_id').isInt().withMessage('Option Product ID must be an integer'),
    body('price_delta').optional().isFloat().withMessage('price_delta must be a number'),
    body('is_default').optional().isBoolean().withMessage('is_default must be a boolean'),
    body('display_order').optional().isInt({ min: 0 }).withMessage('display_order must be >= 0')
];

router.get('/slots', controller.getAllSlots);

router.get('/slots/product/:productId', controller.getSlotsByProductId);


router.use(authMiddleware);

// Gestion slots
router.post('/slots', slotValidation, validateRequest, controller.createSlot);
router.put('/slots/:id', controller.updateSlot);
router.delete('/slots/:id', controller.deleteSlot);

// Gestion options
router.post('/slots/:slotId/options', optionValidation, validateRequest, controller.addOption);
router.put('/slots/:slotId/products/:productId', controller.updateOption);
router.delete('/slots/:slotId/products/:productId', controller.removeOption);

export default router;