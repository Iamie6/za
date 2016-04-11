;(function(exports) {
    var ua = navigator.userAgent.toLowerCase();
    var isIE6 = /msie 6/.test(ua);
    var extend = function(destination, source) {
        for (var property in source) {
            destination[property] = source[property];
        }
        return destination;
    };
    var setStyles = function(ele, styles) {
        for (var property in styles) {
            ele.style[property] = styles[property];
        }
    };
    var getOffset = function(ele) {
        var top = 0;
        var left = 0;
        while (ele != null && ele != document.body) {
            left += ele.offsetLeft;
            top += ele.offsetTop;
            ele = ele.offsetParent;
        }
        return {
            top: top,
            left: left
        };
    };
    var hasClass = function(el, clz) {
        if (!el) {
            return false;
        }
        return el.className.match(new RegExp('(\\s|^)' + clz + '(\\s|$)'));
    };
    var addClass = function(el, clz) {
        if (!hasClass(el, clz)) {
            el.className = el.className.replace(/(^\s*)|(\s*$)/g, '') + ' ' + clz;
        }
    };
    var removeClass = function(el, clz) {
        if (hasClass(el, clz)) {
            var reg = new RegExp('(\\s|^)' + clz + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
    };
    var addEvent = function(el, evType, func, useCapture) {
        if (typeof useCapture == 'undefined') {
            useCapture = false;
        }
        if (el.addEventListener) {
            el.addEventListener(evType, func, useCapture);
            return true;
        } else if (el.attachEvent) {
            el.attachEvent('on' + evType, func);
            return true;
        } else {
            el['on' + evType] = func;
        }
    };
    var ScrollFix = function(wrap, config) {
        var defaults = {
            fixedClz:'fixed',
            getTop: function(wrap){
                return 0;
            },
            getHeight:function(wrap){
                return wrap.offsetHeight;
            },
            fixed:function(wrap,scrollTop,offsetTop,top){
                return scrollTop > offsetTop-top;
            },
            onFix:function(wrap){

            },
            onUnFix:function(wrap){

            }
        };
        config = extend(defaults, config);
        if(!wrap){
            return;
        }
        var pNode = wrap.parentNode;
        var divFilled = document.createElement('div');
        pNode.insertBefore(divFilled, wrap);
        if(isIE6){
            var position = pNode.style.position;
            if(position!=='absolute'&&position!=='relative'){
                setStyles(pNode, {
                    position:'relative'
                });
            }
        }
        var fixedClz = config.fixedClz;
        var toggle = function(b) {
            var height = '1px';
            var marginTop = '-1px';
            if (b) {
                height = config.getHeight(wrap) + 'px';
                marginTop = 0;
            }
            setStyles(divFilled, {
                height:height,
                marginTop:marginTop,
                overflow:'hidden'
            });
        };
        var scrollHandle = function() {
            var offsetTop = getOffset(divFilled).top;
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var top = config.getTop(wrap)||0;
            if (config.fixed(wrap,scrollTop, offsetTop,top)) {
                toggle(true);
                addClass(wrap, fixedClz);

                if(isIE6){
                    top = top+scrollTop- getOffset(pNode).top;
                }
                setStyles(wrap,{
                    top:top+'px'
                });
                config.onFix(wrap);
            } else {
                toggle(false);
                removeClass(wrap, fixedClz);
                config.onUnFix(wrap);
            }
        };
        var timerId = null;
        addEvent(window, 'scroll', function() {
            if (!timerId) {
                scrollHandle();
                timerId = true;
            } else {
                clearTimeout(timerId);
                setTimeout(function() {
                    scrollHandle();
                }, 100);
            }
        });
        scrollHandle();
    };
    window.ScrollFix = ScrollFix;
/*})();
;(function(exports) {*/
    var $ = exports.___sinacMNT___;

    var getParam = function(name) {
        var arr = window.location.search.match(new RegExp('(\\?|&)' + name + '=([^&]*)(&|$)'));
        if (arr != null){
            return decodeURIComponent(arr[2]);
        }
        return null;
    };
    var cookie = (function() {
        /**
         * 读取cookie,注意cookie名字中不得带奇怪的字符，在正则表达式的所有元字符中，目前 .[]$ 是安全的。
         * @param {Object} cookie的名字
         * @return {String} cookie的值
         * @example
         * var value = co.getCookie(name);
         */
        var co = {};
        co.getCookie = function(name) {
            var strCookie = document.cookie;
            var arrCookie = strCookie.split(';');
            for (var i = 0; i < arrCookie.length; i++) {
                var arr = arrCookie[i].split('=');
                if (arr[0] == name){
                    return arr[1];
                }
            }
            return '';
        };

        /**
         * 设置cookie
         * @param {String} name cookie名
         * @param {String} value cookie值
         * @param {Number} expire Cookie有效期，单位：小时
         * @param {String} path 路径
         * @param {String} domain 域
         * @param {Boolean} secure 安全cookie
         * @example
         * co.setCookie('name','sina',null,"")
         */
        co.setCookie = function(name, value, expire, path, domain, secure) {
            var cstr = [];
            cstr.push(name + '=' + window.escape(value));
            if (expire) {
                var dd = new Date();
                var expires = dd.getTime() + expire * 3600000;
                dd.setTime(expires);
                cstr.push('expires=' + dd.toGMTString());
            }
            if (path) {
                cstr.push('path=' + path);
            }
            if (domain) {
                cstr.push('domain=' + domain);
            }
            if (secure) {
                cstr.push(secure);
            }
            document.cookie = cstr.join(';');
        };

        /**
         * 删除cookie
         * @param {String} name cookie名
         */
        co.deleteCookie = function(name) {
            document.cookie = name + '=;' + 'expires=Fri, 31 Dec 1999 23:59:59 GMT;';
        };
        return co;
    })();

    var bindTip = function(){
        if(!dom.useTip||!dom.useTipClose){
            return;
        }
        // 先判断,点击大于0，则不打开提示，否则打开提示;提示只展示一次
        var cookieName = 'USE_TIP_CLICK_TIMES';
        var times = cookie.getCookie(cookieName);
        var show = function(){
            dom.useTip.style.display = '';
            $.addClass(dom.useTip.parentNode,'use-tip-show');
        };
        var hide = function(){
            dom.useTip.style.display = 'none';
            $.removeClass(dom.useTip.parentNode,'use-tip-show');
        };
        times = parseInt(times,10);
        if(isNaN(times)){
            times = 0;
        }
        if(times>0){
            return;
        }else{
            show();
            // 只展示一次
            times = times+1;
            // 5年
            cookie.setCookie(cookieName, times, 43800);
        }

        // 点击关闭
        addEvent(dom.useTipClose, 'click', function(e){
            hide();
            $.stopPropagation(e);
        });
        // 点击打开链接
        addEvent(dom.useTip, 'click', function(e){
            window.open(dom.useTip.getAttribute('lhref'));
        });
        setTimeout(function(){
            hide();
        },30e3);
    };
    var fixAD = function(){
        // 滚动固定
        new window.ScrollFix(dom.sideDa1,{
            getTop:function(wrap){
                var footerToTop = $.getPosition(dom.footer).top;
                var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                var height = wrap.offsetHeight;
                return Math.min(footerToTop - scrollTop - height, 0);
            },
            fixed:function(wrap,scrollTop,offsetTop,top){
                // 滚动到最下面内容时再固定
                var sideDa3 = dom.sideDa3;
                var da3Top = getOffset(sideDa3).top;
                var da3Height = sideDa3.offsetHeight;
                // return scrollTop > offsetTop - top;
                return scrollTop > da3Top+da3Height - top;
            },
            fixedClz:'top-list-fixed'
        });
    };
    var getTopList = function(wrap,infoType,channel){
        var HOTURL = 'http://comment5.news.sina.com.cn/hotnews/info';
        //列表类型，还有week,month以后可能做成选项卡的形式
        var Type = 'day';
        var listChannel = (infoType==1 || infoType==2)?'all':channel;
        //TODO param部分数据从url获取
        var param = {
            format:'js',
            channel:listChannel,
            hotid:listChannel+'_'+Type
        };
        var render = function(dom,data){
            var hotnews = data.hotnews;
            if(!hotnews||hotnews.length===0){
                return;
            }
            var temp = [];
            var iDiv = function(s){
                temp.push(s);
            };
            var splitNum = function(num){
                num = num+'';
                var re=/(-?\d+)(\d{3})/;
                while(re.test(num)) {
                    num=num.replace(re,'$1,$2');
                }
                return num;
            };
            var newHotnews = hotnews.sort(function(a,b){
                var result;
                //比较评论数
                if(a.total_count!=b.total_count){
                    result = b.total_count-a.total_count;
                }else{
                    //评论数相等，比较位置
                    result = a.position-b.position;
                }
                return result;
            });
            var NUMBASE = 'http://comment5.news.sina.com.cn/comment/skin/default.html?';
            iDiv('<div class="hd"> <h2>热评排行</h2> </div> <ul class="bd">');
            for (var i = 0;i<10; i++) {
                var item = newHotnews[i];
                iDiv('<li class="list clearfix"> <div class="num"><a href="'+NUMBASE+'channel='+item.channel+'&newsid='+item.newsid+'">'+splitNum(parseInt(item.total_count,10))+'</a></div> <div class="txt"><a href="'+item.url+'" target="_blank">'+item.title+'</a></div> </li>');
            }
            iDiv('</ul>');
            if(dom.topList){
                dom.topList.innerHTML = temp.join('');
            }

        };
        new $.cmnt.DataLoader({
            url:HOTURL,
           param:param,
           loaded:function(self){
                render(dom,self.data);
           }
        });
    };

    var getCommentData = function(wrap){
        // if(!$.login.isLogin()){
        //     return;
        // }
        var userInfo = $.login.getInfo();
        // var uid = userInfo.sina.uid;
        var uid = (function(info){
            var uid = '';
            if(info.sina){
                uid = userInfo.sina.uid;
            }else if(info.weibo){
                uid = userInfo.weibo.id;
            }
            return uid;
        })(userInfo);
        if(!uid){
            return;
        }
        // var uid = userInfo.weibo.id;
        var encoding = $.cmnt.config.encoding||'gbk';
        var USERURL = 'http://comment5.news.sina.com.cn/user/cmnt';
        //TODO param部分数据从url获取
        var param = {
            uid:uid,
            format:'js',
            ie:encoding,
            oe:encoding
        };
        var render = function(dom,data){
            var usercount = data.usercount;
            var temp = [];
            var iDiv = function(s){
                temp.push(s);
            };
            var splitNum = function(num){
                num = num+'';
                var re=/(-?\d+)(\d{3})/;
                while(re.test(num)) {
                    num=num.replace(re,'$1,$2');
                }
                return num;
            };
            // var href = 'http://comment5.news.sina.com.cn/comment/skin/default.html?style=1&user_uid='+uid+'&info_type=';
            iDiv('<div class="comment count">');
                iDiv('<a target="_blank" href="http://my.sina.com.cn/profile/logined#location=cmnt&cmnt=cmnt-list"><em>'+ splitNum(usercount.l_count) +'</em><span>评论数</span></a>');
            iDiv('</div>');
            iDiv('<span class="line"></span>');
            iDiv('<div class="reply count">');
                iDiv('<a target="_blank" href="http://my.sina.com.cn/profile/logined#location=cmnt&cmnt=reply-list"><em>'+ splitNum(usercount.l_reply) +'</em><span>回复数</span></a>');
            iDiv('</div>');
            if(dom.commentCount){
                dom.commentCount.innerHTML = temp.join('');
            }

        };
        new $.cmnt.DataLoader({
            url: USERURL,
            param: param,
            loaded: function(self) {
                render(dom, self.data);
            }
        });
    };

    var setUserInfo = function(){
        var cusEvt = $.custEvent;
        var setName = function() {
            dom.name.innerHTML = $.login.getName();
            dom.head.innerHTML = $.login.getFace();
        };
        cusEvt.add($, 'ce_login', function() {
            setName();
            getCommentData();
        });
        cusEvt.add($, 'ce_preLogin', function() {
            setName();
            getCommentData();
        });
        cusEvt.add($, 'ce_logout', function() {
            setName();
        });
        cusEvt.add($, 'ce_weiboLogin', function() {
            setName();
        });
        cusEvt.add($, 'ce_weiboLogout', function() {
            setName();
        });
    };


    var url = 'http://comment5.news.sina.com.cn/page/info';
    var pageSize = 20;
    var infoType = getParam('info_type');
    var group = getParam('group')|| getParam('style') || 0;
    var uid = getParam('user_uid') || '';
    var channel = getParam('channel')|| 'ty';
    var newsid = getParam('newsid')|| '6-12-7081102';

    var builder = $.builder($.byId('SI_Wrap'), 'bbs-node-type');
    var dom = builder.ids;


    var co = window.SINA_OUTLOGIN_LAYER.getSinaCookie();

    //不能查看他人回复记录（当没有登录或者登录后co.uid和ARTICLE_DATA.user_uid不一致时）
    if (infoType == 2) {
        //没有登录 或者 登录有user_uid且uid不一致
        if (!co || (co && uid && uid !== co.uid)) {
            location.href = location.href.replace('info_type=2', 'info_type=1');
        }
    }
    //当未登录info_type不为0且user_uid为空时，跳转到登录页面

    // if (infoType != 0 && !co && !uid) {
    //     location.href = 'http://login.sina.com.cn/signup/signin.php?r=' + encodeURIComponent(location.href);
    // }
    if (co) {
        uid = uid || co.uid;
    }
    //更改数据接口
    if (infoType == 1) {
        url = 'http://comment5.news.sina.com.cn/user/cmnt?uid=' + uid;
        pageSize = 20;
    } else if (infoType == 2) {
        url = 'http://comment5.news.sina.com.cn/user/reply?uid=' + uid;
        pageSize = 20;
    }

    var setTpls = function(infoType) {
        var adata = ' action-data=';
        var atype = ' action-type=';
        var clz = ' class=';
        var ctype = ' comment-type=';
        var cmntTpls = $.cmnt.tpls;

        if (infoType === '1' || infoType === '2') {
            // 不需要评论框
            cmntTpls.set('formList', '</div><div class="sina-comment-list" comment-type="list"></div>');
            // 修改列表标题
            cmntTpls.set('list', ['<div' + clz + '"latest-wrap"' + ctype + '"latestWrap">',
                '<div' + clz + '"latest-loading loading"><a href="javascript:;"></a></div>',
                '<div' + clz + '"list"' + ctype + '"latestList"></div>',
                '<div' + clz + '"more"' + atype + '"getMore"' + adata + '"type=latest" ' + ctype + '"latestMore"><a href="javascript:;">点击加载更多</a></div>',
                '</div>',
                '<div' + clz + '"all-loading loading"><a href="javascript:;"></a></div>',
            ].join(''));
        } else {
            // 两个评论框
            cmntTpls.set('formList', '<div class="sina-comment-form sina-comment-form-top"' + ctype + '"form"> </div> <div class="sina-comment-list"' + ctype + '"list"></div><div class="sina-comment-form sina-comment-form-bottom"' + ctype + '"form"> ');
        }

        // var ADHTML = '<div class="adBlock"> <div id="AD_CMSGLIST_BOTTOM"><iframe style="width: 600px; height: 90px; margin: 0 auto ; padding: 0px; border: 0px;" frameborder="0" scrolling="no" src="http://pfp.sina.com.cn/pfpnew/iframe/comments.html"></iframe></div></div>';
        // // 添加广告
        // cmntTpls.set('formList',cmntTpls.get('formList').replace('"list"></div>','"list"></div>'+ADHTML));

        // 评论框加“自律公约”
        var formHTML = cmntTpls.get('comment');
        var gongyue = '<a href="http://news.sina.com.cn/comment/gongyue.html" style="float:right;padding:0 0 0 20px;color:#c00 !important" target="_blank" title="自律公约">自律公约</a>';
        cmntTpls.set('comment',formHTML.replace('<!-- 发布 end -->',gongyue + '<!-- 发布 end -->'));
    };
    var setNewsTitle = function(id, data, infoType) {
        var titleNode = $.byId(id);
        var news = data.news;
        var title = '';
        var usercount = 0;
        var name = '';
        var mcount = 0;
        var count = 0;
        if (titleNode) {
            if (infoType == 1 || infoType == 2) {
                usercount = data.usercount;
                name = usercount.screen_name;
                mcount = 0;

                if (infoType == 1) {
                    mcount = usercount.l_count;
                    title = name + '的评论（共' + mcount + '条）';
                } else if (infoType == 2) {
                    mcount = data.usercount.l_reply;
                    title = '回复' + name + '的评论（共' + mcount + '条）';
                }
                titleNode.innerHTML = title;
                //如果有最新回复数，则加上
                if (data.myMessage && data.myMessage.reply_cmnt) {
                    count = data.myMessage.reply_cmnt.length;
                    if (count > 0) {
                        title = '(' + count + '条新回复)' + title;
                    }
                }
                document.title = title;
            } else {
                title = '<a href="' + news.url + '">' + news.title + '</a>';
                titleNode.innerHTML = title;
                document.title = '新闻论坛_' + news.title + '_新浪网';
            }
        }
    };
    setTpls(infoType);
    // 还可以通过修改url提取个人的评论内容
    window.FormList1 = new $.cmnt.FormList(dom.comment, {
        channel: channel,
        newsid: newsid,
        parent: '',
        encoding: 'gbk'
        // commented:function(){
        //     console.log('form');
        // }
    }, {
        url: url,
        channel: channel,
        newsid: newsid,
        //style=1本来为皮肤，应该为group=1
        group: group,
        encoding: 'gbk',
        page: 1,
        pageSize: pageSize,
        // 每次分页条数
        pageNum: 20,
        firstPageNum:20,
        // 热门评论条数
        hotPageNum: 10,
        maxFloor: 1,
        isBBS:1,
        showReply:0,
        // commented:function(){
        //     console.log('list');
        // },
        // autoGrow:false,
        // 在回复框评论后是否滚动最新评论处
        // scrollToLatest:false,
        loaded: function(self) {
            setNewsTitle(dom.title, self.data, infoType);
            // console.log(self.data);
        }
    }, {
        isBBS: 1
        // 在回复框评论后是否滚动最新评论处
        // scrollToLatest:false
    });

    // 获取排行榜
    getTopList(dom.topList, infoType, channel);
    // 获取评论数和回复数
    getCommentData();
    // 设置用户数据
    setUserInfo();
    // 固定广告
    fixAD();
    // 使用提示
    bindTip();
})(window);