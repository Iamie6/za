 /**
 * author 刘鹏
 * date : 2015-12-16
 * email: liupeng_luck@outlook.com
 * website: http://focusbe.com/
 */ 
var Sugar = function(){
    var $domList = [];
    var fireIn = function(name){
        var page = name;

        var $animates = $(page).find('.animation');
        $domList = [];
        $clockList = [];
        $animates.each(function(){
            var an = {};
            an.dom = $(this);
            an.cn = an.dom.attr('data-class');
            an.type = an.dom.attr('data-type');
            an.delay = an.dom.attr('data-delay');
            an.repeatTime = an.dom.attr('data-repeat');
            $domList.push(an.dom);
            if(an.delay == 0 || !an.delay){
                an.dom.addClass(an.cn);
                if(typeof(an.repeatTime!='undefined')&&an.repeatTime)
                {
                    var clock = setInterval(function(){
                        an.dom.removeClass(an.cn);
                    },an.repeatTime);
                    $clockList.push(clock);
                }
            } else {
                setTimeout(function(){
                    an.dom.addClass(an.cn);
                    if(typeof(an.repeatTime!='undefined')&&an.repeatTime)
                    {
                        var clock = setInterval(function(){
                            an.dom.removeClass(an.cn);
                        },an.repeatTime);
                        $clockList.push(clock);
                    }
                    
                }, an.delay);
            }
        });
    };

    var fireOut = function(){
        while($domList.length > 0){
            var $dom = $domList.pop();
            $dom.removeClass($dom.attr('data-class'));
            if(!$dom.hasClass('animation'))
            {
                $dom.addClass('animation');
            }
        }
        while($clockList.length > 0){
            var $clock = $clockList.pop();
            clearInterval($clock);
        }
    };
    var repeat = function(animates){
        animates.each(function(){
            var an = {};
            an.dom = $(this);
            an.cn = an.dom.attr('data-class');
            an.type = an.dom.attr('data-type');
            an.delay = an.dom.attr('data-delay');
            TweenMax.set(an.dom,{opacity:1,onComplete:function(){
                an.dom.removeClass(an.cn);
                TweenMax.to(an.dom,1,{opacity:0,onComplete:function(){
                    an.dom[0].style.cssText = "";
                    if(an.delay == 0 || !an.delay){
                        an.dom.addClass(an.cn);
                    } else {
                        setTimeout(function(){
                            an.dom.addClass(an.cn);
                        }, an.delay);
                    }
                }});
            }});
        });
    };
    return {
        fireIn: fireIn,
        fireOut: fireOut,
        repeat:repeat
    }
};


