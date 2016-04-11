<!--学校选择插件-->

        //弹出窗口
    function pop(){
        //将窗口居中
        makeCenter();

        //初始化省份列表
        initProvince();

        //默认情况下, 给第一个省份添加choosen样式
        $('[province-id="1"]').addClass('choosen');

        //初始化大学列表
        initSchool(1);
    }

//隐藏窗口
function hide(){
    $('#choose-box-wrapper').css("display","none");
}

function initProvince(){

    //原先的省份列表清空
    $('#choose-a-province').html('');

    for(i=0;i<schoolList.length;i++){
        $('#choose-a-province').append('<a href="javascript:void(0);" class="province-item" province-id="'+schoolList[i].id+'">'+schoolList[i].name+'</a>');
    }

    //添加省份列表项的click事件
    $('.province-item').bind('click',function(){
        var item=$(this);
        var province = item.attr('province-id');
        var choosenItem = item.parent().find('.choosen');
        if(choosenItem)
            $(choosenItem).removeClass('choosen');
        item.addClass('choosen');

        //更新大学列表
        initSchool(province);
    });
}

function initSchool(provinceID){

    //原先的学校列表清空
    $('#choose-a-school').html('');
    var schools = schoolList[provinceID-1].school;
    for(i=0;i<schools.length;i++){
        $('#choose-a-school').append('<a href="javascript:void(0);" class="school-item" school-id="'+schools[i].id+'">'+schools[i].name+'</a>');
    }

    //添加大学列表项的click事件
    $('.school-item').bind('click', function(){
        var item=$(this);
        var school = item.attr('school-id');

        //更新选择大学文本框中的值
        $('#school-name').val(item.text());

        //关闭弹窗
        hide();
    });
}

function makeCenter(){
    $('#choose-box-wrapper').css("display","block");
    $('#choose-box-wrapper').css("position","absolute");
    $('#choose-box-wrapper').css("top", Math.max(0, (($(window).height() - $('#choose-box-wrapper').outerHeight()) / 2) + $(window).scrollTop()) + "px");
    $('#choose-box-wrapper').css("left", Math.max(0, (($(window).width() - $('#choose-box-wrapper').outerWidth()) / 2) + $(window).scrollLeft()) + "px");
}

<!--学校选择插件结束-->








var shenfenJuese = DropDownList.create({
    select : $('#shenfen-juese'),
    attrs : {
        column : 5,     // 只显示5行，超过以后显示滚动条
        height:36,
        width  : 206   // 指定下拉框宽度为150px
    }
});


var shifouTuichu = DropDownList.create({
    select : $('#shifou-tuichu'),
    attrs : {
        column : 5,     // 只显示5行，超过以后显示滚动条
        height:36,
        width  : 206   // 指定下拉框宽度为150px
    }
});


var shifouGongkai = DropDownList.create({
    select : $('#shifou-gongkai'),
    attrs : {
        column : 5,     // 只显示5行，超过以后显示滚动条
        height:36,
        width  : 206   // 指定下拉框宽度为150px
    }
});


var xiangmuJieduan = DropDownList.create({
    select : $('#xiangmu-jieduan'),
    attrs : {
        column : 5,     // 只显示5行，超过以后显示滚动条
        height:36,
        width  : 206   // 指定下拉框宽度为150px
    }
})



$("#sosuo-add").click(function() {

    var selectSchool=$("#tags").val()
    $("#school-name").val(selectSchool);
    hide();

});

//添加教育经历

$(".tianjia-jiaoyu").hide();
$("#edit-div2").click(function ()
{
    $(this).hide();
    $(this).next().show();
    $(".xueli-bianji").show();
    $(".xueli-shanchu").show();
    $(".tianjia-jiaoyu").slideDown();

});

$("#tianjia").click(function()
{

    var schoolName=$("#school-name").val();

    $("#count").append("<div class='yitianjia'> <div class='xueli'>"+ddl_picture1.val()+"</div> <div class='daxue'>"+schoolName+"</div> <div class='xueyuan'>"+ddl_picture2.val()+"</div> <div class='nianfen'>"+ddl_picture3.val()+"</div> <div class='xueli-bianji'>编辑</div> <div class='xueli-shanchu'>删除</div> </div>");

    $(".xueli-shanchu").bind('click',function()
    {
        $(this).parent().remove();

    });

    $(".xueli-bianji").click(function()
    {
        ddl_picture3.val($(this).prev().text());
        ddl_picture2.val($(this).prev().prev().text());
        $("#school-name").val($(this).prev().prev().prev().text());
        ddl_picture1.val($(this).prev().prev().prev().prev().text());
        $("#tianjia").hide();
        $("#bianji-baocun").show();

        var param=$(".yitianjia").index($(this).parent());
        $("#bianji-baocun").attr("title",param);

    });


});

