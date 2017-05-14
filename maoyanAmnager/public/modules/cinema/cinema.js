define(function(require,exports,module){
//   ****************js开始***********************
    
    
    
    
    

    

    
var editIndex;
    function movie_table(){
        findpage();
        tableButton();
        addDiv();
       changeDIV();
        show_div();
        find_div();
    }
//院线分页查询
     function findpage(){    
    $('#cinemaTable').datagrid({
        striped:true,
        rownumbers: true,
        pagination:true,
        url:'/cinema/find', 
        columns:[[    
            {field:'moviehose_name',title:'院线名',width:100},    
            {field:'address',title:'地址',width:100},    
            {field:'call',title:'电话',width:100},    
            {field:'room',title:'放映厅',width:100},    
            {field:'type',title:'放映厅类型',width:100},       
            {field:'sum',title:'座位总数',width:100},       
            {field:'URL',title:'网址',width:100,align:'right'}    
        ]]});
    
    }
    
    //座位显示面板
    function show_div(){
         $('#show').dialog({
            draggable:true,
            title:"座位预览",
            closable:true,
            closed:true,
            modal:true,
            buttons:[{
                text:'关闭',
                iconCls: 'icon-cancel',
                handler:function(){
                    $("#show").dialog("close");

            }
        }]
    }).dialog("close");
        //增加面板座位预览按钮
         $('#show_seat').click(function(){

             if($('#seat').val()!=''){
                 var number=0;
                  $('#show').dialog('open');
                     var table=$('<table>');
                     $('#show').html(table); 
                     table.css('margin','auto');
                     var arr= JSON.parse($('#seat').val());
             
             for(var i of arr){

                      
                         var tr=$('<tr>');
                         for(var n of i){
                             
                             var td=$('<td>');
                           
                             if(n==1){
                                 number++;
                                 $(td).addClass('one').css({width:'10px',height:'10px'});
                             }else{
                                  $(td).addClass('two').css({width:'10px',height:'10px'});
                             }
                            $(td).appendTo(tr);
                         }
                         $(tr).appendTo(table);
                     }
             $('#sum_number').val(number);
             }
             else{
                    $.messager.confirm('提示','请先填写相关信息');
             }
          
        }) ;
        //修改面板座位预览按钮
        $('#changeShow_seat').click(function(){ 
            
             var table=$('<table>');
             $('#show').html(table);
             table.css('margin','auto');
            
        
            if($('#cSeat').val()!=''){
                 var arr= JSON.parse($('#cSeat').val()) ;
                $('#show').dialog('open');
                var number=0;
                 for(var i of arr){

                      
                         var tr=$('<tr>');
                         for(var n of i){
                             
                             var td=$('<td>');
                           
                             if(n==1){
                                 number++;
                                 $(td).addClass('one').css({width:'10px',height:'10px'});
                             }else{
                                  $(td).addClass('two').css({width:'10px',height:'10px'});
                             }
                            $(td).appendTo(tr);
                         }
                         $(tr).appendTo(table);
                     }
                 $('#sum_number1').val(number);
        }
            else{
               $.messager.confirm('提示','请先填写相关数据');  
            }
        });
    }
    
//增加面板
    function addDiv(){
//    var rows=$('#cinemaTable').datagrid('getChecked');
//        $('#CNAadd').on('click',function(){
//            console.log(1);
//            var newDiv=$('<div>');
//            newDiv.css({
//                width:'396px',height:'130px',border:'1px solid grey',margin:'8px 0 8px 0',margin:'auto' 
//            });
//            $('#total_div').append(newDiv);
//        })
            
    $('#CNAadd_form').form({    
    url:'/cinema/add',    
    onSubmit: function(){},    
        success:function(msg){
        $('#cinemaTable').datagrid('reload');
        $.messager.confirm('提示','添加数据成功');
        }    
    });
     $("#CNAadd_div").dialog({
         draggable:true,
        title:"增加院线",
        closable:true,
        closed: true,
        modal: true,
        buttons:[{
            text:'添加',
            iconCls: 'icon-ok',
            handler:function(){
                    var booler=true;
                    var booler_1=true;
                    var arr_ip=$('#CNAadd_form').find('input');
                    console.log(arr_ip);
                    for(var i of arr_ip){
                        console.log(i.value);
                        if(i.value==''){
                            booler_1=false;
                            break;
                        }
                    }

                    //
                //重复数据判断
                 
                      $.ajax({
                        type:'get',
                        url:'/cinema/find',
                        data:{},
                        success:function(msg){
                        console.log(msg)
                        for(var i of msg){
//                            console.log(i.room);
//                            console.log($('#room_ip').val());
//                            console.log(i.moviehose_name);
//                            console.log($('#name_ip').val());
                             if(i.moviehose_name==$('#name_ip').val()&&i.room==$('#room_ip').val()){
                                   booler=false;
                             }
                            
                        }  
                            if(booler&&booler_1){
                           
                            $('#CNAadd_form').submit();
                            $("#CNAadd_div").dialog("close");
                           
                        }else{
                            if(!booler){
                            $.messager.confirm('提示','该影院已有该放映厅');}
                            else if(!booler_1){
                             $.messager.confirm('提示','请完整填入所有信息');   
                            }
                        }
                           
                  }
                          
                    })

                       
                        //
                        
//  
      
                //提交表单判断\

            }
        },{
            text:'关闭',
            iconCls: 'icon-cancel',
            handler:function(){
                $("#CNAadd_div").dialog("close");
                
            }
        }]
    }).dialog("close");
}
//添加按钮
    function tableButton(){
    $('#cinemaTable').datagrid({
        toolbar:[
            {
                iconCls: 'icon-add',
                text: '增加',
                handler: addopen
            },'-',
            {
                iconCls: 'icon-remove',
                text: '删除',
                handler: deleteData
            },'-',
            {
                iconCls: 'icon-edit',
                text: '修改',
                handler: changeData
            },'-',{
                text:($('#CNAfind_div'))
            },'-',
            {
                iconCls:'icon-clear',
                text:'清空',
                handler:clear_table
            }
        ]
    });
}
    //清空
    function clear_table (){
                 $('#CNAss').val('');
                 $('#cinemaTable').datagrid("load",{});
    }
//打开增加面板
        function addopen(){
            var ip_arr=$('#CNAadd_form').find('input');
            for(var i of ip_arr){
                if(i.type!='button'){
                    i.value='';
                }
            }
            $('#CNAadd_div').children('input').val('');
            $('#CNAadd_div').dialog('open');
        }
    //搜索框

    function find_div(){
        $('#CNAss').searchbox({ 
            searcher:function(value,name){ 
            switch(name){
                                  
                case 'moviehose_name':$('#cinemaTable').datagrid('load',{moviehose_name:value});break;
                case 'address':$('#cinemaTable').datagrid('load',{address:value});break;
            } 
            }, 
            menu:'#CNAmm', 
            width:'230px',
            prompt:'请输入搜索值' 
            });
    }
//修改    
    function changeData(){
        
    //选中
    var rows = $('#cinemaTable').datagrid('getChecked');
 
    if (rows.length == 1) {
  
        $('#CNAchange_div').dialog('open');
         $('#cName').val(rows[0].moviehose_name);
         $('#cAddress').val(rows[0].address);
         $('#cCall').val(rows[0].call);
         $('#cURL').val(rows[0].URL);
         $('#cRoom').val(rows[0].room);
         $('#cType').val(rows[0].type);
         $('#sum_number1').val(rows[0].sum);
         $('#cSeat').val(JSON.stringify(rows[0].seat));



            
         
        //修改数据提交
        $('#CNAchange_form').form({    
                url:'/cinema/update',
                onSubmit: function(data){
                data._id=rows[0]._id;
                },    
                success:function(msg){    
                    $.messager.confirm('提示','修改数据成功');
                    $('#cinemaTable').datagrid("reload");
                }    
            });
    }
}
    
    //修改窗口
    function changeDIV(){
       

        $("#CNAchange_div").dialog({
            draggable:true,
            title:"修改院线信息",
            closable:true,
            closed: true,
            modal: true,
            buttons:[{
                text:'修改',
                iconCls: 'icon-ok',
                handler:function(){
                            $('#CNAchange_form').submit();
                           
                            $("#CNAchange_div").dialog("close");
                }
            },{
            text:'取消',
            iconCls: 'icon-cancel',
            handler:function(){
                $("#CNAchange_div").dialog("close");
            }
        }]
    }).dialog("close");
        
    }
//删除
    
 function deleteData(){
       $.messager.confirm('确认','您确认想要删除记录吗？',function(ok){    
        if (ok){   
            var checkData = $('#cinemaTable').datagrid("getChecked");
            if(checkData.length>0){
            var idArr = [];
            for(var i of checkData){
                idArr.push(i._id);
            }
            
            $.ajax({
                url:"/cinema/del",
                data: {ids:idArr},
                success: function(data){

                    $('#cinemaTable').datagrid("reload");
                }
            });
            }
        }    
    }); 
        }

//   ****************js结束***********************    
function inittabs(node){

    $('#'+node.id+'tab').load("modules/cinema/cinema.html",movie_table);   
} 
module.exports.inittabs=inittabs;   
});


