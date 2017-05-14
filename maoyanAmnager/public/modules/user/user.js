define(function(require,exports,modules){
//   ****************js开始***********************
    var editFlag;
 function user(){  
    $(function(){
        initForm();
        initDialog();
         $('#ss').searchbox({ 
                searcher:function(value,name){ 
                    switch(name){
                        case "nameUser":$("#userTable").datagrid('load',{
                            name:value
                        });
                            break;
                        case "userTel":$("#userTable").datagrid('load',{
                            tel:value
                        });
                            break;
                        case "userEmail":$("#userTable").datagrid('load',{
                           email :value
                        });
                            break;
                    }
                   
                }, 
                menu:'#mm', 
                width:"230px",
                prompt:'请输入用户名或者邮箱或者电话' 
                }); 
        
    }) 

       $('#userTable').datagrid({   
               pagination:true,
           url:'/user/find',    
           columns:[[    
               {field:'name',title:'用户名',width:200,editor: {type: 'text',options: {}}},    
               {field:'password',title:'密码',width:200,editor: {type: 'text',options: {}}},    
               {field:'tel',title:'电话',width:200,editor: {type: 'text',options: {}}},   
               {field:'email',title:'邮箱',width:200,editor: {type: 'text',options: {}}},   
               {field:'birthday',title:'生日',width:200,editor: {type: 'text',options: {}}}    
           ]] ,
                //在添加完毕endEdit，保存时触发
         onAfterEdit: function (rowIndex, rowData, changes) {
            console.log(rowData);  //当前编辑完毕以后行的数据
            editFlag = undefined;  //重置标记
             
            //修改
            $.ajax({
                type:"post",
                url:"/user/update",
                data: rowData,
                success: function(data){
                    $.messager.alert('操作','数据修改成功！');
                }
            });
             
        },
           toolbar:[
            {
                iconCls: 'icon-add',
                text: '增加',
                handler: dataInsert
            },'-',
            {
                iconCls: 'icon-edit',
                text: '修改',
//                handler: change
                handler: editData
            },'-',
            
          
            {
                iconCls: 'icon-remove',
                text: '删除',
                handler: removeData
//                handler: function(){}
            },'-',
            {
                iconCls: 'icon-save',
                text: '保存',
//                handler: saveData
                handler: saveData
            },'-',
            {
                text:($("#userSearch"))
            },'-',
            {
                iconCls: 'icon-clear',
                text: '清空',
                handler: clearData 
            }
           ]
       }); 
      //找到index。js设置路径，提交增加的数据  
        function initForm(){  
           $("#add_formUser").form({
               url:"/user/add",
               success: function(msg){
                   $.messager.alert('系统提示','数据添加成功!');
                   $("#userTable").datagrid("reload");
                   $("#add_boardUser").dialog("close");
               }
           });
       }
       //弹框
    function initDialog(){
        //给增加面板初始化dialog属性
         $("#add_boardUser").dialog({
            title:"添加信息",
            closable:true,
            closed: true,
            modal: true,
            buttons:[{
                text:'添加',
                iconCls: 'icon-ok',
                handler:function(){ 
                    //提交表单
                 var add_boolean=true;
                var add_data=$("#add_formUser").find("input");
                       for(var i of add_data){
                     
                        if(i.value==""){
                          add_boolean=false;
                            
                        }
                     
                       
                    }
                    if(add_boolean==true){
                            $('#add_formUser').submit();
                    }else{
                           $.messager.alert('提示','请填写完整数据');
                    }
                        }
                    },{
                text:'关闭',
                iconCls: 'icon-cancel',
                handler:function(){
                    $("#add_boardUser").dialog("close");
                }
            }]
        })
          $("#add_boardUser").dialog("close");
    }
//   弹框打开 增加数据
    function dataInsert(){
        $("#add_boardUser").dialog('open'); 
    }
     
     //修改数据
     function editData(){
         var rows = $("#userTable").datagrid('getChecked');

    if (rows.length == 1) {//选中一行的话触发事件
        
        //选中当前行，开启编辑状态
      
        editFlag =  $("#userTable").datagrid('getRowIndex', rows[0]);//获取选定行的索引
         $("#userTable").datagrid('beginEdit', editFlag);//开启编辑并传入要编辑的行
        
    }else{
        $.messager.alert('系统提示','只能编辑单行数据!');
    }
          //保存数据（和修改相关） 
     }
     function saveData(){
    //退出编辑状态
    console.log(0)
    $("#userTable").datagrid('endEdit', editFlag);
}
//删除数据
     function removeData(){
        $.messager.confirm('确认','您确认想要删除记录吗？',function(ok){    
            if (ok){   
            
            //找到当前被选中的所有行
            var checkData = $("#userTable").datagrid("getChecked");

            var idArr = [];
            for(var obj of checkData){
                idArr.push(obj["_id"]);
            }
            
           console.log(idArr);
            
            //ajax发送请求删除选中行的_id属性
            $.ajax({
        
                url:"/user/del",
//                data:{_id: checkData[0]._id},
                data: {ids:idArr},
                success: function(data){
                    //数据删除完毕，reload数据
                    $("#userTable").datagrid("reload");
                }
            });

        }    
    }); 
}
    //清空
     function clearData(){
          $("#userTable").datagrid('load',{});
    
            $("#ss").val("")
            
     }
 } 
    
//   ****************js结束***********************    
function inittabs(node){
    $('#'+node.id+'tab').load("modules/user/user.html",user);   
} 
modules.exports.inittabs=inittabs;   
});