import { Router } from 'express';
import accountRoutes from './account.routes';
import supplierRoutes from './supplier.routes';
import productRoutes from './product.routes'
import categoryRoutes from './category.routes'

const router = Router();

router.use('/api', accountRoutes);
router.use('/api/suppliers', supplierRoutes);
router.use('/api/product' , productRoutes)
router.use('/api/category' , categoryRoutes)

export default router;