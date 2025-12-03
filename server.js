import express from 'express';
import dotenv from 'dotenv';
import HomeRouter from './src/router/HomeRouter.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware parse JSON
app.use(express.json());


// router home
app.use('/api/home', HomeRouter);

// Kiểm tra môi trường
if (process.env.VERCEL !== '1') {
  // Chỉ chạy khi local
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;