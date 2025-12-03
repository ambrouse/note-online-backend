import express from "express";
import {AuthenticateToken} from '../services/AuthenticateToken.js'
import { AddNote, GetNote } from "../controllers/NoteController.js";


const router = express.Router()

router.get("/note/:name", AuthenticateToken, GetNote)
router.post("/note", AuthenticateToken, AddNote)


export default router