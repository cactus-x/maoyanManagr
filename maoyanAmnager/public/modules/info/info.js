define(function(require,exports,modules){
//   ****************js开始***********************
    //初始化函数
var editFlag;//记录编辑行
var searchData = {};
function init(){
   inittable();//初始化表格
    add_div();//初始化弹框
    initToolbar();//初始化增删改查事件
    initSelectfind();//初始化下拉查询

}
        
    function initSelectfind(){
        $('#info_ss').searchbox({
        width:300,
        searcher:function(value,name){
            switch(name){
                case "cname" : $('#myinfo_table').datagrid('load', { 
                     cname:value,
                    
                }); 
                break;
                case "actor" : $('#myinfo_table').datagrid('load', { 
                    findType:"exact",
                     actor:value,
                     
                });
                break;
            }
        }, 
        menu:'#info_mm', 
        prompt:'请输入...'
        }); 
    }
    function inittable(){
      var table=$('#myinfo_table');
      table.datagrid({
            type:'post',
            url:'/info/find',
            data:{page:1,rows:10},
            pagination:true,
            rownumbers:true,
            columns:[[ 
                {field:'cname',title:'电影名',editor: {type: 'text',options: {}}}, 
                {field:'title',title:'标题',width:200,editor: {type: 'text',options: {}}},    
                {field:'boxoffice',title:'票房信息',width:200,editor: {type: 'text',options: {}}},
                {field:'info',title:'电影详情介绍',width:200,editor: {type: 'text',options: {}}},
                {field:'actor',title:'演员',editor: {type: 'text',options: {}}},
                {field:'director',title:'导演',editor: {type: 'text',options: {}}},
                 {field:'comment',title:'评论',width:200,editor: {type: 'text',options: {}}},
                {field:'imgs',title:'图集',align:'right',editor: {type: 'text',options: {}}}
            ]],
                  //在添加完毕endEdit，保存时触发
         onAfterEdit: function (rowIndex, rowData, changes) {
            console.log(rowData);  //当前编辑完毕以后行的数据
            editFlag = undefined;  //重置标记
            //修改
            $.ajax({
                type:"post",
                url:"/info/update",
                data: rowData,
                success: function(data){
                    $.messager.alert('操作','数据修改成功！');
                }
            });
             
        },
        onLoadSuccess:function(data){
            if(data.total==0){
                 $.messager.alert('温馨提示','没有你要寻找的数据！');
            }
        }
          
      });
     
 }
    function initToolbar(){
        var table=$('#myinfo_table');
        table.datagrid({
            toolbar:[
                {
                    iconCls: 'icon-add',
                    text: '增加',
                    handler: function addData(){
                        $('#addinfo_board').window('open');
                    }
                },'-',
                {
                    iconCls: 'icon-remove',
                    text: '删除',
                    handler: removeData
                },'-',
                {
                    iconCls: 'icon-edit',
                    text: '修改',
                    handler: editData
                },'-',
                {
                    iconCls: 'icon-save',
                    text: '保存',
                    handler: saveData
                },'-',{
                    text:$('#td1')
                },'-',{
                    text:'清空',
                    iconCls: 'icon-clear',
                    handler: function clearData_1 () {
                                $('#ss1').searchbox('clear');
                                $('#myinfo_table').datagrid('load',{ 
                                });
                             }
                }
            ]
        });

    }
    //初始化弹出面板
    function add_div(){
        //找到所有的input增加间距
        var inputs=$('#addinfo_board input');
        var p=$('#addinfo_board p');
        inputs.css('margin-bottom',20);
        p.css('margin-left',20);
        p.css('margin-top',20);
//        初始化添加图片的点击事件
        var imgbtn=$('#imgbtn').on('click',addimgs);
        imgbtn.linkbutton({    
            iconCls: 'icon-add'   
        }); 
        //弹框样式
        var addDiv=$('#addinfo_board');
       addDiv.dialog({    
            title: '请添加新的资讯信息',    
            width: 700,    
            height: 500,    
            closed: false,    
            cache: false,     
            modal: true,
           buttons:[{
				text:'添加',
				handler:addData_in
			},{
				text:'关闭',
				handler:function(){$('#addinfo_board').window('close');
                $('#addinfo_board input:gt(6)').remove()}
			}]
        }).window('close');

    }
//        增
    function addData_in(){
        $('#addinfo_form').form({
           type:'post',
           url: "/info/add",
            //添加成功后执行的函数
           success: function(msg){
               $("#addinfo_board").dialog("close");
               $('#myinfo_table').datagrid('reload'); 
               $.messager.alert('提示','添加成功');
               $('input').val('');
               $('#addinfo_form input:gt(6)').remove();
           },
            //弹出框的form表单内容能否被提交！
            onSubmit:function(param){
                var submitinput=$('#addinfo_board input:lt(7)');
                for(var i=0;i<submitinput.length;i++){
                    //如果里面的内容有任意的一个文本框为空返回false不能提交
                    if(submitinput[i].value==''){
                     $.messager.alert('温馨提示','请填写完善的信息');
                        return false
                    }
                }
                return true;
            }
        }); 
        $('#addinfo_form').submit()
    }
    //删除
    function removeData(){
         var idsArr=[];
        //获取选中行数据，类型为数组，因为可以多选
         var checkData = $('#myinfo_table').datagrid("getChecked");
        for(var obj of checkData){
            var id=obj['_id'];
            idsArr.push(id)
        }
        //判断一下idArr是否为空
        if(idsArr==''){
            $.messager.alert('提示','请选择电影数据进行删除！');  
        }else{
                    //弹框确认是否删除
             $.messager.confirm('确认','您确认想要删除选中的'+idsArr.length+'部电影资讯吗？',function(r){    
                if (r){    
                        //ajax请求删除数据
                    $.ajax({
                       url: "/info/del",
                       data: {ids:idsArr},
                       success: function(msg){
                            $('#myinfo_table').datagrid('reload'); 
                            $.messager.alert('提示','删除成功');  
                       }
                    });
                }    
            });  
        }

    }
    //修改
    function editData(){
        var table=$('#myinfo_table');
            //选中一行进行编辑
        var rows = table.datagrid('getChecked');
        if (rows.length == 1) {//选中一行的话触发事件
        
        //选中当前行，开启编辑状态
        editFlag = table.datagrid('getRowIndex', rows[0]);//获取选定行的索引
        table.datagrid('beginEdit', editFlag);//开启编辑并传入要编辑的行
        
        }else if(rows.length == 0){
            $.messager.alert('系统提示','请选择数据进行编辑!');
        }else{
            $.messager.alert('系统提示','只能编辑单行数据!');
        }
    }
    //保存修改后的数据
    function saveData(){
            //退出编辑状态
    $('#myinfo_table').datagrid('endEdit', editFlag);
    }
    //增加图集的点击事件
    function addimgs(){
      var input_img=$('<input>').attr('type','file').appendTo($('#addinfo_form'));
        input_img.css('width','100%');
        input_img.attr('name','imgs');
    }
    
    
//   ****************js结束***********************    
function inittabs(node){
    $('#'+node.id+'tab').load("modules/info/info.html",init);   
} 
modules.exports.inittabs=inittabs;   
});