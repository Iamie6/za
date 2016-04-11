// JavaScript Document
var num = 0;
var f_id = 0;
var e_id = 0;
var members = '';
var education = "";
var work = "";
var licheng = "";
var s_n = 0;
var ddl2 = "0";
$(function(){
         members = $(".memubers").clone();
		 education = $(".education").clone();
		 licheng = $("#licheng_wrap").clone();
		 work = $(".work").clone();
		 
	    //项目阶段
	    var ddl1 = DropDownList.create({
			select : $("#pro_phase"),
			attrs : {
				column : 5,     
				width  : 340    
			}
		});
		
		//选择分类
	    ddl2 = DropDownList.create({
			select : $("#pro_classify"),
			attrs : {
				column : 5,     
				width  : 340    
			}
		});
		
		//项目成长历程
	    var ddl22 = DropDownList.create({
			select : $("#pro_chengzhang"),
			attrs : {
				column : 5,     
				width  : 300    
			}
		});
		
		//就读开始时间 年
	    var ddl3 = DropDownList.create({
			select : $("#education_start_y"),
			attrs : {
				column : 5,     
				width  : 54,
				height: 36   
			}
		});
		
		//就读开始时间 月
	    var ddl4 = DropDownList.create({
			select : $("#education_start_m"),
			attrs : {
				column : 5,     
				width  : 30,
				height: 36    
			}
		});
		
		//就读结束时间 年
	    var ddl5 = DropDownList.create({
			select : $("#education_end_y"),
			attrs : {
				column : 5,     
				width  : 54,
				height: 36
			}
		});
		
		//就读结束时间 月
	    var ddl6 = DropDownList.create({
			select : $("#education_end_m"),
			attrs : {
				column : 5,     
				width  : 30,
				height: 36    
			}
		});
		
		//学历
		var optionsData = [
			['请选择学历','000',true],     // 格式：[ text, value, selected ]，其中selected省略时为false
			['博士','002'],
			['硕士','003'],
			['本科','004']
		];
		var ddl7 = DropDownList.create({
			container : $('.degree'),    // 指定下拉框的容器，不设定时为document.body
			attrs : {
				id : 'degree_select',            // 指定一个id，必选
				column : 5,     // 只显示5行，超过以后显示滚动条
                width  : 121,    // 指定下拉框宽度为150px
				height:40
			},
			options : optionsData
		});
		
		//工作开始时间 年
		var ddl8 = DropDownList.create({
			select : $('#word_start_time_y'),    // 指定下拉框的容器，不设定时为document.body
			attrs : {
				column : 5,     // 只显示5行，超过以后显示滚动条
                width  : 54,    // 指定下拉框宽度为150px
				height:40
			}
		});
		//工作开始时间 月
		var ddl9 = DropDownList.create({
			select : $('#word_start_time_m'),    // 指定下拉框的容器，不设定时为document.body
			attrs : {
				column : 5,     // 只显示5行，超过以后显示滚动条
                width  : 30,    // 指定下拉框宽度为150px
				height:40
			}
		});
		//工作结束时间 年
		var ddl10 = DropDownList.create({
			select : $('#word_end_time_y'),    // 指定下拉框的容器，不设定时为document.body
			attrs : {
				column : 5,     // 只显示5行，超过以后显示滚动条
                width  : 54,    // 指定下拉框宽度为150px
				height:40
			}
		});
		//工作结束时间 年
		var ddl11 = DropDownList.create({
			select : $('#word_end_time_m'),    // 指定下拉框的容器，不设定时为document.body
			attrs : {
				column : 5,     // 只显示5行，超过以后显示滚动条
                width  : 30,    // 指定下拉框宽度为150px
				height:40
			}
		});
		
		//是否已成立公司
		var ddl12 = DropDownList.create({
			select : $('#iscreated'),    // 指定下拉框的容器，不设定时为document.body
			attrs : {
				column : 5,     // 只显示5行，超过以后显示滚动条
                width  : 338,    // 指定下拉框宽度为150px
				height:56
			}
		});
		
		//是否允许招募
		var ddl13 = DropDownList.create({
			select : $("#recruit"),
			attrs : {
				column : 5,     
				width  : 300    
			}
		});
	});
$("#recruit").change(function(){
	    if($(this).val() == 0){
			   $(this).parent().parent().next().css("display","none");
			}else{
				   $(this).parent().parent().next().css("display","block");
				}
	    
	});
