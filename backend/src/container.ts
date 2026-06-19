/**
 * container.ts
 */

import { AccountRepository } from './repositories/account.repository';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account.controller';

export const accountRepository = new AccountRepository();
export const accountService = new AccountService(accountRepository);
export const accountController = new AccountController(accountService);