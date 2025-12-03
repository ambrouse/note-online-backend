import express from 'express';
import {AddMenu, DeleteMenu, GetMenu } from '../controllers/MenuController.js';
import {AuthenticateToken} from '../services/AuthenticateToken.js'

const router = express.Router();

router.get('/menu',AuthenticateToken,GetMenu);
router.post('/menu',AuthenticateToken,AddMenu);
router.delete('/menu/:name',AuthenticateToken,DeleteMenu);

export default router;