$(".xueli-shanchu").bind('click',function()
{
    $(this).parent().remove();

});

$(".xueli-bianji").click(function()
{
    ddl_picture3.val($(this).prev().text());
    ddl_picture2.val($(this).prev().prev().text());
    $("#school-name").val($(this).prev().prev().prev().text());
    ddl_picture1.val($(this).prev().prev().prev().prev().text());
    $("#tianjia").hide();
    $("#bianji-baocun").show();
    var param=$(".yitianjia").index($(this).parent());
    $("#bianji-baocun").attr("title",param);

});

$("#bianji-baocun").click(function()
{

    var xueliIndex=$("#bianji-baocun").attr("title");
    $(this).hide();
    $("#tianjia").show();
    var parentDiv=$($(".yitianjia").get(xueliIndex));
    $(parentDiv.find("div").get(0)).text(ddl_picture1.val());
    $(parentDiv.find("div").get(1)).text($("#school-name").val());
    $(parentDiv.find("div").get(2)).text(ddl_picture2.val());
    $(parentDiv.find("div").get(3)).text(ddl_picture3.val());

    alert("修改成功！");
    ddl_picture1.val("学历");
    $("#school-name").val("请选择学校");
    ddl_picture2.val("学院");
    ddl_picture3.val("入学年份");

});

$(".jiaoyu-baocun").click(function()
{

    $(this).hide();
    $(this).prev().show();
    $(".xueli-bianji").hide();
    $(".xueli-shanchu").hide();
    $(".tianjia-jiaoyu").slideUp();

});


//关注和粉丝切换

$("#fensi").hide();

$(".fensi").click(function(){

    $("#fensi").show();
    $(".guanzhu").css({"background":"#f3f5f8","color":"#888686"});
    $("#guanzhu").hide();
    $(".fensi").css({"background":"#fff","color":"#282828"});


});

$(".guanzhu").click(function(){

    $("#guanzhu").show();
    $("#fensi").hide();
    $(".fensi").css({"background":"#f3f5f8","color":"#888686"});
    $(".guanzhu").css({"background":"#fff","color":"#282828"});
});





// 设定column和width
var ddl = DropDownList.create({
    select : $('#ddl_picture'),
    attrs : {
        column : 5,     // 只显示5行，超过以后显示滚动条
        width  : 152    // 指定下拉框宽度为150px
    }
});




//点击个人经历编辑
$(".bianji").hide();
$(".bianji-meiyou").hide();

$("#edit-div").click(function()
{
    $(".bianji").slideDown();
    $(".bianji-meiyou").slideDown();
    $(".name-tou .baocun-anniu").show();
    $(".name-tou .shanchu-anniu").show();
    $(".yiqueren-anniu").hide();
    $(".bianji-anniu").hide();


});

//点击个人经历保存
$(".baocun-anniu").click(function()
{
    $(this).parent().next().next().slideUp();
    $(this).hide();
    $(this).next().hide();
    $(this).next().next().show();
    $(this).next().next().next().show();
});




//点击投资理念编辑
$(".bianji-wenben").hide();
$("#edit-div1").click(function()
{

    $(".touzi-linian").hide();
    $(".tigong-jiazhi").hide();
    $(".jiazhi-neirong").hide();
    $(this).next().show();
    $(this).next().next().show();
    $(this).hide();
    $(".bianji-wenben").slideDown();

});

//点击投资理念保存

$(".linian-baocun").click(function()
{
    $(".bianji-wenben").slideUp();
    $(this).hide();
    $(this).next().hide();
    $(this).prev().show();
    $(".touzi-linian").show();
    $(".tigong-jiazhi").show();
    $(".jiazhi-neirong").show();

});



//编辑个人信息


$(function(){
    layer.config({
        skin: 'layer-ext-mineskin',
        extend: ['skin/mineskin/style.css']
    });
})

