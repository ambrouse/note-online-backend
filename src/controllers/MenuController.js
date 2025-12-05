import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import ApiResponse from '../api/ApiResponse.js';
import MenuResponse from '../response/MenuResponse.js'
import {MenuAddRequest} from '../request/MenuRequest.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonFileMenu = path.join(__dirname, '../data/menu.json');
const jsonFileFolder = path.join(__dirname, '../data');

export const GetMenu = async (req, res)=>{
    /*
        Hàm lấy ra tên của menu
            - Đọc từ file menu.json 
            - Trả về một api với data là mảng các chứa object tên của menu
    */


    try{
        const data = await fs.readFile(jsonFileMenu, 'utf8')
        if(!data){
            return res.json(new ApiResponse(200, "/api/v1/menu", "Get", new MenuResponse(true,"Đã lấy tên menu.", [])))
        }

        const jsonData = JSON.parse(data);
        return res.json(new ApiResponse(200, "/api/v1/menu", "Get", new MenuResponse(true, "Đã lấy tên menu.", jsonData))) 

    }catch(err){
        return res.json(new ApiResponse(500, "/api/v1/menu", "Get", "Server is err.")) 
    }
}


export const AddMenu = async(req, res)=>{
    /*
        Hàm thêm tên của menu
            - Đọc từ file menu.json để lọc trùng
            - Add thêm object vào file json
            - Trả về một api với data là mảng các chứa object tên của menu
    */


    let dataMenus = await fs.readFile(jsonFileMenu, 'utf8')
    const requestData = MenuAddRequest.safeParse(req.body)

    if(!requestData.success){
        throw new ApiResponse(400, "/api/v1/menu", "POST", new MenuResponse(false,"Định dạng của Request sai.",dataMenus))
    }

    if(!dataMenus){
        await fs.writeFile(jsonFileMenu, JSON.stringify([requestData.data]));
        await fs.writeFile(jsonFileFolder+"/"+requestData.data.name+".json", "");
        return res.json(new ApiResponse(200, "/api/v1/menu", "POST", new MenuResponse(true,"Đã thêm",[requestData.data])))
    }

    dataMenus = JSON.parse(dataMenus);
    let check = true
    dataMenus.forEach((item)=>{
        if(item.name == requestData.data.name){
            check = false
        }
    })

    if(!check){
        throw new ApiResponse(400, "/api/v1/menu", "POST", new MenuResponse(false,"Tên đã tồn tại",dataMenus))
    }

    dataMenus.push(requestData.data)
    await fs.writeFile(jsonFileMenu, JSON.stringify(dataMenus));
    await fs.writeFile(jsonFileFolder+"/"+requestData.data.name+".json", "");
    return res.json(new ApiResponse(200, "/api/v1/menu", "POST", new MenuResponse(true, "Đã thêm", dataMenus))) 
}


export const DeleteMenu = async(req, res)=>{
    /*
        Hàm xóa tên của menu
            - Đọc từ file menu.json để lọc trùng
            - Xóa tên trùng với request
            - Trả về một api với data là mảng các chứa object tên của menu
    */


    try{
        let dataMenus = await fs.readFile(jsonFileMenu, 'utf8')
        const requestName = req.params.name;
        if(!dataMenus){
            return res.json(new ApiResponse(200, req.originalUrl, req.method, new MenuResponse(false, "Menu rỗng.", dataMenus))) 
        }
        dataMenus = JSON.parse(dataMenus)
        const index = dataMenus.findIndex(i => i.name == requestName)
        if (index !== -1) {
            dataMenus.splice(index, 1);
            await fs.writeFile(jsonFileMenu, JSON.stringify(dataMenus));
            await fs.unlink(jsonFileFolder+"/"+requestName+".json")
            return res.json(new ApiResponse(200, req.originalUrl, req.method, new MenuResponse(false, "Đã xóa.", dataMenus))) 
        }else{
            return res.json(new ApiResponse(200, req.originalUrl, req.method, new MenuResponse(false, "Không tìm thấy tên menu.", dataMenus))) 
        }
    }catch(err){
        console.log(err)
    }


}