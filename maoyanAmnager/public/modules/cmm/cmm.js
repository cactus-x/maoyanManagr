define(function(require,exports,modules){
//   ****************js开始***********************
    
    var activeinder;//初始化选中状态
    var moviedata;//初始化所有电影数据
    var cinemadata;//初始化所有影院数据
    var moviename=[];//初始化所有电影名字
    var cinemadata=[];//初始化所有影院名字
    var cmmdata;//初始化所有电影影院匹配数据
    var nexttime;//初始化下一场入场时间
    var buydate;//购票日期
    var inittime="10:00";//预计首播时间
    var overtime;//预计离场时间
    var roomwork;//放映厅的放映任务
    var _match;//电影影院匹配全内容
    var movie_match=[];//电影匹配全内容
    var cinema_match=[];//影院匹配全内容
    

function init(){
   
    inittable();//初始化表格
     cl();
    initbut();//初始化按键
    initseachbut();//初始化搜索按钮
    initedit();//初始化修改后提交数据
    initaddwindow();//初始化添加窗口
    initmoviedata();//初始化所有电影数据
    initcinemadata();//初始化所有影院数据
    initcmmdata();//初始化所有电影影院匹配数据方法
    initform();//初始化表单提交
    initmoviewindow();//初始化电影匹配窗口
    initcinemawindow();//初始化影院匹配窗口
    console.log(1111111111111);
}    
function cl(){



}
  function initform(){
  $('#ff').form({    
    url:"/cmm/add",
      type:"post",   
    success:function(data){  
        $('#win').window('close');
          $("#dg_cmmx").datagrid("reload");
         
    }    
});  
    }
//初始化表格
function inittable(){   
$('#dg_cmmx').datagrid({    
    url:"/cmm/find",   
    pagination:true,
    data:{page:"1",rows:"10"},
    columns:[[    
        {field:'name',title:'电影名',width:100,editor:{type:"text",option:{}}},
        {field:'type',title:'电影类型',width:100,editor:{type:"text",option:{}}},
        {field:'time',title:'时长',width:100,editor:{type:"text",option:{}}},
        {field:'cinema',title:'影院名',width:100,editor:{type:"text",option:{}}},
        {field:'money',title:'票价',width:100,editor:{type:"text",option:{}}},
        {field:'screens',title:'放映厅',width:100,editor:{type:"text",option:{}}},
        {field:'daty',title:'日期',width:100,editor:{type:"text",option:{}}},
        {field:'startTime',title:'开场时间',width:100,editor:{type:"text",option:{}}},
        {field:'endTime',title:'散场时间',width:100,editor:{type:"text",option:{}}}
]]
}); 
    
    $('#ss_x').searchbox({ 
searcher:function(value,name){ 
alert(value + "," + name) 
}, 
menu:'#mm_x', 
prompt:'请输入值' 
}); 
    
       
 }
    
//初始化按键    
function initbut(){
    $('#dg_cmmx').datagrid({
	toolbar: [
        {
		iconCls: 'icon-man',
        text:'电影',
		handler: moviefuc_m},
        '-',
        {
		iconCls: 'icon-sum',
        text:'影院',
        handler: cinemafuc_m},
        '-',{
		iconCls: 'icon-add',
        text:'添加',
        handler: add},
        '-',
        {
		iconCls: 'icon-remove',
        text:'删除',
        handler: del},
        '-',
        {
		iconCls: 'icon-edit',
        text:'修改',
        handler: change},
        '-',
        {
		iconCls: 'icon-save',
        text:'保存',
        handler: save}
    ]
});
}
    
//初始化seach按钮
function initseachbut(){
    $("#seach-but").on("click",function(){
        if($("#seachcontent").val()=="电影"){
            $('#dg_cmmx').datagrid('load',{
                name:$("#seach_value").val()    
            }); 
        }else if($("#seachcontent").val()=="影院"){
            $('#dg_cmmx').datagrid('load',{
                cinema:$("#seach_value").val()
            }); 
        }  
    });
}
    
    
    
    
    //按电影匹配查询
    function moviefuc_m(){
        console.log("电影");
 $('#movie').window('open');
        
        getmoviename_m();
     
    }
    //按影院匹配查询
    function cinemafuc_m(){
        console.log("影院");
        $('#cinema').window('open');
        getcineamname_m();
        
    }
    //查询匹配内容
    function match(){
        inittable();
    }
    //添加匹配内容
    function add(){
         $('#win').window('open'); 
        initaddwindowcont();//初始化添加窗口所有组件数据
        cleartext();
    }
    //删除匹配信息
    function del(){
          $.messager.confirm('确认','你确认想要删除记录码',function(ok){
      if(ok){
          var checkeds=$('#dg_cmmx').datagrid("getChecked"); 
          var newarr=[];
          for(var i=0;i<checkeds.length;i++){
              newarr.push(checkeds[i]._id);
          }
          console.log(newarr);
          
    $.ajax({
        url:"/cmm/del",
        data:{ids:newarr},
        success:function(){
            //删除后，重载数据
            $('#dg_cmmx').datagrid('reload');
            
        }
    });
    
      }  
    })
    }
    //修改匹配信息
    function change(){
        var rows=$('#dg_cmmx').datagrid("getChecked");
    if(rows.length==1){
        activeinder=$('#dg_cmmx').datagrid("getRowIndex",rows[0]);
            $('#dg_cmmx').datagrid("beginEdit",activeinder);
        }else{
            $.messager.alert('系统提示','只能编辑单行数据!');
        }
    }
    //保存修改匹配
    function save(){
        $('#dg_cmmx').datagrid("endEdit",activeinder);
    }
   
    //捕获编辑提交后数据更新
function initedit(){
    $('#dg_cmmx').datagrid({onAfterEdit:function(rowIndex,rowData,change){
        activeinder:undefined;
        $.ajax({
            type:"post",
            url:"/cmm/update",
            data:rowData,
            success:function(data){
                $.messager.alert("操作","修改成功");
            }
        });
      }
    });
}
    
//初始化添加放映窗口  
function initaddwindow(){  
$('#win').window({
    width:600,
    height:400,
    modal:true,
    title:"添加放映"
}).window("close");
//    $('#win').window('close');
 
 
  }
    
 //初始化所有电影影院匹配数据方法
function initcmmdata(){
    $.ajax({
        type: "post",
        url: "/cmm/find",
        success: function(data){
            cmmdata=data;
         }
    });  
}
//初始化所有电影数据   
function initmoviedata(){
    $.ajax({
        type: "post",
        url: "/movie/find",
        success: function(data){
            moviedata=data;
         }
    });  
} 
//得到所有电影name
    function getmoviename(){
    moviename=[];
    for(var i=0;i<moviedata.length;i++){
        moviename.push(moviedata[i].cname);
    }
} 
    //初始化所有影院数据  
function initcinemadata(){
    $.ajax({
        type: "post",
        url: "/cinema/find",
        success: function(data){
            cinemadata=data;
        }
    });  
}
    //得到所有影院name
 function getcinemaname(){
    cinemaname=[];
    for(var i=0;i<cinemadata.length;i++){
        cinemaname.push(cinemadata[i].moviehose_name);
    }
     for(var i=0;i<cinemaname.length;i++){
         for(var j=i+1;j<cinemaname.length;j++){
             if(cinemaname[i]==cinemaname[j]){
                 cinemaname.splice(j,1);
                 j--;
             }
         }
     }
}  
function cleartext(){
    $("#selectmoviename").val("");
    $("#moviestyle").val("");
    $("#playtime").val("");
    $("#selectcinemaname").val("");
    $("#room").val("");
    $("#money").val("");
    $("#number").val("");
    $("#dd").val("");
    $("#waittime").val("");
    $("#waittimelabel").val("");
    $("#overtime").val("");
}    
    
//初始化add内所有功能    
function initaddwindowcont(){
    
    buydate="";
    //获得电影data
    getmoviename();
    var char="<option></option>";
    for(var i=0;i<moviename.length;i++){
        char+="<option>"+moviename[i]+"</option>";
    }
    $("#selectmoviename").html(char);
    $("#selectmoviename").change(function(){
        for(var i=0;i<moviedata.length;i++){
        if(moviedata[i].cname==this.value){
            $("#moviestyle").val(moviedata[i].type);
            $("#playtime").val(moviedata[i].time); 
            break;
        }else{
            $("#moviestyle").val("");
            $("#playtime").val(""); 
        }
    }
    })
    
    //获得影院data
    getcinemaname();
    var char="<option></option>";
    for(var i=0;i<cinemaname.length;i++){
        char+="<option>"+cinemaname[i]+"</option>";
    }
    $("#selectcinemaname").html(char);
    $("#selectcinemaname").change(function(){
        
        var char="";
        for(var i=0;i<cinemadata.length;i++){
        if(cinemadata[i].moviehose_name==this.value){
             char+="<option>"+cinemadata[i].room+"</option>"; 
        }
    }
        console.log(char);
       $("#room").html(char);  
  
    })
    
    //获得座位数量
    $("#selectcinemaname,#room").on("change",function(){
        if($("#selectcinemaname,#room").val()){
            var char={moviehose_name:$("#selectcinemaname").val(),
                     room:$("#room").val()
                     };
            console.log(char);
            $.ajax({
                type:"post",
                url:"/cinema/find",
                findType:"exact",
                data:char,
                success: function(msg){
//                    console.log(msg);
                    if(msg.length>0)
                    $("#number").val(msg[0].sum);
                }
            
       
            });
        } 
    });
    
    //日期控件
     $('#dd').datebox({    
    required:true
         
});
    //时间控件
    $('#ss').timespinner({    
    min: '08:30',    
    required: true,    
    showSeconds: false   
}); 
    getbuydate();
    
     $("#selectcinemaname,#room,#dd,#waittime").change(function(){
        if($("#selectcinemaname,#room,#waittime").val()&&buydate){
           
            var char={
                cinema:$("#selectcinemaname").val(),
                screens:$("#room").val(),
                daty:buydate   
            }
            console.log(char);
            $.ajax({
                type:"post",
                url:"/cmm/find",
                data:char,
                success: function(msg){
                   roomwork=msg;
                    console.log(roomwork);
                    if(roomwork.length==0){
                        $.messager.alert('提示',$("#selectcinemaname").val()+" "+$("#room").val()+" "+buydate+"还没有放映安排！请合理安排第一映入场时间");  

                        $('#ss').timespinner('setValue', inittime);
                     }else{
                         var a=new Date(buydate+" "+roomwork[0].endTime);
                     for(var i=1; i<roomwork.length; i++){
//                         console.log(buydate+" "+roomwork[i].endTime);
                var a1=new Date(buydate+" "+roomwork[i].endTime);
                         
                         if(a<a1){
                             a=a1;
                         }
                     }
                         inittime=a.getHours()+":"+(parseInt(a.getMinutes())+parseInt($("#waittime").val()));
                        
                         $("#waittimelabel").html("上一场离场时间:"+a.getHours()+":"+a.getMinutes()+"建议合理安排时间");
                         $('#ss').timespinner('setValue', inittime);
             
                     }
          
                    if($("#playtime").val()&&$("#ss").val()&&buydate){
            overtime=new Date(buydate+" "+$("#ss").val());
            
            console.log(overtime);
                   overtime=overtime.getTime()+$("#playtime").val()*60*1000;
                         overtime=new Date(overtime);
                         console.log(overtime);
                         $("#overtime").val(overtime.getHours()+":"+parseInt(overtime.getMinutes()));
        }
                       
                }  
            })
        }
      
     });
    
//    $("#ss").change(function(){
//        console.log(0);
//        if($("#playtime").val()&&$("#ss").val()&&$("#dd").val()){
//        
//            overtime=new Date($("#dd").val()+" "+$("#ss").val());
//          overtime=overtime.getTime()+$("#playtime").val()*60*1000;
//                         overtime=new Date(overtime);
//                     
//                         $("#overtime").val(overtime.getHours()+":"+parseInt(overtime.getMinutes()));
//        }
//     
//    });
     
    
 
//    ***********************
}    
    //获取买票日期
 function getbuydate(){
      $('#dd').datebox({
    onSelect: function(date){
    buydate=(date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
        console.log(buydate);
        return buydate;
    }
});
 }  
    
    
    
    
    
    //dianying *****************
    function initmoviewindow(){
$('#movie').window({    
    width:600,    
    height:400,    
    modal:true ,
    title:"电影匹配查询"
}).window("close"); 
//    $('#movie').window('close');
    
    }
    //获取所有电影匹配的电影数据
    function getmoviename_m(){
        $.ajax({
            type:"post",
            type:"get",
            url:"/cmm/find",
            success:function(data){
                _match=data;
                initmoviedata_m();
                initeditmovie_m();
            }
        })
    }
    function initmoviedata_m(){
    //初始化optiop选项    
        var char="<option></option><option>"+_match[0].name+"</option>";
        movie_match.unshift(_match[0].name);
        for(var i=1;i<_match.length;i++){
            var j;
            for(j=0;j<movie_match.length;j++){
                if(_match[i].name==movie_match[j]){
                    break;
                }   
            }
            if(j==movie_match.length){
                movie_match.unshift(_match[i].name);
                char+="<option>"+_match[i].name+"</option>";
                }
        }
        $("#moviename_m").html(char);
        
        //初始化电影匹配表格
        $('#moviedg').datagrid({    
    url:"/cmm/find",   
    pagination:true,
    data:{page:"1",rows:"10"},
    columns:[[    
        {field:'name',title:'电影名',width:100,editor:{type:"text",option:{}}},
        {field:'type',title:'电影类型',width:100,editor:{type:"text",option:{}}},
        {field:'time',title:'时长',width:100,editor:{type:"text",option:{}}},
        {field:'cinema',title:'影院名',width:100,editor:{type:"text",option:{}}},
        {field:'money',title:'票价',width:100,editor:{type:"text",option:{}}},
        {field:'screens',title:'放映厅',width:100,editor:{type:"text",option:{}}},
        {field:'daty',title:'日期',width:100,editor:{type:"text",option:{}}},
        {field:'startTime',title:'开场时间',width:100,editor:{type:"text",option:{}}},
        {field:'endTime',title:'散场时间',width:100,editor:{type:"text",option:{}}}
]]
}); 
        
//初始化按钮
        $('#moviedg').datagrid({
	toolbar: [
        {
		iconCls: 'icon-save',
        text:'删除'
            ,handler: del_movie_m
        },
        '-',
        {
		iconCls: 'icon-save',
        text:'修改'
            ,handler: change_movie_m
        },
        '-',
        {
		iconCls: 'icon-save',
        text:'保存'
            ,handler: save_movie_m
        }
    ]
});
        //movie_man 电影名查询点击查询
        $("#movieseach").on("click",movie_m);
               
}//我是初始化moive匹配结束
    
    
    
//movie_man 电影名查询
function movie_m(){
        $('#moviedg').datagrid('load', {    
    name: $("#moviename_m").val()     
}); 
    }
//删除电影匹配
function del_movie_m(){
    $.messager.confirm('确认','你确认想要删除记录码',function(ok){
      if(ok){
          var checkeds=$('#moviedg').datagrid("getChecked"); 
          var newarr=[];
          for(var i=0;i<checkeds.length;i++){
              newarr.push(checkeds[i]._id);
          }
    $.ajax({
        url:"/cmm/del",
        data:{ids:newarr},
        success:function(){
            //删除后，重载数据
            $('#moviedg').datagrid('reload');
            
        }
    });
    
      }  
    })
}
  //修改电影匹配
function change_movie_m(){
    var rows=$('#moviedg').datagrid("getChecked");
    if(rows.length==1){
        activeinder=$('#moviedg').datagrid("getRowIndex",rows[0]);
            $('#moviedg').datagrid("beginEdit",activeinder);
        }else{
            $.messager.alert('系统提示','只能编辑单行数据!');
        }
}  
//保存电影匹配
function save_movie_m(){
     $('#moviedg').datagrid("endEdit",activeinder);
} 
   
//匹配电影查询编辑提交后数据更新
function initeditmovie_m(){
 $('#moviedg').datagrid({onAfterEdit:function(rowIndex,rowData,change){
        activeinder:undefined;
        $.ajax({
            type:"post",
            url:"/cmm/update",
            data:rowData,
            success:function(data){
                $.messager.alert("操作","修改成功");
            }
        });
      }
    });
}   
//************************************************
  
//获得所有影院查询数据
        function initcinemawindow(){
//            $('#cinema').window('close');
$('#cinema').window({    
    width:600,    
    height:400,    
    modal:true ,
    title:"影院匹配查询"
}).window("close");
//            console.log($('#cinema'));
//              $('#cinema').window('close');
//              $('#cinema').html("");
          
            

//            console.log(2222222222222);
    }
    
    //获取所有影院匹配的电影数据getcineamname_m
    function getcineamname_m(){
        $.ajax({
            type:"post",
            type:"get",
            url:"/cmm/find",
            success:function(data){
                _match=data;
                initcinemadata_m();
                initeditcinema_m();
            }
        })
    }
    function initcinemadata_m(){
    //初始化optiop选项    
        var char="<option></option><option>"+_match[0].cinema+"</option>";
        cinema_match.unshift(_match[0].cinema);
        for(var i=1;i<_match.length;i++){
            var j;
            for(j=0;j<cinema_match.length;j++){
                if(_match[i].cinema==cinema_match[j]){
                    break;
                }   
            }
            if(j==cinema_match.length){
                cinema_match.unshift(_match[i].cinema);
                char+="<option>"+_match[i].cinema+"</option>";
           
                }
        }
//        *********************************

        $("#cinemaname_m").html(char);
        
        //初始化电影匹配表格
        $('#cinemadg').datagrid({    
    url:"/cmm/find",   
    pagination:true,
    data:{page:"1",rows:"10"},
    columns:[[    
        {field:'name',title:'电影名',width:100,editor:{type:"text",option:{}}},
        {field:'type',title:'电影类型',width:100,editor:{type:"text",option:{}}},
        {field:'time',title:'时长',width:100,editor:{type:"text",option:{}}},
        {field:'cinema',title:'影院名',width:100,editor:{type:"text",option:{}}},
        {field:'money',title:'票价',width:100,editor:{type:"text",option:{}}},
        {field:'screens',title:'放映厅',width:100,editor:{type:"text",option:{}}},
        {field:'daty',title:'日期',width:100,editor:{type:"text",option:{}}},
        {field:'startTime',title:'开场时间',width:100,editor:{type:"text",option:{}}},
        {field:'endTime',title:'散场时间',width:100,editor:{type:"text",option:{}}}
]]
}); 
        //初始化按钮
        $('#cinemadg').datagrid({
	toolbar: [
        {
		iconCls: 'icon-save',
        text:'删除'
            ,handler: del_cinema_m
        },
        '-',
        {
		iconCls: 'icon-save',
        text:'修改'
            ,handler: change_cinema_m
        },
        '-',
        {
		iconCls: 'icon-save',
        text:'保存'
            ,handler: save_cinema_m
        } 
    ]
});      
//movie_man 电影名查询点击查询
$("#cinemaseach").on("click",cinema_m);              
}//我是初始化moive匹配结束
//************************************************    
//movie_man 电影名查询
function cinema_m(){
    $('#cinemadg').datagrid('load', {    
    cinema: $("#cinemaname_m").val()     
    }); 
}
    
//删除电影匹配
function del_cinema_m(){
    $.messager.confirm('确认','你确认想要删除记录码',function(ok){
      if(ok){
          var checkeds=$('#cinemadg').datagrid("getChecked"); 
          var newarr=[];
          for(var i=0;i<checkeds.length;i++){
              newarr.push(checkeds[i]._id);
          }
    $.ajax({
        url:"/cmm/del",
        data:{ids:newarr},
        success:function(){
            //删除后，重载数据
            $('#cinemadg').datagrid('reload');  
        }
    });
    
      }  
    })
}
    
//修改电影匹配change_cinema_m
function change_cinema_m(){
    var rows=$('#cinemadg').datagrid("getChecked");
    if(rows.length==1){
        activeinder=$('#cinemadg').datagrid("getRowIndex",rows[0]);
            $('#cinemadg').datagrid("beginEdit",activeinder);
        }else{
            $.messager.alert('系统提示','只能编辑单行数据!');
        }
}
    
//保存电影匹配
function save_cinema_m(){
     $('#cinemadg').datagrid("endEdit",activeinder);
} 
   
//匹配电影查询编辑提交后数据更新
function initeditcinema_m(){
 $('#cinemadg').datagrid({onAfterEdit:function(rowIndex,rowData,change){
        activeinder:undefined;
        $.ajax({
            type:"post",
            url:"/cmm/update",
            data:rowData,
            success:function(data){
                $.messager.alert("操作","修改成功");
            }
        });
      }
    });
}
      
//   ****************js结束***********************    
function inittabs(node){
    $('#'+node.id+'tab').load("modules/cmm/cmm.html",init);   
} 
modules.exports.inittabs=inittabs;   
});