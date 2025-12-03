import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import NoteResponse from '../response/NoteResponse.js'
import ApiResponse from '../api/ApiResponse.js';
import {NoteItemRequest} from '../request/NoteItemRequest.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonFileMenu = path.join(__dirname, '../data/menu.json');
const jsonFileFolder = path.join(__dirname, '../data');

export const GetNote = async(req, res)=>{
    try{
        let dataMenus = await fs.readFile(jsonFileMenu, 'utf8')
        const requestName = req.params.name
        if(!dataMenus){
            return res.json(new ApiResponse(200, req.originalUrl, req.method, new NoteResponse(false, "Note rỗng.", []))) 
        }
        dataMenus = JSON.parse(dataMenus)
        const index = dataMenus.findIndex(i => i.name == requestName)
        if(index==-1){
            return res.json(new ApiResponse(200, req.originalUrl, req.method, new NoteResponse(false, "Note rỗng.", []))) 
        }else{
            let dataNotes = await fs.readFile(jsonFileFolder+"/"+requestName+".json", 'utf8')
            if(!dataNotes){
                return res.json(new ApiResponse(200, req.originalUrl, req.method, new NoteResponse(false, "Note rỗng.", []))) 
            }
            dataNotes = JSON.parse(dataNotes) 
            return res.json(new ApiResponse(200, req.originalUrl, req.method, new NoteResponse(true, "Đã lấy notes.", dataNotes))) 
        }
    }catch(err){
        console.log(err)
    }
}


export const AddNote = async(req, res)=>{
    const requestNoteItem = NoteItemRequest.safeParse(req.body)
    if(!requestNoteItem.success){
        throw new ApiResponse(400, req.originalUrl, req.method, "Sai định dạng request.")
    }
      

    let dataMenus = await fs.readFile(jsonFileMenu, 'utf8')
    dataMenus = JSON.parse(dataMenus)
    let index = dataMenus.findIndex(i => i.name == requestNoteItem.data.nameMenu)
    if(index==-1){
        return res.json(new ApiResponse(200, req.originalUrl, req.method, new NoteResponse(false, "Không tìm thấy name menu.", [])))
    }
    const pathNote = jsonFileFolder+"/"+requestNoteItem.data.nameMenu+".json"
    let dataNotes = await fs.readFile(pathNote, 'utf8')
    if(!dataNotes){
        await fs.writeFile(pathNote, JSON.stringify([requestNoteItem.data]));
        return res.json(new ApiResponse(200, req.originalUrl, req.method, new NoteResponse(false, "Không tìm thấy name menu.", [requestNoteItem.data])))
    }
    dataNotes = JSON.parse(dataNotes)
    index = dataNotes.findIndex(i => i.title == requestNoteItem.data.title)
    if(index!=-1){throw new ApiResponse(400,req.originalUrl, req.method, new NoteResponse(false, "Tên file đã tồn tại.", []))}
    dataNotes.push(requestNoteItem.data)
    await fs.writeFile(pathNote, JSON.stringify(dataNotes));
    return res.json(new ApiResponse(200, req.originalUrl, req.method, new NoteResponse(true, "Đã thêm.", dataNotes)))
}