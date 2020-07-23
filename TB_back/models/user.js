const mongoose = require('mongoose')
//Sasi >> updated the schema from Chad's version
const tweetBattleSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    password: {type: String, required: true},
    username: {type: String, required: true, unique: true}, //Sasi >> email is the username
    savedTweets: [],
    score: 0,
})

module.exports = mongoose.model('tweetbattle', tweetBattleSchema)