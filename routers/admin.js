//处理 /admin 请求的处理模块
const express = require('express');
const userModel = require('../models/users');
const classifyModel = require('../models/classify');
const contentModel = require("../models/content");
const commentModel = require('../models/comment');

const router = express.Router();
//判断是不是管理员的中间件.
router.use(function (req, res, next) {
    if (!req.userInfo.isAdmin) {
        res.send('不是管理员');
        return;
    }
    next();
})
//进入用户管理的路由.
router.get('/user', function (req, res, next) {

    /**
     * 从数据库中读取所有用户的数据
     * 
     * limit(Number) : 限制获取的数据条数;
     * skip(Number) : 忽略数据的条数.
     * count(function (count){}) : 获取数据库中记录的条数.
     * 
     */
    let page = Number(req.query.page || 1);     //当前页数
    let showNumber = 5;    //每一页显示的条数
    let pages = 0;         //当前一共的页数.

    userModel.count().then(function (count) {

        pages = Math.ceil(count / showNumber);
        page = Math.min(page, pages);        //取值不能超过 pages
        page = Math.max(page, 1);              //取值不能小于 1;

        let skipNumber = (page - 1) * showNumber;      //跳过的总条数

        userModel.find({}, function (err, data) {
            res.render('admin/userManagen.html', {
                userInfo: req.userInfo,
                userData: data,
                page: page,
                pages: pages,
                showNumber: showNumber,
                count: count,
            });
        }).limit(showNumber).skip(skipNumber);
    })

})
//进入分类管理的路由.
router.get('/classify', function (req, res, next) {

    classifyModel.find({}, function (err, data) {
        res.render('admin/classifyManagen.html', {
            classifyInfo: data,
            userInfo: req.userInfo
        });
    })
})
//增加分路由.
router.get('/classify/add', function (req, res, next) {
    res.render('admin/classify_add.html', {
        userInfo: req.userInfo,
    })
})
//post用来接收增加分类的数据.
router.post('/classify/add', function (req, res, next) {
    let classify = req.body.classify || '';

    if (classify == '') {
        res.render('admin/error', {
            message: "输入不能为空",
            userInfo: req.userInfo,
        })
        return;
    }

    //数据库查询是否有相同的数据存在

    classifyModel.findOne({
        classify: classify,
    }, function (err, data) {
        if (data) {    //数据库中有
            res.render('admin/error.html', {
                message: "分类已经存在",
                userInfo: req.userInfo,
            });
        } else {    //数据库中没有.

            //保存.
            let a = new classifyModel({
                classify: classify,
            });
            a.save();

            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '添加成功',
            })
        }
    });
})
//删除分类的路由.
router.get('/classify/delete', function (req, res, next) {
    res.render('admin/classify_delete.html', {
        userInfo: req.userInfo,
    })
})
//接收提交的删除分类请求数据.
router.post('/classify/delete', function (req, res, next) {
    let classify = req.body.classify || '';

    if (classify == '') {
        res.render('admin/error', {
            message: "输入不能为空",
            userInfo: req.userInfo,
        })
        return;
    }

    if (classify == "首页") {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: "首页分类不能删除",
        })
        return;
    }

    //数据库查询是否有相同的数据存在
    classifyModel.findOne({
        classify: classify,
    }, function (err, data) {
        if (data) {    //数据库中有
            classifyModel.remove(data, function (err) {
                console.log("remove ok");
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: "成功删除该分类"
                })
            })
        } else {    //数据库中没有.
            res.render('/admin/error', {
                userInfo: req.userInfo,
                message: '找不到该分类,请确认后重试'
            })
        }
    })
})
//进入内容管理的路由.首先展示全部的分类以及对应的内容.
router.get('/content', function (req, res, next) {

    classifyModel.find({}, function (err, classify){
        contentModel.find({}, function (err, content){
            res.render('admin/contentManagen', {
                userInfo: req.userInfo,
                classifyInfo: classify,
                contentInfo: content,
            })
        })
    })

})
//内容添加
router.get('/content/add', function (req, res, next) {

    classifyModel.find({}, function (err, data) {
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            classifyInfo: data,
        })
    }).sort({ id: -1 });
})
//接收内容添加提交的数据
router.post('/content/add', function (req, res, next) {
    let author = req.body.author;
    let title = req.body.title;
    let description = req.body.description;
    let content = req.body.content;
    let classify = req.body.classify;

    if (author == '' || title == '' ||
        description == '' || content == '' ||
        classify == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: "请仔细检查再操作",
        })
        return;
    }

    let centent = new contentModel({
        author: author,
        title: title,
        description: description,
        content: content,
        classify: classify,
    })
    centent.save();

    res.render('admin/success', {
        userInfo: req.userInfo,
        message: "添加成功",
    })
})
//内容删除
router.get('/content/delete', function (req, res, next) {
    
    let id = req.query.id || '';
    if(id == ''){
        classifyModel.find({}, function (err, data) {
            res.render('admin/content_delete', {
                userInfo: req.userInfo,
                classifyInfo: data,
                classifyName: '无, 请选择分类进行操作'
            })
        })
    }else{
        contentModel.remove({_id: id}, function (err, data){
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: "删除完成",
            })
        })
    }


})
//内容删除 post
router.post('/content/delete', function (req, res, next) {

    let classify = req.body.classify || '';

    contentModel.find({ classify: classify }, function (err, contentData) {
        classifyModel.find({}, function (err, classifyData) {
            let classifyName = '';
            for (let i = 0; i < classifyData.length; i++) {
                if (classifyData[i]._id.toString() == classify) {
                    classifyName = classifyData[i].classify;
                }
            }
            res.render('admin/content_delete', {
                userInfo: req.userInfo,
                classifyInfo: classifyData,
                contentInfo: contentData,
                classifyName: classifyName
            })
        })
    })

})
//进入评论管理路由
router.get('/comment', function (req, res, next){
    let classify = req.query.classify||"";   //当前选择的分类.

    classifyModel.find({}, function (err, classifyData){
        if(classify != ''){
            contentModel.find({ classify: classify }, function (err, contentData){
                let nowclass = '';

                for(let i = 0; i < classifyData.length; i++){
                    if(classifyData[i]._id.toString() == classify){
                        nowclass = classifyData[i].classify;
                    }
                }

                res.render('admin/commentManagen.html', {
                    userInfo: req.userInfo,
                    classifyInfo: classifyData,
                    contentInfo: contentData,
                    classifyName: nowclass,
                })
            })
        }else{
            res.render('admin/commentManagen.html', {
                userInfo: req.userInfo,
                classifyInfo: classifyData,
            })
        }
    })
})
//进入评论管理删除路由
router.get('/comment/delete', function (req, res, next){
    let comment = req.query.comment || '';
    let article = req.query.article || '';

    if(article != ''){
        commentModel.find({ article: article }, function (err, comment){
            res.render('admin/comment_delete.html', {
                userInfo: req.userInfo,
                commentInfo: comment,
            })
        })
    }else{   //删除评论
        commentModel.deleteOne({ _id: comment }, function (err,data){
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '删除成功'
            })
        })
    }
})
//管理首页的路由.
router.get('/managen', function (req, res, next) {
    let id = req.query.ID;
    if (req.query.operation && req.query.operation == 'delete') {
        userModel.remove({
            _id: id,
        }, function () {
            console.log('detele OK');
        })
    } else {
        let username = req.query.username;
        let password = req.query.password;
        userModel.update({ _id: id }, { 'username': username, 'password': password }, function (err, data) {
            console.log("updata OK");
        })
    }
})

router.get('/', function (req, res, next) {
    res.render('admin/index.html', {
        userInfo: req.userInfo,
    });
})

module.exports = router;