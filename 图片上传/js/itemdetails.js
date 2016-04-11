var index = 0;
var timer = 0;
var ulist = $('#carrousel-wrapper .lists ul');
var $previewList = $('.preview-list ul');
var list = ulist.find('li');
var llength = list.length;//li的个数，用来做边缘判断
var lwidth = $(list[0]).width();//每个li的长度，ul每次移动的距离
var uwidth = llength * lwidth;//ul的总宽度
var $controlBtns = $('.control-btn');
		
$(function (){
	//lunbo
	init();
	//chushihua pifu
	initSkin();
	
	//个人资料验证
	var $inputlist = $(".person-main ul li input");
	
	 $inputlist.blur(function (e){
		var $index =  $inputlist.index(e.currentTarget);
		var $hint = $(".person-main .hint").eq($index);
		if($(this).val() == ""){
			$hint.show();
		} else {
			if($(this).attr("id") == "myemail"){
				
				var email = /^\w+@[a-z0-9-]+(\.[a-z]{2,6}){1,2}$/;
				var $myemail = $("#myemail");
				if(email.test($myemail.val())){
					$myemail.next(".hint").hide();
				} else {
					
					$myemail.next(".hint").html("邮箱格式不正确");
					$myemail.next(".hint").show();

				}
				
			}
			if($(this).attr("id") == "mobile"){
				var tel =  /^0?1[3|4|5|7|8][0-9]\d{8}$/;
				var $mobile = $("#mobile");
				if(tel.test($mobile.val())){
					$mobile.next(".hint").hide();
				} else {
					$mobile.next(".hint").html("手机格式不正确");
					$mobile.next(".hint").show();
				}
			}
		}
		
		
	});
	$inputlist.focus(function (e){
		var $index =  $inputlist.index(e.currentTarget);
		var $hint = $(".person-main .hint").eq($index);
		$hint.hide();
	});
	
	
	var $inputbtn = $(".person-main .inputbtn");
	$inputbtn.click(function (){
		for(var i = 0; i < $inputlist.length; i++){
			if($inputlist.eq(i).val() == ""){
				$inputlist.eq(i).next(".hint").show();
			}
		}
	});
	
	
	
	
	//itemdetails
    $(".information").on("click", ".tab-btn li", function() {
        var $recommendLi = $(".tab-btn li");
        var $recContenta = $('.information-main .mcon');
        var $index = $recommendLi.index($(this));
        $recContenta.hide();
        $recContenta.eq($index).show();
        $recommendLi.removeClass("active");
        $(this).addClass("active");
    });


    $(".schedule").each(function (){
        var $index = $(".schedule").index($(this));
        var $schedule = $(".schedule").eq($index).html();
        $(".project-barn").eq($index).css("width",$schedule)
    });


    $(".more span").click(function (){
		
       $(".bottom ul").css({
           height: 'auto'
       });
       $(".more").hide();
		
    });

	var $news = $(".news");
	$news.on("click",".reply",function (){
		var $index = $news.find(".reply").index($(this));
		var $parent = $news.find("ul li .message").eq($index);
		reply($news, $parent);
	});
	
    var $comment = $('.comment');
    $comment.on("click",".reply",function (){
        var $index = $comment.find(".reply").index($(this));
        var $parent = $comment.find("ul li .quiz-mainr").eq($index);
        reply($comment, $parent);
    }).on("click",".quiz a.quiza",function (e){
        e.preventDefault();
        var $replyFormWrapper = $(".reply-form-wrapper");
        $replyFormWrapper.find('textarea').focus();
		 $comment.find('.reply-form').remove();
		var tplReplayForm = $('#tpl-reply-form').html();
        var $tplReplayForm = $(tplReplayForm);
		 $(".reply-form-wrapper").append($('#tpl-reply-form').html());
		var $mycontent = $tplReplayForm.find(".mycontent");
        $mycontent.focus();
		 
    });

    


    $(".attenta").click(function (){
		if($(this).html() == "已关注"){
			$(this).html("关注");
			$(this).css({"background":"none","color":"#fff","border":"1px solid #ffffff","opacity":"0.7"});
		} else {
			$(this).html("已关注");
			$(this).css({"background":"#80a313","color":"#fff","border":"none","opacity":"1"});
			
		}
        

    });
	
	
 
    
	//person center
	
	//验证手机
	$(".checktel").click(function (){
		checktel();
	});
	
	
	//验证邮箱
	
	$(".checkeml").click(function (){
		
		checkeml();
	});

	
	//修改头像
	$(".updateportrait").click(function (){
		showportrait();
		
	});
	
	
	//修改密码
	$(".updatepwd").click(function()
	{
		showdialog();
	});
	


	$(".tab-box").on("click", ".tab-nav li", function() {
        var $recommendLi = $(".tab-nav li");
        var $recContenta = $('.tab-box .tab-content');
        var $index = $recommendLi.index($(this));
        $recContenta.hide();
        $recContenta.eq($index).show();
        $recommendLi.removeClass("active");
        $(this).addClass("active");
    });

	$(".contentbox").on("click","a.del",function (){
		layer.confirm('您确定要删除吗？', {
			btn: ['确定','取消'], //按钮
			shade: false, //不显示遮罩
			area:['420px','180px']
		});
		
	});
	$(".unfollow").on("click",function (){
		layer.confirm('您确定要取消关注吗？', {
			btn: ['确定','取消'], //按钮
			shade: false ,//不显示遮罩
			area:['420px','180px']  
		});
		
	})
	
	$(".tab-content").on("click", ".news-nav li", function() {
        var $recommendLi = $(".news-nav li");
        var $recContenta = $('.tab-content .news-con');
        var $index = $recommendLi.index($(this));
        $recContenta.hide();
        $recContenta.eq($index).show();
        $recommendLi.removeClass("active");
        $(this).addClass("active");
    });
	
	$(".main").on("click",".main-r .more",function (){
			$(".main-rmiddle .middle").css({height:"auto"});
			$(".main-r .more").hide();
	});
	$(".main").on("click",".main-r .morebottom ",function (){
			$(".main-rbottom .mybottom").css({height:"auto"});
			$(".main-r .morebottom").hide();
	});
	
	
	//payment

	$(".pay-btn1 #submit").click(function (){
		$("#bar").removeClass("bar1");
		$("#bar").addClass("bar2");
		$(".pay-content1").hide();
		$(".pay-content2").show();
		$("#pay-btn1").hide();
		$("#pay-btn2").show();
		
	});
	
	$("#buy").click(function (){
		$(".pay-inner").hide();
		$(".pay-content3").show();
		$(".pay-main").css("height","530px");
		
	});
	
	$("#update").click(function (){
		$("#bar").removeClass("bar2");
		$("#bar").addClass("bar1");
		$(".pay-content2").hide();
		$(".pay-content1").show();
		$("#pay-btn1").show();
		$("#pay-btn2").hide();
	});
	
	var $payinput = $(".pay-content1 input");
	$payinput.blur(function (){
		var $num = $(this).val();
		if(isNaN($num)){
			$(".pay-content1 span.limit").html("输入有误").show();
				$payinput.focus();
			
		} else{
			if($num == ""){
				
				$(".pay-content1 span.limit").html("不能为空").show();
				$payinput.focus();
				
			} else{
				if(parseInt($num) < 50000){
					
					$(".pay-content1 span.limit").html("不能小于最低投资额").show();
					$payinput.focus();
				} else {
					$(".pay-content1 span.limit").hide();
				}
				
			} 
		}
		
	});
	
	
	//上传头像
	var $mybtn = $("#update-btn");
	var $updatec = $(".update-choose");
	var $updatet = $(".update-tailor");
	var $updatef = $(".update-face");
	var $updateclose = $(".update-close");
	var $previewpane1 = $("#preview-pane1");
	var $updateoff = $("#update-off");
	var $updateconfirm = $("#update-confirm");
	$mybtn.click(function (){
		$updatec.hide();
		$updatet.show();
		updatePreview({x:'60',y:'60',x2:'250',y2:'250',w:'190',h:'190'});
		$previewpane1.hide();
		$(".update-mright").css({"paddingTop":"0","marginLeft":"430px"});
		$('#element_id').attr("src","../images/investor-person.jpg");
		
	});
	$updateclose.click(function (){
		$updatef.hide();
	});
	
	$updateoff.click(function (){
		$updatec.show();
		$updatet.hide();
		$previewpane1.show();
		$(".update-mright").css({"paddingTop":"50px","marginLeft":"490px"});
	});
	//点击确定
	$updateconfirm.click(function (){
		var $x1 = $('#x1').val();
		var $y1 = $('#y1').val();
		var $w1 = $('#w').val();
		var $h1 = $('#h').val();
	    $.ajax({
			type:"POST",
			url:"",
			data:{'x1':$x1,'y1':$y1,"w1":$w1,"h1":$h1},
			success:function (msg){
				$updatef.hide();
				if(msg.result == "1"){
					//do something
					
				}
			}
			
		});
	 
	 
	  
	});
	
	//裁剪图片
	var api;
	var jcrop_api;
	//缩略图
	var jcrop_api,
	boundx,
	boundy,
	$preview = $('#preview-pane'),
	$pcnt = $('#preview-pane .preview-container'),
	$pimg = $('#preview-pane .preview-container .jcrop-preview'),
	$pcnt1 = $('#preview-pane .preview-container2'),
	$pimg2 = $('#preview-pane .preview-container2 .jcrop-preview2'),
	xsize = $pcnt.width(),
	ysize = $pcnt.height(),
	xsize1 = $pcnt1.width(),
	ysize1 = $pcnt1.height();
  $('#element_id').Jcrop({
    // 默认出现选框
    bgOpacity: 0.5,
    bgColor: 'white',
    addClass: 'jcrop-light',
	//选框数值
	onChange: updatePreview,
    onSelect: updatePreview,
    onRelease: clearCoords,
	//缩略图
	
    aspectRatio: xsize / ysize
	
  },function(){
	jcrop_api = this;
    api = this;
    api.setSelect([60, 60, 50+200,50+200]);
    api.setOptions({
      bgFade: true
    });
    api.ui.selection.addClass('jcrop-selection');
	//缩略图
	var bounds = this.getBounds();
    boundx = bounds[0];
    boundy = bounds[1];
    // Store the API in the jcrop_api variable
    jcrop_api = this;
    
    // Move the preview into the jcrop container for css positioning
    $preview.appendTo(jcrop_api.ui.holder);
  });
  function updatePreview(c){
	$('#x1').val(c.x);
	  $('#y1').val(c.y);
	  $('#x2').val(c.x2);
	  $('#y2').val(c.y2);
	  $('#w').val(c.w);
	  $('#h').val(c.h);
	  
    if (parseInt(c.w) > 0) {
      var rx = xsize / c.w;
      var ry = ysize / c.h;
      var rx1 = xsize1 / c.w;
      var ry1 = ysize1 / c.h;
      $pimg.css({
        width: Math.round(rx * boundx) + 'px',
        height: Math.round(ry * boundy) + 'px',
        marginLeft: '-' + Math.round(rx * c.x) + 'px',
        marginTop: '-' + Math.round(ry * c.y) + 'px'
      });
	  $pimg2.css({
        width: Math.round(rx1 * boundx) + 'px',
        height: Math.round(ry1 * boundy) + 'px',
        marginLeft: '-' + Math.round(rx1 * c.x) + 'px',
        marginTop: '-' + Math.round(ry1 * c.y) + 'px'
      });
    }
  };
  
  
  
  //选框数值
  $('#coords').on('change','input',function(e){
    var x1 = $('#x1').val(),
    x2 = $('#x2').val(),
    y1 = $('#y1').val(),
    y2 = $('#y2').val();

    jcrop_api.setSelect([x1, y1, x2, y2]);
  });
  
	//选框选中
  $('#buttonbar').on('click', 'button', function(e){
    var $t = $(this),
      $g = $t.closest('.cxbtn_group');

    $g.find('button.active').removeClass('active');
    $t.addClass('active');
    $g.find('[data-setclass]').each(function(){
      var $th = $(this),
        c = $th.data('setclass'),
        a = $th.hasClass('active');

      if (a) {
        api.ui.holder.addClass(c);
        switch(c){
          case 'jcrop-light':
          api.setOptions({
            bgColor: 'white',
            bgOpacity: 0.5
          });
          break;
          
          case 'jcrop-dark':
          api.setOptions({
            bgColor: 'black',
            bgOpacity: 0.4
          });
          break;
          
          case 'jcrop-normal':
          api.setOptions({
            bgColor: $.Jcrop.defaults.bgColor,
            bgOpacity: $.Jcrop.defaults.bgOpacity
          });
          break;
        }
      } else {
        api.ui.holder.removeClass(c);
      };
    });
  });
	
	
	

});

  
function clearCoords(){
  $('#coords input').val('');
};



