	'use strict';
	/*
	 * @sinabone:for sinanews by fstone.
	 *
	 * @2015/3/10 16:00;
	 */

	 /* 
	  *  检测节点上是否包含某个 class 名
	  *  obj必填、 必须是有效节点、不能是节点集合
	  *  sClass 必填 非空字符串  
	  */
	function hasClass(obj,sClass){
		var reg=new RegExp('\\b'+sClass+'\\b');
		return reg.test(obj.className);
	}
	
	/*
	* 移除 某个节点上的 某个 class名
	*
	*/
	function removeClass(obj,sClass){
		var reg=new RegExp('\\b'+sClass+'\\b','g');
		if(hasClass(obj,sClass)){
			obj.className=obj.className.replace(reg,'').replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ');
		}
	}
	
	/*
	* 给某个节点添加 某一个 class 
	*
	*/
	function addClass(obj,sClass){
		if(obj.className){
			if(!hasClass(obj,sClass)){
				obj.className+=" "+sClass;
			}
		}else{
			obj.className=sClass;
		}
	}
	
	/*
	*	pc端，添加滚轮事件，
	*	
	* 	obj必填，
	*	fn是函数，接受一个参数, 
	*	参数是boolean值。  true  是向下滚动  false 向上滚动
	*
	*/
	function addMouseWheel(obj,fn){
		if(window.navigator.userAgent.toLowerCase().indexOf("firefox") != -1){
			obj.addEventListener("DOMMouseScroll",fnWheel,false);	
		} else {
			obj.onmousewheel = fnWheel;
		}
		function fnWheel(ev){
			var oEvent = ev || event;
			var bDown = true;
			if(oEvent.wheelDelta){
				bDown = oEvent.wheelDelta > 0 ? false : true;
			} else {
				bDown = oEvent.detail > 0 ? true : false;	
			}
			(typeof fn == "function") && fn(bDown);
			oEvent.preventDefault && oEvent.preventDefault();
			return false;
		}
	}
	
	/*
	* dom加载函数，接受参数fn，
	*
	* fn为dom加载完后,回调函数，会自执行；
	*
	*/
	function domReady(fn){
		if(document.addEventListener){
			document.addEventListener('DOMContentLoaded',fn,false);
		}else{
			document.attachEvent('onreadystatechange',function(){
				if((document.readyState=='complete')||(document.readyState=='loaded')){
					fn && fn();
				}	
			});
		}
	}
	
	/*
	* 通过class 获取一组元素，兼容ie6 
	* 
	*/
	function getByClass(oParent,sClass){
		if(oParent){
			if(oParent.getElementsByClassName){
				return oParent.getElementsByClassName(sClass);
			}else{
				var arr=[];
				var reg=new RegExp("\\b"+sClass+"\\b");
				var aEle=document.getElementsByTagName("*");
				for(var i=0;i<aEle.length;i++){
					if(reg.test(aEle[i].className)){
						arr.push(aEle[i]);
					}
				}
				return arr;
			}
		}else{
			alert("父级无效元素");
		}
	}
	
	/*
	* 获取 节点的属性 返回带单位的属性值
	*
	*/
	function getStyle(obj,name){
		return (obj.currentStyle || getComputedStyle(obj,false))[name];
	}
	
	/*
	*	事件绑定， 兼容
	*
	*/
	function addEvent(obj,sEv,fn){
		if(obj.addEventListener){
			obj.addEventListener(sEv,function(ev){
				var oEvent=ev || event;
				if(fn.apply(obj,arguments)==false){
					oEvent.cancelBubble=true;
					oEvent.preventDefault();
				}
			},false);
		}else{
			obj.attachEvent('on'+sEv,function(ev){
				var oEvent=ev || event;
				if(fn.apply(obj,arguments)==false){
					oEvent.cancelBubble=true;
					return false;	
				}
			});
		}
	}
	
	/*
	* pc端动画
	*
	*
	*/
	var Tween={Linear:function(t,b,c,d){return c*t/d+b},Quad:{easeIn:function(t,b,c,d){return c*(t/=d)*t+b},easeOut:function(t,b,c,d){return -c*(t/=d)*(t-2)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t+b}return -c/2*((--t)*(t-2)-1)+b}},Cubic:{easeIn:function(t,b,c,d){return c*(t/=d)*t*t+b},easeOut:function(t,b,c,d){return c*((t=t/d-1)*t*t+1)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t+b}return c/2*((t-=2)*t*t+2)+b}},Quart:{easeIn:function(t,b,c,d){return c*(t/=d)*t*t*t+b},easeOut:function(t,b,c,d){return -c*((t=t/d-1)*t*t*t-1)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t*t+b}return -c/2*((t-=2)*t*t*t-2)+b}},Quint:{easeIn:function(t,b,c,d){return c*(t/=d)*t*t*t*t+b},easeOut:function(t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t*t*t+b}return c/2*((t-=2)*t*t*t*t+2)+b}},Sine:{easeIn:function(t,b,c,d){return -c*Math.cos(t/d*(Math.PI/2))+c+b},easeOut:function(t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b},easeInOut:function(t,b,c,d){return -c/2*(Math.cos(Math.PI*t/d)-1)+b}},Expo:{easeIn:function(t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b},easeOut:function(t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b},easeInOut:function(t,b,c,d){if(t==0){return b}if(t==d){return b+c}if((t/=d/2)<1){return c/2*Math.pow(2,10*(t-1))+b}return c/2*(-Math.pow(2,-10*--t)+2)+b}},Circ:{easeIn:function(t,b,c,d){return -c*(Math.sqrt(1-(t/=d)*t)-1)+b},easeOut:function(t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return -c/2*(Math.sqrt(1-t*t)-1)+b}return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b}},Elastic:{easeIn:function(t,b,c,d,a,p){if(t==0){return b}if((t/=d)==1){return b+c}if(!p){p=d*0.3}if(!a||a<Math.abs(c)){a=c;var s=p/4}else{var s=p/(2*Math.PI)*Math.asin(c/a)}return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b},easeOut:function(t,b,c,d,a,p){if(t==0){return b}if((t/=d)==1){return b+c}if(!p){p=d*0.3}if(!a||a<Math.abs(c)){a=c;var s=p/4}else{var s=p/(2*Math.PI)*Math.asin(c/a)}return(a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b)},easeInOut:function(t,b,c,d,a,p){if(t==0){return b}if((t/=d/2)==2){return b+c}if(!p){p=d*(0.3*1.5)}if(!a||a<Math.abs(c)){a=c;var s=p/4}else{var s=p/(2*Math.PI)*Math.asin(c/a)}if(t<1){return -0.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b}return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*0.5+c+b}},Back:{easeIn:function(t,b,c,d,s){if(s==undefined){s=1.70158}return c*(t/=d)*t*((s+1)*t-s)+b},easeOut:function(t,b,c,d,s){if(s==undefined){s=1.70158}return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},easeInOut:function(t,b,c,d,s){if(s==undefined){s=1.70158}if((t/=d/2)<1){return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b}return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b}},Bounce:{easeIn:function(t,b,c,d){return c-Tween.Bounce.easeOut(d-t,0,c,d)+b},easeOut:function(t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else{if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+0.75)+b}else{if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+0.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+0.984375)+b}}}},easeInOut:function(t,b,c,d){if(t<d/2){return Tween.Bounce.easeIn(t*2,0,c,d)*0.5+b}else{return Tween.Bounce.easeOut(t*2-d,0,c,d)*0.5+c*0.5+b}}}};
	
	function move(obj,json,options){
		options=options || {};
		options.duration=options.duration || 500;
		options.easing=options.easing || Tween.Elastic.easeOut;
		
		clearInterval(obj.timer);
		//1000/60
		var count=Math.floor(options.duration/30);
		var start={};
		var dis={};
		for(var name in json){
			start[name]=parseFloat(getStyle(obj,name));
			dis[name]=json[name]-start[name];
		}
		var n=0;
		
		obj.timer=setInterval(function(){
			n++;
			
			for(var name in json){
				var cur=options.easing(n/count*options.duration,start[name],dis[name],options.duration);
				
				if(name=='opacity'){
					obj.style.opacity=cur;
					obj.style.filter='alpha(opacity:'+cur*100+')';
				}else{
					obj.style[name]=cur+'px';
				}
			}
			
			if(n==count){
				clearInterval(obj.timer);	
				options.complete && options.complete.call(obj);
			}
		},30);
	}
	
	/*
	* 
	*	跨域请求数据
	*
	*
	*
	*/
	function jsonp(json){
		json=json || {};
		if(!json.url)return;
		json.data=json.data || {};
		json.cbName=json.cbName || 'cb';

		var fnName='jsonp'+Math.random();
		fnName=fnName.replace('.','');
		window[fnName]=function(data){
			json.success && json.success(data);	
			
			oHead.removeChild(oS);
		}
		
		//临时处理data
		json.data[json.cbName]=fnName;
		
		var arr=[];
		for(var name in json.data){
			arr.push(name+'='+json.data[name]);
		}
		
		
		var oS=document.createElement('script');
		oS.src=json.url+'?'+arr.join('&');
		var oHead=document.getElementsByTagName('head')[0];
		oHead.appendChild(oS);
	}
	
	/*
	*	json转url
	*
	*
	*/
	function json2url(json){
		json.t=Math.random();
		
		var arr=[];
		for(var name in json){
			arr.push(name+'='+json[name]);
		}
		return arr.join('&');
	}
	
	/*
	*	ajax
	*/
	function ajax(json){
		json=json || {};
		if(!json.url){
			alert('用法不合理');
			return;
		}
		json.type=json.type || 'GET';
		json.time=json.time || 3000;
		json.data=json.data || {};
		
		
		var timer=null;
		if(window.XMLHttpRequest){
			var oAjax=new XMLHttpRequest();
		}else{
			var oAjax=new ActiveXObject('Microsoft.XMLHTTP');
		}
		
		switch(json.type.toUpperCase()){
			case 'GET':
				oAjax.open('GET',json.url+'?'+json2url(json.data),true);
				oAjax.send();
				break;
			case 'POST':
				oAjax.open('POST',json.url,true);
				oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				oAjax.send(json2url(json.data));
				break;
		}
		
		oAjax.onreadystatechange=function(){
			if(oAjax.readyState==4){
				if(oAjax.status>=200 && oAjax.status<300 || oAjax.status==304){
					json.success && json.success(oAjax.responseText);
				}else{
					json.error && json.error(oAjax.status);	
				}
				clearTimeout(timer);
			}
		};
		
		//超时
		timer=setTimeout(function(){
			//json.fnTimeOut && json.fnTimeOut();
			if(!json.fnTimeOut){
				alert('网络不给力');
			}else{
				json.fnTimeOut();	
			}
			oAjax.onreadystatechange=null;
		},json.time);
	}
	
	/*
	* 移动端 滑动事件
	* type有 start / move / left / right / up / down / long / click /end
	*
	*/
	function addTouchEvent(obj,type,fn) {
    //滑动范围在5x5内则做点击处理，s是开始，e是结束
		var init = {x:5,y:5,sx:0,sy:0,ex:0,ey:0};
		var sTime = 0, eTime = 0;
		type = type.toLowerCase();
	 
		obj.addEventListener("touchstart",function(ev){
			var oEvent=ev||event;
			sTime = new Date().getTime();
			init.sx = event.targetTouches[0].pageX;
			init.sy = event.targetTouches[0].pageY;
			init.ex = init.sx;
			init.ey = init.sy;
			if(type.indexOf("start") != -1){
				if(fn.apply(obj,arguments)==false){
					
					oEvent.cancelBubble=true;
					oEvent.preventDefault();
				}
			}
		}, false);
	 
		obj.addEventListener("touchmove",function(ev) {
			var oEvent = ev ||event;
			oEvent.preventDefault();//阻止触摸时浏览器的缩放、滚动条滚动
			init.ex = event.targetTouches[0].pageX;
			init.ey = event.targetTouches[0].pageY;
			if(type.indexOf("move")!=-1){
				if(fn.apply(obj,arguments)==false){
					
					oEvent.cancelBubble=true;
					oEvent.preventDefault();
				}
			};
		}, false);
	 
		obj.addEventListener("touchend",function(ev) {
			var oEvent = ev || event;
			var changeX = init.sx - init.ex;
			var changeY = init.sy - init.ey;
			if(Math.abs(changeX)>Math.abs(changeY)&&Math.abs(changeX)>init.x) {
				//左右事件
				if(changeX > 0) {
					if(type.indexOf("left")!=-1){
						if(fn.apply(obj,arguments)==false){
							
							oEvent.cancelBubble=true;
							oEvent.preventDefault();
						}
					};
				}else{
					if(type.indexOf("right")!=-1){
						if(fn.apply(obj,arguments)==false){
							
							oEvent.cancelBubble=true;
							oEvent.preventDefault();
						}
					};
				}
			}
			else if(Math.abs(changeY)>Math.abs(changeX)&&Math.abs(changeY)>init.y){
				//上下事件
				if(changeY > 0) {
					if(type.indexOf("up")!=-1){
						if(fn.apply(obj,arguments)==false){
							
							oEvent.cancelBubble=true;
							oEvent.preventDefault();
						}
					};
				}else{
					if(type.indexOf("down")!=-1){
						if(fn.apply(obj,arguments)==false){
							
							oEvent.cancelBubble=true;
							oEvent.preventDefault();
						}
					};
				}
			}
			else if(Math.abs(changeX)<init.x && Math.abs(changeY)<init.y){
				eTime = new Date().getTime();
				//点击事件，此处根据时间差细分下
				if((eTime - sTime) > 300) {
					if(type.indexOf("long")!=-1){
						if(fn.apply(obj,arguments)==false){
							
							oEvent.cancelBubble=true;
							oEvent.preventDefault();
						}
					}; //长按
				}
				else {
					if(type.indexOf("click")!=-1){
						if(fn.apply(obj,arguments)==false){
							
							oEvent.cancelBubble=true;
							oEvent.preventDefault();
						}
					}; //当点击处理
				}
			}
			if(type.indexOf("end")!=-1){
				if(fn.apply(obj,arguments)==false){
							
					oEvent.cancelBubble=true;
					oEvent.preventDefault();
				}
			};
		}, false);
	};

	/*
	* 
	* iframe交互
	*
	*/
	var ijax = function(url,data,cb){
        var body = document.body;
        var suffix = Math.abs((new Date()).getTime()) + '_' + Math.round(Math.random() * 1e8);
        var id = "ijax_iframe_"+suffix;
        var ifm=document.createElement("iframe");
        iframe.style.cssText="position:absolute;top:-9999px;height:0px;overflow:hidden;";
        iframe.frameborder="0";
        iframe.name=id;
        iframe.id=id;
        //var ifm = $('<iframe style="position:absolute;top:-9999px;height:0px;overflow:hidden;" frameborder="0" name="'+id+'" id="'+id+'"></iframe>');
        data.callback = 'ijax_'+suffix;
        var arr=[];
		for(var name in data){
			arr.push(name+'='+data[name]);
		}
		var str=arr.join("&");
        var inputHtml = (function(data){
            var html = [];
            for(var name in data){
                var val = data[name];
                html.push('<input type="hidden" name="'+name+'" value="'+val+'" />');
            }
            return html.join('');
        })(data);
        window['ijax_'+suffix] = function(msg){
            if(typeof cb === 'function'){
                cb(msg);
            }
            setTimeout(function(){
            	body.removeChild(ifm);
            	body.removeChild(form);
               //ifm.removeChild();
               //form.remove();
            },1e3);
        };
        var form=document.createElement("form");
        form.action=url+"?"+str;
        form.method="post";
        form.target=id;
        form.innerHTML=inputHtml;
        //var form = $('<form action="'+url+'?'+str+'" method="post" target="'+id+'">'+inputHtml+'</form>');
        body.appendChild(ifm);
        body.appendChild(form);
        //body.append(ifm);
        //body.append(form);
        form.submit();
    };
	//document.domain = "sina.com.cn";