define(function(require,exports,modules){
//   ****************js开始***********************   
   var  editFlag;//编辑标记
   function movie(){
        $(function(){
//        movieTable=$("#movieTable");
            initForm();
        initDialog();
     $('#mov_ss').searchbox({ 
                searcher:function(value,name){ 
                    switch(name){
                        case "movieName":$("#movieTable").datagrid('load',{
                            cname:value
                        });
                            break;
                        case "movieType":$("#movieTable").datagrid('load',{
                            type:value
                        });
                            break;
                    }
                   
                }, 
                menu:'#mov_mm', 
                width:"230px",
                prompt:'请输入电影名或者类型' 
                }); 
    })
       
              
        
       $('#movieTable').css("width","100%");
       $('#movieTable').datagrid({    
           url:'/movie/find',
           pagination:true,
           columns:[[    
               {field:'cname',title:'电影中文名',width:100,editor: {type: 'text',options: {}}},    
               {field:'ename',title:'电影英文名',width:150,editor: {type: 'text',options: {}}},    
               {field:'type',title:'类型',width:50,editor: {type: 'text',options: {}}},   
               {field:'score',title:'电影评分',width:80,editor: {type: 'text',options: {}}},   
               {field:'actor',title:'演员',width:100,editor: {type: 'text',options: {}}},   
               {field:'want',title:'想看',width:80,editor: {type: 'text',options: {}}},   
               {field:'area',title:'区域',width:80,editor: {type: 'text',options: {}}},   
               {field:'year',title:'年代(年份)',width:80,editor: {type: 'text',options: {}}},   
               {field:'time',title:'时长(分钟)',width:80,editor: {type: 'text',options: {}}},   
               {field:'timePlay',title:'上映时间',width:80,editor: {type: 'text',options: {}}},   
               {field:'timeArea',title:'上映地区',width:80,editor: {type: 'text',options: {}}},   
               {field:'boxOffice',title:'票房',width:80,editor: {type: 'text',options: {}}},   
               {field:'info',title:'剧情介绍',width:100,editor: {type: 'text',options: {}},align:'right'}    
           ]],
            //在添加完毕endEdit，保存时触发
         onAfterEdit: function (rowIndex, rowData, changes) {
            console.log(rowData);  //当前编辑完毕以后行的数据
            editFlag = undefined;  //重置标记
             
            //修改
            $.ajax({
                type:"post",
                url:"/movie/update",
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
                text:($("#movieSearch")),
                
            },'-',
            {
                iconCls: 'icon-clear',
                text: '清空',
//                handler: saveData
                handler: clearData
                
            }
            
        ],
           
           
       }); 
       
          

       
   //找到index。js设置路径，提交增加的数据    
       function initForm(){  
           $("#add_form").form({
               url:"/movie/add",
               success: function(msg){
                   $.messager.alert('系统提示','数据添加成功!');
                   $("#movieTable").datagrid("reload");
                   $("#mov_add_board").dialog("close");
               }
           });
       }
       //弹框
        function initDialog(){
        //给增加面板初始化dialog属性
         $("#mov_add_board").dialog({
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
                    var add_data=$("#add_form").find("input");
                  
//                    console.log(add_data);
                    for(var i of add_data){
                     
                        if(i.value==""){
                          add_boolean=false;
                            
                        }
                     
                       
                    }
                    if(add_boolean==true){
                            $('#add_form').submit();
                    }else{
                           $.messager.alert('提示','请填写完整数据');
                    }
                      

                }
            },{
                text:'关闭',
                iconCls: 'icon-cancel',
                handler:function(){
                    $("#mov_add_board").dialog("close");
                }
            }]
        })
          $("#mov_add_board").dialog("close");
    }
       //弹框打开
    function dataInsert(){  
        $("#mov_add_board").dialog('open'); 
        
    }
       //修改数据
function editData(){
    //选中一行进行编辑
    var rows = $("#movieTable").datagrid('getChecked');

    if (rows.length == 1) {//选中一行的话触发事件
        
        //选中当前行，开启编辑状态
        editFlag =  $("#movieTable").datagrid('getRowIndex', rows[0]);//获取选定行的索引
         $("#movieTable").datagrid('beginEdit', editFlag);//开启编辑并传入要编辑的行
        
    }else{
        $.messager.alert('系统提示','只能编辑单行数据!');
    }
}
       //保存数据（和修改相关）
function saveData(){
    //退出编辑状态
    console.log(0)
    $("#movieTable").datagrid('endEdit', editFlag);
}
//查找数据
function searchData(){
    $("#movieTable").datagrid('load',{
        cname: $("#cname").val(),
        type: $("#type").val()
       
    });
}
//删除数据
function removeData(){
      $.messager.confirm('确认','您确认想要删除记录吗？',function(ok){    
        if (ok){   
            
            //找到当前被选中的所有行
            var checkData = $("#movieTable").datagrid("getChecked");

            var idArr = [];
            for(var obj of checkData){
                idArr.push(obj["_id"]);
            }
            
           console.log(idArr);
            
            //ajax发送请求删除选中行的_id属性
            $.ajax({
        
                url:"/movie/del",
//                data:{_id: checkData[0]._id},
                data: {ids:idArr},
                success: function(data){
                    //数据删除完毕，reload数据
                    $("#movieTable").datagrid("reload");
                }
            });

        }    
    }); 
}
//清空
     function clearData(){
          $("#movieTable").datagrid('load',{});
    
            $("#mov_ss").val("")
            
     }
 
   }   
   
//   ****************js结束***********************    
function inittabs(node){
    $('#'+node.id+'tab').load("modules/movie/movie.html",movie);   
} 
modules.exports.inittabs=inittabs;   
});