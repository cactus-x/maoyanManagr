define(function(require,exports,modules){
//   ****************js开始***********************
    
    function init(){
        hottable();// 热映表格
        initDialog();//弹出框
        initSelectfind1();//初始化下拉查询
    }

     function initSelectfind1(){
        $('#hot_ss').searchbox({
        width:300,
        searcher:function(value,name){
            switch(name){
                case "cname" : $('#myhot_table').datagrid('load', { 
                     cname:value
                }); 
                break;
                case "actor" : $('#myhot_table').datagrid('load', { 
                    findType:"exact",
                     actor:value
                });
                break;
                case "type" : $('#myhot_table').datagrid('load', { 
                     type:value
                });
                break;
                case "year" : $('#myhot_table').datagrid('load', { 
                    findType:"exact",
                     year:value
                });
                break;
            }
         $('#hot_ss').val('')   
        }, 
        menu:'#hot_mm', 
        prompt:'' 
        }); 
    }
    
    
   function hottable(){
       var table=$('#myhot_table');
       table.datagrid({
            url:'/hot/find',
            data:{page:1,rows:10},
            pagination:true,
            rownumbers:true,
            columns:[[    
                {field:'cname',title:'电影名'},    
                {field:'ename',title:'英文名'},
                {field:'type',title:'类型'},
                {field:'area',title:'国家'},
                {field:'score',title:'电影评分'},
                {field:'actor',title:'演员'},
                {field:'year',title:'上映时间'},
                {field:'time',title:'影片时长'},
                {field:'timePlay',title:'上映日期'},
                {field:'timeArea',title:'上映地区'},
                {field:'boxOffice',title:'票房总计'},
                {field:'imgs',title:'图集'},
                {field:'info',title:'简介',width:300,align:'right'}
      
            ]],
           //编辑 按钮
           toolbar: [{
                iconCls: 'icon-add',
                text:'增加',
                handler: addData
            },'-',{
                iconCls: 'icon-remove',
                 text:'删除',
                handler: removieData
            },'-',{
                 text :$('#hot_td')  
            },'-',{
                    text:'清空',
                    iconCls: 'icon-clear',
                    handler: function clearData_1 () {
                                $('#hot_ss').searchbox('clear');
                                $('#myhot_table').datagrid('load',{ });
                             }
                }
                    
            ],
          
        }); 
   }
    //添加弹出框
function initDialog(){
    //给增加面板初始化dialog属性
     $("#hot_add_box").dialog({
        width:1000,    
        height:400,   
        title:"添加电影到热映",
        closable:true,
        closed: true,
        modal: true,
        
        buttons:[{
            text:'确认添加',
            iconCls: 'icon-ok',
            handler:addData_in
        },{
            text:'关闭',
            iconCls: 'icon-cancel',
            handler:function(){
                $("#hot_add_box").dialog("close");
            }
        }]
    }).dialog("close");
}


    function addData(){
        $('#hot_add_box').dialog('open');
//        打开添加电影加载所有电影信息
        allmovie_table();
    }
    //添加弹框后的表格
    function allmovie_table(){
         var table=$('#allmovie_table');
            table.datagrid({
            url:'/movie/find',
//            singleSelect:true,
            data:{page:1,rows:10},
            check:true,
            rownumbers:true,
            pagination:true,
            columns:[[    
                {field:'cname',title:'电影名'},    
                {field:'ename',title:'英文名'},
                {field:'type',title:'类型'},
                {field:'area',title:'国家'},
                {field:'score',title:'电影评分'},
                {field:'actor',title:'演员'},
                {field:'year',title:'上映时间'},
                {field:'time',title:'影片时长'},
                {field:'timePlay',title:'上映日期'},
                {field:'timeArea',title:'上映地区'},
                {field:'boxOffice',title:'票房总计'},
                {field:'imgs',title:'图集'},
                {field:'info',title:'简介',width:100,align:'right'}
            ]]
        }); 
    }
    
    //添加movie集合内的电影到热映的函数
    function addData_in(){
         //找到当前被选中的所有行
        var checkData =$('#allmovie_table').datagrid("getChecked");
        $.messager.confirm('确认','您确认想要添加'+checkData.length+'部电影到热映吗？',function(r){    
            if (r){  
                        //获取没有ID的一个相同的数组
                for(var obj of checkData){
                  var newobj={
                     cname:obj.cname,
                     ename:obj.ename,
                     type:obj.type,
                     area:obj.area,
                     score:obj.score,
                     actor:obj.actor,
                     year:obj.year,
                     time:obj.time,
                     timePlay:obj.timePlay,
                     timeArea:obj.timeArea,
                     boxOffice:obj.boxOffice,
                     info:obj.info,
                     imgs:obj.imgs
                  }
                     //ajax请求提交数据
                  $.ajax({
                       type: "post",
                       url: "/hot/add",
                       submitType:"addMore",
                       data:newobj,
                       success: function(msg){

                       }
                  });

                }
                $('#myhot_table').datagrid('reload'); 
                $("#hot_add_box").dialog("close");
                $.messager.alert('提示','添加成功');
            }    
        });  


    }
//    删除热映集合内的函数
    function removieData(){
        //找到当前被选中的所有行
        var idsArr=[];
         var checkData = $('#myhot_table').datagrid("getChecked");
        for(var obj of checkData){
            var id=obj['_id'];
            idsArr.push(id)
        }
        //判断一下传过去的数据是否是空的，如果是空的，弹出提示
        if(idsArr==''){
             $.messager.alert('提示','请选择数据进行删除')
        }else{
            
            $.messager.confirm('确认','您确认想要删除记录吗？',function(r){    
            if (r){    
                    //ajax请求数据
                    $.ajax({
                       url: "/hot/del",
                       data: {ids:idsArr},
                       success: function(msg){
                            $('#myhot_table').datagrid('reload'); 
                            $.messager.alert('提示','删除成功');  
                       }
                    });
                }    
            });  
        }


       
    } 
        
        
        

    
//   ****************js结束***********************    
function inittabs(node){
    $('#'+node.id+'tab').load("modules/hot/hot.html",init);   
} 
modules.exports.inittabs=inittabs;   
});