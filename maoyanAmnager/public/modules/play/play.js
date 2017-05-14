var myTable;
var win;
var addForm;
define(function(require,exports,modules){
//   ****************js开始***********************
    
   
  function init(){
      addForm=$("#play_addForm");
        myTable=$("#play_myTabel");
      win=$("#play_win");
        initPanel();//初始化页面
        initBut();//曾删改查按钮
        initDialog();//初始化弹框面板
        initPanel_box();//初始化弹框数据
        choseData();//查询
      

      
      
    }
    function initPanel(){
             //初始化页面
            myTable.datagrid({
                url: "/play/find",
                pagination:true,//显示翻页
                data:{page:1,rows:10},
                rownumbers: true,//显示行数
                 
                columns:[[        
                    {field:'cname',title:'电影中文名字',width:100,editor: {type: 'text',options: {}} },    
                    {field:'ename',title:'电影英文名字',width:100,editor: {type: 'text',options: {}} },  
                    {field:'type',title:'类型',width:100,editor: {type: 'text',options: {}} },  
                    {field:'score',title:'电影评分',width:100,editor: {type: 'numberbox',options: {}}},  
                    {field:'actor',title:'演员',width:100,editor: {type: 'text',options: {}}},  
                    {field:'area',title:'区域',width:100,editor: {type: 'text',options: {}}},
                    {field:'year',title:'年代',width:100,editor: {type: 'text',options: {}}},
                    {field:'time',title:'时长',width:100,editor: {type: 'text',options: {}}},
                    {field:'timePlay',title:'上映时间',width:100,editor: {type: 'text',options: {}}},
                    {field:'areaPlay',title:'上映地区',width:100},
                    {field:'boxOffice',title:'票房',width:100,editor: {type: 'numberbox',options: {}}}, 
                    {field:'info',title:'剧情介绍',width:100,editor: {type: 'numberbox',options: {}}}, 
                    {field:'imgOne',title:'首页图片',width:100,editor: {type: 'numberbox',options: {}}}, 
                    {field:'img',title:'图片',width:100,editor: {type: 'numberbox',options: {}}} 
                ]],
                
                    onLoadSuccess: function(data){
                        if(data.total==0){
                        $.messager.confirm("提示","数据丢失啦！，找找其它的吧！",function(ms){
                            if(ms){
                                $("#ss").searchbox("clear");
                                myTable.datagrid("load",{});
                            }
                        });                 
                        }
                    }
        });  
        
    }
    //初始化弹框数据
    function initPanel_box(){
             //初始化页面
            addForm.datagrid({
                url: "/movie/find",
                pagination:true,
                draggable:true,
                data:{page:1,rows:10},
                rownumbers: true,//显示行数
                columns:[[    
                    {field:'cname',title:'电影中文名字',width:100,editor: {type: 'text',options: {}} },    
                    {field:'ename',title:'电影英文名字',width:100,editor: {type: 'text',options: {}} },  
                    {field:'type',title:'类型',width:100,editor: {type: 'text',options: {}} },  
                    {field:'score',title:'电影评分',width:100,editor: {type: 'numberbox',options: {}}},  
                    {field:'actor',title:'演员',width:100,editor: {type: 'text',options: {}}},  
                    {field:'area',title:'区域',width:100,editor: {type: 'text',options: {}}},
                    {field:'year',title:'年代',width:100,editor: {type: 'text',options: {}}},
                    {field:'time',title:'时长',width:100,editor: {type: 'text',options: {}}},
                    {field:'timePlay',title:'上映时间',width:100,editor: {type: 'text',options: {}}},
                    {field:'areaPlay',title:'上映地区',width:100},
                    {field:'boxOffice',title:'票房',width:100,editor: {type: 'numberbox',options: {}}}, 
                    {field:'info',title:'剧情介绍',width:100,editor: {type: 'numberbox',options: {}}}, 
                    {field:'imgOne',title:'首页图片',width:100,editor: {type: 'numberbox',options: {}}}, 
                    {field:'img',title:'图片',width:100,editor: {type: 'numberbox',options: {}}} 
                ]]
        });    
    }
    
    
    

    function initBut(){
        myTable.datagrid({
            toolbar:[
                {
                    iconCls: 'icon-add',
                    text: '增加',
                    handler: addData
                },'-', 
                {
                    iconCls:"icon-remove",
                    text:"删除",
                    handler:removeData
                },"-",
                {text:$('#tv')}
            ]
        })
    }
    //初始化弹框面板
    function initDialog(){
        win.dialog({
            title:"添加信息",
            modal:true,
            closable:true,
            closed:true,
            resizable:true,
            buttons:[{
                text:"确认添加",
                iconCls:"icon-ok",
                handler:addOK
                
            },{
                text:"取消",
                iconCls:"icon-cancel",
                handler:function(){
                    win.dialog("close")
                }
            }]
        }).dialog("close");
    }
    
    
    //确认添加
    function addOK(){
        
        var chooseData=addForm.datagrid("getChecked");//获取被选中行信息
        if(chooseData.length<1){
               $.messager.alert("提示","请先选择你要添加的内容");
           }else{
        $.messager.confirm("添加","你确认添加记录？",function(){
               for(var obj of chooseData){
                var addObj={
                    cname:obj.cname,
                    ename:obj.ename,
                    type:obj.type,
                    score:obj.score,
                    actor:obj.actor,
                    area:obj.area,
                    year:obj.year,
                    time:obj.time,
                    timePlay:obj.timePlay,
                    areaPlay:obj.areaPlay,
                    boxOffice:obj.boxOffice,
                    info:obj.info,
                    imgOne:obj.imgOne,
                    img:obj.img
                }
                 $.ajax({
                type:"post",
                url:"/play/add",
                data:addObj,
                success:function(data){
                    myTable.datagrid("reload");
                }
            });
            }
           })
        addForm.datagrid("clearChecked");
            win.dialog("close")
        };
    }
    //添加
  function addData(){
    win.dialog('open'); 
      
  }
    //删除
    function removeData(){
        var chekData=myTable.datagrid("getChecked");
        console.log(chekData);
        if(chekData.length<1){
            $.messager.alert("提示","请选择要删除项");
        }else{
            $.messager.confirm("删除","你确认删除记录？",function(ms){
            if(ms){
                var arr=[];
            for(var obj of chekData){
                arr.push(obj["_id"]);
            }
            $.ajax({
                url:"/play/del",
                data:{ids:arr},
                success:function(){
                    myTable.datagrid("reload");
                    
                }
            })
            }
            
            
            
        })
        }
    }
    
    //查询
    function choseData(){ 
        $('#play_ss').searchbox({ 
            searcher:function(value,name){ 
                switch(name){
                    case "cname":myTable.datagrid("reload",{
                        cname:value
                    });break;
                    case "actor": myTable.datagrid("reload",{
                    findType:"exact",//精准查询
                    actor:value
                });
//            if(name =="cname"){
//                 myTable.datagrid("reload",{
//                        cname:$("#ss").val()
//                    });
//                console.log(myTable.total)
//                }else if(name=="actor"){
//                    myTable.datagrid("reload",{
//                        findType:"exact",//精准查询
//                        actor:$("#ss").val()
//                    })
//                }
//
                        
                }
                
            },

            menu:'#play_mm'
        });
        
       
          
      
    }
    
//   ****************js结束***********************    
function inittabs(node){
    $('#'+node.id+'tab').load("modules/play/play.html",init);   //将init函数在加载时执行
} 
modules.exports.inittabs=inittabs;   
});