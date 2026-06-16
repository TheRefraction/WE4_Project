import { Router } from 'express';
import accountRoutes from './account.routes';
import supplierRoutes from './supplier.routes';
import productRoutes from './product.routes'
import categoryRoutes from './category.routes'
import customizationRoutes from './customizationslot.routes';
import paymentRoutes from './payment.routes';

const router = Router();

router.use('/api/customizations', customizationRoutes);
router.use('/api', accountRoutes);
router.use('/api/suppliers', supplierRoutes);
router.use('/api/products' , productRoutes)
router.use('/api/categories' , categoryRoutes)
router.use('/api/payments', paymentRoutes)




export default router;