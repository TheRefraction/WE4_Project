import { Router } from 'express';

import accountRoutes from './account.routes';
import supplierRoutes from './supplier.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import customizationRoutes from './customization.routes';
/*import paymentRoutes from './payment.routes';
import invoiceRoutes from './invoice.routes';*/

const API_VERSION = 'v1';

const router = Router();

// Version 1
router.use(`/api/${API_VERSION}`, accountRoutes);
router.use(`/api/${API_VERSION}/customizations`, customizationRoutes);
router.use(`/api/${API_VERSION}/suppliers`, supplierRoutes);
router.use(`/api/${API_VERSION}/products`, productRoutes);
router.use(`/api/${API_VERSION}/categories`, categoryRoutes);
/*router.use(`/api/${API_VERSION}/payments`, paymentRoutes);
router.use(`/api/${API_VERSION}/invoices`, invoiceRoutes);*/

export default router;