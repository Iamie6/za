 /**
 * author 刘鹏
 * date : 2015-12-16
 * email: liupeng_luck@outlook.com
 * website: http://focusbe.com/
 */  
document.addEventListener('touchmove', function (event) {event.preventDefault();}, false);
var ww,wh,cover;
var isSwitchPage = false;
var winload = false;
var isrun = false;
var mintime = 10;
var spendtime = 0;
var loadedRun = false;
/* swipe */
var swiper1,sugar;
$(function(){
    setFontsize(10);
    $(window).resize(function(){
        setFontsize(10);
    });
    // window.v = new V();
    // var canvas = document.getElementById('loading_canvas');
    // window.canvasgif2 = new canvasgif(canvas,'loading_img','jpg',20,195,140,15,null,false);
    // loadingText();
    // vg.init();
    Roc.init();
});

ImageLoad = function(ajaxGet,imagesUrl,imagesArr,preloadedCallback,loadingChangeCallback,loadedCallback){
    this.imagesObj = {};
    var self = this;
    this.preloading = function(){
        if(ajaxGet)
        {
            if(!imagesUrl)
            {
                imagesUrl = "files.php";
            }
            var preloadUrl = imagesUrl+'?file=images/preload';
            $.ajax({
                url:preloadUrl,
                error:function(){
                    self.preloaded();
                },
                success:function(data){
                    self.loadImage(data,function(percent){
                        if(percent>=100)
                        {
                            self.preloaded();
                        }
                    });
                }
            });
        }
        else
        {
            self.preloaded();
        }

    };
    this.preloaded = function(){
        preloadedCallback();
        self.loading();
        
    };
    this.loading = function(){
        if(ajaxGet)
        {
            if(!imagesUrl)
            {
                imagesUrl = "files.php";
            }
            $.ajax({
                url:imagesUrl,
                error:function(){
                    self.loaded();
                    loadedCallback(self.imagesObj);
                },
                success:function(data){
                    self.loadImage(data,function(percent){
                        self.loadingChange(percent);
                        loadingChangeCallback(percent);
                        if(percent>=100)
                        {
                            self.loaded();
                            loadedCallback(self.imagesObj);
                        }
                    });
                }
            });
        }
        else
        {
            self.preloaded();
        }
    };
    this.loadingChange = function(percent){

    };
    this.loaded = function(){

    };
    this.loadImage = function(data,callback)
    {
        var imgLoaded = 0;
        var percent = 0;
        var imgLength = data.length;
        for(var i=0;i<imgLength;i++)
        {
            var imgobj = new Image();
            imgobj.onload = function()
            {
                imgLoaded++;
                percent = parseInt(imgLoaded/imgLength*100);
                callback(percent);
            }
            imgobj.src = data[i].src;
            self.imagesObj[data[i].id] = imgobj;
        }
    }
    this.preloading();
}
Roc = {
    TweenObj:[],
    init:function(){
        this.imageload = new ImageLoad(true,null,null,this.preloaded,this.loadingChange,this.loaded);
        this.bind();
    },
    reset:function(){

    },
    bind:function(){
        var self = this;
        $(".start_btn,.arrow_btn").click(function(){
            self.swiper.unlockSwipes();
            self.swiper.slideNext();
            self.swiper.lockSwipes();
        });
        
        $(".zi_btn").click(function(){
            self.stopCiAnimate();
            // TweenMax.to($(this).parents('.mod-main').find('.zi .fangge'),1,{opacity:1});
            TweenMax.to($(this).parents('.mod-main').find('.zi .zi_img'),1,{opacity:1});
            var delay = 1;
            var callFun = function(){};
            var i = 0;
            var jieship = $(this).parents('.mod-main').find('.jieship')
            jieship.each(function(){
                i++;
                if(i==jieship.length)
                {
                    callFun = function(){
                        $(".arrow_btn").removeClass('aniArrowUp');
                        TweenMax.to(".arrow_btn",0.3,{opacity:1,ease:Power1.easeInOut,onComplete:function(){
                            self.swiper.unlockSwipeToNext();
                            $(".arrow_btn").addClass('aniArrowUp');
                        }});
                    }
                }
                TweenMax.to($(this),1.5,{opacity:1,ease:Power1.easeInOut,delay:delay,onComplete:callFun});
                delay+=1.5;
            });
            
        });
        $(".ji").click(function(){
            self.stopCiAnimate();
        });
        $(".play_agin").click(function(){
            self.swiper.unlockSwipes();
            self.swiper.slideTo(0, 0, false);
            $(".hide").css({opacity:0});
            sugar.fireOut();
            sugar.fireIn($(".page1"));
        });
        $(".share_btn").click(function(){
            $(".share_tip").fadeIn();
        });
        $(".share_tip").click(function(){
            $(".share_tip").fadeOut();
        });
    },
    loadingChange:function(percent){
        $(".loading_p .percent").html(percent+'%');
    },
    setDaixu:function(){
        var curI = -1;
        setInterval(function(){
            if(curI<0)
            {
                $(".daixu_outer span").css({opacity:0.5});
                
            }
            else
            {
                $(".daixu_outer span").eq(curI).css({opacity:1});
                for(var i=curI+1;i<$(".daixu_outer span").length;i++)
                {
                    $(".daixu_outer span").eq(i).css({opacity:0.5});
                }
            }
            
            curI = parseInt((curI+2)%($(".daixu_outer span").length+1))-1;
        },500);
    },
    loaded:function(){
        sugar = new Sugar();
        Roc.setDaixu();
        setTimeout(function(){
            $("#loading").fadeOut();
            
            // $(".juanzhou .zi_outer img").each(function(index){
            //     $(this).css({width:$(this).width()/544*100+'%'});
            // });
            
            sugar.fireIn($(".page1"));
            setTimeout(function(){
                $(".start_btn").removeClass('animation animation2').removeClass($(".start_btn").attr('data-class')).addClass('flash2');
            },10000);
        },1000);
        
        //Roc.setCi($(".juanzhou .zi_outer"),$(".juanzhou .zi_outer img").not($(".ci1_outer")),7);
        //Roc.ciAnimate($(".juanzhou .zi_outer"),$(".juanzhou .zi_inner"),'x');
        // Roc.ciAnimate($(".pc_outer .zi_outer"),$(".pc_outer .zi_outer .zi_inner"),'y');
        // Roc.ciAnimate($(".phone_outer .zi_outer"),$(".phone_outer .zi_outer .zi_inner"),'x');
    },
    preloaded:function(){
        $("#loading").show();
        $(".content").show();
        Roc.setSwipe();
    },
    ciAnimate:function(ci_outer,ci_inner,direction,time){
        var self = this;
        ci_inner.each(function(){
            if($(this).hasClass('animation'))
            {
                $(this).removeClass('animation').removeClass('animation2').removeClass($(this).attr('data-class')).addClass('willAnimation');
            }
        });
        
        if(typeof(self.ciAnimateClock)!=undefined&&self.ciAnimateClock)
        {
            clearTimeout(self.ciAnimateClock);
            self.ciAnimateClock = null;
        }
        var cssObj = {};
        if(direction=='x')
        {
            cssObj[direction] = -ci_inner.width();
        }
        else
        {
            cssObj[direction] = -ci_inner.height();
        }
        if(typeof(time)=='undefined')
        {
            time = 6;
        }
        cssObj['ease'] = 'Linear.easeInOut';
        cssObj['onComplete'] = function(){
            TweenMax.set(ci_inner,{x:0,y:0});
            self.ciAnimate(ci_outer,ci_inner,direction,time);
        };
        
        var tween = TweenMax.to(ci_inner,time,cssObj);
        self.TweenObj.push(tween);
    },
    setCi:function(ci_outer,ci_imgs,line){
        var self = this;
        var i=0;
        // ci_imgs.hide();
        this.ci_imgs = ci_imgs;
        var lineWidth = ci_outer.width()/line;
        this.lineWidth = lineWidth;
        this.lineArray = [];
        var curLine = 0;
        do{
            if(i>=ci_imgs.length-2)
            {
                break;
            }
            var j = 0;
            var totalHeight = 0;
            do{
                totalHeight+=ci_imgs.eq(i).height();
                if(totalHeight<=ci_outer.height()*0.86)
                {
                    j++;
                    i++;
                }
                else
                {
                    var blankHeight = ci_outer.height()-totalHeight+ci_imgs.eq(i).height();
                    var perHeight = blankHeight/(j*2);
                    var curTop = perHeight;
                    var curArr = [];
                    for(var k=j;k>0;k--)
                    {
                        TweenMax.set(ci_imgs.eq(i-k),{top:curTop,x:curLine*lineWidth+(lineWidth-ci_imgs.eq(i-k).width())/2});
                        curTop+=(ci_imgs.eq(i-k).height()+perHeight*2);
                        curArr.push(i-k);
                    }
                    self.lineArray.push(curArr);
                    curLine++;
                    break;
                }
            }
            while(true);

        }
        while(true);
        this.setCiAnimate();
    },
    setCiAnimate:function(){
        var self = this;
        var y = 0;
        var moveX = 0;
        objArray = [];
        for(var i = 0; i<this.lineArray.length;i++)
        {
            var objs = [];
            var curIndex;
            // console.log(this.lineArray[i]);
            for(var j=0;j<this.lineArray[i].length;j++)
            {
                curIndex = this.lineArray[i][j];
                objs.push(this.ci_imgs[curIndex]);
            }
            var k = 0;
            objArray.push(objs);
            var tween = TweenMax.to(objs,0.6*(i+1),{x:-this.lineWidth,ease:Linear.easeInOut,onComplete:function(){
                move(objArray[k]);
                k++;
            }});
            self.TweenObj.push(tween);
        }
        var move = function(objs)
        {
            TweenMax.set(objs,{x:self.lineArray.length*self.lineWidth,opacity:1});
            var tween = TweenMax.to(objs,0.6*self.lineArray.length,{x:-self.lineWidth,ease:Linear.easeInOut,onComplete:function(){
                move(objs);
            }});
            self.TweenObj.push(tween);
        }
        // for(var i = 0; i<this.lineArray.length;i++)
        // {
        //     var objs = [];
        //     var curIndex;
        //     for(var j=0;j<this.lineArray[i];j++)
        //     {
        //         curIndex = this.lineArray[i][j];
        //         objs.push(this.ci_imgs.eq(curIndex));
        //     }
        //     if(i==0)
        //     {
        //         TweenMax.to(objs,0.3,{x:x,onComplete:function(){
        //             for(var i=0;i<objs.length;i++)
        //             {
        //                 var curobj = self.ci_imgs.eq(objs[i]);
        //                 TweenMax.set(curobj,{x:0,x:self.lineWidth*8+(self.lineWidth-curobj.width())/2,opacity:0});

        //             }
        //             self.lineArra.push(self.lineArra.shift());
        //         }});
        //     }
        //     else if(i==this.lineArray.length-1)
        //     {

        //     }
        //     else
        //     {

        //     }
            
        // }
        
    },
    stopCiAnimate:function(){
        var self = this;
        if(typeof(self.repeatClock)!=undefined&&self.repeatClock)
        {
            clearInterval(self.repeatClock);
            self.repeatClock = null;
        }
        if(typeof(self.ciAnimateClock)!=undefined&&self.ciAnimateClock)
        {
            clearTimeout(self.ciAnimateClock);
            self.ciAnimateClock = null;
        }
        for(var i = 0;i<this.TweenObj.length;i++)
        {
            this.TweenObj[i].pause();
        }
        this.TweenObj = [];
    },
    setSwipe:function(){
        var self = this;
        this.swiper = new Swiper('.swiper-container', {
            direction:'vertical',
            onSlideChangeEnd:function(swiper){
                
                if(swiper.activeIndex<5||swiper.activeIndex==$(".swiper-slide").length-1)
                {
                    self.swiper.lockSwipes();

                    TweenMax.to(".arrow_btn",1,{opacity:0,onComplete:function(){
                    }});
                }
                else
                {
                    $(".arrow_btn").removeClass('aniArrowUp');
                    TweenMax.to(".arrow_btn",1,{opacity:1,onComplete:function(){
                        $(".arrow_btn").addClass('aniArrowUp');
                    }});
                }
                sugar.fireOut();
                sugar.fireIn($(".swiper-slide").eq(swiper.activeIndex));
            },
            onTransitionEnd:function(swiper){
                if(typeof(self.repeatClock)!='undefined'&&self.repeatClock)
                {
                    clearInterval(self.repeatClock);
                }
                var repeatEle = $(".swiper-slide").eq(swiper.activeIndex).find(".anirepeat");
                if(repeatEle.length>0)
                {
                    self.repeatClock = setInterval(function(){
                        sugar.repeat(repeatEle);
                    },16000);
                }
                if(swiper.activeIndex==1)
                {
                    $(".start_btn").removeClass('flash2');
                }
            },
            onTransitionStart:function(swiper){
                // if(swiper.activeIndex == 2)
                // {
                //     self.ciAnimateClock = setTimeout(function(){
                //         self.ciAnimate($(".juanzhou .zi_outer"),$(".juanzhou .zi_inner"),'x',8);
                //     },6000);
                // }
                // else if(swiper.activeIndex == 3)
                // {
                //     self.ciAnimateClock = setTimeout(function(){
                //         self.ciAnimate($(".pc_outer .zi_outer"),$(".pc_outer .zi_outer .zi_inner"),'y',8);
                //     },6000);
                    
                // }
                // else if(swiper.activeIndex == 4)
                // {
                //     self.ciAnimateClock = setTimeout(function(){
                //         self.ciAnimate($(".phone_outer .zi_outer"),$(".phone_outer .zi_outer .zi_inner"),'x',6);
                //     },6000);
                    
                // }
            }
        });
        this.swiper.lockSwipes();
        // swiper1 = new Swipe(document.querySelector('.swipe-wrap1'), {
        //     continuous: false,
        //     callback:function(index){
        //     },
        //     transitionEnd: pageControl
        // });
        // setTimeout(function () {
        //     sugar.fireOut();
        //     sugar.fireIn(first_pages[0]);
        // }, 600);
        // //运行第一个page的动画
        // $(".arrow").click(function(){
        //     if($(this).hasClass('aniArrowUp'))
        //     {
        //         swiper1.prev();
        //     }
        //     else
        //     {
        //         swiper1.next();
        //     }
        // });
    }
}

