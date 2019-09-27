const mongoose = require('mongoose');

//结构定义
module.exports = new mongoose.Schema({
    //作者
    author: String,
    //标题
    title: String,
    //简介
    description: String,
    //内容
    content: String,
    //分类
    classify: String,
    //发布的时间
    date: {
        type: Date,
        default: new Date()
    }
})