$("#pro_classify").change(function(){
	    if(ddl2.val() == "0"){
			   $(this).parent().find("span[class*=tips]").removeClass("display_none");
			}else{
				   $(this).parent().find("span[class*=tips]").addClass("display_none");
				}
	    
	});

$("#step1_btn").click(function(){
	    $(".content_top_step").css("background-position","0px -58px");
	    $("#module_id").text("商业计划");
	    $("#step1").addClass("display_none");
		$("#step2").removeClass("display_none");
	});

$("#step2_btn").click(function(){
	    $(".content_top_step").css("background-position","0px -116px");
	    $("#module_id").text("盈利模式");
	    $("#step2").addClass("display_none");
		$("#step3").removeClass("display_none");
	});
	
$("#step3_btn").click(function(){
	    $(".content_top_step").css("background-position","0px -174px");
	    $("#module_id").text("团队信息");
	    $("#step3").addClass("display_none");
		$("#step4").removeClass("display_none");
	});
	
$("#step4_btn").click(function(){
	    $(".content_top_step").css("background-position","0px -232px");
	    $("#module_id").text("公司构架");
	    $("#step4").addClass("display_none");
		$("#step5").removeClass("display_none");
	});
	
$("#step5_btn").click(function(){
	    $(".content_top_step").css("background-position","0px -290px");
	    $("#module_id").text("融资要求");
	    $("#step5").addClass("display_none");
		$("#step6").removeClass("display_none");
	});
	
$("#step6_btn").click(function(){
	    $(".content").addClass("display_none");
		$(".success_tips").removeClass("display_none");
	});
	
//项目名称
$("#pro_name").focus(function(){
	   //$(this).parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#pro_name").blur(function(){
	   //$(this).parent().next().find("span[class*=dialog]").addClass("display_none");
	   var v = $(this).val();
	   if(v == ""){
		      $(this).next().text("不能为空");
		      $(this).next().removeClass("display_none");
		   }else if(v.length > 20){
			      $(this).next().text("请输入不超过20个字�?");
			      $(this).next().removeClass("display_none");
			   }else{
				      $(this).next().addClass("display_none");
				   }
	});
	
//一句话亮点
$("#pro_intro").focus(function(){
	   //$(this).parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#pro_intro").blur(function(){
	   //$(this).parent().next().find("span[class*=dialog]").addClass("display_none");
	   var v = $(this).val();
	   if(v == ""){
		      $(this).next().text("不能为空");
		      $(this).next().removeClass("display_none");
		   }else{
			      $(this).next().removeClass("display_none");
			   }
	});
	
//项目阶段
$("#pro_phase").focus(function(){
	   //$(this).parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#pro_phase").blur(function(){
	   //$(this).parent().next().find("span[class*=dialog]").addClass("display_none");
	   var v = $(this).val();
	   if(v == "0"){
		      $(this).next().text("请选择项目阶段");
		      $(this).next().removeClass("display_none");
		   }else{
			      $(this).next().removeClass("display_none");
			   }
	});
	
//团队人数
$("#team_num").focus(function(){
	   //$(this).parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#team_num").blur(function(){
	   //$(this).parent().next().find("span[class*=dialog]").addClass("display_none");
	   var v = $(this).val();
	   if(v == ""){
		      $(this).next().text("请填写大于0的整数");
		      $(this).next().removeClass("display_none");
			  return;
		   }
	   if(isNaN($(this).val())){
		      $(this).next().text("请填写大于0的整数");
		      $(this).next().removeClass("display_none");
			  return;
		   }
	   if($(this).val().indexOf(".") != -1){
		      $(this).next().text("请填写大于0的整数");
		      $(this).next().removeClass("display_none");
			  return;
		   }
	   if(new Number(v) <= 0){
			      $(this).next().text("请填写大于0的整数");
		          $(this).next().removeClass("display_none");
				  return;
		    }	      
	   $(this).next().addClass("display_none");
	});
	
//视频介绍
/*$("#pro_video_intro").focus(function(){
	   $(this).parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#pro_video_intro").blur(function(){
	   $(this).parent().next().find("span[class*=dialog]").addClass("display_none");
	});*/
	
//用户需求
$("#user_need").focus(function(){
	   $(this).parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#user_need").blur(function(){
	   //$(this).parent().next().find("span[class*=dialog]").addClass("display_none");
	   var v = $(this).val();
	   if(v == ""){
		      $(this).next().text("不能为空");
		      $(this).next().removeClass("display_none");
		   }else{
				      $(this).next().addClass("display_none");
				   }
	});
	