function showdialog(){
    var content="<div><div class='dialog-left'>" +
        "<div class='touxiang'  onclick='path.click()'></div>" +
        "<input type='file' id='path' style='display:none' onchange='upfile.value=this.value'>" +
        "<div class='touxiang-shuoming'>建议您上传500X500像素以上的正方形头像</div>" +
        "</div>" +
        "<div class='dialog-right'><div class='dialog-top'>" +
        "<div class='hang-div'>基本信息</div><div class='hang-div'>联系信息</div></div>" +
        "<div class='dialog-hang'>" +
        "<div class='hang-name'><span>姓名</span><input  type='text'/></div>" +
        "<div class='hang-name1'><span>手机</span><input id='shouji' type='text'/></div>" +
        "</div><div class='div-yanzheng'><div class='dialog-youze'></div><div id='shouji-yanzheng' class='dialog-youze1'></div></div>" +
        "<div class='dialog-hang'>" +
        "<div class='hang-name'><span>公司</span><input type='text'/></div>" +
        "<div class='hang-name1'><span>邮箱</span><input id='email' type='text'/></div>" +
        "</div><div class='div-yanzheng'><div class='dialog-youze'></div><div id='email-yanzheng'  class='dialog-youze1'></div></div>" +
        "<div class='dialog-hang'>" +
        "<div class='hang-name'><span>职位</span><input type='text'/></div>" +
        "<div class='hang-name1'><span>微信</span><input id='weixin' type='text'/></div>" +
        "</div><div class='div-yanzheng'><div class='dialog-youze'></div><div class='dialog-youze1'></div></div>" +
        "<div class='jieshao-wenzi'>自我介绍</div><form  method='post' onSubmit='return datacheck();'> <textarea name='Memo' style='+margin-left:30px;' rows='3' wrap=PHYSICAL cols='76' onKeyDown='gbcount(this.form.Memo,this.form.total,this.form.used,this.form.remain);' onKeyUp='gbcount(this.form.Memo,this.form.total,this.form.used,this.form.remain);'></textarea> <div class='shengyu'><input type='hidden' maxLength='4' name='total' size='3' value='60' class='inputtext1'> <input type='hidden' maxLength='4' name='used' size='3' value='0' class='inputtext'> <div style='float:left;+margin-left:8px;'>剩余字数:</div> <input  maxLength='4' disabled='true' name='remain'  value='60' class='inputtext1'></div></form> "+
        "<div class='dialog-baocun yuanjiao' id='dialog-baocun'>保 存</div>"+
        "</div></div>";




    layer.alert(content,{area:['820px', '530px'],title:'编辑个人信息'}, function(index){
        //do something

        layer.close(index);
    });

    $(".layui-layer-btn0").hide();


    $("#dialog-baocun").bind('click',function()
    {

        $(".layui-layer").remove();
        $(".layui-layer-shade").hide();
    });



}


//表单检验


$("#email").live('blur',function () {

    if($(this).val()!="")
    {

        var email = /^\w+@[a-z0-9-]+(\.[a-z]{2,6}){1,2}$/;
        if (email.test($("#emil").val())) {
            $("#email-yanzheng").text("");
        } else {

            $("#email-yanzheng").text("邮箱格式不正确!");


        }
    }
    else{

        $("#email-yanzheng").text("不能为空！");
    }

});



$("#shouji").live('blur',function () {

    if($(this).val()!="")
    {

        var reg = new RegExp("^1[3|5|7|8|][0-9]{9}$");
        if (reg.test($("#shouji").val())) {
            $("#shouji-yanzheng").text("");
        } else {

            $("#shouji-yanzheng").text("手机号码格式不正确!");


        }
    }
    else{

        $("#shouji-yanzheng").text("不能为空！");
    }

});



$(".hang-name input").live('blur',function()
{
    if($(this).val()=="")
    {
        $(this).parent().parent().next().children(".dialog-youze").text("不能为空!");
    }
    else
    {
        $(this).parent().parent().next().children(".dialog-youze").text("");
    }

});






    // 填写学历时候下拉框
    var ddl_picture1 = DropDownList.create({
        select : $('#xueli'),
        attrs : {
            column : 4,
            width : 62
        }
    });

    // 通过原生select控件创建自定义下拉框
    var ddl_picture2 = DropDownList.create({
        select : $('#xueyuan'),
        attrs : {
            column : 4,
            width : 132
        }
    });

    // 通过原生select控件创建自定义下拉框
    var ddl_picture3 = DropDownList.create({
        select : $('#nianfen'),
        attrs : {
            column : 4,
            width : 142
        }
    });






//日期控件
    laydate({elem: '#start'});//绑定元素
    laydate({elem: '#end'});//绑定元素
    laydate({elem: '#shijiandian'});//绑定元素



$(".un-select").live('click',function()
{
    $(this).hide();
    $(this).next().show();
});


$(".check-left").live('click',function()
{
    $(this).hide();
    $(this).prev().show();
});



var shijianParam=1;

