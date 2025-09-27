import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';


const app = express();
const port = process.env.PORT || 1000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
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
