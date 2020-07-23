const express = require('express');
const tweetBattle = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.js');

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
          'SECRET_TWEETBATTLE',
          { expiresIn: '1h' });

        res.status(200).json({
          userId: foundtweetbattle.id, 
          username: foundtweetbattle.username,
          token: token
        });

    } else {
        res.status(401).json({message:"Invalid Username/Password"});
    }
     
    })
  })

  // CREATE ROUTE
tweetBattle.post('/', (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  console.log(req.body.password);
    userModel.create(req.body, (error, createdTweetBattle) => {
      if (error) {
        res.status(400).json({ error: error.message })
      }
      res.status(200).send(createdTweetBattle) 
      console.log(createdTweetBattle);
    })
  })

  // UPDATE ROUTE
tweetBattle.put('/:id', (req, res) => {
    userModel.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedTweetBattle) => {
      if (err) {
        res.status(400).json({ error: err.message })
      }
      res.status(200).json(updatedTweetBattle)
    })
  })

  // DELETE ROUTE
tweetBattle.delete('/:id', (req, res) => {
    userModel.findByIdAndRemove(req.params.id, (err, deleteTweetBattle) => {
      if (err) {
        res.status(400).json({ error: err.message })
      }
      res.status(200).json(deleteTweetBattle)
    })
  })
  
  module.exports = tweetBattle