function initSkin(){
	layer.config({
			skin: 'layer-ext-mineskin',
			extend: ['skin/mineskin/style.css']
		});
}
function showdialog(){
		var content=
			"<div class='oldpwd clearfix'> " +
			"<div class='oldpwd-wd fl'>&nbsp;&nbsp; 旧密码</div>" +
			"<div class='oldpwd-input fl'><input type='text' name='oldpwd'/><a href='javascript:void(0)'>忘记密码</a></div>" +
			"</div>" +
			"<div class='oldpwd clearfix'>" +
			"<div class='oldpwd-wd fl'>&nbsp;&nbsp; 新密码</div>" +
			"<div class='oldpwd-input fl'><input type='text' name='newpwd'/></div>" +
			
			"</div>"+
			"<div class='oldpwd clearfix'>" +
			"<div class='oldpwd-wd fl'>确认密码</div>" +
			"<div class='oldpwd-input fl'><input type='text' name='affirm'/></div>" +
			
			"</div>"
			;


		layer.alert(content,{area:['530px', '290px'],title:'修改密码',btn: ['修改密码']}, function(index){
			//do something

			layer.close(index);
		});

		$(".layui-layer-btn0").css({"position":"absolute","left":"160px","bottom":"25px","background":"#ff5657","width":"120px","height":"35px","-moz-border-radius":"3px","-webkit-border-radius":"3px","border-radius":"3px"});
}
function showportrait(){
		
		var content=
			"<div class='portraitbox clearfix'> " +
			"<div class='portrait fl'><img src='images/headerp.png'/></div>" +
			"<div class='portrait-input fl'><input type='button' value='选择图像' onclick='path.click()' class='mybutton'><input type='file' id='path' style='display:none'><p class='word'>建议您上传500X500像素以上的正方形头像</p></div>" +
			"</div>" 

			;


		layer.alert(content,{area:['530px', '360px'],title:'修改头像',btn: ['修改头像']}, function(index){
			//do something

			layer.close(index);
		});

		$(".layui-layer-btn0").css({"position":"absolute","left":"14px","bottom":"25px","background":"#ff5657","width":"120px","height":"35px","-moz-border-radius":"3px","-webkit-border-radius":"3px","border-radius":"3px"});
}
function checkeml(){
		
		var content=
			"<div class='checkemail clearfix'> " +
			"<div class='checkemail-input'><input id='emil' type='text' placeholder='请输入您要验证邮箱地址'/></div>" +
			"<div class='yzeml'></div>"+
			"</div>" 
			;


		layer.alert(content,{area:['530px', '200px'],title:'验证邮箱',btn: ['发送验证邮件']}, function(index){
			//do something

			layer.close(index);
		});

		$(".layui-layer-btn0").css({"position":"absolute","left":"286px","font-size":"16px","bottom":"79px","background":"#ff5657","width":"136px","height":"35px","-moz-border-radius":"3px","-webkit-border-radius":"3px","border-radius":"3px"});
		$(".layui-layer-btn0").unbind("click");
		$(".layui-layer-btn0").click(function (){
			$(".layui-layer-content").html("<div class='lookemail clearfix'> " +
				"<div class='lookmail-input'>重置邮件已经发往 email@126.com, 点击重置链接找回密码。</div>" +
				"</div>" 
				);
			$(".layui-layer-btn0").html("查收并激活邮件");
			$(".layui-layer-btn0").css({"position":"absolute","left":"160px","bottom":"30px","font-size":"16px","background":"#ff5657","width":"152px","height":"35px","-moz-border-radius":"3px","-webkit-border-radius":"3px","border-radius":"3px"})
			
		});
		$("#emil").blur(function (){
			var email = /^\w+@[a-z0-9-]+(\.[a-z]{2,6}){1,2}$/;
			if(email.test($("#emil").val())){
				$(".yzeml").html("");
			} else {
				$(".yzeml").html("邮箱格式不正确");
				
			}
			if($("#emil").val() == "" || $("#emil").val() == "请输入您要验证的手机号码" ){
				$(".yzeml").html("邮箱不能为空");
			
			}
		});
		$("#emil").focus(function (){
			
			$(".yzeml").html("");
		});
}
	
