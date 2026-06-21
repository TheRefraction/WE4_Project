import { Request, Response, NextFunction } from 'express';
import { getCollection } from '../config/mongo';
import { AuthRequest } from './auth.middleware'; // Réutilisation de votre type

export const requestLogger = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const start = Date.now();

    res.on('finish', async () => {
        const duration = Date.now() - start;

        try {
            const logsCollection = getCollection<any>('logs');
            
            // Création de l'objet avec des valeurs par défaut pour éviter les "undefined"
            const logEntry = {
                timestamp: new Date(),
                method: req.method || 'GET', 
                path: req.originalUrl || req.path || '/',
                status: res.statusCode || 0,
                duration: Math.round(duration),
                // userId est optionnel, donc on ne le met que s'il existe
                ...(req.user?.userId && { userId: String(req.user.userId) }),
                ip: req.ip || '127.0.0.1'
            };

            await logsCollection.insertOne(logEntry);
        } catch (error) {
            // Loguer l'erreur réelle pour comprendre quel champ manque
            console.error('Failed to log request:', error);
        }
    });

    next();
};