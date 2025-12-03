import jwt from 'jsonwebtoken';
import ApiResponse from '../api/ApiResponse.js';
import {LoginRequest} from '../request/LoginRequest.js'
import LoginResponse from '../response/LoginResponse.js'


export const Login = (req, res)=>{
    /*
        Hàm đăng nhập
            - Lấy secretkey, name và pass từ .env để kiểm tra
            - Tạo token theo chuẩn jwt và đẩy vào cookie với http only
            - Response kết quả đăng nhập về
    */
    const loginRequest = LoginRequest.safeParse(req.body)
    const SECRETKEY = process.env.SECRETKEY
    const NAME = process.env.NAME
    const PASS = process.env.PASS

    if(!loginRequest.success){
        throw new ApiResponse(400,req.originalUrl, req.method, "Dữ liệu request sai định dạng.")
    }

    if(NAME!=loginRequest.data.name){
        return res.json(new ApiResponse(200,req.originalUrl, req.method,new LoginResponse(false, "Sai tên đăng nhập.")))
    }
    
    if(PASS!=loginRequest.data.pass){
        return res.json(new ApiResponse(200,req.originalUrl, req.method,new LoginResponse(false, "Sai mật khẩu.")))
    }
    
    try{
        const payload = {
            id: "root123",
            username: "BaoNguyen"
        };
        const token = jwt.sign(payload, SECRETKEY, { expiresIn: "1h" });
        // const token = jwt.sign(payload, SECRETKEY, { expiresIn: "365d" });

        res.cookie('token', token, {
            httpOnly: true,   // JavaScript không đọc được
            secure: false,    // true nếu dùng https
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 // 1 giờ
            // maxAge: 365 * 24 * 60 * 60 * 1000 // 1 năm
        });
        return res.json(new ApiResponse(200,req.originalUrl, req.method,new LoginResponse(false, "Đăng nhập thành công")))
    }catch(err){
        console.log(err)
    }
}