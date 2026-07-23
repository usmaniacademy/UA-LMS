import { Router } from 'express';
import { getSettings, updateSetting } from '../controllers/setting.controller.js';
import { requireAuth, requireRoles } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getSettings);
router.patch('/', requireAuth, requireRoles(['admin']), updateSetting);

export default router;