function checktel(){
		var content=
			"<div class='oldpwd checktel clearfix'> " +
			"<div class='oldpwd-input checktel-input fl'><input type='text' id='tel' name='oldpwd' placeholder='请输入您要验证的手机号码' /><span id='yzm'></span><span class='code' id='code'>发送验证码</span></div>" +
			"</div>" +
			"<div class='oldpwd checktel clearfix'>" +
			"<div class='oldpwd-input checktel-input fl'><input type='text' name='newpwd' placeholder='请输入您收到的验证码' /></div>" +
			
			"</div>"
			;


		layer.alert(content,{area:['530px', '290px'],title:'验证手机号',btn: ['验证']}, function(index){
			//do something

			layer.close(index);
		});

		$(".layui-layer-btn0").css({"position":"absolute","left":"87px","bottom":"35px","background":"#ff5657","width":"120px","height":"35px","-moz-border-radius":"3px","-webkit-border-radius":"3px","border-radius":"3px"});
		
		
		
		
		$("#tel").blur(function (){
			var tel =  /^0?1[3|4|5|7|8][0-9]\d{8}$/;
			if(tel.test($("#tel").val())){
				$("#yzm").html("");
			} else {
				$("#yzm").html("手机格式不正确");
				
			}
			if($("#tel").val() == "" || $("#tel").val() == "请输入您要验证的手机号码" ){
				$("#yzm").html("手机不能为空");
			
			}
		});
		$("#tel").focus(function (){
			
			$("#yzm").html("");
		});
		
		
		
		var flag=false;
		var i = 60;
		var timer = null;
		$("#code").click(function (){
			
			if(flag)
            {	
               return;
            }
            else
            {
                timer=setInterval(function()
                {
                    i--;
					if(i == 0){
						clearInterval(timer);
						$("#code").html("发送验证码");
						$("#code").css("background","#93c937");
						flag = false;
						i = 60;
						
					} else {
						$("#code").html(i+"s后重新获取");
						$("#code").addClass("count");
						$("#code").css("background","#7d7d7d");	
						flag = true;
					}
					
                },1000);
            }
		});
		
}

