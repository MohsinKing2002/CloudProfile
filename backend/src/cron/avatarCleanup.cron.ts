import cron from 'node-cron';
import { cleanupOrphanAvatars } from '../services/avatarCleanup.service.js';

export const startAvatarCleanupCron = () => {
  cron.schedule(
    '0 2 15 * *',
    async () => {
      console.log('[CRON] Starting orphan avatar cleanup...');
      try {
        await cleanupOrphanAvatars();

        console.log('[CRON] Orphan avatar cleanup completed.');
      } catch (error) {
        console.error('[CRON] Orphan avatar cleanup failed:', error);
      }
    },
    {
      timezone: 'Asia/Kolkata',
    },
  );
};
