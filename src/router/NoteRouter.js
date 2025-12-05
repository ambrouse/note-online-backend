import express from "express";
import {AuthenticateToken} from '../services/AuthenticateToken.js'
import { AddNote, GetNote, DeleteNote } from "../controllers/NoteController.js";


const router = express.Router()

router.get("/note/:name", AuthenticateToken, GetNote)
router.post("/note", AuthenticateToken, AddNote)
router.delete("/note", AuthenticateToken, DeleteNote)


export default router