/**
 * Created by Administrator on 2015/6/15.
 */




var shenfenJuese = DropDownList.create({
    select : $('#shenfen-juese'),
    attrs : {
        column : 5,     // 只显示5行，超过以后显示滚动条
        height:36,
        width  : 214   // 指定下拉框宽度为150px
    }
});


var shifouTuichu = DropDownList.create({
    select : $('#shifou-tuichu'),
    attrs : {
        column : 5,     // 只显示5行，超过以后显示滚动条
        height:36,
        width  : 214   // 指定下拉框宽度为150px
    }
});


var shifouGongkai = DropDownList.create({
    select : $('#shifou-gongkai'),
    attrs : {
        column : 5,     // 只显示5行，超过以后显示滚动条
        height:36,
        width  : 214   // 指定下拉框宽度为150px
    }
});


var xiangmuJieduan = DropDownList.create({
    select : $('#xiangmu-jieduan'),
    attrs : {
        column : 5,     // 只显示5行，超过以后显示滚动条
        height:36,
        width  : 214   // 指定下拉框宽度为150px
    }
});






//输入校验

$(".input-biaozhun input").live('blur',function()
{

    if($(this).val()=="")
    {
        $(this).parent().parent().next(".yanzheng").text("不能为空！");
    }
    else
    {
        $(this).parent().parent().next(".yanzheng").text("");
    }

});



$(function(){

    $("#sjld").sjld("#shenfen","#chengshi");
    $("#sjld1").sjld("#shenfen1","#chengshi1");

});


window.onload = function (){

    $("#shenfen p").text("省份/地区");
    $("#chengshi p").text("城市");
    $("#shenfen1 p").text("省份/地区");
    $("#chengshi1 p").text("城市");

}



//日期控件
    laydate({elem: '#start'});//绑定元素

    laydate({elem: '#end'});//绑定元素

    laydate({elem: '#shijiandian'});//绑定元素








//添加团队信息

var paramCount=1;

$(".add-info").click(function()
{
    paramCount++;
    $(".add-info").before("<div class='jigou-biaodan'><div class='shangchuan'> <div class='input-qianmian'>上传头像<span>*</span></div> <div class='input-shangchuan'><input type='button'  onclick='path"+paramCount+".click()' class='mingpian-shangchuan'><input type='file' id='path"+paramCount+"' style='display:none'> </div> <div class='zhizhao'>*文件大小请勿超过8MB</div><div class='jigou-shanchu'>删除</div> </div> <div class='zhenshi-xingming biaodan-height'> <div class='input-qianmian'>真实姓名<span>*</span></div><div class='input-biaozhun'><input type='text'/></div> </div> <div class='yanzheng'></div> <div class='zhenshi-xingming'> <div class='input-qianmian'>联系方式<span>*</span></div><div class='input-biaozhun'><input type='text'/></div> </div> <div class='yanzheng'></div><div class='zhenshi-xingming'> <div class='input-qianmian'>邮箱<span>*</span></div><div class='input-biaozhun'><input type='text'/></div></div><div class='yanzheng'></div> <div class='zhenshi-xingming'> <div class='input-qianmian'>职位<span>*</span></div><div class='input-biaozhun'><input type='text'/></div> </div><div class='yanzheng'></div> <div class='zhenshi-xingming'> <div class='input-qianmian'>所在城市<span>*</span></div><div class='input-biaozhun'><div id='sjld"+paramCount+"' style='width:622px;height:36px;float:left;position:relative;'> <div class='m_zlxg yuanjiao' id='shenfen"+paramCount+"'> <p title=''>省份</p> <div class='m_zlxg2'> <ul></ul> </div> </div> <div class='m_zlxg yuanjiao' id='chengshi"+paramCount+"'> <p title=''>城市</p> <div class='m_zlxg2'> <ul></ul> </div> </div></div> </div> </div> <div class='miaoshu-div biaodan-height'> <div class='input-qianmian'>人员介绍<span>&nbsp;</span></div> <div class='input-miaoshu'> <textarea class='ziwo-miaoshu'></textarea> </div> </div></div>");
    $("#sjld"+paramCount).sjld("#shenfen"+paramCount,"#chengshi"+paramCount);
    $("#shenfen"+paramCount+" p").text("省份/地区");
    $("#chengshi1"+paramCount+"p").text("城市");
});


