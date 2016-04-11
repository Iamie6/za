// JavaScript Document
var choose_layer = "";
var choose_layer_ = "";
var role = "pro";
var num = 60;
var time = -1;
$(function(){
	   layer.config({
			skin: 'layer-ext-mineskin',
			extend: ['skin/mineskin/style.css']
		});
	})
$(".choose_way").children("div").click(function(){
	var content_str = "";
	var flag = 0;
	if($(this).index() == 0){
		   content_str = "您好，您选择的是“项目方”，注册成功后，您可以发布融资项目。“项目方”一旦选择，后续将不可变更。您是否确定？";
		   $(this).addClass("choose_way_left_curr");
		   flag = 0;
		   role = "pro";
		}else{
			  content_str = "您好，您选择的是“投资方”，注册成功后，您可以投资项目。“投资方”一旦选择，后续将不可变更。您是否确定？";
			  $(this).addClass("choose_way_left_curr_");
			  flag = 1;
			  role = "investor";
			}
    choose_layer = layer.confirm(content_str, {
		btn: ['确定','重新选择'],
		shade: [0.6,'#000000'],
		area: ['470px', '200px']
	}, function(){//确定
	    layer.close(choose_layer);
		$("#choose_way").addClass("display_none");
		$("#register_mobile").removeClass("display_none");
	}, function(){//重新选择
		layer.close(choose_layer);
		if(flag == 0){
			 $(".choose_way_left").removeClass("choose_way_left_curr");
			}else{
				 $(".choose_way_right").removeClass("choose_way_left_curr_");
				}
	});
});

$("#email_register").click(function(){
	   $("#register_mobile").find("input").val('');
	   $("#register_mobile").find("span[class*=name_tips]").addClass("display_none");
	   $("#register_mobile").find("span[class*=tips]").addClass("display_none");
	   $("#register_mobile").find("span[class*=code_btn]").removeClass("display_none");
	   $("#register_mobile").find("span[class*=code_btn_]").addClass("display_none");
	   $("#register_mobile").addClass("display_none");
	   $("#register_email").removeClass("display_none");
	});
$("#mobile_register").click(function(){
	   if(time != -1){
		      clearInterval(time);
		   }
	   $("#msg_info").text("60s后重新获取");
	   num = 60;
	   $("#register_email").find("input").val('');
	   $("#register_email").find("span[class*=name_tips]").addClass("display_none");
	   $("#register_email").find("span[class*=tips]").addClass("display_none");
	   $("#register_mobile").removeClass("display_none");
	   $("#register_email").addClass("display_none");
	});
$("#email_create_btn").click(function(){
	   $("#register_email").addClass("display_none");
	   if(role=="pro"){
		      $("#email_mobile_tab").html("创建我发的项目并开始融资");
		   }else{
			     $("#email_mobile_tab").html("申请成为认证投资人");
			   }
	   $("#second_step_email").removeClass("display_none");
	   //$("#register_email_success").removeClass("display_none");
	   
	});
$("#mobile_create_btn").click(function(){
	   $("#register_mobile").addClass("display_none");
	   if(role=="pro"){
		      $("#email_mobile_tab").html("创建我发的项目并开始融资");
		   }else{
			     $("#email_mobile_tab").html("申请成为认证投资人");
			   }
	   $("#register_email_success").removeClass("display_none");
	});
	
$("#your_name").blur(function(){
	    if($(this).val() == ""){
			   $(this).parent().next().find("span[class*=tips_span]").html("真实姓名不能为空");
			   $(this).parent().next().removeClass("display_none");
			   $(this).parent().parent().find("span[class*=name_tips]").addClass("display_none");
			}else{
				   $(this).parent().next().addClass("display_none");
				   $(this).parent().parent().find("span[class*=name_tips]").removeClass("display_none");
				}
	});