$("#pro-tianjia").live('click',function ()
{
    var proValue=$("#project").val();

    if($("#project").attr("title")==1)
    {
        $("#add-project").before("<div class='duijie-project sleft'> <div class='dj-left'> <img src='../images/cheyu_chuanmei.png'/> </div><div class='dj-right'><div class='name-tou'><div class='company-name'>"+proValue+"</div> <div class='baocun-anniu'>保存</div><div class='apply-bianji'>编辑</div><div class='shanchu-anniu'>删除</div></div><div class='touziren'>投资人</div><div class='bianji'><div class='bianji-div'><div class='bianji-height'></div><div class='bianji-hang'><div class='bianji-wenzi'>公司名称</div><div><input value='"+proValue+"' type=''/></div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>职位</div><div><input type=''/></div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>开始时间</div><div><input placeholder='开始时间' class='shijian' id='start"+shijianParam+"' /></div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>结束时间</div><div class='shijian-div'><input class='shijian' placeholder='结束时间' id='end"+shijianParam+"'/></div><div class='zhijin-wenzi'>至今</div><div class='un-select no-select'></div><div class='check-left xuanze-left'></div></div><span class='span-yanzheng'></span></div></div></div> <div class='clear-both'></div> <div class='down-border'></div></div>");

        $("#project").attr("title","");
        $("#project").val("");


    }
    else
    {
        $("#add-project").before("<div class='duijie-project sleft'><div class='dj-left'><img src='../images/cheyu_chuanmei.png'/></div><div class='dj-right'><div class='name-tou'><div class='company-name'>"+proValue+"</div> <div class='baocun-anniu'>保存</div><div class='apply-bianji'>编辑</div><div class='shanchu-anniu'>删除</div></div><div class='touziren'>投资人</div><div class='bianji-meiyou'><div class='bianji-div'><div class='bianji-height'></div><div class='bianji-hang'><div class='bianji-wenzi'>公司名称</div><div><input value='"+proValue+"' type=''/></div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>投资时间</div><div><input placeholder='时间点' class='shijian' id='shijiandian' type=''/></div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>身份角色</div><div><select id='shenfen-juese"+shijianParam+"' class='yuanjiao'><option value='1'>角色1</option><option value='2'>角色2</option><option value='3'>角色3</option><option value='4'>角色4</option><option value='5'>角色5</option> </select></div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>项目阶段</div><div><select id='xiangmu-jieduan"+shijianParam+"' class='yuanjiao'><option value='1'>项目阶段1</option><option value='2'>项目阶段2</option><option value='3'>项目阶段3</option><option value='4'>项目阶段4</option><option value='5'>项目阶段5</option></select></div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>投资金额</div><div class='tou-jine'><input type=''/></div><div class='danwei'>万元</div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>本轮融资总额</div><div class='tou-jine'><input type=''/></div><div class='danwei'>万元</div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>融资前估值</div><div class='tou-jine'><input type=''/></div><div class='danwei'>万元</div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>是否成功退出</div><div><select id='shifou-tuichu"+shijianParam+"' class='yuanjiao'><option value='1'>是</option><option value='2'>否</option></select></div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>是否公开本次投资</div><div><select id='shifou-gongkai"+shijianParam+"' class='yuanjiao'><option value='1'>是</option><option value='2'>否</option></select></div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>创始人姓名</div><div><input type=''/></div></div><span class='span-yanzheng'></span><div class='bianji-hang1'><div class='bianji-wenzi'>创始人手机</div><div><input class='chuangshi-shouji' type=''/></div></div><span class='span-yanzheng'></span><div class='bianji-hang1'><div class='bianji-wenzi'>创始人邮箱</div><div><input class='chuangshi-email' type=''/></div></div><span class='span-yanzheng'></span></div></div></div><div class='clear-both'></div><div class='down-border'></div></div>");
        var shenfenJuese="shenfenJuese"+shijianParam;
        shenfenJuese = DropDownList.create({
            select : $('#shenfen-juese'+shijianParam),
            attrs : {
                column : 5,     // 只显示5行，超过以后显示滚动条
                height:36,
                width  : 210   // 指定下拉框宽度为150px
            }
        });

        var shifouTuichu="shifouTuichu"+shijianParam;
        shifouTuichu = DropDownList.create({
            select : $('#shifou-tuichu'+shijianParam),
            attrs : {
                column : 5,     // 只显示5行，超过以后显示滚动条
                height:36,
                width  : 210   // 指定下拉框宽度为150px
            }
        });


        var shifouGongkai="shifouGongkai"+shijianParam;
        shifouGongkai = DropDownList.create({
            select : $('#shifou-gongkai'+shijianParam),
            attrs : {
                column : 5,     // 只显示5行，超过以后显示滚动条
                height:36,
                width  : 210   // 指定下拉框宽度为150px
            }
        });

        var xiangmuJieduan="xiangmuJieduan"+shijianParam;
        xiangmuJieduan = DropDownList.create({
            select : $('#xiangmu-jieduan'+shijianParam),
            attrs : {
                column : 5,     // 只显示5行，超过以后显示滚动条
                height:36,
                width  : 210   // 指定下拉框宽度为150px
            }
        });



    }
    shijianParam++;


});