// vg = {
//     imageArr:{},
//     init:function(){
//         this.images = res_images;
//         this.preImages = pre_images;
//         this.preloading();
//     },
//     preloading:function(){
//         var self = this;
//         loadImage(this.preImages,function(percent){
//             if(percent>=100)
//             {
//                 self.preloaded();
//             }
//         });
//         self.preloaded();
//     },
//     preloaded:function(){
//         $("#loading").show();
//         this.loading();
//     },
//     loading:function(){
//         var self = this;
//         loadImage(this.images,function(percent){
//             self.loadingChange(percent);
            
//         });
//     },
//     loadingChange:function(percent){
//         var self = this;
//         var callback = function(){};
//         if(percent>=100)
//         {
//             var callback = function(){
//                 setTimeout(function(){
//                     loaded();
//                 },300);
//             }
            
//         }
//         $(".loading_num").html(percent+'%');
//         if(percent<50)
//         {
//             $(".loading_line1 .light_dian").show();
//             TweenMax.to(".loading_line1 .bar",1,{height:percent*2+'%',ease:Power1.easeInOut,onComplete:function(){
                
//             }});
//             // $(".loading_line1 .bar").stop().animate({height:percent*2+'%'},300);
//         }
//         else
//         {
//             // TweenMax.to(".loading_line1 .bar",1,{height:'50%',ease:Power1.easeInOut,onComplete:function(){
//             //     self.loadingHalf = true;
//             // // }});
//             // if(typeof(self.loadingHalf!='undefined')&&self.loadingHalf)
//             // {
                