$(".baocun-anniu").live('click',function()
{
    $(this).parent().next().next().slideUp();
    $(this).hide();
    $(this).next().show();
    $(this).next().next().show();
});

$(".shanchu-anniu").live('click',function()
{
    $(this).parent().parent().parent().remove();
});

$(".apply-bianji").live('click',function()
{
    $(this).parent().next().next().slideDown();
    $(this).hide();
    $(this).prev().show();
    $(this).prev().prev().show();
});

// 设定column和width
var zhiwei = DropDownList.create({
    select : $('#ddl_picture'),
    attrs : {
        column : 5,     // 只显示5行，超过以后显示滚动条
        width  : 162    // 指定下拉框宽度为150px
    }
});


$(".jigou-shanchu").live("click",function()
{
    $(this).parent().parent().remove();
    paramCount--;
});








//进行下一个步骤显示

$("#fuwu-biaodan1").hide();
$("#fuwu-biaodan2").hide();

$("#liucheng").click(function()
{
    $("#fuwu-biaodan").hide();
    $("#fuwu-biaodan1").show();
    $(".liucheng-pic").hide();
    $(".liucheng-pic1").show();

});

$("#liucheng1").click(function()
{
    $("#fuwu-biaodan1").hide();
    $("#fuwu-biaodan2").show();
    $(".liucheng-pic1").hide();
    $(".liucheng-pic2").show();

});

$("#liucheng2").click(function()
{

});


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


$("#geren-input").click(function() {

    if($("#geren-input:checked").val()=="on")
    {
        $("#geren-kuang").slideDown();
        $("#danwei-kuang").hide();
    }
    else
    {
        $("#geren-kuang").hide();
        $("#danwei-kuang").slideDown();

    }


});

$("#jigou-input").click(function() {

    if($("#jigou-input:checked").val()=="on")
    {

        $("#geren-kuang").hide();
        $("#danwei-kuang").slideDown();

    }
    else
    {

        $("#geren-kuang").slideDown();
        $("#danwei-kuang").hide();

    }

});



var yijuhua = $('#yijuhua').val();