//解决方案
$("#solution").focus(function(){
	   //$(this).parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#solution").blur(function(){
	   //$(this).parent().next().find("span[class*=dialog]").addClass("display_none");
	   var v = $(this).val();
	   if(v == ""){
		      $(this).next().text("不能为空");
		      $(this).next().removeClass("display_none");
		   }else{
				      $(this).next().addClass("display_none");
				   }
	});
	
//方案优势
$("#pro_advantage").focus(function(){
	   //$(this).parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#pro_advantage").blur(function(){
	   //$(this).parent().next().find("span[class*=dialog]").addClass("display_none");
	   var v = $(this).val();
	   if(v == ""){
		      $(this).next().text("不能为空");
		      $(this).next().removeClass("display_none");
		   }else{
				      $(this).next().addClass("display_none");
				   }
	});
	
//收入来源
$("#income_source").focus(function(){
	   //$(this).parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#income_source").blur(function(){
	   //$(this).parent().next().find("span[class*=dialog]").addClass("display_none");
	   var v = $(this).val();
	   if(v == ""){
		      $(this).next().text("不能为空");
		      $(this).next().removeClass("display_none");
		   }else{
				      $(this).next().addClass("display_none");
				   }
	});
	
//成本构成添加
$("#cost_add_btn").click(function(){
	   $(this).parent().parent().children("li[class!=add]").last().after('<li><span><input class="cost_input" type="text" placeholder="主要成本和费用"/></span><span style="width:24px;height:33px;border:0px;"></span><span><input class="money_input" type="text" placeholder="金额"/><div class="unit_label">万元</div></span><div class="del_span">删除</div></li>');
	   $(this).parent().parent().children("li[class!=add]").last().find(".del_span").click(function(){
		   $(this).parent().remove();
		});
	});
$(".del_span").click(function(){
	   $(this).parent().remove();
	});
	
$(".money_input").blur(function(){
	   if(isNaN($(this).val())){
		      $(this).val("");
		   }
	});
$(".money_input_01").blur(function(){
	   if(isNaN($(this).val())){
		      $(this).val("");
		   }
	});
step4Event();
function step4Event(){
	    //真实姓名
		$(".real_name_input").focus(function(){
			   //$(this).parent().next().find("span[class*=dialog]").removeClass("display_none");
			});
		$(".real_name_input").blur(function(){
			   //$(this).parent().next().find("span[class*=dialog]").addClass("display_none");
			   var v = $(this).val();
			   if(v == ""){
					  $(this).next().text("不能为空");
					  $(this).next().removeClass("display_none");
				   }else{
							  $(this).next().addClass("display_none");
						   }
			});
		
		//职位
		$(".position").focus(function(){
			   //$(this).parent().next().find("span[class*=dialog]").removeClass("display_none");
			});
		$(".position").blur(function(){
			   //$(this).parent().next().find("span[class*=dialog]").addClass("display_none");
			   var v = $(this).val();
			   if(v == ""){
					  $(this).next().text("不能为空");
					  $(this).next().removeClass("display_none");
				   }else{
							  $(this).next().addClass("display_none");
						   }
			});
		
		//人员介绍
		/*$(".person_intro").focus(function(){
			   $(this).parent().next().find("span[class*=dialog]").removeClass("display_none");
			});
		$(".person_intro").blur(function(){
			   $(this).parent().next().find("span[class*=dialog]").addClass("display_none");
			});*/
	}

	
//教育经历
//gxg
$(".education_add_btn").click(function(){
	    f_id ++;
	    var s = $(education).clone();
	    $(s).find("#education_start_y").attr("id","education_start_y" + f_id);
		$(s).find("#education_start_m").attr("id","education_start_m" + f_id);
		$(s).find("#education_end_y").attr("id","education_end_y" + f_id);
		$(s).find("#education_end_m").attr("id","education_end_m" + f_id);
		$(s).addClass("margin_top_9");
		$(s).find(".degree").attr("class","degree" + f_id);
		$(s).find(".del_").addClass("work_del_tips");
		
		
 
		 $(this).parent().prev().after($(s).prop("outerHTML"));
		 //avar o = $(".education").last();
		 var o = $(this).parent().prev();
		 createEducationSelect(o);
		 /*$("#step4 .education").last().find(".work_del_tips").click(function(){
			    $(this).parent().remove();
			 });*/
		$(this).parent().prev().find(".work_del_tips").click(function(){
					$(this).parent().remove();
				 });
	});
