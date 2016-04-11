// JavaScript Document
$("#user_name").blur(function(){
	   if($("#user_name").val() == ""){
		      $(this).parent().next().removeClass("display_none");
		      $(this).parent().next().find(".tips_span").html("不能为空");
		   }
	   $(".f").val("0");
	   var o = $(this);
	   $.ajax({
			url:'#',
			type: 'post',
			data: {name:$("#user_name").val()},
			dataType:"text",
			success: function(data, status){
				//if 不存在 {$(o).parent().next().children().eq(0).html("账号不存在");$(".f").val("0");}else {$(o).parent().next().addClass("display_none");$(".f").val("1");}
			},error: function(req, status){
				$(".f").val("0");
				$(o).parent().next().removeClass("display_none");
		        $(o).parent().next().find(".tips_span").html("系统错误！");
			}
		});
	});

$("#user_pwd").blur(function(){
	   if($("#user_pwd").val() == ""){
		      $(this).parent().next().removeClass("display_none");
		      $(this).parent().next().find(".tips_span").html("不能为空");
		   }
	   $(".f_").val("0");
	   var o = $(this);
	   $.ajax({
			url:'#',
			type: 'post',
			data: {name:$("#user_name").val(),pwd:$("#user_pwd").val()},
			dataType:"text",
			success: function(data, status){
				//if 不存在 {$(o).parent().next().children().eq(0).html("密码不正确");$(".f_").val("0");}else {$(o).parent().next().addClass("display_none");$(".f_").val("1");}
			},error: function(req, status){
				$(".f_").val("0");
				$(o).parent().next().removeClass("display_none");
		        $(o).parent().next().find(".tips_span").html("系统错误！");
			}
		});
	});

$(".account_btn").click(function(){
	   if($(".f").val() == "0" || $(".f_").val() == "0"){
		      return;
		   }
		$(".form1").attr("action","#");
		$(".form1").submit();
	});