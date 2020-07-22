const express = require('express')
const tweetBattle = express.Router()

const userModel = require('../models/user.js')

// INDEX ROUTE
tweetBattle.get('/', (req, res) => {
    userModel.find({}, (err, foundTweetBattle) => {
      if (err) {
        res.status(400).json({ error: err.message })
      }
      res.status(200).json(foundTweetBattle)
    })
  })

  // CREATE ROUTE
tweetBattle.post('/', (req, res) => {
    userModel.create(req.body, (error, createdTweetBattle) => {
      if (error) {
        res.status(400).json({ error: error.message })
      }
      res.status(200).send(createdTweetBattle) 
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