function createEducationSelect(o){
	    //就读开始时间 年
	    DropDownList.create({
			select : $(o).find("#education_start_y" + f_id),
			attrs : {
				column : 5,     
				width  : 54,
				height: 36   
			}
		});
		
		//就读开始时间 月
	    DropDownList.create({
			select : $(o).find("#education_start_m" + f_id),
			attrs : {
				column : 5,     
				width  : 30,
				height: 36    
			}
		});
		
		//就读结束时间 年
	    DropDownList.create({
			select : $(o).find("#education_end_y" + f_id),
			attrs : {
				column : 5,     
				width  : 54,
				height: 36
			}
		});
		
		//就读结束时间 月
	    DropDownList.create({
			select : $(o).find("#education_end_m" + f_id),
			attrs : {
				column : 5,     
				width  : 30,
				height: 36    
			}
		});
		
		//学历
		var optionsData = [
			['请选择学历','000',true],     // 格式：[ text, value, selected ]，其中selected省略时为false
			['博士','002'],
			['硕士','003'],
			['本科','004']
		];
		DropDownList.create({
			container : $(o).find(".degree" + f_id),    // 指定下拉框的容器，不设定时为document.body
			attrs : {
				id : 'degree_select' + f_id,            // 指定一个id，必选
				column : 5,     // 只显示5行，超过以后显示滚动条
                width  : 160,    // 指定下拉框宽度为150px
				height:40
			},
			options : optionsData
		});
		//删除事件
		
	}

	
//添加成员
/*$("#add_group_menuber").click(function(){
	   var o = $(".memubers_01").eq(0).clone(true,false);
	   $(o).addClass("margin_top_20").removeClass("memubers_01");
	   $("#step4 .memubers").last().after($(o));
	   $(o).find(".education_del").click(function(){
			    $(this).parent().remove();
			 });
	   $(o).find(".work_del_btn").click(function(){
		       $(this).parent().remove();
		   });
	   step4Event01(o);
	   $(o).find(".work_add_btn").click(function(){alert(0);
		   var obj = $("#step4 .work_01").eq(0).clone(true,false);
		   $(obj).addClass("margin_top_20").removeClass("work_01");
		   $(obj).find(".work_del_tips").addClass("work_del_btn");
		   $(this).parent().prev().after(obj);
		   $(obj).find(".work_del_btn").click(function(){
				   $(this).parent().remove();
			   });
		});
	   $(o).find(".education_add_btn").click(function(){
			var s = '<div class="float_left border_css education margin_top_9 mouse_over_border"><span class="education_span margin_top_20">'+
							   '<span class="education_span_cell_left float_left">专业名称&nbsp;&nbsp;</span>'+
							   '<span class="education_span_cell_center border_css float_left border_radius_5">'+
								   '<input type="text" class="border_radius_5"/>'+
							   '</span>'+
						   '</span>'+
						   '<span class="education_span margin_top_20">'+
							   '<span class="education_span_cell_left float_left">学校名称&nbsp;&nbsp;</span>'+
							   '<span class="education_span_cell_center border_css float_left border_radius_5">'+
								   '<input type="text" class="border_radius_5"/>'+
							   '</span>'+
						   '</span>'+
						   '<span class="education_span margin_top_20">'+
							   '<span class="education_span_cell_left float_left">就读时间&nbsp;&nbsp;</span>'+
							   '<span class="attend_time">'+
								   '<table border="0" cellpadding="0" cellspacing="0">'+
									  '<tr>'+
										  '<td>'+
											 '<select id="education_start_y" class="border_css float_left border_radius_5">'+
												  '<option>1</option>'+
												  '<option>1</option>'+
												  '<option>1</option>'+
											  '</select>'+
										  '</td>'+
										  '<td>'+
											 '<select id="education_start_m" class="border_css float_left border_radius_5">'+
												  '<option>1</option>'+
												  '<option>1</option>'+
												  '<option>1</option>'+
											   '</select>'+
										  '</td>'+
										  '<td>'+
											 '<span class="float_left" style="text-align:center;width:16px;height:36px;line-height:36px;display:block;">-</span>'+
										  '</td>'+
										  '<td>'+
											 '<select id="education_end_y" class="border_css float_left border_radius_5">'+
												  '<option>1</option>'+
												  '<option>1</option>'+
												  '<option>1</option>'+
											   '</select>'+
										  '</td>'+
										  '<td>'+
											 '<select id="education_end_m" class="border_css float_left border_radius_5">'+
												  '<option>1</option>'+
												  '<option>1</option>'+
												  '<option>1</option>'+
											   '</select>'+
										  '</td>'+
									  '</tr>'+
								   '</table>'+
							   '</span>'+
						   '</span>'+
						   '<span class="education_span margin_top_20">'+
							   '<span class="education_span_cell_left float_left">学历&nbsp;&nbsp;</span>'+
							   '<span class="degree">'+
								   '<select class="border_css float_left border_radius_5">'+
									  '<option>1</option>'+
									  '<option>1</option>'+
									  '<option>1</option>'+
								   '</select>'+
							   '</span>'+
						   '</span>'+
						   '<span class="pro_name_tips tips text_align_right cursor_p education_del">点击此处删除&nbsp;&nbsp;</span>'+
					   '</div>';
			 $(this).parent().prev().after(s);
			 $(this).parent().prev().find(".education_del").click(function(){
					$(this).parent().remove();
				 });
		});
		
	});*/
	//gxg
