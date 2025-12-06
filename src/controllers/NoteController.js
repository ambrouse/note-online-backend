import NoteResponse from '../response/NoteResponse.js'
import ApiResponse from '../api/ApiResponse.js';
import {NoteItemRequest} from '../request/NoteItemRequest.js'
import {AddNoteDb, DeleteNoteDb, GetNotesDb} from '../database/NoteDb.js'



export const GetNote = async(req, res)=>{
    /*
        Hàm đọc dữ liệu của các note
            - Đọc từ database để lấy ra các note theo name menu
            - Trả về một api với data là mảng các chứa note theo tên menu trong req
    */

    
    const requestName = req.params.name
    
    const data = await GetNotesDb(requestName)
    
    if(!data[0]){
        throw new ApiResponse(400, req.originalUrl, req.method, new NoteResponse(false, data[1], []))
    }
    
    return res.json(new ApiResponse(200, req.originalUrl, req.method, new NoteResponse(true, "Đã lấy "+data[1].length+" notes.", data[1]))) 
}


export const AddNote = async(req, res)=>{
    /*
        Hàm thêm note 
            - Kiểm tra nameMenu và lọc trùng title của note sau đó thêm note vào database
            - Trả về một api với data là mảng các chứa note theo tên menu trong req
    */


    const requestNoteItem = NoteItemRequest.safeParse(req.body)
    if(!requestNoteItem.success){
        throw new ApiResponse(400, req.originalUrl, req.method, "Sai định dạng request.")
    }


    const data = await AddNoteDb(requestNoteItem.data)

    if(!data[0]){
        throw new ApiResponse(400, req.originalUrl, req.method, data[1])
    }

    return res.json(new ApiResponse(200, req.originalUrl, req.method, new NoteResponse(true, "Đã tạo note.", data[1])))
}


export const DeleteNote = async(req, res)=>{
    /*
        Hàm thêm note 
            - Kiểm tra nameMenu và lọc trùng title của note sau đó xóa note trong db
            - Trả về một api với data là mảng các chứa note theo tên menu trong req
    */


    const nameMenu = req.query.nameMenu
    const titleNote = req.query.titleNote
    const data = await DeleteNoteDb(nameMenu, titleNote)

    if(!data[0]){
        throw new ApiResponse(400, req.originalUrl, req.method, new NoteResponse(false, data[1], []))
    }

    return res.json(new ApiResponse(200, req.originalUrl, req.method, new NoteResponse(true, "Đã xóa note.", data[1])))
} 


