
    //options slots controller

    async addOption(req: Request, res: Response, next: NextFunction): Promise <void>{
        try{
            const slotId = parseInt (req.params.slotId, 10)
            if (isNaN(slotId)){
                res.status(400).json({
                    success: false,
                    message: 'Invalid slot ID'
                });
                return;
            }
            const newOption = await customizationService.addOptionToSlot(slotId, req.body);
            res.status(201).json({
                success: true,
                message : 'Option added successfully',
                data : newOption
            });
        }catch (error){
            next(error);
        }
    }


    async updateOption(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const slotId = parseInt (req.params.slotId,10);
            const productId = parseInt(req.params.productId,10);
            if (isNaN(slotId) || isNaN(productId)){
                res.status(400).json({
                    success: false,
                    message: 'Invalid slot or product ID'
                });
                return;
            }
            const {priceDelta, isDefault, displayOrder} = req.body;
            const updatedOption = await customizationService.updateOption(slotId, productId, priceDelta, isDefault, displayOrder);

            res.status(200).json({
                success: true, 
                message: 'Option updated successfully',
                data: updatedOption
            });
        }catch(error){
            next(error);
        }
    }


    async removeOption(req: Request, res: Response, next: NextFunction): Promise<void>{
        try {
            const slotId = parseInt(req.params.slotId, 10);
            const productId = parseInt(req.params.productId, 10);
            if (isNaN(slotId) || isNaN(productId)){
                res.status(400).json({
                    success: false,
                    message: 'Invalid slot or product ID'
                });
                return;
            }
            await customizationService.removeOptionFromSlot(slotId, productId);
            res.status(200).json({
                success: true,
                message: 'Option removed from slot successfully'
            });   
        }catch(error){
            next(error);
        }
    }