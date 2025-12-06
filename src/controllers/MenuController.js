import ApiResponse from '../api/ApiResponse.js';
import MenuResponse from '../response/MenuResponse.js'
import {MenuAddRequest} from '../request/MenuRequest.js'
import { GetMenuDb, AddMenuDb, DeleteMenuDb } from '../database/MenuDb.js';



export const GetMenu = async (req, res)=>{
    /*
        Hàm lấy ra tên của menu
            - Đọc từ file menu.json 
            - Trả về một api với data là mảng các chứa object tên của menu
    */


    const data = await GetMenuDb()
    if(!data[0]){
        throw new ApiResponse(400, "/api/v1/menu", "GEt", new MenuResponse(false,data[1],[]))
    }

    return res.json(new ApiResponse(200, "/api/v1/menu", "Get", new MenuResponse(true, "Đã lấy "+data[1].length+" tên menu.", data))) 
}


export const AddMenu = async(req, res)=>{
    /*
        Hàm thêm tên của menu
            - Đọc từ file menu.json để lọc trùng
            - Add thêm object vào file json
            - Trả về một api với data là mảng các chứa object tên của menu
    */

        const requestData = MenuAddRequest.safeParse(req.body)
        if(!requestData.success){
            throw new ApiResponse(400, "/api/v1/menu", "POST", new MenuResponse(false,"Định dạng của Request sai.",[]))
        }
        const name = requestData.data.name
        const data = await AddMenuDb(name)
        
        if(!data[0]){
            throw new ApiResponse(400, "/api/v1/menu", "POST", new MenuResponse(false,data[1],[]))
        }

        return res.json(new ApiResponse(200, "/api/v1/menu", "POST", new MenuResponse(true,"Đã thêm",data[1])))         
}


export const DeleteMenu = async(req, res)=>{
    /*
        Hàm xóa tên của menu
            - Đọc từ file menu.json để lọc trùng
            - Xóa tên trùng với request
            - Trả về một api với data là mảng các chứa object tên của menu
    */


    const requestName = req.params.name;
    const data = await DeleteMenuDb(requestName)    
    if(!data[0]){
        throw new ApiResponse(400, "/api/v1/menu", "POST", new MenuResponse(false,data[1],[]))
    }

    return res.json(new ApiResponse(200, "/api/v1/menu", "POST", new MenuResponse(true,"Đã Xóa",data[1]))) 
}