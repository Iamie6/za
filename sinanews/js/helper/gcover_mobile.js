 /**
 * author 刘鹏
 * date : 2015-12-16
 * email: liupeng_luck@outlook.com
 * website: http://focusbe.com/
 */ 
//弹窗
var wh;
var gCover = function(coverEle,options){
	"use strict";
	var defaultOption = {
		animation:'fade',
		time:300,
		videoVar:null,//内嵌的视频对象
		scrollObj:null,
		padding:100,//弹窗距离上下的距离
		startShow:function(){

		},
		endShow:function(){

		},
		startHide:function(){

		},
		endHide:function(){

		}
	};
  	options = $.extend(defaultOption,options);
	var self = this;
	this.animation = options.animation;
	this.curCover = [];
	this.time = options.time;
	this.scrollArray = {};
	this.curZindex = 3000;
	this.init = function(){
		if($("#overlay").length<1)
		{
			$('body').append("<div style='position: fixed!important;_position:fixed; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 3000; background: rgb(0, 0, 0);display:none;' id='overlay'></div>");
		}
		self.setCoverInit();
		self.bind();
	};
	function hasIscroll()
	{
		if(typeof(IScroll)!='function')
		{
			console.error('you must include iscroll');
			return false;
		}
		return false;
	}

	this.setCoverInit = function(){
		coverEle.each(function(){
			$(this).css({display:'block',opacity:0,top:'-200%'});
			$(this).css({zIndex:3001,left:"50%",marginTop:(-$(this).height()/2)+"px",marginLeft:(-$(this).outerWidth()/2)+"px"});
			$(this).attr('data-state','hide');
		});
		coverEle.css({position:'fixed'});
	};
	this.bind = function(){
		$(window).bind("resize",function(){
			for(var i in self.curCover)
			{
				self.setCover(self.curCover[i]);
			}
		});
	    coverEle.each(function(){
	    	var $this = $(this);
	    	$(this).find(".close,.confirm").unbind('click').bind('click',function(){
	    		self.hide($this);
	    	});
	    });
	};
	this.setScroll = function(obj,index)
	{
		if(obj.find('.scroller').length==0)
		{
			obj.html('<div class="scroller">'+obj.html()+'</div>');
		}
		var coverHeight = obj.find('.scroller').height();
		if(coverHeight>$(window).height()-options.padding)
		{
			coverHeight = $(window).height()-options.padding;
			obj.css({height:coverHeight,overflow:'hidden'});
		}
		else
		{
			obj.height('auto');
		}
		
		if(typeof(self.scrollArray[index])!='undefined'&&self.scrollArray[index])
		{
			self.scrollArray[index].refresh();
		}
		else
		{
			self.scrollArray[index] = new IScroll(obj[0],{scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,
				shrinkScrollbars: 'scale',
				fadeScrollbars: false,
				click:true
			});
		}
	}

	this.setCover = function(obj){
		//窗口变化是改变当前弹窗的样式
		if(typeof(obj)=='undefined'||!obj||obj.attr('data-state')=='hide')
		{
			return;
		}
		var coverHeight,coverTop,index;
		wh = $(window).height();
		obj.each(function(){
			if(options.scrollObj)//容许出滚动条
			{
				index = $(this).index();
				if(options.scrollObj=='this')
				{
					self.setScroll($(this),$(this),index);
				}
				else
				{
					self.setScroll($(this).find(options.scrollObj),index);
				}
				$(this).css({top:'50%',marginTop:$(this).height()/2});
			}
			else
			{
				$(this).css({overflow:'visible'});
			}
			coverHeight =$(this).height();

			$(this).css({top:'50%',marginTop:-coverHeight/2,marginLeft:-$(this).outerWidth()/2});
		});
	};
	this.show = function(obj,animation,time,callbFn){
		if(typeof(obj)=='undefined'||!obj||obj.attr('data-state')=='show'||obj.attr('data-state')=='showing')
		{
			return;
		}
		if(typeof(animation)=='function')
		{
			callbFn = animation;
			animation = self.animation;
		}
		else if(typeof(animation)=='undefined'||!animation)
		{
			animation = self.animation;
		}
		if(typeof(time)=='function')
		{
			callbFn = time;
			time = self.time;
		}
		else if(typeof(time)=='undefined'||!time)
		{
			time = self.time;
		}
		self.curZindex+=2;
		obj.attr('data-state','showing');
		self.setCover(obj);
		self.curCover.push(obj);
		var callback = function(){
			obj.attr('data-state','show');
			options.endShow();
			if(typeof(callbFn)=='function')
			{
				callbFn();
			}
		}
		options.startShow();

		if(animation=='fade')
		{
			obj.stop().css({opacity:0,display:'block',zIndex:self.curZindex}).animate({opacity:1,display:'block'},time,function(){
				callback();
			});
		}
		else if(animation=='downfade')
		{
			obj.css({marginTop:(-obj.height()/2-100)+'px',opacity:0,display:'block',zIndex:self.curZindex}).stop().animate({marginTop:(-obj.height()/2)+'px',opacity:1},time,function(){
				callback();
			});
		}

		if($("#overlay").css('display')=='none')
		{
			$("#overlay").css({opacity:'0',display:'block'}).stop().animate({opacity:0.6},time);
		}
		else
		{
			$("#overlay").css({zIndex:parseInt(obj.css('z-index'))-1});
		}
		
	};
	this.hide = function(obj,animation,time,callbFn){
		if(typeof(obj)=='undefined'||!obj||obj.attr('data-state')=='hide'||obj.attr('data-state')=='hiding')
		{
			return;
		}
		if(typeof(animation)=='function')
		{
			callbFn = animation;
			animation = self.animation;
		}
		else if(typeof(animation)=='undefined'||!animation)
		{
			animation = self.animation;
		}
		if(typeof(time)=='function')
		{
			callbFn = time;
			time = self.time;
		}
		else if(typeof(time)=='undefined'||!time)
		{
			time = self.time;
		}
		obj.attr('data-state','hiding');
		self.removeCurCover(obj);
		var callback = function(){
			$('body,html').css({overflowY:'auto'});
			obj.attr('data-state','hide');
			options.endShow();
			if(typeof(callbFn)=='function')
			{
				callbFn();
			}
		}
	    if(options.videoVar)
	    {
	    	options.videoVar.stop();
	    }
	    if(animation=='fade')
	    {
	    	obj.stop().animate({opacity:0},time*0.6,function(){
	    		obj.css({top:'-200%'});
	    		callback();
	    	});
	    }
	    else if(animation=='downfade')
	    {
	    	obj.each(function(){
	    		var $this = $(this);
	    		$(this).stop().animate({marginTop:(-$(this).height()/2-100)+'px',opacity:0},time,function(){
		    		$this.css({'top':'-200%'});
		    		callback();
		    	});
	    	});
	    }
	    if(self.curCover.length==0)
	    {
	    	$("#overlay").stop().animate({'opacity':0},time,function(){
		    	$("#overlay").css({display:'none'});
		    });
	    }
	};
	this.removeCurCover = function(obj){
		var needDelete = -1;
		for(var i in self.curCover)
		{
			if(self.curCover[i][0]==obj[0])
			{
				needDelete = i;
				break;
			}
		}
		if(needDelete>-1)
		{
			self.curCover.splice(needDelete);
		}
	};
	this.init();
}

if(window.jQuery || window.Zepto){
	(function($) {
		$.fn.gCover = function(params) {
			return new gCover($(this), params);
		}
	})(window.jQuery || window.Zepto)
}
var __scrollBarWidth=0;
function getScrollBarouterWidth() {
	if (__scrollBarWidth) return __scrollBarWidth;

	 var scrollBarHelper = document.createElement("div");
	 // if MSIE
	 // 如此设置的话，scroll bar的最大宽度不能大于100px（通常不会）。
	 scrollBarHelper.style.cssText = "overflow:scroll;width:100px;height:100px;"; 
	// else OTHER Browsers:
	// scrollBarHelper.style.cssText = "overflow:scroll;";
	document.body.appendChild(scrollBarHelper);
	if (scrollBarHelper) {
	     __scrollBarWidth = {
	         horizontal: scrollBarHelper.offsetHeight - scrollBarHelper.clientHeight,
	         vertical: scrollBarHelper.offsetWidth - scrollBarHelper.clientWidth
	     };
	 }
	 document.body.removeChild(scrollBarHelper);
	return __scrollBarWidth;
}