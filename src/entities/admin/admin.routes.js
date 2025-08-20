import express from 'express';
import { adminMiddleware, verifyToken } from '../../core/middlewares/authMiddleware.js';
import { getAllUsersControllerByAdmin, updateUserDecisionController } from './admin.controller.js';


const router = express.Router();

router.get("/all-users", verifyToken, adminMiddleware, getAllUsersControllerByAdmin);
router.put("/:id/decision", verifyToken, adminMiddleware, updateUserDecisionController);


export default router;