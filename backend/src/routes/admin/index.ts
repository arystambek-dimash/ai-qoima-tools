import { Router } from 'express';
import { adminAuth } from '../../middleware/adminAuth.js';
import useCasesAdminRouter from './useCases.js';
import toolsAdminRouter from './tools.js';
import promptsAdminRouter from './prompts.js';
import newsAdminRouter from './news.js';
import toolUpdatesAdminRouter from './toolUpdates.js';
import subscribersAdminRouter from './subscribers.js';
import companiesAdminRouter from './companies.js';

const router = Router();

// Apply admin auth to all admin routes
router.use(adminAuth);

router.use('/use-cases', useCasesAdminRouter);
router.use('/tools', toolsAdminRouter);
router.use('/prompts', promptsAdminRouter);
router.use('/news', newsAdminRouter);
router.use('/tool-updates', toolUpdatesAdminRouter);
router.use('/subscribers', subscribersAdminRouter);
router.use('/companies', companiesAdminRouter);

export default router;
