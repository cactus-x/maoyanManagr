 
define(function(require,exports,modules){
    
    require("jquery");
    require("easyui")($);
    //***********************单页跳转开始
    
     $(init)
     function init(){
         $.ajax({
             type:"post",
             url:"/getSession",
             success:function(msg){
                console.log(msg); 
         console.log(msg.name);
                 if(msg.name==undefined){
                     location.replace("../modules/manager/managelogin.html")
                 }else{
                     
                     $("#loginacc").html(msg.name);
                 }
             }
             
             
             
         })
     }
    
    
    $('#menu').tree({
	onClick: addtab
});
       
//添加新的tab    
function addtab(node){
    if ($('#tabs').tabs('exists', node.text)){
        $('#tabs').tabs('select', node.text);
    } else {
         var content ='<div id="'+node.id+'tab"></div>';
         $('#tabs').tabs('add',{
         title:node.text,
         iconCls:'icon-save',
         closable:true,
         selected:true,
//             id:node.id+"tab"
         content:content     
        });
    }
//以下是是自己的页面跳转部分 
		switch(node.id){
                case "cinema":{
                   require("cinema").inittabs(node);
                    break;
                }
                case "movie":{
                    require("movie").inittabs(node);
                    break;
                }    
                case "hot":{
                    require("hot").inittabs(node);
                    break;
                }
                case "info":{
                    require("info").inittabs(node);
                    break;
                }
                case "wait":{
                    require("wait").inittabs(node);
                    break;
                }
                case "play":{
                    require("play").inittabs(node);
                    break;
                }
                case "user":{
                    require("user").inittabs(node);
                    break;
                }
                case "cmm":{
                    require("cmm").inittabs(node);
                    break;
                }    
            }
	}
  
        
        
//***********************单页跳转结束 
    
   
    
    
    
    
    
    
    
//***********************本页js开始   
    //选项卡宽度自动填错
    $('#tabs').tabs({    
    fit:true ,
    closable:true
});
    
    //面板宽度自动填错
    $("#meuubox").layout({
        fit:true
    });
//  *********************本页js结束 
    

    
    
    

    
    
    
    
    
    
    
});



 






