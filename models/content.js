const mongoose = require('mongoose');

const content = require('../schemas/content');

module.exports = mongoose.model('contentModule', content);