function doMove(direction){
            //向右按钮
            if (direction =="toRight") {
                index++;
                if ( index< llength) {
                    uwidth = lwidth *index;
                    ulist.css('left',-uwidth);
					console.log("*********************toRight:" + uwidth);
                    //ulist.animate({left: -uwidth}, 1000);

                }else{
					console.log("*********************toRight:0px");
                    //ulist.animate({left:'0px'});
					ulist.css('left','0px');
                    index = 0;
                };
                //向左按钮
            }else if(direction == "toLeft"){
                index--;
                if ( index < 0) {
                    index = llength - 1;
                }
                uwidth = lwidth *index;
                ulist.css('left',-uwidth);
                //ulist.animate({left: -uwidth}, "slow");
                //点击数字跳转
            } else {
                index = direction;
                uwidth = lwidth *index;
				ulist.css('left',-uwidth);
                //ulist.animate({left: -uwidth}, "slow");
            }
            changeBtn(index);
        }
        
        
function init(){
	//生成按钮(可以隐藏)
	addBtn(list);
	//显示隐藏左右点击开关
	$controlBtns.show();
	$controlBtns.on('click', function(event) {
		var elm = $(event.target);
		doMove(elm.data('type'));
		return false;
	});

	//初始化描述
	//var text = ulist.find('li').eq(0).find('img').attr('alt');
	//var link = ulist.find('li').eq(0).find('a').attr('href');
	//$('.img_intro .text a').text(text);
	//$('.img_intro .text a').attr('href',link);
	
}



