import { Router } from 'express';
import { getSettings, updateSetting } from '../controllers/setting.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getSettings);
router.patch('/', authenticate, authorize('admin'), updateSetting);

export default router;
