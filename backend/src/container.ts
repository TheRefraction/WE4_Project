/**
 * container.ts
 */

import { AccountRepository } from './repositories/account.repository';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { SupplierRepository } from './repositories/supplier.repository';
import { SupplierService } from './services/supplier.service';
import { SupplierController } from './controllers/supplier.controller';
import { CustomizationSlotRepository } from './repositories/customization.repository';
import { CustomizationService } from './services/customization.service';
import { CustomizationController } from './controllers/customization.controller';
import { CustomizationFacade } from './services/customization.facade';
import { CustomizationOptionRepository } from './repositories/option.repository';
import { OptionService } from './services/option.service';
import { OptionController } from './controllers/option.controller';
import { ProductRepository } from './repositories/product.repository';
import { ProductService } from './services/product.service';
import { ProductFacade } from './services/product.facade';
import { ProductController } from './controllers/product.controller';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentService } from './services/payment.service';
import { PaymentController } from './controllers/payment.controller';
import { InvoiceRepository } from './repositories/invoice.repository';
import { InvoiceService } from './services/invoice.service';
import { InvoiceController } from './controllers/invoice.controller';

export const accountRepository = new AccountRepository();
export const accountService = new AccountService(accountRepository);
export const accountController = new AccountController(accountService);

export const categoryRepository = new CategoryRepository();
export const categoryService = new CategoryService(categoryRepository);
export const categoryController = new CategoryController(categoryService);

export const supplierRepository = new SupplierRepository();
export const supplierService = new SupplierService(supplierRepository);
export const supplierController = new SupplierController(supplierService);

export const optionRepository = new CustomizationOptionRepository();
export const optionService = new OptionService(optionRepository);

export const customizationRepository = new CustomizationSlotRepository();
export const customizationService = new CustomizationService(customizationRepository);
export const customizationFacade = new CustomizationFacade(customizationService, optionService);

export const customizationController = new CustomizationController(customizationService, customizationFacade);
export const optionController = new OptionController(optionService, customizationFacade);

export const productRepository = new ProductRepository();
export const productService = new ProductService(productRepository);
export const productFacade = new ProductFacade(productService, customizationFacade, categoryService, supplierService);
export const productController = new ProductController(productService, productFacade);

export const paymentRepository = new PaymentRepository();
export const paymentService = new PaymentService(paymentRepository);
export const paymentController = new PaymentController(paymentService);

export const invoiceRepository = new InvoiceRepository();
export const invoiceService = new InvoiceService(invoiceRepository);
export const invoiceController = new InvoiceController(invoiceService, paymentService);