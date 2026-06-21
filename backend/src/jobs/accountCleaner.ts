import cron from 'node-cron';
import { pgPool } from '../config/postgres';

export const initAccountCleaner = () => {
    // Planifié tous les jours à 03h00 du matin
    cron.schedule('0 3 * * *', async () => {
        console.log('[AccountCleaner] Démarrage de la purge des comptes inactifs...');
        
        try {
            // Note: Assurez-vous que vos FK ont 'ON DELETE CASCADE' 
            // pour supprimer les factures/données liées automatiquement.
            const query = `
                DELETE FROM account 
                WHERE last_login < NOW() - INTERVAL '2 years'
                OR (last_login IS NULL AND created_at < NOW() - INTERVAL '2 years');
            `;
            
            const result = await pgPool.query(query);
            
            console.log(`[AccountCleaner] Succès : ${result.rowCount} comptes supprimés.`);
        } catch (error) {
            console.error('[AccountCleaner] Erreur lors de la suppression :', error);
        }
    });
};