$("#add_group_menuber").click(function(){
	    f_id ++;
	    var s = $(members).clone();
	    $(s).find("input[type=file]").attr("id","file_touxiang_btn" + f_id);
		$(s).find("span[class=choose_file]").click(function(){
			    $("#file_touxiang_btn" + f_id).get(0).click();
			});
		
		$(s).find("#team_sjld").attr("id","team_sjld" + f_id);
		$(s).find("#team_shenfen").attr("id","team_shenfen" + f_id);
		$(s).find("#team_chengshi").attr("id","team_chengshi" + f_id);
		$(s).find("#education_start_y").attr("id","education_start_y" + f_id);
		$(s).find("#education_start_m").attr("id","education_start_m" + f_id);
		$(s).find("#education_end_y").attr("id","education_end_y" + f_id);
		$(s).find("#education_end_m").attr("id","education_end_m" + f_id);
		$(s).find(".degree").attr("class","degree" + f_id);
		
		$(s).find("#word_start_time_y").attr("id","word_start_time_y" + f_id);
		$(s).find("#word_start_time_m").attr("id","word_start_time_m" + f_id);
		$(s).find("#word_end_time_y").attr("id","word_end_time_y" + f_id);
		$(s).find("#word_end_time_m").attr("id","word_end_time_m" + f_id);
		
		
		$("#step4 .memubers").last().after($(s).prop("outerHTML"));
		$("#team_sjld" + f_id).sjld("#team_shenfen" + f_id,"#team_chengshi" + f_id);
        $("#team_shenfen" + f_id +" p").text("省份/地区");
        $("#team_chengshi" + f_id +" p").text("城市");
		DropDownList.create({
			select : $("#education_start_y" + f_id),
			attrs : {
				column : 5,     
				width  : 54,
				height: 36   
			}
		});
		
		//就读开始时间 月
	    DropDownList.create({
			select : $("#education_start_m" + f_id),
			attrs : {
				column : 5,     
				width  : 30,
				height: 36    
			}
		});
		
		//就读结束时间 年
	    DropDownList.create({
			select : $("#education_end_y" + f_id),
			attrs : {
				column : 5,     
				width  : 54,
				height: 36
			}
		});
		
		//就读结束时间 月
	    DropDownList.create({
			select : $("#education_end_m" + f_id),
			attrs : {
				column : 5,     
				width  : 30,
				height: 36    
			}
		});
		//学历
		var optionsData1 = [
			['请选择学历','000',true],     // 格式：[ text, value, selected ]，其中selected省略时为false
			['博士','002'],
			['硕士','003'],
			['本科','004']
		];
		DropDownList.create({
			container : $(".degree" + f_id),    // 指定下拉框的容器，不设定时为document.body
			attrs : {
				id : 'degree_select' + f_id,            // 指定一个id，必选
				column : 5,     // 只显示5行，超过以后显示滚动条
                width  : 130,    // 指定下拉框宽度为150px
				height:40
			},
			options : optionsData1
		});
		
		 DropDownList.create({
			select : $("#word_start_time_y" + f_id),
			attrs : {
				column : 5,     
				width  : 30,
				height: 36    
			}
		});
		DropDownList.create({
			select : $("#word_start_time_m" + f_id),
			attrs : {
				column : 5,     
				width  : 30,
				height: 36    
			}
		});
		DropDownList.create({
			select : $("#word_end_time_y" + f_id),
			attrs : {
				column : 5,     
				width  : 30,
				height: 36    
			}
		});
		DropDownList.create({
			select : $("#word_end_time_m" + f_id),
			attrs : {
				column : 5,     
				width  : 30,
				height: 36    
			}
		});
		
		//$(".education_add_btn").click(function(){
		$(this).parent().prev().find(".education_add_btn").click(function(){
			f_id++;
			var s = $(education).clone();
			$(s).find("#education_start_y").attr("id","education_start_y" + f_id);
			$(s).find("#education_start_m").attr("id","education_start_m" + f_id);
			$(s).find("#education_end_y").attr("id","education_end_y" + f_id);
			$(s).find("#education_end_m").attr("id","education_end_m" + f_id);
			$(s).addClass("margin_top_9");
			$(s).find(".degree").attr("class","degree" + f_id);
			$(s).find(".del_").addClass("work_del_tips");
			
			
	 
			 $(this).parent().prev().after($(s).prop("outerHTML"));
			 //var o = $(".education").last();
			 var o = $(this).parent().prev();
			 createEducationSelect(o);
			 /*$("#step4 .education").last().find(".work_del_tips").click(function(){
					$(this).parent().remove();
				 });*/
			 $(this).parent().prev().find(".work_del_tips").click(function(){
					$(this).parent().remove();
				 });
		});
		//$(".work_add_btn").click(function(){
		$(this).parent().prev().find(".work_add_btn").click(function(){
			f_id ++;
			var s = $(work).clone();
			$(s).find("#word_start_time_y").attr("id","word_start_time_y" + f_id);
			$(s).find("#word_start_time_m").attr("id","word_start_time_m" + f_id);
			$(s).find("#word_end_time_y").attr("id","word_end_time_y" + f_id);
			$(s).find("#word_end_time_m").attr("id","word_end_time_m" + f_id);
			$(s).addClass("margin_top_9");
			$(s).find(".del_").addClass("work_del_tips");
			
			
	 
			 $(this).parent().prev().after($(s).prop("outerHTML"));
			 //var o = $(".work").last();
			 var o = $(this).parent().prev();
			 createWorkSelect(o);
			 /*$("#step4 .work").last().find(".work_del_tips").click(function(){
					$(this).parent().remove();
				 });*/
		     $(this).parent().prev().find(".work_del_tips").click(function(){
					$(this).parent().remove();
				 });
		});
	});

