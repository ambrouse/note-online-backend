import rateLimit from 'express-rate-limit';
import ApiResponse from '../api/ApiResponse.js';

// Giới hạn 100 request / 15 phút / 1 IP
export const Limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 phút
  max: 100, // tối đa 100 request
  message: new ApiResponse(429, "","","Thao tác quá nhanh."),
  standardHeaders: true, // trả headers X-RateLimit-* 
  legacyHeaders: false,  // tắt X-RateLimit-Limit, X-RateLimit-Remaining
});