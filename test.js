// All modules is ok
// const cookies = require('cookies');
// const markdown = require('markdown');
// const swig = require('swig');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');

// console.log(cookies);
// console.log(markdown);
// console.log(swig);
// console.log(mongoose);
// console.log(bodyParser);

// const mongoose = require('mongoose');
// const userModel = require('./models/users');

// mongoose.connect('mongodb://localhost:27017/blog', function(err){
//     if(err){
//         console.log('connect failed');
//     }

//     userModel.find({}, function (err, data){
//         if(err){
//             console.log(err);
//         }else{
//             console.log(data);
//         }
//     })
// });

    // userModel.findOne({   //先查询用户是否存在
    //     username : username,
    // }).then(function (userInfo){
    //     if(userInfo){      //如果用户存在.
    //         userModel.findOne({      //再查询用户名和密码和数据库对应是否正确.
    //             username : username,
    //             password : password,
    //         }).then(function (userInfo){
    //             if(userInfo){     //如果都正确, 登录成功.
    //                 //返回登录成功的数据
    //                 responseData.code = 0;
    //                 responseData.message = '登录成功';
    //                 res.json(responseData);
    //                 return;
    //             }

    //             //用户存在, 但是密码不正确.
    //             responseData.code = 1;
    //             responseData.message = '密码不正确';
    //             res.json(responseData);
    //             return;
    //         })
    //     }

    //     //用户不存在
    //     responseData.code = 2;
    //     responseData.message = '用户不存在';
    //     res.json(responseData);
    // });


    const obj = {
        status:{
            name: '22',
            age: 15,
            sex: 'male'
        }
    }

    console.log(obj[status]);