function step4Event01(o){
	    //真实姓名
		$(o).find(".real_name_input").focus(function(){
			   $(this).parent().next().find("span[class*=dialog]").removeClass("display_none");
			});
		$(o).find(".real_name_input").blur(function(){
			   $(this).parent().next().find("span[class*=dialog]").addClass("display_none");
			   var v = $(this).val();
			   if(v == ""){
					  $(this).next().text("不能为空");
					  $(this).next().removeClass("display_none");
				   }else{
							  $(this).next().addClass("display_none");
						   }
			});
		
		//职位
		$(o).find(".position").focus(function(){
			   $(this).parent().next().find("span[class*=dialog]").removeClass("display_none");
			});
		$(o).find(".position").blur(function(){
			   $(this).parent().next().find("span[class*=dialog]").addClass("display_none");
			   var v = $(this).val();
			   if(v == ""){
					  $(this).next().text("不能为空");
					  $(this).next().removeClass("display_none");
				   }else{
							  $(this).next().addClass("display_none");
						   }
			});
		
		//人员介绍
		$(o).find(".person_intro").focus(function(){
			   $(this).parent().next().find("span[class*=dialog]").removeClass("display_none");
			});
		$(o).find(".person_intro").blur(function(){
			   $(this).parent().next().find("span[class*=dialog]").addClass("display_none");
			});
	}
	
//工作经历添加
//gxg
$(".work_add_btn").click(function(){
	    f_id ++;
	    var s = $(work).clone();
	    $(s).find("#word_start_time_y").attr("id","word_start_time_y" + f_id);
		$(s).find("#word_start_time_m").attr("id","word_start_time_m" + f_id);
		$(s).find("#word_end_time_y").attr("id","word_end_time_y" + f_id);
		$(s).find("#word_end_time_m").attr("id","word_end_time_m" + f_id);
		$(s).addClass("margin_top_9");
		$(s).find(".del_").addClass("work_del_tips");
		
		
 
		 $(this).parent().prev().after($(s).prop("outerHTML"));
		 //var o = $(".work").last();
		 var o = $(this).parent().prev();
		 createWorkSelect(o);
		 /*$("#step4 .work").last().find(".work_del_tips").click(function(){
			    $(this).parent().remove();
			 });*/
		$(this).parent().prev().find(".work_del_tips").click(function(){
					$(this).parent().remove();
				 });
	});
