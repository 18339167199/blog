const express = require('express');
const mongoose = require('mongoose');
const swig = require('swig');
const Cookies = require('cookies');
const bodyParser = require('body-parser');
const userModel = require('./models/users.js');

let app = express();

//配置应用模板
//定义当前使用的模板引擎， 第一个参数是 模板引擎的名称同时也是模板文件的后缀. 第二个参数是用于解析模板内容的方法.
app.engine('html', swig.renderFile);
//设置模板文件存放的目录, 第一个参数必须是 views, 第二个参数是目录. 
app.set('views', './views');
//注册使用的模板引擎, 第一个参数必须是 'view engine', 第二个参数必须和 app.engine 方法中定义的模板引擎名称(第一个参数)一样.
app.set('view engine', 'html');
//在开发中需要取消模板缓存
swig.setDefaults({cache : false});
//bodyParser设置
app.use(bodyParser.urlencoded({extended : true}));
//设置 cookies 信息的处理.
app.use( function (req, res, next){
    req.cookies = new Cookies(req, res);

    //解析登录用户的 cookies 信息.
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            
            //获取当前用户的类型.
            userModel.findById(req.userInfo._id, function (err, data){
                req.userInfo.isAdmin = Boolean(data.isAdmin);
                next();
            })
        }catch(e){
            next();
        }
    }else{
        next();
    }
} )

/**
 * 根据不同的功能划分模块
 * 当用户访问localhost:8081, 默认进入 ./routers/main.js 路由处理文件.
 * 当用户访问localhost:8081/admin 进入登录界面或者个人主页
 * localhost:8081/api存放 api 处理文件.
 */
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

//设置静态文件托管
//当请求的路径以 '/public' 开头, 直接调用静态托管处理返回文件.
app.use('/public', express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost:27017/blog', function (err){
    if(err){
        console.log('connect failed');
    }else{
        console.log('connect success');
        app.listen(8081, function (){
            console.log('项目启动');
        });
    }
});