$(function() {
    var projects = [
        {
            label: "车语传媒",
            name: "张三",
            time:"2014-08-12",
            desc: "中国第一的中小企业股权众筹融资平台",
            icon: "../images/cheyu_chuanmei.png"
        },
        {
            label: "阿里巴巴",
            name: "李四",
            time:"2014-08-12",
            desc: "中国第一的中小企业股权众筹融资平台1",
            icon: "../images/cheyu_chuanmei.png"
        },
        {
            label: "大众传媒",
            name: "王五",
            time:"2014-08-12",
            desc: "中国第一的中小企业股权众筹融资平台2",
            icon: "../images/cheyu_chuanmei.png"
        }
    ];

    $( "#project" ).autocomplete({
        minLength: 0,
        source: projects,
        focus: function( event, ui ) {
            $( "#project" ).val( ui.item.label );
            return false;
        },
        select: function( event, ui ) {
            $( "#project" ).val( ui.item.label );
            $("#project").attr("title","1");
            return false;
        }
    })
        .data( "ui-autocomplete" )._renderItem = function( ul, item ) {
        return $( "<li>" ).append( "<div class='so-div'><div class='so-left'><img src='"+item.icon+"'></div><div class='so-right'><div class='so-name'>"+item.label+"</div><div class='so-biaoti'>"+item.desc+"</div><div class='so-xiangqing'><div class='so-touxiang'></div><div class='so-chuangjian'>项目创建人："+item.name+"</div><div class='so-shijian'></div><div class='so-riqi'>加入卡贝金融时间："+item.time+"</div></div></div>").appendTo( ul );
    };
});



$(".shanchu-anniu").live('click',function(){

    $(this).parent().parent().parent().remove();

});

$(".linian-shanchu").click(function(){

    $(".bianji-wenben").slideUp();
    $(this).hide();
    $(this).prev().hide();
    $(this).prev().prev().show();
    $(".touzi-linian").show();
    $(".tigong-jiazhi").show();
    $(".jiazhi-neirong").show();

});


$(".chuangshi-shouji").live('blur',function () {



    if($(this).val()!="")
    {

        var reg = new RegExp("^1[3|5|7|8|][0-9]{9}$");
        if (reg.test($(".chuangshi-shouji").val())) {
            $(this).parent().parent().next().text("");
        } else {

            $(this).parent().parent().next().text("手机号码格式不正确!");


        }
    }
    else{

        $(this).parent().parent().next().text("不能为空！");
    }

});

$(".chuangshi-email").live('blur',function () {

    if($(this).val()!="")
    {

        var email = /^\w+@[a-z0-9-]+(\.[a-z]{2,6}){1,2}$/;
        if (email.test($(".chuangshi-email").val())) {
            $(this).parent().parent().next().text("");
        } else {

            $(this).parent().parent().next().text("邮箱格式不正确!");


        }
    }
    else{

        $(this).parent().parent().next().text("不能为空！");
    }

});


$(".bianji-hang input").live('blur',function ()
{
    if($(this).val()=="")
    {
        $(this).parent().parent().next().text("不能为空！");
    }
    else
    {
        $(this).parent().parent().next().text("");
    }
});




//二维码
//二维码
$(".mywx").mouseenter(function (){
    $(this).css("cursor","pointer");
    $("#mycode").show();

});
$(".mywx").mouseleave(function (){
    $("#mycode").hide();

});
$("#code").qrcode({
    render: "table", //table方式
    width: 110, //宽度
    height:110, //高度
    text: "http://www.qq.com" //任意内容
});


//文本框输入字数限制
function checktext(text)
{
    allValid = true;
    for (i = 0; i < text.length; i++)
    {
        if (text.charAt(i) != " ")
        {
            allValid = false;
            break;
        }
    }
    return allValid;
}

function gbcount(message,total,used,remain)
{
    var max;
    max = total.value;
    if (message.value.length > max) {
        message.value = message.value.substring(0,max);
        used.value = max;
        remain.value = 0;
    }
    else {
        used.value = message.value.length;
        remain.value = max - used.value;
    }
}