function changeBtn(i){
	$previewList.find('li').eq(i).addClass('on').siblings().removeClass('on');
	var text = ulist.find('li').eq(i).find('img').attr('alt');
	var link = ulist.find('li').eq(i).find('a').attr('href');
	//$('.img_intro .text a').text(text);
	//$('.img_intro .text a').attr('href',link);
}

function addBtn (list){
	for (var i = 0; i < list.length; i++) {
		var imgsrc = $(list[i]).find('img').attr('src');
		var listCon = '<li><img src="'+imgsrc+'""></li>';
		$(listCon).appendTo($previewList);
		//隐藏button中的数字
		//list.css('text-indent', '10000px');
	};
	$previewList.find('li').first().addClass('on');
	$previewList.find('li').click(function(event) {
		var _index = $(this).index();
		doMove(_index);
	});
} 

function reply($box, $obj){
        $box.find(' .reply-form').remove();
        var tplReplayForm = $('#tpl-reply-form').html();
        var $tplReplayForm = $(tplReplayForm);
        $obj.append($tplReplayForm);

        var $mycontent = $tplReplayForm.find(".mycontent");
        $mycontent.focus();
        $mycontent.blur(function (){
			var contentVal = $mycontent.val();
            if(contentVal == "" || contentVal == "请输入内容"){
                $(".empty").show();
				
            } 
        });
        $mycontent.focus(function (){
            $(".empty").hide();
        });
} 
//个人中心限制字数
	function checktext(text) { 
		allValid = true; 
		for (i = 0; i < text.length; i++) { 
			if (text.charAt(i) != " ") { 
			allValid = false; 
			break; 
			} 
		} 
		return allValid; 
	} 

	function gbcount(message,total,used,remain) { 
		var max; 
		max = total.value; 
		if (message.value.length > max) { 
		message.value = message.value.substring(0,max); 
		used.value = max; 
		remain.value = 0; 
		} else { 
		used.value = message.value.length; 
		remain.value = max - used.value; 
		} 
	} 
	var textmemo = document.getElementById("textmemo");
	var wordsize = document.getElementById("wordsize");
	if(textmemo.value == ""){
		wordsize.value = 300;
	} else {
		wordsize.value = 300 - parseInt(textmemo.value.length);
		
	}
	
	
     