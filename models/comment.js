const mongoose = require('mongoose');

const comment = require('../schemas/comment');

module.exports = mongoose.model('commentModule', comment);