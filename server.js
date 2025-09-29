import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';


const app = express();
const port = process.env.PORT || 1000;

import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


// MongoDB connection URI
const uri = process.env.MONGODB_URI;
async function main() {
  try {   
    await mongoose.connect(uri);    
    console.log('✅ Connected to MongoDB Atlas');

  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

main();

//rendering engine
app.get('/', (req, res) => {
    res.render('index.ejs', { url:null});
});

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()  + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix)
  }
})



const upload = multer({ storage: storage })

const imageSchema = new mongoose.Schema({
  imgUrl: String,
  filename: String,
  public_id: String,
});

const File = mongoose.model('cloudinary', imageSchema);

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file.path;

  const cloudinaryRes = await cloudinary.uploader.upload(file, {
    folder: 'uploads'
  });

  const db = await File.create({
    imgUrl: cloudinaryRes.secure_url,
    filename: file.originalname,
    public_id: cloudinaryRes.public_id,
  });

  res.render('index.ejs', { url: cloudinaryRes.secure_url });
 // res.json({ message: 'File uploaded successfully', cloudinaryResponse });
  
  // req.body will hold the text fields, if there were any
})


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