//                 var height = parseInt($(".loading_line1 .bar")[0].style.height)+1;
//                 if(height>=100)
//                 {
//                     $(".loading_line1 .light_dian").hide();
//                     $(".loading_line2 .light_dian").show();
//                     TweenMax.set(".loading_line1 .bar",{height:'100%',onComplete:function(){}});
//                     TweenMax.to(".loading_line2 .bar",1,{height:(percent-50)*2+'%',ease:Power1.easeInOut,onComplete:function(){
//                         callback();
//                     }});
//                 }
//                 else
//                 {
//                     var time = (100-height)*0.02;
//                     TweenMax.to(".loading_line1 .bar",time,{height:'100%',onComplete:function(){
//                         $(".loading_line1 .light_dian").hide();
//                         $(".loading_line2 .light_dian").show();
//                         TweenMax.to(".loading_line2 .bar",1,{height:(percent-50)*2+'%',ease:Power1.easeInOut,onComplete:function(){
//                             callback();
//                         }});
//                     }});
//                 }
                
//                 // $(".loading_line1 .bar").stop().animate({height:'100%'},0);
                
//             // }
//             // else if(percent>=100)
//             // {
//             //     TweenMax.to(".loading_line1 .bar",2,{height:'50%',ease:Power1.easeInOut,onComplete:function(){
//             //         $(".loading_line1 .light_dian").hide();
//             //         $(".loading_line2 .light_dian").show();
//             //         TweenMax.set(".loading_line1 .bar",{height:'100%'});
//             //         // $(".loading_line1 .bar").stop().animate({height:'100%'},0);
//             //         TweenMax.to(".loading_line2 .bar",2,{height:(percent-50)*2+'%',ease:Power1.easeInOut,onComplete:function(){
//             //             callback();
//             //         }});
//             //     }});
//             // }
//             // $(".loading_line2 .bar").stop().animate({height:(percent-50)*2+'%'},300);
//         }
//         // var curIndex = parseInt(this.preImages.length*percent/100)-1;
//         // var callback = null;
//         // if(percent>=100)
//         // {
//         //     callback = function(){
//         //         setTimeout(function(){
//         //             loaded();
//         //         },300);
//         //     };
//         // }
//         // canvasgif2.playTo(curIndex,callback);
//     }
// }

