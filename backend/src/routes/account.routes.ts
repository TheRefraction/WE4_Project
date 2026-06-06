import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';
import { body } from 'express-validator';

const router = Router();
const accountController = new AccountController();

// Validation rules
const registerValidation = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone('any').withMessage('Valid phone number is required')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const updateValidation = [
  body('firstName').optional().notEmpty(),
  body('lastName').optional().notEmpty(),
  body('email').optional().isEmail(),
  body('phone').optional(),
  body('password').optional().isLength({ min: 6 })
];

// Public routes
router.post('/register', registerValidation, validateRequest, accountController.register);
router.post('/login', loginValidation, validateRequest, accountController.login);

// Protected routes
router.use(authMiddleware);
router.get('/profile', accountController.getProfile);
router.put('/profile/:id', updateValidation, validateRequest, accountController.updateAccount);
router.delete('/profile/:id', accountController.deleteAccount);

// Admin routes
router.get('/admin/accounts', accountController.getAllAccounts);
router.get('/admin/accounts/:id', accountController.getAccountById);

export default router;