$('#yijuhua').focus(function() {
    //获得焦点时，如果值为默认值，则设置为空
    if ($(this).val() == yijuhua) {
        $(this).val("");
        $(this).css("color","#333333");
    }
});
$('#yijuhua').blur(function() {
    //失去焦点时，如果值为空，则设置为默认值
    if ($(this).val()== "") {
        $(this).val(yijuhua);
        $(this).css("color","#c4c4c4");
    }
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


var shijianParam=1;

$(".tianjia").click(function ()
{

    var proValue=$("#project").val();

    if($("#project").attr("title")==1)
    {
        $("#add-project").before("<div class='duijie-project'> <div class='dj-left'> <img src='../images/cheyu_chuanmei.png'/> </div><div class='dj-right'><div class='name-tou'><div class='company-name'>"+proValue+"</div> <div class='baocun-anniu'>保存</div><div class='apply-bianji'>编辑</div><div class='shanchu-anniu'>删除</div></div><div class='touziren'>投资人</div><div class='bianji'><div class='bianji-div'><div class='bianji-height'></div><div class='bianji-hang'><div class='bianji-wenzi'>公司名称</div><div><input value='"+proValue+"' type=''/></div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>职位</div><div><input type=''/></div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>开始时间</div><div><input placeholder='开始时间' class='shijian' id='start"+shijianParam+"' /></div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>结束时间</div><div class='shijian-div'><input class='shijian' placeholder='结束时间' id='end"+shijianParam+"'/></div><div class='zhijin-wenzi'>至今</div><div class='un-select no-select'></div><div class='check-left xuanze-left'></div></div><span class='span-yanzheng'></span></div></div></div> <div class='clear-both'></div> <div class='down-border'></div></div>");

        $("#project").attr("title","");
        $("#project").val("");

    }
    else
    {
        $("#add-project").before("<div class='duijie-project'><div class='dj-left'><img src='../images/cheyu_chuanmei.png'/></div><div class='dj-right'><div class='name-tou'><div class='company-name'>"+proValue+"</div> <div class='baocun-anniu'>保存</div><div class='apply-bianji'>编辑</div><div class='shanchu-anniu'>删除</div></div><div class='touziren'>投资人</div><div class='bianji-meiyou'><div class='bianji-div'><div class='bianji-height'></div><div class='bianji-hang'><div class='bianji-wenzi'>公司名称</div><div><input value='"+proValue+"' type=''/></div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>投资时间</div><div><input placeholder='时间点' class='shijian' id='shijiandian' type=''/></div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>身份角色</div><div><select id='shenfen-juese"+shijianParam+"' class='yuanjiao'><option value='1'>角色1</option><option value='2'>角色2</option><option value='3'>角色3</option><option value='4'>角色4</option><option value='5'>角色5</option> </select></div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>项目阶段</div><div><select id='xiangmu-jieduan"+shijianParam+"' class='yuanjiao'><option value='1'>项目阶段1</option><option value='2'>项目阶段2</option><option value='3'>项目阶段3</option><option value='4'>项目阶段4</option><option value='5'>项目阶段5</option></select></div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>投资金额</div><div class='tou-jine'><input type=''/></div><div class='danwei'>万元</div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>本轮融资总额</div><div class='tou-jine'><input type=''/></div><div class='danwei'>万元</div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>融资前估值</div><div class='tou-jine'><input type=''/></div><div class='danwei'>万元</div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>是否成功退出</div><div><select id='shifou-tuichu"+shijianParam+"' class='yuanjiao'><option value='1'>是</option><option value='2'>否</option></select></div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>是否公开本次投资</div><div><select id='shifou-gongkai"+shijianParam+"' class='yuanjiao'><option value='1'>是</option><option value='2'>否</option></select></div></div><span class='span-yanzheng'></span><div class='bianji-hang'><div class='bianji-wenzi'>创始人姓名</div><div><input type=''/></div></div><span class='span-yanzheng'></span><div class='bianji-hang1'><div class='bianji-wenzi'>创始人手机</div><div><input class='chuangshi-shouji' type=''/></div></div><span class='span-yanzheng'></span><div class='bianji-hang1'><div class='bianji-wenzi'>创始人邮箱</div><div><input class='chuangshi-email' type=''/></div></div><span class='span-yanzheng'></span></div></div></div><div class='clear-both'></div><div class='down-border'></div></div>");

        var shenfenJuese="shenfenJuese"+shijianParam;
        shenfenJuese = DropDownList.create({
            select : $('#shenfen-juese'+shijianParam),
            attrs : {
                column : 5,     // 只显示5行，超过以后显示滚动条
                height:36,
                width  : 214   // 指定下拉框宽度为150px
            }
        });

        var shifouTuichu="shifouTuichu"+shijianParam;
        shifouTuichu = DropDownList.create({
            select : $('#shifou-tuichu'+shijianParam),
            attrs : {
                column : 5,     // 只显示5行，超过以后显示滚动条
                height:36,
                width  : 214   // 指定下拉框宽度为150px
            }
        });


        var shifouGongkai="shifouGongkai"+shijianParam;
        shifouGongkai = DropDownList.create({
            select : $('#shifou-gongkai'+shijianParam),
            attrs : {
                column : 5,     // 只显示5行，超过以后显示滚动条
                height:36,
                width  : 214   // 指定下拉框宽度为150px
            }
        });

        var xiangmuJieduan="xiangmuJieduan"+shijianParam;
        xiangmuJieduan = DropDownList.create({
            select : $('#xiangmu-jieduan'+shijianParam),
            attrs : {
                column : 5,     // 只显示5行，超过以后显示滚动条
                height:36,
                width  : 214   // 指定下拉框宽度为150px
            }
        });



    }
    shijianParam++;


});


//表单验证
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