// function loaded(){
//     loadedRun = true;
//     clearInterval(window.textClock);
//     // clearInterval(spendClock);
//     $("#loading").animate({opacity:0},200,function(){
//         // canvasgif2.stop();
//         $("#loading").remove();
//     });
//     initAnimate();
//     setFontsize(10);
//     sugar = new Sugar();
//     /* control swipe change */
//     renderFirstPage();
//     cover = $(".cover").gCover({
//         time:300
//     });

//     $(".weixin").click(function(){
//         cover.show($(".weixin_cover"));
//     });
//     $(".qq_btn").click(function(){
//         cover.show($(".qq_cover"));
//     });
//     var canvas = document.getElementById('canvas');
//     window.canvasgif1 = new canvasgif(canvas,'final_','jpg',13,640,470,15,null,true);
//     // window['canvasgif'].init(canvas,'images/v2/final_','jpg',13,640,470,15,100);
//     setVideo();
//     setHero();
//     $(".news_btn").click(function(){
//         swiper1.slide(3);
//     });
//     $(".heros_btn").click(function(){
//         swiper1.slide(1);
//     });
//     $(".infos_btn").click(function(){
//         swiper1.slide(2);
//     });
//     $(".shejiao_outer").click(function(e){
//         e.stopPropagation();
//         var ishide = $(this).parent().find('.erji').is(":hidden")
//         if(ishide)
//         {
//             $(this).addClass('cur');
//             $(this).parent().find('.erji').stop().fadeIn(300);
//         }
//         else
//         {
//             $(this).removeClass('cur');
//             $(this).parent().find('.erji').stop().fadeOut(300);
//         }
//     });
//     $('body').click(function(){
//         $(".shejiao_outer").removeClass('cur');
//         $(".shejiao_outer").parent().find('.erji').stop().fadeOut(300);
//     });
//     $(".bottom_nav a").bind('touchstart',function(){
//         $(this).addClass('hover');
//     });
//     $(".bottom_nav a").bind('touchend',function(){
//         $(this).removeClass('hover');
//     });
//     $(".yuyue_ceshi").click(function(){
//         cover.show($(".yuyue_cover"));
//     });
// }
// function loadingText()
// {
//     var length = $(".loading_text>p").length;
//     var cur = parseInt(Math.random()*length);
//     goToNext();
//     window.textClock = setInterval(function(){
//         goToNext();
//     },3000);
//     function goToNext(){
//         var next = (cur+1)%length;
//         var nextp = $(".loading_text>p").eq(next);
//         var curp =  $(".loading_text>p").eq(cur);
//         var nextspan = $(".loading_text>p").eq(next).find('span');
//         if(isrun)
//         {
//             curp.fadeOut(500,function(){
//                 // nextspan.hide();
//                 // nextp.show();
//                 setTimeout(function(){
//                     nextp.fadeIn(500,function(){
//                         cur = next;
//                     });
//                 },500);
//             });
//         }
//         else
//         {
//             nextp.fadeIn(500,function(){
//                 cur = next;
//             });
//         }
//         isrun = true;
//     }
// }