function createWorkSelect(o){
	    DropDownList.create({
			select : $(o).find("#word_start_time_y" + f_id),
			attrs : {
				column : 5,     
				width  : 54,
				height: 36   
			}
		});
		
		//就读开始时间 月
	    DropDownList.create({
			select : $(o).find("#word_start_time_m" + f_id),
			attrs : {
				column : 5,     
				width  : 30,
				height: 36    
			}
		});
		
		//就读结束时间 年
	    DropDownList.create({
			select : $(o).find("#word_end_time_y" + f_id),
			attrs : {
				column : 5,     
				width  : 54,
				height: 36
			}
		});
		
		//就读结束时间 月
	    DropDownList.create({
			select : $(o).find("#word_end_time_m" + f_id),
			attrs : {
				column : 5,     
				width  : 30,
				height: 36    
			}
		});
	}


$("#iscreated").change(function(){
	   if($(this).val() == 0){
		      $(".step5_content").addClass("display_none");
		   }else{
			      $(".step5_content").removeClass("display_none");
			   }
	});

//公司名称
$("#company_name").focus(function(){
	   $(this).parent().parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#company_name").blur(function(){
	   $(this).parent().parent().next().find("span[class*=dialog]").addClass("display_none");
	   if($(this).val() == ""){
		       $(this).parent().next().removeClass("display_none");
		   }else{
			      $(this).parent().next().addClass("display_none");
			   }
	});

//创建时间
$("#create_time").focus(function(){
	   $(this).parent().parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#create_time").blur(function(){
	   $(this).parent().parent().next().find("span[class*=dialog]").addClass("display_none");
	   if($(this).val() == ""){
		       $(this).parent().next().text("不能为空");
		       $(this).parent().next().removeClass("display_none");
		   }else{
			      var v = $(this).val();
				  var v1 = v.split("-");
				  alert("v1.length= " + v1.length);
				  if(v1.length != 3){
					     alert(0);
					     $(this).parent().next().text("格式不正确");
		                 $(this).parent().next().removeClass("display_none");
						 return;
					  }
				  if( isNaN(v1[0]) || isNaN(v1[1]) ||  isNaN(v1[2]) ){
					      alert(1);
					      $(this).parent().next().text("格式不正确");
		                  $(this).parent().next().removeClass("display_none");
						  return;
					  }
				  if(new Number(v1[0]) <= 1949 || new Number(v1[0]) >= new Date().getFullYear() || new Number(v1[1]) <= 0 || new Number(v1[1]) > 12 || new Number(v1[2]) <= 0 || new Number(v1[1]) > 31){
					      alert(2);
						  $(this).parent().next().text("格式不正确");
		                  $(this).parent().next().removeClass("display_none");
						  return;
					  }
				  if(v1[0].length != 4 || v1[1].length != 2 ||  v1[2].length != 2){
					      alert(3);
						  $(this).parent().next().text("格式不正确");
		                  $(this).parent().next().removeClass("display_none");
						  return;
					  }
			      $(this).parent().next().removeClass("display_none");
			   }
	});

//	注册资本
$("#registered_capital").focus(function(){
	   $(this).parent().parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#registered_capital").blur(function(){
	   $(this).parent().parent().next().find("span[class*=dialog]").addClass("display_none");
	   if($(this).val()==""){
		     $(this).val(0);
			 return;
		   }
	   if(isNaN($(this).val())){
		      $(this).val(0);
		   }else if(new Number($(this).val()) < 0){
			     $(this).val(0);
			   }
	});

//法人代表
$("#legal_person").focus(function(){
	   $(this).parent().parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#legal_person").blur(function(){
	   $(this).parent().parent().next().find("span[class*=dialog]").addClass("display_none");
	   if($(this).val()==""){
		     $(this).parent().next().removeClass("display_none");
			 return;
		   }
	   $(this).parent().next().addClass("display_none");
	});
	
