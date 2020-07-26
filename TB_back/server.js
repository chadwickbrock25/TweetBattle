const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 3003;
const path = require('path'); 
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/tweetbattle';

// Error / Disconnection
mongoose.connection.on('error', err => console.log(err.message + ' is Mongod not running?'))
mongoose.connection.on('disconnected', () => console.log('mongo disconnected'))

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.once('open', ()=>{
    console.log('connected to mongoose...')
})

// middleware
app.use(express.json()); 


const whitelist = ['http://localhost:3000'];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) >= 0) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

const tweetBattleController = require('./controllers/tweetbattle.js')
app.use('/tweetbattle', tweetBattleController);
app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "public/build", "index.html"));
});


app.listen(PORT, () => {
  console.log('🎉🎊', 'celebrations happening on port', PORT, '🎉🎊',)
})