$('#updateBtn').click(function (){
    let id = $("#managenInput").val();
    if(id == ''){
        window.alert("ID 不能为空");
        return;
    }
    $("#managen").show();
    return false;
});


$('deleteBtn').click(function (){
    let id = $("#managenInput").val();
    if(id == ''){
        window.alert("ID 不能为空");
        return;
    }
    $.ajax({
        type: 'get',
        url: 'admin/managen',
        data:{
            operation: 'delete',
            ID: id,
        },
        success: function (data, textStatus){
            console.log('OK');
        }
    })
});

$('#managen-4').click(function (){
    $('#managen').hide();
    return false;
})