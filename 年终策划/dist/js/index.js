function getStyle(obj,name){
	return (obj.currentStyle || getComputedStyle(obj,false))[name];
}
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
		(typeof fn == "function") && fn.call(obj,bDown);
		oEvent.preventDefault && oEvent.preventDefault();
		return false;
	}
}
function isIE(ver){
    var b = document.createElement('b');
    b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
    return b.getElementsByTagName('i').length === 1;
}
var provinceList={
	"34":"安徽",
	"11":"北京",
	"50":"重庆",
	"35":"福建",
	"62":"甘肃",
	"44":"广东",
	"45":"广西",
	"52":"贵州",
	"46":"海南",
	"13":"河北",
	"23":"黑龙江",
	"41":"河南",
	"42":"湖北",
	"43":"湖南",
	"15":"内蒙古",
	"32":"江苏",
	"36":"江西",
	"22":"吉林",
	"21":"辽宁",
	"64":"宁夏",
	"63":"青海",
	"14":"山西",
	"37":"山东",
	"31":"上海",
	"51":"四川",
	"12":"天津",
	"54":"西藏",
	"65":"新疆",
	"53":"云南",
	"33":"浙江",
	"61":"陕西",
	"71":"台湾",
	"81":"香港",
	"82":"澳门",
	"400":"海外"
};
$(function(){
	function isIELow(){
		if(isIE(8)||isIE(7)||isIE(6)){
			alert("请升级浏览器观看");
		}
	}
	isIELow();
	
	var userIdNum=false;
	//1759115371
	var userPanel = window.SINA_USER_PANEL;
	var $query = userPanel.STK;
	var hasend = false;
	var userDateJson = {
		"sex":"未知",
		"age":"未知",
		"name":"未知",
		"add":"未知",
		"inter":[
			"雾霾"
		]
	};
	if(userPanel){
		userPanel.set('extra',{
				css: ''	
		}).set('outLoginLayer', {
		ready : function(){
			var loginLayer = window.SINA_OUTLOGIN_LAYER;
			if(loginLayer){
				loginLayer.set('extra',{
					css: 'http://i.sso.sina.com.cn/css/outlogin/v1/outlogin_skin_finance.css'
					}).set('sso', {
						entry : 'account'
					}).register("login_success",function(){
						userIdNum=loginLayer.getSinaCookie().uid;
						setHeadPic();
						contentPage=0;
						setContentPage();
						setMycommentTilte();
						showBtn();
					}).register("logout_success",function(){
					}).init();
				}
				document.querySelector(".logBtn").onclick=function(){
					loginLayer.set('plugin', {
						"position" : 'center',
						"parentNode" : null,
						"relatedNode" : null
					}).register("login_success",function(){
						userIdNum=loginLayer.getSinaCookie().uid;
						setHeadPic();
						modelShow();
						contentPage=0;
						setContentPage();
						setMycommentTilte();
						showBtn();
					}).show();
				};
				document.querySelectorAll(".inputAgin>span")[1].onclick=function(){
					loginLayer.set('plugin', {
						"position" : 'center',
						"parentNode" : null,
						"relatedNode" : null
					}).register("login_success",function(){
						userIdNum=loginLayer.getSinaCookie().uid;
						setHeadPic();
						modelShow();
						contentPage=0;
						setContentPage();
						setMycommentTilte();
						showBtn();
					}).show();
				};
			}
		}).set('container',{
			node: $query.E("SI_User")
		}).register('plugin_ready',function(){
		}).init();
	}

	function setMycommentTilte(){
		var mycommentTilte=document.querySelector(".mycommentTilte");
		mycommentTilte.innerHTML="我的新闻浏览、评论记录";
		newsListcover.style.right="-522px";
		commentList.style.left="-100%";
	}
	//屏幕高
	var clientH = document.documentElement.clientHeight;
	// 开始按钮
	var startBtn = document.querySelector(".startBtn");
	//包含 遮罩  展示数据  
	var showData = document.querySelector(".showData");
	//假新闻页
	var news = document.querySelector(".news");
	



	function modelShow(){
		news.style.top="-350px";
		showData.style.display="block";
		if(userIdNum){
			goToLogin.style.left="0";
			resolute();
		}else{
			goToLogin.style.left="-100%";
		}
	}
	//document removemousewheel
	
	//document addmousewheel
	function addWheelDocu(){
		if(window.navigator.userAgent.toLowerCase().indexOf("firefox") != -1){
			document.addEventListener("DOMMouseScroll",afnWheel,false);	
		} else {
			document.onmousewheel = afnWheel;
		}
		var t=0;
		function afnWheel(ev){
			var oEvent = ev || event;
			var bDown = true;
			if(oEvent.wheelDelta){
				bDown = oEvent.wheelDelta > 0 ? false : true;
			} else {
				bDown = oEvent.detail > 0 ? true : false;	
			}
			(typeof newsMove == "function") && newsMove(bDown);
			oEvent.preventDefault && oEvent.preventDefault();
			return false;
		}
		function newsMove(dir){
			if(dir){
				t-=40;
				t=t<=-(2170-clientH)?-(2170-clientH):t;
			}else{
				t+=40;
				t=t>=0?0:t;
			}
			news.style.top=t+"px";
		}
		setTimeout(function (){
			if(window.navigator.userAgent.toLowerCase().indexOf("firefox") != -1){
				document.removeEventListener("DOMMouseScroll",afnWheel,false);	
			} else {
				document.onmousewheel = null;
			}
			modelShow();
		},3000);
	}
	
	
	//开始动画
	startBtn.onclick=function(){
		if(isIE(8)||isIE(7)||isIE(6)){
			alert("请升级浏览器观看");
			return;
		}
		news.style.display="block";
		setTimeout(function(){
			document.querySelector(".part1").style.display="none";
			news.className="news";
		},500);
		setTimeout(function(){
			$(".bkground").animate({"top":"-20%"},500);
			$(".glass").animate({"top":"25%"},1000,function(){
				addWheelDocu();
			});
		},2000);
	};

	/*
	*	遮罩层 逻辑
	*/
	//遮罩父级
	var goToLogin = document.querySelector(".goToLogin");
	//遮罩  解析数据页
	var resolution = document.querySelector(".resolution");
	//遮罩  引导填写 个人信息页
	var btnbox = document.querySelector(".btnbox");
	//遮罩 填写个人信息页
	var userInput = document.querySelector(".input");
	// 遮罩 拒绝登陆页
	var loginOff = document.querySelector(".loginOff");
	//个人信息  侧栏
	var personalInfor = document.querySelector(".personalInfor");
	

	// 解析动效
	function resolute(){
		var n=0,step=27,timer;
		
		timer=setInterval(function(){
			n++;
			if(n>=6){
				clearInterval(timer);
			}
			$(".getMes ul").css({"top":(81-27*n)+"px"});
		},1000);
		addAnimation();
		setTimeout(function(){
			$(".bkground").hide();
			$(".glass").hide();
			goToLogin.style.background="none";
			$(".portrait").addClass("headMove");
			personalInfor.style.left="0";
			news.style.top="0";
			setTimeout(function(){
				goToLogin.style.display="none";
				tipDarg();
			},500)
		},7000);
	}
	function addAnimation(){
		$(".animate").each(function(index){
			$(this).addClass("glassAnimate"+index);
		})
	}
	//获取用户信息
	function setHeadPic(){
		$.ajax({
			url:"http://api.sina.com.cn/weibo/2/users/show.json",
			data:{
				"uid":userIdNum,
				"source":2835469272
			},
			type:"get",
			dataType:"jsonp",
			jsonp:"callback",
			success:function(json){
				if(json.result.status.code==0){
					userDateJson.sex=json.result.data.gender;
					userDateJson.src=json.result.data.avatar_large;
					userDateJson.name=json.result.data.name;
					userDateJson.add=provinceList[json.result.data.province];
					setInf();
				}
			}
		});
		$.ajax({
			url:"http://comment5.news.sina.com.cn/user/cmnt",
			data:{
				"uid":userIdNum,
				"count":2015
			},
			type:"get",
			dataType:"jsonp",
			jsonp:"callback",
			success:function(json){
				if(json.result.status.code==0){
					$(".record span i").html(json.result.data.pc_count);
					$(".newsListNumP span").html(json.result.data.pc_count);
				}
			}
		});
		$.ajax({
			url:"http://comment5.news.sina.com.cn/user/cmnt",
			data:{
				"uid":userIdNum
			},
			type:"get",
			dataType:"jsonp",
			jsonp:"callback",
			success:function(json){
				if(json.result.status.code==0){
					find2(json.result.newsdict);
				}
			}
		});
		$.ajax({
			url:"http://cre.mix.sina.com.cn/get/user/profile",
			data:{
				"uid":userIdNum,
				"translate":1
			},
			type:"get",
			dataType:"jsonp",
			jsonp:"callback",
			success:function(json){
				if(json.result.status.code==0){
					var arr=[];

					for (name in json.result.data.t){
						var str=name+"-"+json.result.data.t[name];
						arr.push(str);
					}
					arr.sort(function(a,b){
						return b.split("-")[1]-a.split("-")[1];
					})

					for (var i = 0; i < arr.length; i++) {
						if(i==5){
							break;
						}
						var str=arr[i].split("-")[0];
						userDateJson.inter.push(str);
						setInter();
					};
					
				}
			}
		});
		$.ajax({
			url:"http://cre.mix.sina.com.cn/get/user/history",
			data:{
				"uid":userIdNum
			},
			type:"get",
			dataType:"jsonp",
			jsonp:"callback",
			success:function(json){
				if(json.result.status.code==0){
					var arr=json.result.data;
					arr.sort(function(a,b){
						return b.ctime-a.ctime;
					});
					var oUl=document.querySelector(".newsCom>ul");
					oUl.innerHTML="";
					for (var i = 0; i < arr.length; i++) {
						if(i==5){
							break;
						}
						var oLi=document.createElement("li");
						oLi.innerHTML="<a href="+arr[i].url+" target='_blank'><span></span>"+arr[i].title+"</a>"
						oUl.appendChild(oLi);
					};
				}
			}
		});
	}


	function find2(json){
		var arr=[];
		for(name in json){
			arr.push(json[name]);
		}
		arr.sort(function(a,b){
			return getTime(b.time)-getTime(a.time);
		})
		var oUl=document.querySelector(".newsList>ul");
		oUl.innerHTML="";
		
		for (var i = 0; i < 2; i++) {
			var oLi=document.createElement("li");
			if(!arr[i]){break;}
			console.log(arr[i].url);
			oLi.innerHTML="<a href="+arr[i].url+" target='_blank'><span></span>"+arr[i].title+"</a>"
			oUl.appendChild(oLi);
		};
	}
	function getTime(str){
		var arr=str.split(" ");
		var arr1=arr[0].split("-");
		var arr2=arr[1].split(":");
		var time=new Date(arr1[0],arr1[1],arr1[2],arr2[0],arr2[1],arr2[2]);
		return time;
	}

	var sex = document.querySelectorAll(".info span")[0];
	var age = document.querySelectorAll(".info span")[2];
	var addres = document.querySelectorAll(".info span")[4];
	var name = document.querySelector(".info>p");
	var label = document.querySelector(".label");
	var portrait = document.querySelector(".portrait");
	var touxing = document.querySelector(".touxing");
	var showDataName = document.querySelector(".showDataName");

	function setInf(){
		setSrc();
		setSex();
		setInter();
		setName();
		setAddres();
		setAge();
	}
	function setSrc(){
		if(userDateJson.src){
			portrait.style.background="url("+userDateJson.src+") no-repeat";
			touxing.style.background="url("+userDateJson.src+") no-repeat";
			touxing.style.backgroundSize="cover";
		}
	}
	function setSex(){
		if(userDateJson.sex=='m'){
			sex.innerHTML="男";
			//circleBox2Att.innerHTML="男性";
		}else if(userDateJson.sex=='f'){
			sex.innerHTML="女";
			//circleBox2Att.innerHTML="女性";
		}
	}
	function setInter(){
		label.innerHTML="";
		for (var i = 0; i < userDateJson.inter.length; i++) {
			if(i==6){
				userDateJson.inter.length=6;
				break;
			}
			var oSpan=document.createElement("span");
			oSpan.innerHTML = userDateJson.inter[i];
			label.appendChild(oSpan);
		};
	}
	function setName(){
		if(userDateJson.name!="未知"){
			name.innerHTML = userDateJson.name;
			showDataName.innerHTML=userDateJson.name;
		}
	}
	function setAddres(){
		addres.innerHTML = userDateJson.add;
		circleBox2Att.innerHTML=userDateJson.add;
		otherLikeTitle.innerHTML=userDateJson.add;
	}
	function setAge(){
		if(isNaN(userDateJson.age))return;
		userDateJson.age+="";
		userDateJson.age=userDateJson.age.substring(0,3);
		age.innerHTML = +userDateJson.age;
	}


	//开关 个人信息侧栏
	var closeBtn = document.querySelector(".closeBtn");
	closeBtn.onclick=function(){
		var left=parseInt(getStyle(personalInfor,"left"));
		if(left==0){
			personalInfor.style.left="-370px";
			this.className="closeBtn active";
		}else{
			personalInfor.style.left="0";
			this.className="closeBtn";
		}
	};


	//榜单元素

    var interest =document.querySelector(".interest");
    var record =document.querySelector(".record");
    var interestBtn=interest.children[0];
    var recordBtn=record.children[0];

	//关闭榜单
	var closeList1 = document.getElementById("closeList1");
	var closeList2 = document.getElementById("closeList2");

	function showBtn(){
		closeList1.style.display="block";
		closeList2.style.display="block";
	}

	var lookList1 = document.getElementById('lookList1');
	var lookList2 = document.getElementById('lookList2');
	var commentList = document.querySelector(".commentList");
	var newsListcover = document.querySelector(".newsListcover");

	//查看全部榜单
	var closeList11 = document.querySelector("#closeList11");
	var closeList22 = document.querySelector("#closeList22");
	//全部榜单
	var allList1 =document.querySelector(".allListBox1");
	var allList2 =document.querySelector(".allListBox2");

	//关闭全部榜单
	var classAllList1 =document.querySelector(".allListBox1>div>span");
	var classAllList2 =document.querySelector(".allListBox2>div>span");

	closeList11.onclick=function(){
		allList2.style.display="block";
	};
	closeList22.onclick=function(){
		allList1.style.display="block";
	};
	classAllList1.onclick=function(){
		allList1.style.display="none";
	};
	classAllList2.onclick=function(){
		allList2.style.display="none";
	};

	closeList1.onclick=function(){
		if(userIdNum){
			if(userIdNum>1){
				commentList.style.left="-100%";
			}else{
				alert("请登录后查看更多精彩内容");
			}
		}else{
			alert("请登录后查看更多精彩内容");
		}
	};
	closeList2.onclick=function(){
		if(userIdNum){
			if(userIdNum>1){
				newsListcover.style.right="-522px";
			}else{
				alert("请登录后查看更多精彩内容");
			}
		}else{
			alert("请登录后查看更多精彩内容");
		}
	};
	lookList2.onclick=function(){
		commentList.style.left="0";
	};
	lookList1.onclick=function(){
		newsListcover.style.right="0";
	};
	//暂不登陆
	var noLogin= document.querySelector(".noLogin");
	noLogin.onclick=function(){
		goToLogin.style.left="-200%";
	};

	//
	var backLoginBtn = document.querySelector(".backLoginBtn");
	var nextLoginBtn = document.querySelector(".nextLoginBtn");

	nextLoginBtn.onclick=function(){
		goToLogin.style.left="-300%";
	};
	backLoginBtn.onclick=function(){
		goToLogin.style.left="-100%";
	};

	var back = document.querySelector(".back");
	var noTo = document.querySelector(".noTo");

	back.onclick=function(){
		goToLogin.style.left="-200%";
	};
	noTo.onclick=function(){
		$(".bkground").hide();
		$(".glass").hide();
		news.style.top="0";
		goToLogin.style.display="none";
		setContentPage();
		personalInfor.style.left="0";
		setTimeout(function(){
			$(".inputAgin").addClass("shine");
		},1000);
	};

	var content = document.querySelector(".content");
	var contentPage = 1;
	if(userIdNum){
		contentPage=0;
	}
	var startDate=+new Date();
	addMouseWheel(content,function(dir){
		var nowDate = +new Date();
		if((nowDate-startDate)<1000){
			return;
		}
		startDate=nowDate;
		if(!dir){
			contentPage--;
			if(userIdNum){
				contentPage= contentPage<=0?0:contentPage;
			}else{
				contentPage= contentPage<=1?1:contentPage;
			}
		}else{
			contentPage++;
			contentPage=contentPage>=4?4:contentPage;
		}
		setContentPage();
	});
	
	function setContentPage(){
		setSideInfo();
		setSideInfoTag();
		if(contentPage==2){
			numAnim(allNews,1277532,20101,"1,277,532");
			numAnim(allCom,68594085,1231231,"68,594,085");
			numAnim(allShare,2506455,32345,"2,506,455");
			numAnim(allTime,350706621,5311111,"350,706,621");
		}else{
			clearInterval(allNews.timer);
			clearInterval(allCom.timer);
			clearInterval(allShare.timer);
			clearInterval(allTime.timer);
		}
		if(contentPage==3){
			numAnim(allPer,1613131005,26541111,"1,613,131,005");
		}else{
			clearInterval(allPer.timer);
		}
		if(contentPage==4){
			$(".ani").each(function(){
				this.style.display="block";
			})
		}
		content.style.top=-contentPage*100+"%";
	}

	//数字动效
	// allNews  114,610
	// allCom   68,594,085
	// allShare   2,506,455
	// allTime   350,706,600
	// chartPage   1,613,131,005
	var allNews = $(".allNews strong")[0];
	var allCom = $(".allCom strong")[0];
	var allShare = $(".allShare strong")[0];
	var allTime = $(".allTime strong")[0];
	var allPer = $(".chartPage strong")[0];
	function numAnim(obj,endnum,step,endstr){
		if(obj.innerHTML>=endnum)return;
		var n=0;
		obj.timer=setInterval(function(){
			n+=step;
			if(n>=endnum){
				obj.innerHTML=endstr;
				clearInterval(obj.timer);
			}else{
				obj.innerHTML=n;
			}
		},30);
	};

	//图标
	function pie1(id){
      $('#'+id).highcharts({
            chart: {
            	height:240,
            	width:280,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
          		marginRight:0,
                backgroundColor:"none"
            },
            colors:['#e88687','#f2c182','#cb88c2','#81d6e1','#b1d776','#6eaceb','#68cd9a','#9d8fe6','#d3ab31','#dccf44'],
            credits: {
                enabled: false
            },
             title: {
	            text: null
	        },
            legend: {
              itemStyle: {
                    color: '#666666'
                }
            },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'     //{series.name}: 
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b style="color:#666666;">{point.name}</b>',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || '#666666'
                        }
                    }
                }
            },
            series: [{
	            type: 'pie',
	            name: '',
	            data: [
	                ['19岁以下',   11.0],
	                {
	                    name: '20~29岁',
	                    y: 43.0,
	                    sliced: true,
	                    selected: true
	                },
	                ['30~39岁',    24.0],
	                ['40~49岁',    14.0],
	                ['50~59岁',     6.0],
	                ['60岁以上',   3.0]
	            ]
	        }]
        });
    }
    function pie2(id){
      $('#'+id).highcharts({
            chart: {
            	height:200,
            	width:200,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
          		marginRight:0,
                backgroundColor:"none"
            },
            colors:['#e88687','#f2c182','#cb88c2','#81d6e1','#b1d776','#6eaceb','#68cd9a','#9d8fe6','#d3ab31','#dccf44'],
            credits: {
                enabled: false
            },
             title: {
	            text: null
	        },
            legend: {
              itemStyle: {
                    color: '#666666'
                }
            },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'     //{series.name}: 
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b style="color:#666666;">{point.name}</b>',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || '#666666'
                        }
                    }
                }
            },
            series: [{
	            type: 'pie',
	            name: '',
	            data: [
	                {
	                    name: '男性',
	                    y: 79.0,
	                    sliced: true,
	                    selected: true
	                },
	                ['女性',    21.0],
	            ]
	        }]
        });
    }
    function pie3(id){
      $('#'+id).highcharts({
            chart: {
            	height:240,
            	width:260,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
          		marginRight:0,
                backgroundColor:"none"
            },
            colors:['#e88687','#f2c182','#cb88c2','#81d6e1','#b1d776','#6eaceb','#68cd9a','#9d8fe6','#d3ab31','#dccf44'],
            credits: {
                enabled: false
            },
             title: {
	            text: null
	        },
            legend: {
              itemStyle: {
                    color: '#666666'
                }
            },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'     //{series.name}: 
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b style="color:#666666;">{point.name}</b>',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || '#666666'
                        }
                    }
                }
            },
            series: [{
	            type: 'pie',
	            name: '',
	            data: [
				{
	                    name: '广东',
	                    y: 12.0,
	                    sliced: true,
	                    selected: true
	                },
	                ['北京',   8],
	                ['江苏',       7],
	                ['浙江',    6],
	                ['山东',     6],
	                ['海外',   5],
	                ['天津',   5],
	                ['湖南',   4],
	                ['河南',   4],
	                ['河北',   4],
	                ['湖北',   4],
	                ['上海',   4],
	                ['福建',   3],
	                ['四川',   3],
	                ['辽宁',   3],
	                ['安徽',   3],
	                ['陕西',   2],
	                ['广西',   2],
	                ['山西',   2],
	                ['江西',   2],
	                ['吉林',   2],
	                ['黑龙江',   2],
	                ['重庆',   1],
	                ['云南',   1],
	                ['未知',   1],
	                ['内蒙古',   1],
	                ['贵州',   1],
	                ['甘肃',   1],
	                ['新疆',   1],
	                ['海南',   0.41],
	                ['宁夏',   0.26],
	                ['台湾',   0.2],
	                ['香港',   0.17],
	                ['青海',   0.17],
	                ['西藏',   0.06],
	                ['澳门',   0.02]
	            ]
	        }]
        });
    }
    function pie4(id){
      $('#'+id).highcharts({
            chart: {
            	height:240,
            	width:260,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
          		marginRight:0,
                backgroundColor:"none"
            },
            colors:['#e88687','#f2c182','#cb88c2','#81d6e1','#b1d776','#6eaceb','#68cd9a','#9d8fe6','#d3ab31','#dccf44'],
            credits: {
                enabled: false
            },
             title: {
	            text: null
	        },
            legend: {
              itemStyle: {
                    color: '#666666'
                }
            },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'     //{series.name}: 
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b style="color:#666666;">{point.name}</b>',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || '#666666'
                        }
                    }
                }
            },
            series: [{
	            type: 'pie',
	            name: '',
	            data: [
			{
	                    name: '广东',
	                    y: 13.15,
	                    sliced: true,
	                    selected: true
	                },
	                ['北京',   10.99],
				    ['山东',     10.32],
	                ['江苏',       6.04],
	                ['天津',   4.66],
	                ['湖北',   4.59],
	                ['浙江',    4.29],
	                ['上海',   4.26],
	                ['河北',   4.10],
	                ['四川',   3.93],
	                ['河南',   3.47],
	                ['辽宁',   2.70],
	                ['福建',   2.49],
	                ['安徽',   2.43],
	                ['陕西',   2.29],
	                ['山西',   2.17],
	                ['湖南',   2.05],
	                ['广西',   1.98],
	                ['海外',   1.71],
	                ['贵州',   1.71],
	                ['黑龙江',   1.52],
	                ['吉林',   1.42],
	                ['重庆',   1.30],
	                ['江西',   1.29],
	                ['云南',   1.17],
	                ['甘肃',   0.98],
	                ['内蒙古',   0.87],
	                ['新疆',   0.82],
	                ['海南',   0.61],
	                ['宁夏',   0.22],
	                ['香港',   0.19],
	                ['青海',   0.14],
	                ['台湾',   0.08],
	                ['西藏',   0.06],
	                ['澳门',   0.02]					
	            ]
	        }]
        });
    }
    pie1("chart1");
    pie2("chart2");
    pie3("chart3");
    pie4("chart4");

    var startAginBtn = document.querySelector(".footerstartAginBtn");
    var shareBtn = document.querySelector(".footershareBtn");
    startAginBtn.onclick=function(){
    	if(userIdNum){
			contentPage=0;
		}else{
			contentPage=1;
		}
		setContentPage();
    };

    function setSideInfo(){
    	if(contentPage>1){
    		personalInfor.style.display="none";
    	}else{
    		personalInfor.style.display="block";
    	}
    }
    function setSideInfoTag(){
    	if(contentPage==0){
    		interest.className="interest";
    		record.className="record Nactive";
    	}else if(contentPage==1){
    		interest.className="interest Nactive";
    		record.className="record";
    	}
    }
    interestBtn.onclick=function(){
    	interest.className="interest";
    	record.className="record Nactive";
    	if(userIdNum){
    		contentPage=0;
			setContentPage();
    	}	
    };
    recordBtn.onclick=function(){
    	interest.className="interest Nactive";
    	record.className="record";
    	contentPage=1;
    	setContentPage();
    };

    var huanYiZuBtn=document.querySelector(".mylist1").children[1];
    var listBoxUl=document.querySelector(".listbox1 ul");
    var listBoxLi=document.querySelectorAll(".listbox1 ul li span");

    huanYiZuBtn.onclick=function(){
    	var left=parseInt(getStyle(listBoxUl,"left"));
    	if(left==0){
    		listBoxUl.style.left="-345px";
    	}else{
    		listBoxUl.style.left="0";
    	}
    };
    for (var i = 0; i < listBoxLi.length; i++) {
    	listBoxLi[i].onclick=function(){
    		this.className="active";
    		var str=this.getAttribute("data-inner");
    		if(str){
    			userDateJson.inter.push(str);
    		}
    	};
    };

    var inputOkBtn=document.querySelector(".inputOkBtn");
    var age3=document.querySelector(".age3");
    var hasChanged2=false;
    inputOkBtn.onclick=function(){
    	if(!hasChanged2){
    		userDateJson.add="北京";
    	};
    	if(!hasChangedSex2)return;
    	var value=+age3.value;
    	if(age3.value){
    		if(!isNaN(value)){
	    		userDateJson.age=value;
	    	}else{
	    		return;
	    	}
    	}else{
    		return;
    	}
    	userIdNum=true;
    	contentPage=0;
    	setContentPage();
    	setInf();
    	modelShow();
    	confighuanList();
    };
    var selecteEle=document.querySelector(".add1 select");
    selecteEle.onchange=function(){
    	userDateJson.add=this.value;
    	hasChanged2=true;
    };
    var sex3=document.querySelector(".sex3");
    var sex4=document.querySelector(".sex4");
    var hasChangedSex2=false;
    sex3.onclick=function(){
    	this.className="sex3 inputbkground active";
    	sex4.className="sex4 inputbkground";
    	userDateJson.sex="m";
    	hasChangedSex2=true;
    };
    sex4.onclick=function(){
    	this.className="sex4 inputbkground active";
    	sex3.className="sex3 inputbkground";
    	userDateJson.sex="f";
    	hasChangedSex2=true;
    };

    var inputAginBtn = document.querySelector(".inputAgin>span");

    var inputAginBox = document.querySelector(".inputAginBox");
    var inputAginBoxBtn = document.querySelector(".inputAginBox>div");
    var inputAge2=document.querySelector(".inputAge2");
    var inputAdd=document.querySelector('.inputAdd>select');
    var hasChanged=false;
    inputAdd.onchange=function(){
    	hasChanged=true;
    	userDateJson.add=inputAdd.value;
    };
    inputAginBoxBtn.onclick=function(){
    	var value=+inputAge2.value;
    	var hasAge=false;
    	if(value){
    		if(!isNaN(value)){
	    		userDateJson.age=value;
	    		hasAge=true;
	    		
	    	}
    	}
    	if(!hasChanged){
    		userDateJson.add="北京";
    	}
    	if(hasAge&&hasChangedSex){
    	
    		userIdNum=true;
    		contentPage=0;
    		setContentPage();
    		confighuanList();
    		tipDarg();
    		
    	}
    	setInf();
    	
    	inputAginBox.style.display="none";
    	
    }; 
    inputAginBtn.onclick=function(){
    	inputAginBox.style.display="block";
    };

    var inputSex2=document.querySelector('.inputSex2');
    var inputSex3=document.querySelector('.inputSex3');
    var hasChangedSex=false;
    inputSex2.onclick=function(){
    	this.className="inputSex2 active";
    	inputSex3.className="inputSex3";
		userDateJson.sex="m";
		hasChangedSex=true;
    };
    inputSex3.onclick=function(){
    	this.className="inputSex3 active";
    	inputSex2.className="inputSex2";
    	userDateJson.sex="f";
    	hasChangedSex=true;
    };

    var inputLabelBtn=document.querySelector(".inputLabel>span");
    var inputLabelInput=document.querySelector(".inputLabel>input");
    inputLabelBtn.onclick=function(){
    	if(inputLabelInput.value){
    		for (var i = 0; i < userDateJson.inter.length; i++) {
    			if(inputLabelInput.value==userDateJson.inter[i]){
    				break;
    			}
    		};
    		if(i==userDateJson.inter.length){
    			userDateJson.inter.unshift(inputLabelInput.value);
    			inputLabelInput.value="";
    			setInter();
    			findSame(cIndex1,cIndex2);
    		}
    	}
    };

    //相同标签 插入到列表
    var aguessList=["国内新闻"];
    var guessList=document.querySelector(".guess>div");

    function inputGuessList(text){
    	for (var i = 0; i < aguessList.length; i++) {
    		if(aguessList[i]==text){
    			break;
    		}
    	};
    	if(i<aguessList.length)return;
    	aguessList.push(text);
    	var a=document.createElement("a");
    	a.href="http://tags.news.sina.com.cn/"+text;
    	a.target='_blank';
    	a.innerHTML=text;
    	guessList.insertBefore(a,guessList.children[0]);
    }


    //第一次进入 拖拽页 效果

    var hardCircle2 = document.querySelector(".hardCircle2");
    function tipDarg(){
    	setTimeout(function(){
    		if(findSame(cIndex1,cIndex2)){
				hardCircle2.style.right="70px";
			}else{
				hardCircle2.style.right="0";
			};
			setTimeout(function(){
	    		$('.hardtip2').stop().animate({"opacity":0},100,function(){
		    		$('.hardtip2').stop().animate({"opacity":1},100,function(){
		    			$('.hardtip2').stop().animate({"opacity":0},100,function(){
		    				$('.hardtip2').stop().animate({"opacity":1},100,function(){
				    			$('.hardtip2').stop().animate({"opacity":0},100,function(){
				    				$('.hardtip2').hide();
				    				guessList.children[0].style.opacity=1;
				    			})
				    		})
		    			})
		    		})
		    	})
	    	},2000);
    	},3000);
    }
    
    var message="add";
    var attr2 = document.querySelector(".attr2");
    var attr1 = document.querySelector('.attr1');
    function findSame(index1,index2){
    	if(userDateJson.inter[index1]){
    		attr1.innerHTML=userDateJson.inter[index1];
    	}else{
    		attr1.innerHTML="未知";
    	}
    	if(message=="add"){
    		attr2.innerHTML=addMessage[messageIndex][1][0][index2];
    		if(addMessage[messageIndex][1][0][index2]==userDateJson.inter[index1]){
    			inputGuessList(userDateJson.inter[index1]);
    			hardCircle2.style.right="70px";
    			return true;
    		}
    	}else if(message=="age"){
    		attr2.innerHTML=ageMessage[messageIndex][1][0][index2];
			if(ageMessage[messageIndex][1][0][index2]==userDateJson.inter[index1]){
    			inputGuessList(userDateJson.inter[index1]);
    			hardCircle2.style.right="70px";
    			return true;
    		}
    	}else if(message=="sex"){
    		attr2.innerHTML=secMessage[messageIndex][1][0][index2];
    		if(secMessage[messageIndex][1][0][index2]==userDateJson.inter[index1]){
    			inputGuessList(userDateJson.inter[index1]);
    			hardCircle2.style.right="70px";
    			return true;
    		}
    	}
    	hardCircle2.style.right="0";
    	return false;
    }

    var nnn=0;
    var hardBtn= document.querySelector('.hardBtn');
    var circleBox2=document.getElementById("circleBox2");
    var circleBox2Att=document.getElementById("circleBox2Att");
    var otherLikeTitle= document.getElementById("otherLikeTitle");
    var messageIndex=1;

    var cIndex1=0;
    var cIndex2=0;
    hardBtn.onclick=function(){
    	nnn++;
    	var n=nnn%3;
    	if(n==0){
    		message="add";
    		circleBox2.className="";
    		if(userDateJson.add=="未知"){
    			circleBox2Att.innerHTML="北京";
    			huanList(addMessage,1);
    			otherLikeTitle.innerHTML="北京";
    			messageIndex=1;
    		}else{
    			hardsetAttBox2(addMessage);
    		}
    		this.innerHTML="切换下一属性:性别";
    	}else if(n==1){
    		message="sex";
    		circleBox2.className="active1";
    		if(userDateJson.sex=="未知"){
    			circleBox2Att.innerHTML="男性";
    			huanList(secMessage,0);
    			otherLikeTitle.innerHTML="男性";
    			messageIndex=0;
    		}else{
    			hardsetAttBox2(secMessage);
    		}
    		findSame(cIndex1,cIndex2);
    		this.innerHTML="切换下一属性:年龄";
    	}else if(n==2){
    		message="age";
    		circleBox2.className="active2";
    		if(userDateJson.age=="未知"){
    			circleBox2Att.innerHTML="20~29年龄段";
				otherLikeTitle.innerHTML="20~29年龄段";
    			huanList(ageMessage,1);
    			messageIndex=1;
    		}else{
    			hardsetAttBox2(ageMessage);
    		}
    		findSame(cIndex1,cIndex2);
    		this.innerHTML="切换下一属性:地域";
    	}
    };
    function hardsetAttBox2(mes){
    	for (var i=0; i < mes.length; i++) {
    		if(mes[i][0]==userDateJson[message]){
    			if(mes[i][0]=="m"){
    				circleBox2Att.innerHTML="男性";
    				otherLikeTitle.innerHTML="男性";
    				huanList(secMessage,0);
    				messageIndex=0;
    			}else if(mes[i][0]=="f"){
    				circleBox2Att.innerHTML="女性";
    				otherLikeTitle.innerHTML="女性";
    				huanList(secMessage,1);
    				messageIndex=1;
    			}else{
    				circleBox2Att.innerHTML=mes[i][0];
    				otherLikeTitle.innerHTML=mes[i][0];
    				huanList(addMessage,i);
    				messageIndex=i;
    			}
    		}
    	};

    	if(message=="age"){
    		if(userDateJson.age<20){
    			circleBox2Att.innerHTML=ageMessage[0][0];
    			otherLikeTitle.innerHTML=ageMessage[0][0];

    			huanList(ageMessage,0);
    			messageIndex=0;
    		}else if(userDateJson.age>=20&&userDateJson.age<=29){
    			circleBox2Att.innerHTML=ageMessage[1][0];
    			otherLikeTitle.innerHTML=ageMessage[1][0];
    			huanList(ageMessage,1);
    			messageIndex=1;
    		}else if(userDateJson.age>=30&&userDateJson.age<=39){
    			circleBox2Att.innerHTML=ageMessage[2][0];
    			otherLikeTitle.innerHTML=ageMessage[2][0];
    			huanList(ageMessage,2);
    			messageIndex=2;
    		}else if(userDateJson.age>=40&&userDateJson.age<=49){
    			circleBox2Att.innerHTML=ageMessage[3][0];
    			otherLikeTitle.innerHTML=ageMessage[3][0];
    			huanList(ageMessage,3);
    			messageIndex=3;
    		}else if(userDateJson.age>=50&&userDateJson.age<=59){
    			circleBox2Att.innerHTML=ageMessage[4][0];
    			otherLikeTitle.innerHTML=ageMessage[4][0];
    			huanList(ageMessage,4);
    			messageIndex=4;
    		}else if(userDateJson.age>=60){
    			circleBox2Att.innerHTML=ageMessage[5][0];
    			otherLikeTitle.innerHTML=ageMessage[5][0];
    			huanList(ageMessage,5);
    			messageIndex=5;
    		}
    	}
    }

    function huanList(arr,index){
    	var otherLike=document.querySelector(".otherLike>ul");
    	otherLike.innerHTML="";
    	for (var i = 0; i < arr[index][1][1].length; i++) {
    		var oLi=document.createElement("li");
    		oLi.innerHTML="<a target='_blank' href="+arr[index][1][1][i].href+"><span></span>"+arr[index][1][1][i].title+"</a>";
    		otherLike.appendChild(oLi);
    	};
    }

    function confighuanList(){
    	var otherLike=document.querySelector(".otherLike>ul");
    	otherLike.innerHTML="";
    	if(message=="add"){
    		for (var j = 0; j < addMessage.length; j++) {
    			if(addMessage[j][0]==userDateJson.add){
    				break;
    			}
    		};
    		if(j==addMessage.length){
    			j=1;
    		}
    		for (var i = 0; i < addMessage[j][1][1].length; i++) {
	    		var oLi=document.createElement("li");
	    		oLi.innerHTML="<a target='_blank' href="+addMessage[j][1][1][i].href+"><span></span>"+addMessage[j][1][1][i].title+"</a>";
	    		otherLike.appendChild(oLi);
	    	};
    	}else if(message=="age"){
    		for (var j = 0; j < ageMessage.length; j++) {
    			if(ageMessage[j][0]==userDateJson.age){
    				break;
    			}
    		};
    		if(j==ageMessage.length){
    			j=1;
    		}
			for (var i = 0; i < ageMessage[j][1][1].length; i++) {
	    		var oLi=document.createElement("li");
	    		oLi.innerHTML="<a target='_blank' href="+ageMessage[j][1][1][i].href+"><span></span>"+ageMessage[j][1][1][i].title+"</a>";
	    		otherLike.appendChild(oLi);
	    	};
    	}else if(message=="sex"){
    		for (var j = 0; j < secMessage.length; j++) {
    			if(secMessage[j][0]==userDateJson.sex){
    				break;
    			}
    		};
    		if(j==secMessage.length){
    			j=0;
    		}
			for (var i = 0; i < secMessage[j][1][1].length; i++) {
	    		var oLi=document.createElement("li");
	    		oLi.innerHTML="<a target='_blank' href="+secMessage[j][1][1][i].href+"><span></span>"+secMessage[j][1][1][i].title+"</a>";
	    		otherLike.appendChild(oLi);
	    	};
    	}
    }
    confighuanList();
    



    Raphael(function(){
		var p=new Raphael(0,0,100,100);
		var oDiv1=document.getElementById('circleBox1')
		var oDiv2=document.getElementById('circleBox2')

		var p1=new Raphael(0,0,400,400);
		var p2=new Raphael(0,0,400,400);

		oDiv1.appendChild(p1.canvas);
		oDiv2.appendChild(p2.canvas);


		var path1=p1.path('M200 33 A 167 167, 0, 0, 0, 200, 367').attr({
			'stroke-linejoin':'round',
			'stroke':"#6ac0e1",
			'stroke-opacity':0,
			'stroke-width':1
		});
		var path2=p2.path('M200 33 A 167 167, 0, 1, 1, 200, 367').attr({
			'stroke-linejoin':'round',
			'stroke':"#6ac0e1",
			'stroke-opacity':0,
			'stroke-width':1
		});

		var c1=p1.circle(200,33,16).attr({"fill":'#fff',"stroke":"#6ac0e1",'cursor':'pointer'});
		var c2=p2.circle(200,33,16).attr({"fill":'#fff',"stroke":"#6ac0e1",'cursor':'pointer'});

		var total=path1.getTotalLength();
		var tota2=path2.getTotalLength();
		var len1=0;
		var len2=0;
		var json2=path2.getPointAtLength(len2);

		var startX,startY;
		c1.drag(function(dx,dy,x,y,event){
			
			var angle = Raphael.angle(200,200,dx+startX,dy+startY);
			if(angle<=90){
				len1=(90-angle)*Math.PI*167/180;
			}else if(angle>=270){
				len1=(450-angle)*Math.PI*167/180;
			}
			var scale=len1/total;
			var index;
			if(scale<1/6){
				index=0;
			}else if(scale>=1/6&&scale<1/3){
				index=1;
			}else if(scale>=1/3&&scale<1/2){
				index=2;
			}else if(scale>=1/2&&scale<2/3){
				index=3;
			}else if(scale>=2/3&&scale<5/6){
				index=4;
			}else if(scale>=5/6){
				index=5;
			}
			if(cIndex1!=index){
				cIndex1=index;
				if(findSame(cIndex1,cIndex2)){
					hardCircle2.style.right="70px";
				}else{
					hardCircle2.style.right="0";
				};
			}
			
			var json1=path1.getPointAtLength(len1);

			c1.attr({
				cx:json1.x,
				cy:json1.y
			});
		},function(){
			startX=c1.attr('cx');
			startY=c1.attr('cy');
		},function(){
			console.log('end');
		});

		var startX2,startY2;
		c2.drag(function(dx,dy,x,y,event){
			
			var angle = Raphael.angle(200,200,dx+startX2,dy+startY2);
			if(angle>=90&&angle<=270){
				len2=(angle-90)*Math.PI*167/180;
			}
			
			var scale=len2/tota2;
			var index;
			if(scale<1/6){
				index=0;
			}else if(scale>=1/6&&scale<1/3){
				index=1;
			}else if(scale>=1/3&&scale<1/2){
				index=2;
			}else if(scale>=1/2&&scale<2/3){
				index=3;
			}else if(scale>=2/3&&scale<5/6){
				index=4;
			}else if(scale>=5/6){
				index=5;
			}
			if(cIndex2!=index){
				cIndex2=index;
				if(findSame(cIndex1,cIndex2)){
					hardCircle2.style.right="70px";
				}else{
					hardCircle2.style.right="0";
				};
			}
			var json2=path2.getPointAtLength(len2);

			c2.attr({
				cx:json2.x,
				cy:json2.y
			});
		},function(){
			startX2=c2.attr('cx');
			startY2=c2.attr('cy');
		},function(){
			console.log(cIndex2);
		});
	});

});