var getParam = function (search) {
    var params = {};

    if (search.indexOf('?') >= 0) {
        search = search.slice(1);
    }

    search = search.split('&');
    search.forEach(function (item) {
        var temp = item.split('=');
        params[temp[0]] = temp[1];
    });
    if (!params['page'] || !params['index']) {
        params['page'] = 1;
        params['index'] = 1;
    }
    return params;
};
var renderFirstPage = function () {
    setSwipe();
    
    setBanner();
};
function setSwipe()
{
    swiper1 = new Swipe(document.querySelector('.swipe-wrap1'), {
        continuous: false,
        callback:function(index){
            if(index==0)
            {
                canvasgif1.play();
                // $(".slogan3").show().addClass('pulseInOut');
            }
            else
            {
                canvasgif1.stop();
                // $(".slogan3").hide().removeClass('pulseInOut');
            }
            
        },
        transitionEnd: pageControl
    });
    setTimeout(function () {
        sugar.fireOut();
        sugar.fireIn(first_pages[0]);
    }, 600);
    //运行第一个page的动画
    $(".arrow").click(function(){
        if($(this).hasClass('aniArrowUp'))
        {
            swiper1.prev();
        }
        else
        {
            swiper1.next();
        }
    });
}
/* swipe page control */
var scale;
function setfixSize()
{
	var set = function(){
		ww = $(window).width();
		var height1,height;
		var width1,width;
		$(".fix_size").each(function(){
			width1 = parseInt($(this).attr('data-width'));
			scale = ww/width1;
			height1 = parseInt($(this).attr('data-height'));
			height = height1*scale;
			$(this).width(ww);
			$(this).height(height);
		});
	}
	$(window).resize(function(){
		set();
	});
	set();
}

