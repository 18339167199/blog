const mongoose = require('mongoose');

const classify = require('../schemas/classify');

module.exports = mongoose.model('classifyModel', classify);