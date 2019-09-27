//处理 /api 请求的处理模块
const express = require('express');
const userModel = require('../models/users.js');    //用户账户和密码的数据可模型.
const router = express.Router();

//统一返回格式
let responseData;
router.use( function(req, res, next){
    responseData = {
        code : 0,
        message : ''
    }

    next();
} );

/**
 * 用户注册路由
 * 注册逻辑 : 
 *     1. 用户名和密码不为空
 *     2. 两次密码一致
 *     3. 用户是否已经被注册
 *           数据库查询.
 */
router.post('/user/register', function (req, res, next){
    let username = req.body.username;
    let password = req.body.password;
    let repassword = req.body.repassword;

    if( (username == '') || (password == '') ){
        responseData.code = 1;
        responseData.message = '用户名或密码不能为空';
        res.json(responseData);
        return;
    }
    //两次密码一致
    if(password != repassword){
        responseData.code = 3;
        responseData.message = '两次密码不一致';
        res.json(responseData);
        return;
    }
    
    userModel.findOne({
        username : username,
    }).then(function (userInfo){
        if(userInfo){
            //userInfo 存在则表明数据库中存在该用户.
            responseData.code = 4;
            responseData.message = '用户名已经被注册';
            res.json(responseData);
            return;
        }

        responseData.code = 0;
        responseData.message = '注册成功';
        res.json(responseData);

        //保存用户注册数据到数据库中.
        let user = new userModel({
            username : username,
            password : password
        });
        user.save(function (err, res){
            if(err){
                console.log('error' + err);
            }else{
                console.log('save');
            }
        })
    })

});
router.post('/user/login', function (req, res, next){
    let username = req.body.username;
    let password = req.body.password;

    if(username == '' || password == ''){
        responseData.code = 1;
        responseData.message = '用户名或者密码不能为空';
        res.json(responseData);
        return;
    }
    
    userModel.findOne({
        username : username,
        password : password,
    }, function (err, data){
        if(data){
            console.log('登录成功');
            responseData.code = 0;
            responseData.message = '登录成功';
            responseData.userInfo = {
                _id : data._id,
                username : data.username,
            }
            req.cookies.set('userInfo', JSON.stringify(responseData.userInfo));
            res.json(responseData);
            return;
        }else{
            responseData.code = 2;
            responseData.message = '账号或密码不正确或账户不存在';
            res.json(responseData);
            return;
        }
    })


})
router.get('/user/logout', function (req, res,next){
    req.cookies.set('userInfo', null);
    responseData.code = 0;
    res.json(responseData);
})

module.exports = router;