//播放音乐
//music
var sound = 'media/music';
var mode = true;
var note_id = 1;

function $$(name) {
    return document.getElementById(name);
}
var audio = null;
function switchsound() {
    au = audio;
    if (au.paused) {
        playsound();
    }
    else {
        stopsound();
    }
}
function stopsound()
{
	au = audio;
	mode = false;
    au.pause();
    $('#sound_image').removeClass('music_open').addClass('music_close');
}
function playsound()
{
	au = audio;
	au.play();
    $('#sound_image').removeClass('music_close').addClass('music_open');
    mode = true;
}
function playbksound() {
	var index;
    var audiocontainer = $$('audiocontainer');
    audio = document.createElement("audio");
    audio.src = sound+".mp3";
    audio.id="bgsound";
    audio.addEventListener('ended', function () {
        setTimeout(function () {audio.play(); index++}, 500);
    }, false);
    if (audiocontainer != undefined) {
        audiocontainer.appendChild(audio);
        // audiocontainer.innerHTML = '<audio id="bgsound" loop="loop" autoplay="autoplay"><source src="'+sound+'.ogg" type="audio/ogg"><source src="'+sound+'.mp3" type="audio/mpeg"/></audio>';
    }
    audio.play(); 
    sound_div = document.createElement("div");
    sound_div.setAttribute("ID", "cardsound");
    sound_div.style.cssText = "position:fixed;right:10px;top:10px;z-index:9;visibility:visible;";
    sound_div.onclick = switchsound;
    bg_htm = "<div id='sound_image' class='music_open'></div>";
    sound_div.innerHTML = bg_htm;
    document.body.appendChild(sound_div);

}
playbksound();
function orientationChange(){   
	switch(window.orientation) {   
		case 0: // Portrait   
		case 180: // Upside-down Portrait   
		// Javascript to setup Portrait view   
		$("#heng_tip").hide();
		break;   
		case -90: // Landscape: turned 90 degrees counter-clockwise   
		case 90: // Landscape: turned 90 degrees clockwise   
		// Javascript to steup Landscape view   
		$("#heng_tip").show();
		break;   
	}   
}
orientationChange();
window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", orientationChange, false);
