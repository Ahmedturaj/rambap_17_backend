import express from 'express';
import authRoutes from '../../entities/auth/auth.routes.js';
import userRoutes from '../../entities/user/user.routes.js';
import adminRoutes from '../../entities/admin/admin.routes.js';


const router = express.Router();


router.use('/v1/auth', authRoutes);
router.use('/v1/user', userRoutes);
router.use('/v1/admin', adminRoutes);


export default router;
