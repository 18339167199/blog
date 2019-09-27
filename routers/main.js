//首页模块
//处理 /main 请求的处理模块
const express = require('express');
const mongoose = require('mongoose');
const classifyModel = require('../models/classify');
const contentModel = require('../models/content');
const commentModel = require('../models/comment.js');

const router = express.Router();

router.get('/', function (req, res, next){

    classifyModel.find({ classify: "首页" }, function (err, data){
        let searchClass = data[0]._id.toString();    // 首页的 id 值.
        contentModel.find({ classify: searchClass }, function (err, data){
            res.render('main/index', {
                userInfo: req.userInfo,
                article: data,
            })
        })
    }) 
})

//为初始化主界面的导航栏提供数据.
router.get('/navload', function (req, res, next){
    classifyModel.find({}, function (err, data){
        res.json(data);
    })
})

router.get('/load', function (req, res, next){

    let classify = req.query.classify;
    
    classifyModel.findById(classify, function (err, data){
        let searchClass = data._id.toString();    //请求的类.
        contentModel.find({ classify: searchClass }, function (err, data){
            res.render('main/index', {
                userInfo: req.userInfo,
                article: data,
            })
        })
    })
})

router.get('/article', function (req, res, next){
    let id = req.query.id;
    let page = Number(req.query.page || 1);     //当前页数
    let showNumber = 2;    //每一页显示的评论条数为2.
    let pages = 0;         //当前一共的页面数.

    commentModel.countDocuments(function (err, count){
        pages = Math.ceil(count / showNumber);
        page = Math.min(page, pages);        //取值不能超过 pages
        page = Math.max(page, 1);              //取值不能小于 1;

        let skipNumber = (page - 1) * showNumber;      //跳过的总条数

        contentModel.findById(id, function (err, content){
            commentModel.find({ article: id }, function (err, comment){
                res.render('main/article', {
                    contentInfo: content,
                    commentInfo: comment,
                    page: page,
                })
            }).limit(showNumber).skip(skipNumber).sort({ _id: -1 });
        })
    })

})

router.get('/comment', function (req, res, next){
    let comment = req.query.comment;
    let id = req.query.article;
    
    let com = new commentModel({
        username: req.userInfo.username,
        comment: comment,
        article: id,
    })

    com.save(function (err){
        if(!err){
            let url = 'http://localhost:8081/article?id=' + id.toString();
            setTimeout(function (){
                res.redirect(302, url);
            }, 1000);
        }
    });
    
})

module.exports = router;