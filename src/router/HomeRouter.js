import express from 'express';
import { GetAllStaff, GetAllUser } from '../controllers/HomeController.js';

const router = express.Router();

router.get('/user',GetAllUser);
router.get('/staff',GetAllStaff);

export default router;