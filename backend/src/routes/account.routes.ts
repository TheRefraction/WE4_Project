import { Router } from 'express';
import { body, param } from 'express-validator';

import { Role } from '../models/account.model';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validation.middleware';

import { accountController } from '../container';

const router = Router();

const idValidation = [param('id').isInt().withMessage('Invalid id')];

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
  body('password').optional().isLength({ min: 6 }),
  body('role').optional().isIn(Object.values(Role)).withMessage('Invalid role value')
];

// Public routes
router.post('/register', registerValidation, validateRequest, accountController.register);
router.post('/login', loginValidation, validateRequest, accountController.login);

// Protected routes
router.use(authMiddleware);
router.get('/profile', accountController.getProfile);
router.put('/profile/:id', idValidation, updateValidation, validateRequest, accountController.updateAccount);
router.delete('/profile/:id', idValidation, validateRequest, accountController.deleteAccount);

// Admin routes
router.get('/admin/accounts', accountController.getAllAccounts);
router.get('/admin/accounts/:id', idValidation, validateRequest, accountController.getAccountById);

export default router;