const mongoose = require('mongoose')

const tweetBattleSchema = mongoose.Schema({
    username: 'string',
    passwork: 'string',
    email: 'string',
    savedTweets: [],
    score: 0,
})

module.exports = mongoose.model('tweetbattle', tweetBattleSchema)