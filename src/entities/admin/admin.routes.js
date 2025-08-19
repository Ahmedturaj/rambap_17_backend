import express from 'express';
import { adminMiddleware, verifyToken } from '../../core/middlewares/authMiddleware.js';
import { updateUserDecisionController } from './admin.controller.js';


const router = express.Router();


router.put("/:id/decision", verifyToken, adminMiddleware, updateUserDecisionController);


export default router;