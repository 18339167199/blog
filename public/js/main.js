let table = $('#table');                 //导航栏
let tableWidth = table.outerWidth(true);              //导航栏的总宽度
let listLen = table.children().length;            //导航栏子元素的个数

//列表自动居中.
function navigationListAutoCenter() {
    let liList = table.children();
    liList.css({
        "width": (tableWidth / listLen) + "px",
    })
}

function loadNav() {
    $.ajax({
        type: 'get',
        url: '/navload',
        data: {},
        success: function (data, textStatus) {
            for (let i = 0; i < data.length; i++) {
                table.append($("<li><a href=/load?classify=" + data[i]._id.toString() + ">" + data[i].classify + "</a></li>"));
            }
            listLen = table.children().length;
            navigationListAutoCenter();
        },
    });
}

//切换注册框和登录框事件和按钮绑定事件.
function loginOrRegister() {
    let loginBox = $('#login');
    let registerBox = $('#register');
    let userInfoBox = $('#userinfo');
    let logoutBtn = $('#logoutBtn');

    loginBox.find('a.colMint').on('click', function () {
        registerBox.show();
        loginBox.hide();
    });
    registerBox.find('a.colMint').on('click', function () {
        loginBox.show();
        registerBox.hide();
    });
    //登录按钮事件
    loginBox.find('button').on('click', function () {
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                username: loginBox.find('[name=username]').val(),
                password: loginBox.find('[name=password]').val(),
            },
            dataType: 'json',
            success: function (data, textStatus) {

                loginBox.find('.colWarning').css({
                    'color': 'red',
                }).html(data.message);

                if (!data.code) {    //登录成功 code=0 , 其他为1, 2,
                    console.log(data);
                    window.location.reload();    //界面重定向.
                }
            }
        })
    })
    //注册按钮事件
    registerBox.find('button').on('click', function () {
        //通过 AJAX 提交数据
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data: {
                username: registerBox.find('[name="username"]').val(),
                password: registerBox.find('[name="password"]').val(),
                repassword: registerBox.find('[name="repassword"]').val()
            },
            dataType: 'json',
            success: function (data, textStatus) {
                $('#register>.colWarning').css({
                    'color': 'red',
                }).html(data.message);
                if (data.code == 0) {    //code = 0 表示注册成功. 应该跳转到登录框;
                    setTimeout(function () {
                        $('#register>.colWarning').html('');
                        registerBox.hide();
                        loginBox.show();
                    }, 1000);
                }
            }
        })
    })

    //退出按钮事件.
    logoutBtn.on('click', function () {
        $.ajax({
            type: 'get',
            url: 'api/user/logout',
            success: function (data, textStatus) {
                if (!data.code) {   //返回 code=0 表示退出成功.
                    window.location.reload();
                }
            }
        })
    })
}

function init() {
    loadNav();
    loginOrRegister();
}

init();
