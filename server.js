import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cors from 'cors';

import path from 'path';
import { fileURLToPath } from 'url';

// config env
dotenv.config();

//database config
connectDB();


// rest object 
const app = express();

// middlewares
app.use(cors());
app.use(express.json())
app.use(morgan('dev'));


//Routess
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/category' , categoryRoutes);
app.use('/api/v1/product', productRoutes);

// Static Files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, './client/build')));

app.get('*' , function(req, res){
    res.sendFile(path.join(__dirname , './client/build/index.html'));
})


// rest Api  
app.get('/', (req, res)=>{
      res.send('<h1>Welcome to Ecommerce App</h1>')
})


// PORT
const PORT = process.env.PORT || 8080
app.listen(PORT, ()=>{
    console.log(`Server is Running on ${process.env.DEV_MODE} mode ${PORT}`.bgCyan.white)
}) 