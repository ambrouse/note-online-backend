import ApiResponse from "../api/ApiResponse.js";
import jwt from 'jsonwebtoken';

function VerifyTokenService(tokenUser){
  const SECRETKEY = process.env.SECRETKEY
    try {
      const decoded = jwt.verify(tokenUser, SECRETKEY);
        return true
    } catch (err) {
      console.log(err)
        return false
    }
}





export const AuthenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader)
  const token = req.cookies.token;
  if (!token) throw new ApiResponse(401,req.originalUrl,req.method,"Chưa đăng nhập.")

  if(!VerifyTokenService(token)){
    throw new ApiResponse(401,req.originalUrl,req.method,"Đã hết phiên đăng nhập.")
  }
  next();
};




