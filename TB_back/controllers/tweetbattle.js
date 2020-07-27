const express = require('express');
const tweetBattle = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.js');
const TOKEN_SECRET = process.env.SECRET || "SECRET_TWEETBATTLE";

// LOGIN ROUTE
tweetBattle.post('/login', (req, res) => {
  console.log(req.body);
    userModel.findOne({username:req.body.username}, (err, foundtweetbattle) => {
      if (err) {
        res.status(400).json({ error: err.message })
      }
      console.log("success")
      if (bcrypt.compareSync(req.body.password, foundtweetbattle.password)) {
        //res.status(200).json(foundtweetbattle)
        let token = jwt.sign(
          { userId: foundtweetbattle.id, username: foundtweetbattle.username},
          TOKEN_SECRET,
          { expiresIn: '1h' });
          console.log(foundtweetbattle);
        res.status(200).json({
          id: foundtweetbattle.id, 
          username: foundtweetbattle.username,
          password:foundtweetbattle.password,
          token: token,
          savedTweets:foundtweetbattle.savedTweets
        });

    } else {
        res.status(401).json({message:"Invalid Username/Password"});
    }
     
    })
  })

  // CREATE ROUTE
tweetBattle.post('/', (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    userModel.create(req.body, (error, createdTweetBattle) => {
      if (error) {
        res.status(400).json({ error: error.message })
      }
      res.status(200).send(createdTweetBattle) 
      console.log(createdTweetBattle);
    })
  })

  // UPDATE ROUTE TO SAVE TWEET
tweetBattle.put('/:id', (req, res) => {
  console.log('this is the req.body: ', req.body);
    userModel.findById(req.body.id, (err, foundUser) => {
      if (err) {
        res.status(400).json({ error: err.message })
      }
      if (req.body.password == foundUser.password) {
        let verifiedUser = jwt.verify(req.body.token, TOKEN_SECRET);
        console.log(verifiedUser);
        if(req.body.id == verifiedUser.userId){
          foundUser.savedTweets.push(req.body.savedTweet);
          foundUser.save((err, data) => {
            console.log('this is the founduser: ', foundUser);
            if (err) {
              res.status(400).json({ error: err.message })
            }
            res.status(200).json(foundUser.savedTweets);
          })
        }
      } 
      else{
        res.status(401).json({message:"Invalid Username/Password"});
      }

    })

});

  // DELETE ROUTE
tweetBattle.delete('/', (req, res) => {
  console.log('this is the req.body: ', req.body);
    userModel.findById(req.body.id, (err, foundUser) => {
      if (err) {
        res.status(400).json({ error: err.message })
      }
      if (req.body.password == foundUser.password) {
        let verifiedUser = jwt.verify(req.body.token, TOKEN_SECRET);
        console.log(verifiedUser);
        if(req.body.id == verifiedUser.userId){
          foundUser.savedTweets.splice(req.body.index,1);
          foundUser.save((err, data) => {
            console.log('this is the founduser: ', foundUser);
            if (err) {
              res.status(400).json({ error: err.message })
            }
            res.status(200).json(foundUser.savedTweets);
          })
        }
      } 
      else{
        res.status(401).json({message:"Invalid Username/Password"});
      }

    })
  });
  
  module.exports = tweetBattle