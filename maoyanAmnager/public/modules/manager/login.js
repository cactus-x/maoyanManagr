$(init)

function init(){
    loginData();
}

function loginData(){ 
    $('#login_box').form({
        type:'post',
        url:'/manager/find',
        onSubmit:function(data){
            data.addSession=$("#login_acc").val();
        },
        success:function(msg){
            console.log(msg);
           msg=JSON.parse(msg); console.log($("#login_acc").val());
            console.log($("#login_pwd").val());
            
            
if(msg[0].name==$("#login_acc").val()&&msg[0].password==$("#login_pwd").val()) {
    console.log(11111111111111);
    location.replace("../../index.html"); 
}              
 
        }
    })
    
}