//股权新增
$(".guquan_add").click(function(){
	   var s = '<li>'+
                              '<span>'+
                                  '<input class="cost_input" type="text" placeholder="主要成本和费用"/>'+
                              '</span> '+
                              '<span style="width:24px;height:33px;border:0px;"></span>'+
                              '<span>'+
                                 '<input class="money_input" type="text" placeholder="金额"/>'+
                                 '<div class="unit_label">万元</div>'+
                              '</span>'+
                              '<div class="del_span">删除</div>'+
                          '</li>';
	  $(this).parent().before(s);
	  $(".del_span").click(function(){
		   $(this).parent().remove();
		});
	});

//融资要求
$("#funding").focus(function(){
	   $(this).parent().parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#funding").blur(function(){
	   $(this).parent().parent().next().find("span[class*=dialog]").addClass("display_none");
	   if($(this).val()==""){
		     $(this).parent().next().removeClass("display_none");
			 return;
		   }
	   if(isNaN($(this).val())){
		     $(this).parent().next().removeClass("display_none");
			 return;
		   }
	   if(new Number($(this).val()) < 1){
		     $(this).parent().next().removeClass("display_none");
			 return;
		   }
	   $(this).parent().next().addClass("display_none");
	});
	
//出让股份
$("#stock").focus(function(){
	   $(this).parent().parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#stock").blur(function(){
	   $(this).parent().parent().next().find("span[class*=dialog]").addClass("display_none");
	   if($(this).val()==""){
		     $(this).parent().next().removeClass("display_none");
			 return;
		   }
	   if(isNaN($(this).val())){
		     $(this).parent().next().removeClass("display_none");
			 return;
		   }
	   if(new Number($(this).val()) < 1){
		     $(this).parent().next().removeClass("display_none");
			 return;
		   }
	   $(this).parent().next().addClass("display_none");
	});
	
//每人最低投资金额
$("#stock_01").focus(function(){
	   $(this).parent().parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#stock_01").blur(function(){
	   $(this).parent().parent().next().find("span[class*=dialog]").addClass("display_none");
	   if($(this).val()==""){
		     $(this).parent().next().removeClass("display_none");
			 return;
		   }
	   if(isNaN($(this).val())){
		     $(this).parent().next().removeClass("display_none");
			 return;
		   }
	   if(new Number($(this).val()) < 1){
		     $(this).parent().next().removeClass("display_none");
			 return;
		   }
	   $(this).parent().next().addClass("display_none");
	});
	
//最低门槛
$("#stock_02").focus(function(){
	   $(this).parent().parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#stock_02").blur(function(){
	   $(this).parent().parent().next().find("span[class*=dialog]").addClass("display_none");
	   if($(this).val()==""){
		     $(this).parent().next().removeClass("display_none");
			 return;
		   }
	   if(isNaN($(this).val())){
		     $(this).parent().next().removeClass("display_none");
			 return;
		   }
	   if(new Number($(this).val()) < 1){
		     $(this).parent().next().removeClass("display_none");
			 return;
		   }
	   $(this).parent().next().addClass("display_none");
	});
	
//招募金额
$("#stock_03").focus(function(){
	   $(this).parent().parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#stock_03").blur(function(){
	   $(this).parent().parent().next().find("span[class*=dialog]").addClass("display_none");
	   if($(this).val()==""){
		     $(this).val("1");
			 return;
		   }
	   if(isNaN($(this).val())){
		     $(this).val("1");
			 return;
		   }
	   if(new Number($(this).val()) < 1){
		     $(this).val("1");
			 return;
		   }
	});
	
//招募金额
$("#purpose").focus(function(){
	   $(this).parent().next().find("span[class*=dialog]").removeClass("display_none");
	});
$("#purpose").blur(function(){
	   $(this).parent().next().find("span[class*=dialog]").addClass("display_none");
	   if($(this).val()==""){
		     $(this).next().removeClass("display_none");
			 return;
		   }
	   $(this).next().addClass("display_none");
	});
	
$(".help_icon").mouseover(function(){
	   $(this).next().removeClass("display_none");
	});
$(".help_icon").mouseout(function(){
	   $(this).next().addClass("display_none");
	});
	
$("#licheng_add_btn").click(function(){
	   var o = $(licheng).clone();
	   $(o).find("#pro_chengzhang").attr("id","pro_chengzhang" + s_n);
	   $(o).addClass("margin_top_9");
	   $(this).parent().prev().after($(o).prop("outerHTML"));
	   DropDownList.create({
			select : $("#pro_chengzhang" + s_n),
			attrs : {
				column : 5,     
				width  : 340    
			}
		});
	   s_n++;
	});
