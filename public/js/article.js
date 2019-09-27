let textarea = $('textarea');
let btn = $('button');
let info = $('#infomation');

//输入栏为空的时候，提交按钮不能提交.
textarea.on('input', function (){
    if(textarea.val() == ''){
        btn.attr('disabled', 'disabled');
    }else{
        btn.removeAttr('disabled');
    }
})

btn.on('click', function (){
    info.html('评论已提交');
    setTimeout(function (){
        info.html('');
    }, 2500);
})
