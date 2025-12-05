import express from 'express';
import dotenv from 'dotenv';
import MenuRouter from './src/router/MenuRouter.js'
import AuthRouter from './src/router/AuthRouter.js'
import NoteRouter from './src/router/NoteRouter.js'
import cookieParser from 'cookie-parser';
import {Limiter} from './src/services/SpamRequest.js'
import cors from 'cors'


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Áp dụng giới hạn request cho tất cả route
app.use(Limiter);
// Middleware parse JSON
app.use(express.json());
// Middleware parse cookie
app.use(cookieParser());
// setup cors
app.use(cors({
  origin: "https://ambrouse.github.io/note-online-frontend",   // hoặc domain FE của bạn
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true                 // cho phép cookie/token
}));

// router 
app.use('/api/v1/note-app/menu', MenuRouter);
app.use('/api/v1/note-app/auth', AuthRouter);
app.use('/api/v1/note-app/note', NoteRouter);



// Middleware bắt mã lỗi
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.result || 'Lỗi Server.';
  const url = err.url || 'Không xác định';
  const method = err.method || 'Không xác định.';

  return res.status(status).json({
    status: status,
    url: url,
    method: method,
    errMessage: message
  });
});


// Kiểm tra môi trường
if (process.env.VERCEL !== '1') {
  // Chỉ chạy khi local
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;