domReady(function(){
	var oHtml=document.getElementsByTagName('html')[0],
		oBody=document.body,
		clientWidth=document.documentElement.clientWidth||document.body.clientWidth,
		clientHeight=document.documentElement.clientHeight||document.body.clientHeight;
	var s=clientWidth/clientHeight;
	if(s>=0.77){
		oBody.style.width=Math.floor(0.77*clientHeight)+"px";
		clientWidth=Math.floor(0.77*clientHeight);
	}
	oHtml.style.fontSize=clientWidth/16+"px";

	var loadingline=document.querySelector(".loadingline");
	var scale=document.querySelector(".scale");
	var num=0;

	window.timer=setInterval(function(){
		num++;
		if(num>78){
			clearInterval(window.timer);
		}
		scale.innerHTML=num;
		loadingline.style.width=num+"%";
	},50);
});
window.onload=function(){
	//是否点击过捐款
	var blen=localStorage.getItem("kangzhanjuanguan2015");
	//人数统计
	var mark={};
	//是否可以翻页
	var cannext=false;
	//显示人数
	var aspan=document.querySelectorAll(".joinNum");
	//音乐按钮
	var yingyue=document.querySelector(".yingyue");
	//背景音乐
	var music=document.querySelector(".music");
	//按钮
	var startBtn=document.querySelector(".startBtn");
	//黑色背景
	var animationBox=document.querySelector(".animationBox");
	//桥
	var qiao=document.querySelector(".qiao");
	//子弹
	var zidan=document.querySelector(".zidan");
	//子弹音频
	var zidanAudio=document.querySelector("#zidanAudio");
	//桥文字
	var qiaoword=document.querySelector(".qiaoword");
	//放映灯盒子
	var huandengBox=document.querySelector(".huandengBox");
	//放映图片盒子
	var huandengpic=document.querySelector(".huandengpic");
	//放映图片
	var pers=document.querySelectorAll(".per");
	//放映是的文字组
	var picworlds=document.querySelectorAll(".picworld");
	//正文页
	var article=document.querySelector(".article");
	//正文页子页
	var sections=document.querySelectorAll(".sec");
	/*加载*/
	var loadingline=document.querySelector(".loadingline");
	var scale=document.querySelector(".scale");
	var sec1=document.querySelector("#sec1");
	var num=78;
	clearInterval(window.timer);
	scale.innerHTML=num;
	loadingline.style.width=num+"%";
	var timer1=null;
	timer1=setInterval(function(){
		num++;
		if(num>=100){
			clearInterval(timer1);
			jsonp({
				url:"http://comment5.news.sina.com.cn/count/info",
				data:{
					pid:0,
					key:"kangzhanjuanguan2015",
				},
				cbName:"callback",
				success:function(json){
					mark=json;
					console.log(json);
					var sum=json.result.data.sum;
					towerHeight(sum);
					aspan[0].innerHTML=sum;
					aspan[1].innerHTML=sum;
					document.querySelector(".loading").classList.add("hide");
					if(blen){
						secIndex=2;
						article.classList.remove("hide");
						sections[2].classList.remove("hide");
						localStorage.removeItem('kangzhanjuanguan2015');
					}else{
						sec1.classList.remove("hide");
					}
					yingyue.classList.remove("hide");
					music.play();
				    document.addEventListener("WeixinJSBridgeReady", function () {
				        music.play();
				    }, false);
				}
			});
		}
		scale.innerHTML=num;
		loadingline.style.width=num+"%";
	},50);
	/*加载结束*/
	function addClickNum(){
		jsonp({
			url:"http://comment5.news.sina.com.cn/count/submit",
			data:{
				pid:0,
				key:"kangzhanjuanguan2015",
			},
			dataType:"jsonp",
			cbName:"callback",
			success:function(json){
			}
		});
	}
	//开场动画  开始
	startBtn.onclick=function(){
		animationBox.classList.remove("hide");
		animationBox.classList.add("tobig");
		qiao.classList.remove("hide");
		qiaoword.classList.remove("hide");
		setTimeout(function(){
			zidan.classList.remove("hide");
			setTimeout(function(){
				zidanAudio.play();
			},500);
		},2500);
		setTimeout(function(){
			qiao.classList.remove("opaci");
			qiaoword.classList.remove("opaci");
			qiao.classList.remove("delay1");
			qiaoword.classList.remove("delay2");
			qiao.classList.add("opaciOut");
			qiaoword.classList.add("opaciOut");
			huandengBox.classList.remove("hide");
			setTimeout(function(){
				for (var i = 0; i < picworlds.length; i++) {
					(function(index){
						setTimeout(function(){
							huandengpic.style.height=0;
							setTimeout(function(){
								showpic(index);
								picworlds[index].classList.remove("hide");
								if(index==5){
									cannext=true;
									setTimeout(function(){
										document.querySelector("#sec1 .tipbtn").classList.remove("hide");
									},500);
								}
							},600);
						},4000*index);
					})(i);
				};
			},2200);
		},6000);
	};
	function showpic(index){
		for (var i = 0; i < picworlds.length; i++) {
			picworlds[i].classList.add("hide");
		};
		huandengpic.style.background="url("+pers[index].src+") no-repeat 0 0";
		huandengpic.style.backgroundSize="100% auto";
		huandengpic.style.height=9.425+"rem";
	}
	addTouchEvent(sec1,"up",function(){
		if(cannext){
			article.classList.remove("hide");
			sections[0].classList.remove("hide");
			sec1.classList.add("fadeOutUp");
		}
	});

/*翻页*/
	var secIndex=0;
	for (var i = 0; i < sections.length; i++) {
		sections[i].style.zIndex=20-i;
		sections[i].classList.add("hide");
		(function(index){
			addTouchEvent(sections[index],"up",function(){
				if (secIndex==sections.length-1) {
					secIndex=sections.length-1;
					return;
				}
				if(index==1){
					document.querySelector(".juanBtn").classList.add("fadeInDown");
				}
				sections[secIndex+1].classList.remove("hide");
				sections[secIndex].classList.remove("fadeInUp");
				sections[secIndex].classList.add("fadeOutUp");
				secIndex++;
				//console.log(secIndex);
				return false;
			});
			addTouchEvent(sections[index],"down",function(){
				secIndex--;
				if(secIndex<0){
					secIndex=0;
					return;
				}
				sections[secIndex].classList.remove("hide");
				sections[secIndex].classList.remove("fadeOutUp");
				sections[secIndex].classList.add("fadeInUp");
				//console.log(secIndex);
				return false;
			});
		})(i);
	};
	/*添砖加瓦*/
	(function(){
		var bclick=false;
		//添砖按钮
		var zhuanbtn= document.querySelector(".zhuanBtn");
		//捐款按钮
		var juanbtn=document.querySelector(".juanBtn");
		var sharebtn=document.querySelector(".sharebtn");
		var aginbtn= document.querySelector(".aginbtn");
		var sharePage= document.querySelector(".share");
		var markPage=document.querySelector(".mark");
		if(localStorage.getItem('kangzhanjuanguan201508')){
			var ap=document.querySelectorAll(".markWord p");
			ap[0].innerHTML="感谢参与";
			ap[1].innerHTML="您已为纪念碑添过砖了";
			zhuanbtn.classList.add("active");
			juanbtn.classList.remove("hide");
			juanbtn.classList.add("active");
		}
		zhuanbtn.onclick=function(){
			if(localStorage.getItem('kangzhanjuanguan201508')){
				var ap=document.querySelectorAll(".markWord p");
				ap[0].innerHTML="感谢参与";
				ap[1].innerHTML="您已为纪念碑添过砖了";
			}else{
				localStorage.setItem('kangzhanjuanguan201508',true);
				aspan[0].innerHTML++;
				aspan[1].innerHTML++;
				addClickNum();
			}
			markPage.classList.remove("hide");
		};
		markPage.onclick=function(){
			markPage.classList.add("hide");
			zhuanbtn.classList.add("active");
			juanbtn.classList.remove("hide");
			juanbtn.classList.add("active");
		};
		sharebtn.onclick=function(){
			sharePage.classList.remove("justTosmall");
			sharePage.classList.add("justTobig");
			sharePage.classList.remove("hide");	
		};
		sharePage.onclick=function(){
			sharePage.classList.remove("justTobig");
			sharePage.classList.add("justTosmall");
		};
		juanbtn.onclick=function(){
			localStorage.setItem('kangzhanjuanguan2015',true);
		};
	})();

	/*音乐*/
	(function(){
		var bclick=false;
		yingyue.onclick=function(){
			if(bclick){
				music.play();
			    this.classList.add("run");
			    bclick=false;
			}else{
				music.pause();
			    this.classList.remove("run");
			    bclick=true;
			}
		};
	})();
	/*纪念碑的高度*/
	function towerHeight(n){
		var Height="1.9%";
		if (n<10000) {
			Height="1.9%";
		}else if(n<25000&&n>10000){
			Height="2%";
		}else if(n>=25000&&n<50000){
			Height="5%";
		}else if(n>=50000&&n<100000){
			Height="10%";
		}else if(n>=100000&&n<150000){
			Height="20%";
		}else if(n>=150000&&n<200000){
			Height="30%";
		}else if(n>=200000&&n<250000){
			Height="40%";
		}else if(n>=250000&&n<300000){
			Height="50%";
		}else if(n>=300000&&n<350000){
			Height="60%";
		}else if(n>=350000&&n<400000){
			Height="70%";
		}else if(n>=400000&&n<450000){
			Height="80%";
		}else if(n>=450000&&n<500000){
			Height="90%";
		}else if(n>=500000){
			Height="100%";
		}
		document.querySelector(".towerY").style.height=Height;
		document.querySelector(".towerscale span").innerHTML=Height;
	}
};