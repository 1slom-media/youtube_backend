import express from 'express';
import userRouter from './routers/user.routers.js';
import videoRouter from './routers/video.router.js'
import morgan from 'morgan';
import path from 'path'
import cors from 'cors'
import fileUpload from 'express-fileupload';
import errorHandler from './utils/error-handler.js';

const PORT=process.env.PORT || 5000

const app=express();
app.use(express.json());
app.use(fileUpload());
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(userRouter);
app.use(videoRouter)
app.use('/static', express.static(path.join(process.cwd(),'src','uploads')))
app.use(errorHandler)

app.listen(PORT,()=>console.log(PORT))