$("#e_your_name").blur(function(){
	    if($(this).val() == ""){
			   $(this).parent().next().find("span[class*=tips_span]").text("真实姓名不能为空");
			   $(this).parent().next().removeClass("display_none");
			   $(this).parent().parent().find("span[class*=name_tips]").addClass("display_none");
			}else{
				   $(this).parent().next().addClass("display_none");
				   $(this).parent().parent().find("span[class*=name_tips]").removeClass("display_none");
				}
	});

$("#your_mobile").blur(function(){
	    if($(this).val() == ""){
			   $(this).parent().parent().children().last().find(".tips_span").html("手机号码不能为空");
			   $(this).parent().parent().children().last().removeClass("display_none");
			   $(".register_email").addClass("display_none");
			}else{
				   var reg = new RegExp("^1[3|5|7|8|][0-9]{9}$");
				   if(!reg.test($(this).val())){
					       $(this).parent().parent().children().last().find(".tips_span").html("手机格式有误，请重新录入！");
						   $(this).parent().parent().children().last().removeClass("display_none");
						   $(".register_email").addClass("display_none");
					   }else{
						      $(".register_email").removeClass("display_none");
						      $(this).parent().parent().children().last().addClass("display_none");
						   }
				}
	});

$("#e_your_email").blur(function(){
	    if($(this).val() == ""){
			   $(this).parent().parent().children().last().find(".tips_span").html("不能为空");
			   $(this).parent().parent().children().last().removeClass("display_none");
			   $(".register_mobile").addClass("display_none");
			}else{
				   var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
				   if(!reg.test($(this).val())){
					       $(this).parent().parent().children().last().find(".tips_span").html("邮箱格式有误");
						   $(this).parent().parent().children().last().removeClass("display_none");
						   $(".register_mobile").addClass("display_none");
					   }else{
						      $(".register_mobile").removeClass("display_none");
						      $(this).parent().parent().children().last().addClass("display_none");
						   }
				}
	});

$("#your_pwd").blur(function(){
	    if($(this).val() == ""){
			   $(this).parent().next().find(".tips_span").html("密码为至少6位数据或字母");
			   $(this).parent().next().removeClass("display_none");
			}else{
				    var reg = new RegExp("^[0-9|a-z|A-Z]{6,}$");
					if($(this).val().length < 6){
					     $(this).parent().next().find(".tips_span").text("密码为至少6位数据或字母");
		                 $(this).parent().next().removeClass("display_none");
						 return;
					  }
					if(!reg.test($(this).val())){
						    $(this).parent().next().find(".tips_span").html("密码为至少6位数据或字母");
						    $(this).parent().next().removeClass("display_none");
						}else{
							   $(this).parent().next().addClass("display_none");
							}
				}
	});
	
$("#e_your_pwd").blur(function(){
	    if($(this).val() == ""){
			   $(this).parent().next().find("span[class*=tips_span]").html("密码需至少6位数字或字母");
			   $(this).parent().next().removeClass("display_none");
			}else{
				    var reg = new RegExp("^[0-9|a-z|A-Z]{6,}$");
					if($(this).val().length < 6){
					     $(this).parent().next().find("span[class*=tips_span]").text("密码需至少6位数字或字母");
		                 $(this).parent().next().removeClass("display_none");
						 return;
					  }
					if(!reg.test($(this).val())){
						    $(this).parent().next().find("span[class*=tips_span]").html("密码需至少6位数字或字母");
						    $(this).parent().next().removeClass("display_none");
						}else{
							   $(this).parent().next().addClass("display_none");
							}
				}
	});

$(".code_btn").click(function(){
	   if(time != -1){
		      clearInterval(time);
		   }
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

$(".register_btn").click(function(){
	    if(!$(".choose_way").children().eq(0).hasClass("choose_way_left_curr") && !$(".choose_way").children().eq(1).hasClass("choose_way_left_curr_")){
			    choose_layer_ = layer.confirm("请先选择您的注册身份！", {
					btn: ['确定','取消'],
					shade: [0.6,'#000000'],
					area: ['470px', '170px']
				}, function(){//确定
					layer.close(choose_layer_);
				}, function(){//重新选择
					layer.close(choose_layer_);
				});
			}
	});