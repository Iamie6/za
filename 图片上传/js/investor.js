
$(function(){
    layer.config({
        skin: 'layer-ext-mineskin',
        extend: ['skin/mineskin/style.css']
    });

})



$(".fasixin-wenzi").click(function()
{

    showdialog();

});



function showdialog(){
    var content=
        "<div class='sixindiyi'> " +
        "<div class='sixin-wenziyi'><span>*</span>收件人：</div>" +
        "<div class='wenziyi-input'><input type='text'/></div>" +
        "</div>" +
        "<div class='sixindier'>" +
        "<div class='sixin-wenziyi'><span>*</span>内容：</div>" +
        "<div class='wenzier-input'><input type='textarea'/></div>" +
        "</div>";




    layer.alert(content,{area:['660px', '300px'],title:'联系大卫·卡贝',btn: ['提交']}, function(index){
        //do something

        layer.close(index);
    });

    $(".layui-layer-btn0").css({"background":"#93c937","width":"80px","-moz-border-radius":"8px","-webkit-border-radius":"8px","border-radius":"8px"});

  


}





$(".jiaguanzhu").click(function ()
{

    var text=$(this).children(".jiaguanzhu-wenzi").text();

    if(text=="加关注")
    {
        $(this).children(".jiaguanzhu-wenzi").text("已关注");
        $(this).children(".touziren-jia").text("-");
        $(this).css("background","#8ec100");
    }
    else
    {
        $(this).children(".jiaguanzhu-wenzi").text("加关注");
        $(this).children(".touziren-jia").text("+");
        $(this).css("background","#ff5656");
    }
});



// 设定column和width
    var hangye = DropDownList.create({
        select : $('#hangye'),
        attrs : {
            column : 5,     // 只显示5行，超过以后显示滚动条
            height:36,
            width  : 140    // 指定下拉框宽度为150px
        }
    });

    var touziType = DropDownList.create({
        select : $('#touzi-type'),
        attrs : {
            column : 5,     // 只显示5行，超过以后显示滚动条
            height:36,
            width  : 140    // 指定下拉框宽度为150px
        }
    });





$(function(){

    $("#sjld").sjld("#shenfen","#chengshi");

});


window.onload = function (){

    $("#shenfen p").text("省份/地区");
    $("#chengshi p").text("城市");

}
