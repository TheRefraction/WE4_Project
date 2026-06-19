import { CustomizationService } from './customization.service';
import { OptionService } from './option.service';
import { AppError } from '../middlewares/error.middleware';

export class CustomizationFacade {
    constructor(private slotSvc: CustomizationService, private optionSvc: OptionService) {}
}