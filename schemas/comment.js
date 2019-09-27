const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    //评论用户.
    username: String,
    //评论内容.
    comment: String,
    //对应的文章
    article: String,
    //评论时间.
    date: {
        type: Date,
        default: new Date()
    },
})