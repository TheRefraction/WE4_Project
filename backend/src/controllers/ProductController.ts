import { Request, Response } from 'express';
import { Product } from '../models/Product';

export class ProductController {

  getAllProducts = async (req: Request, res: Response) => {
    try {
      const products = await Product.getAllProducts(); 
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ message: 'Erreur lors de la récupération des produits', error: error.message });
    }
  };


  getProductById = async (req: Request, res: Response)  => {
    try {
      const id = parseInt(req.params.id, 10);
      const product = await Product.getProductById(id); 

      if (!product) {
        res.status(404).json({ message: 'Produit non trouvé' });
        return;
      }
      res.status(200).json(product);
    } catch (error: any) {
      res.status(500).json({ message: 'Erreur lors de la récupération du produit', error: error.message });
    }
  };


  getFilteredProducts = async (req: Request, res: Response)  => {
    try {
      const search = req.query.search as string;
      const sort = req.query.sort as string;
      
      const products = await Product.getFilteredProducts(search, sort); 
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ message: 'Erreur lors du filtrage des produits', error: error.message });
    }
  };

  getProductByIdWithSupplier = async (req: Request, res: Response) => {
    try {      const id = parseInt(req.params.id, 10);
      const productWithSupplier = await Product.getByIdWithSupplier(id);
      if (!productWithSupplier) {
        res.status(404).json({ message: 'Produit non trouvé' });
        return;
      }
      res.status(200).json(productWithSupplier);
    } catch (error: any) {
      res.status(500).json({ message: 'Erreur lors de la récupération du produit avec fournisseur', error: error.message });
    }
  };






}