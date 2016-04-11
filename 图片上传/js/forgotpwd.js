// JavaScript Document
var time = -1;
var num = 60;
$(function(){
	   layer.config({
			skin: 'layer-ext-mineskin',
			extend: ['skin/mineskin/style.css']
		});
	   $("input[type='radio']").eq(0).trigger("click");
	})
$("#next_btn").click(function(){
	   /*if($("#next_h").val() == "0"){
		       return;
		   }*/
	   $("#first_step").addClass("display_none");
	   if($("input[type='radio']").get(0).checked){
		      $("#second_step_mobile").removeClass("display_none");
		   }else{
			      $("#email").text($("#find_by_email_input").val());
				  //$("#email_link").attr("href","mailto:" + $("#find_by_email_input").val());
			      $("#second_step_email").removeClass("display_none");
			   }
	   $(".content_form_title_02").css("background-position","3px -398px");
	   $(".content_form_title_01").css("background-position","0px -354px");
	   
	});
$(".next_2_step").click(function(){
	   if($(".next_2_step").val() == "0"){
		      return;
		   }
	   $("#first_step").addClass("display_none");
	   if($("input[type='radio']").get(0).checked){
		      $("#second_step_mobile").addClass("display_none");
		   }else{
			      $("#second_step_email").addClass("display_none");
			   }
	   $("#third_step").removeClass("display_none");
	   $(".content_form_title_02").css("background-position","3px -260px");
	   $(".content_form_title_01").css("background-position","0px -354px");
	   $(".content_form_title_03").css("background-position","0px -444px");
	});
	
$("#sure_btn").click(function(){
	    layer.open({
			type: 1,
			title:'提示',
			shade: [0.6,'#000000'],
			shadeClose:true,
			area: ['470px', '260px'],
			content: '<div class="success_icon"></div><div class="success_title color_02">密码设置成功，请登录。</div>'
		});
	});
$("input[type='radio']").click(function(){
	    $("#next_h").val("0");
		if($(this).index("input[type='radio']") == 0){
			   $(".tips").addClass("display_none");
			   $("#find_by_mobile_input").removeAttr("disabled");
			   $("#find_by_email_input").attr("disabled",true);
			}else{
				   $(".tips").addClass("display_none");
				   $("#find_by_email_input").removeAttr("disabled");
				   $("#find_by_mobile_input").attr("disabled",true);
				}
		$("#first_step").find("input[type='text']").unbind("blur");
        $(this).parent().parent().next().find("input[type='text']").bind("blur",function(){
			 var param = "";
			 var u = "#";
			 if($(this).val()==""){
				    $(this).parent().next().removeClass("display_none");
					$(this).parent().next().find(".tips_span").html("不能为空");
					$("#next_h").val("0");
					return;
				 }
			 if($(this).attr("id") == "find_by_mobile_input"){
				    param = $("#find_by_mobile_input").val();
					u = "#";
				 }else{
					     param = $("#find_by_email_input").val();
						 u = "#";
					 }
			 var o = $(this);
			 $.ajax({
				url:u,
				type: 'post',
				data: {param:param},
				dataType:"text",
				success: function(data, status){
					//if 不存在 {$(o).parent().next().children().eq(0).html("账号不存在");$("#next_h").val("0");}else {$(o).parent().next().addClass("display_none");$("#next_h").val("1");}
				},error: function(req, status){
					$("#next_h").val("0");
					$(o).parent().next().removeClass("display_none");
					$(o).parent().next().children().eq(0).html("系统错误！");
				}
			 });
		     $(this).parent().next().removeClass("display_none");
	     });
	});
	
$("#f_code_input").blur(function(){
		if($(this).val() == ""){
			   $("#next_c").val("0");
			}
		/*clearInterval(time);
		num = 60;
		$(".code_btn_").text(num + "s后重新获取");
		$(".code_btn_").addClass("display_none");
		$(".code_btn").addClass("display_none");
		
		if($(this).val() == ""){
			   $(this).parent().find("span[class*='tips']").children().eq(0).text("验证码为空");
			   $(this).parent().find("span[class*='tips']").removeClass("display_none");
			}else{
				   $(this).parent().children("span")
				   $(this).parent().find("span[class*='tips']").addClass("display_none");
				}*/
	});
	
$(".code_btn").click(function(){
	   $(".code_btn").removeClass("display_none");
	   if(num > 0 ){
		      $(".code_btn").addClass("display_none");
			  $(".code_btn_").removeClass("display_none");
		   }
	   time = setInterval("updateTime()",1000);
	});

function updateTime(){
	   if(num <= 0 ){
			      clearInterval(time);
				  $(".code_btn").removeClass("display_none");
			      $(".code_btn_").addClass("display_none");
				  num = 60;
				  $(".code_btn_").text(num + "s后重新获取");
				  return;
			   }
	   num --;
	   $(".code_btn_").text(num + "s后重新获取");
	}

$("#reset_pwd").blur(function(){
	   if($(this).val() == ""){
		      $(this).parent().next().find(".tips_span").text("不能为空");
		      $(this).parent().next().removeClass("display_none");
		   }else{
			      var reg = new RegExp("^[0-9|a-z|A-Z]{6,}$");
				  if($(this).val().length < 6){
					     $(this).parent().next().find(".tips_span").text("密码至少6位");
		                 $(this).parent().next().removeClass("display_none");
						 return;
					  }
				  if(!reg.test($(this).val())){
						    $(this).parent().next().find(".tips_span").text("需数字或字母");
						    $(this).parent().next().removeClass("display_none");
						}else{
							   $(this).parent().next().addClass("display_none");
							}
			   }
	});
	
$("#re_reset_pwd").blur(function(){
	   if($(this).val() == ""){
		      $(this).parent().next().find(".tips_span").text("不能为空");
		      $(this).parent().next().removeClass("display_none");
			  return;
		   }else{
			      if($(this).val() != $("#reset_pwd").val()){
					   $(this).parent().next().find(".tips_span").text("密码不相同");
					   $(this).parent().next().removeClass("display_none");
					   return;
				   }
			   }
	   $(this).parent().next().addClass("display_none");
	});
