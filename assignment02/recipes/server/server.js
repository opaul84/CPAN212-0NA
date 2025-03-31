require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const router = require('./recipes_router');

const PORT = process.env.PORT || 8001;

const cors = require('cors');
const app = express();
app.use(cors()); 
app.use(express.json()); // Ensure JSON parsing
app.use('/recipe', router);


const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MongoDB URI is missing! Check your .env file.");
  process.exit(1);
}

mongoose.connect('mongodb+srv://opaul1984:aO18xwbN4opToQI7@classdemo.jiepb.mongodb.net/RecipeDb',
  {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

  app.use('/recipe', router);

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
  