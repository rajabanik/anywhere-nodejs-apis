import express from 'express';
import { conn } from './config/connection'; 
import userRouter from './routes/users/userRouter'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/users',userRouter);

conn().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Failed to start the server:', error);
});
