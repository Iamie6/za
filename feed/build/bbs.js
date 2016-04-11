/*!
* comment
* v 3.0.0
* svn ../ui/project/comment3/
* 2015-08-12 11:47
* [${p_id},${t_id},${d_id}] published at ${publishdate} ${publishtime}
*/
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
         * \u8BFB\u53D6cookie,\u6CE8\u610Fcookie\u540D\u5B57\u4E2D\u4E0D\u5F97\u5E26\u5947\u602A\u7684\u5B57\u7B26\uFF0C\u5728\u6B63\u5219\u8868\u8FBE\u5F0F\u7684\u6240\u6709\u5143\u5B57\u7B26\u4E2D\uFF0C\u76EE\u524D .[]$ \u662F\u5B89\u5168\u7684\u3002
         * @param {Object} cookie\u7684\u540D\u5B57
         * @return {String} cookie\u7684\u503C
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
         * \u8BBE\u7F6Ecookie
         * @param {String} name cookie\u540D
         * @param {String} value cookie\u503C
         * @param {Number} expire Cookie\u6709\u6548\u671F\uFF0C\u5355\u4F4D\uFF1A\u5C0F\u65F6
         * @param {String} path \u8DEF\u5F84
         * @param {String} domain \u57DF
         * @param {Boolean} secure \u5B89\u5168cookie
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
         * \u5220\u9664cookie
         * @param {String} name cookie\u540D
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
        // \u5148\u5224\u65AD,\u70B9\u51FB\u5927\u4E8E0\uFF0C\u5219\u4E0D\u6253\u5F00\u63D0\u793A\uFF0C\u5426\u5219\u6253\u5F00\u63D0\u793A;\u63D0\u793A\u53EA\u5C55\u793A\u4E00\u6B21
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
            // \u53EA\u5C55\u793A\u4E00\u6B21
            times = times+1;
            // 5\u5E74
            cookie.setCookie(cookieName, times, 43800);
        }

        // \u70B9\u51FB\u5173\u95ED
        addEvent(dom.useTipClose, 'click', function(e){
            hide();
            $.stopPropagation(e);
        });
        // \u70B9\u51FB\u6253\u5F00\u94FE\u63A5
        addEvent(dom.useTip, 'click', function(e){
            window.open(dom.useTip.getAttribute('lhref'));
        });
        setTimeout(function(){
            hide();
        },30e3);
    };
    var fixAD = function(){
        // \u6EDA\u52A8\u56FA\u5B9A
        new window.ScrollFix(dom.sideDa1,{
            getTop:function(wrap){
                var footerToTop = $.getPosition(dom.footer).top;
                var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                var height = wrap.offsetHeight;
                return Math.min(footerToTop - scrollTop - height, 0);
            },
            fixed:function(wrap,scrollTop,offsetTop,top){
                // \u6EDA\u52A8\u5230\u6700\u4E0B\u9762\u5185\u5BB9\u65F6\u518D\u56FA\u5B9A
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
        //\u5217\u8868\u7C7B\u578B\uFF0C\u8FD8\u6709week,month\u4EE5\u540E\u53EF\u80FD\u505A\u6210\u9009\u9879\u5361\u7684\u5F62\u5F0F
        var Type = 'day';
        var listChannel = (infoType==1 || infoType==2)?'all':channel;
        //TODO param\u90E8\u5206\u6570\u636E\u4ECEurl\u83B7\u53D6
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
                //\u6BD4\u8F83\u8BC4\u8BBA\u6570
                if(a.total_count!=b.total_count){
                    result = b.total_count-a.total_count;
                }else{
                    //\u8BC4\u8BBA\u6570\u76F8\u7B49\uFF0C\u6BD4\u8F83\u4F4D\u7F6E
                    result = a.position-b.position;
                }
                return result;
            });
            var NUMBASE = 'http://comment5.news.sina.com.cn/comment/skin/default.html?';
            iDiv('<div class="hd"> <h2>\u70ED\u8BC4\u6392\u884C</h2> </div> <ul class="bd">');
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
        //TODO param\u90E8\u5206\u6570\u636E\u4ECEurl\u83B7\u53D6
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
                iDiv('<a target="_blank" href="http://my.sina.com.cn/profile/logined#location=cmnt&cmnt=cmnt-list"><em>'+ splitNum(usercount.l_count) +'</em><span>\u8BC4\u8BBA\u6570</span></a>');
            iDiv('</div>');
            iDiv('<span class="line"></span>');
            iDiv('<div class="reply count">');
                iDiv('<a target="_blank" href="http://my.sina.com.cn/profile/logined#location=cmnt&cmnt=reply-list"><em>'+ splitNum(usercount.l_reply) +'</em><span>\u56DE\u590D\u6570</span></a>');
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

    //\u4E0D\u80FD\u67E5\u770B\u4ED6\u4EBA\u56DE\u590D\u8BB0\u5F55\uFF08\u5F53\u6CA1\u6709\u767B\u5F55\u6216\u8005\u767B\u5F55\u540Eco.uid\u548CARTICLE_DATA.user_uid\u4E0D\u4E00\u81F4\u65F6\uFF09
    if (infoType == 2) {
        //\u6CA1\u6709\u767B\u5F55 \u6216\u8005 \u767B\u5F55\u6709user_uid\u4E14uid\u4E0D\u4E00\u81F4
        if (!co || (co && uid && uid !== co.uid)) {
            location.href = location.href.replace('info_type=2', 'info_type=1');
        }
    }
    //\u5F53\u672A\u767B\u5F55info_type\u4E0D\u4E3A0\u4E14user_uid\u4E3A\u7A7A\u65F6\uFF0C\u8DF3\u8F6C\u5230\u767B\u5F55\u9875\u9762

    // if (infoType != 0 && !co && !uid) {
    //     location.href = 'http://login.sina.com.cn/signup/signin.php?r=' + encodeURIComponent(location.href);
    // }
    if (co) {
        uid = uid || co.uid;
    }
    //\u66F4\u6539\u6570\u636E\u63A5\u53E3
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
            // \u4E0D\u9700\u8981\u8BC4\u8BBA\u6846
            cmntTpls.set('formList', '</div><div class="sina-comment-list" comment-type="list"></div>');
            // \u4FEE\u6539\u5217\u8868\u6807\u9898
            cmntTpls.set('list', ['<div' + clz + '"latest-wrap"' + ctype + '"latestWrap">',
                '<div' + clz + '"latest-loading loading"><a href="javascript:;"></a></div>',
                '<div' + clz + '"list"' + ctype + '"latestList"></div>',
                '<div' + clz + '"more"' + atype + '"getMore"' + adata + '"type=latest" ' + ctype + '"latestMore"><a href="javascript:;">\u70B9\u51FB\u52A0\u8F7D\u66F4\u591A</a></div>',
                '</div>',
                '<div' + clz + '"all-loading loading"><a href="javascript:;"></a></div>',
            ].join(''));
        } else {
            // \u4E24\u4E2A\u8BC4\u8BBA\u6846
            cmntTpls.set('formList', '<div class="sina-comment-form sina-comment-form-top"' + ctype + '"form"> </div> <div class="sina-comment-list"' + ctype + '"list"></div><div class="sina-comment-form sina-comment-form-bottom"' + ctype + '"form"> ');
        }

        // var ADHTML = '<div class="adBlock"> <div id="AD_CMSGLIST_BOTTOM"><iframe style="width: 600px; height: 90px; margin: 0 auto ; padding: 0px; border: 0px;" frameborder="0" scrolling="no" src="http://pfp.sina.com.cn/pfpnew/iframe/comments.html"></iframe></div></div>';
        // // \u6DFB\u52A0\u5E7F\u544A
        // cmntTpls.set('formList',cmntTpls.get('formList').replace('"list"></div>','"list"></div>'+ADHTML));

        // \u8BC4\u8BBA\u6846\u52A0\u201C\u81EA\u5F8B\u516C\u7EA6\u201D
        var formHTML = cmntTpls.get('comment');
        var gongyue = '<a href="http://news.sina.com.cn/comment/gongyue.html" style="float:right;padding:0 0 0 20px;color:#c00 !important" target="_blank" title="\u81EA\u5F8B\u516C\u7EA6">\u81EA\u5F8B\u516C\u7EA6</a>';
        cmntTpls.set('comment',formHTML.replace('<!-- \u53D1\u5E03 end -->',gongyue + '<!-- \u53D1\u5E03 end -->'));
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
                    title = name + '\u7684\u8BC4\u8BBA\uFF08\u5171' + mcount + '\u6761\uFF09';
                } else if (infoType == 2) {
                    mcount = data.usercount.l_reply;
                    title = '\u56DE\u590D' + name + '\u7684\u8BC4\u8BBA\uFF08\u5171' + mcount + '\u6761\uFF09';
                }
                titleNode.innerHTML = title;
                //\u5982\u679C\u6709\u6700\u65B0\u56DE\u590D\u6570\uFF0C\u5219\u52A0\u4E0A
                if (data.myMessage && data.myMessage.reply_cmnt) {
                    count = data.myMessage.reply_cmnt.length;
                    if (count > 0) {
                        title = '(' + count + '\u6761\u65B0\u56DE\u590D)' + title;
                    }
                }
                document.title = title;
            } else {
                title = '<a href="' + news.url + '">' + news.title + '</a>';
                titleNode.innerHTML = title;
                document.title = '\u65B0\u95FB\u8BBA\u575B_' + news.title + '_\u65B0\u6D6A\u7F51';
            }
        }
    };
    setTpls(infoType);
    // \u8FD8\u53EF\u4EE5\u901A\u8FC7\u4FEE\u6539url\u63D0\u53D6\u4E2A\u4EBA\u7684\u8BC4\u8BBA\u5185\u5BB9
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
        //style=1\u672C\u6765\u4E3A\u76AE\u80A4\uFF0C\u5E94\u8BE5\u4E3Agroup=1
        group: group,
        encoding: 'gbk',
        page: 1,
        pageSize: pageSize,
        // \u6BCF\u6B21\u5206\u9875\u6761\u6570
        pageNum: 20,
        firstPageNum:20,
        // \u70ED\u95E8\u8BC4\u8BBA\u6761\u6570
        hotPageNum: 10,
        maxFloor: 1,
        isBBS:1,
        showReply:0,
        // commented:function(){
        //     console.log('list');
        // },
        // autoGrow:false,
        // \u5728\u56DE\u590D\u6846\u8BC4\u8BBA\u540E\u662F\u5426\u6EDA\u52A8\u6700\u65B0\u8BC4\u8BBA\u5904
        // scrollToLatest:false,
        loaded: function(self) {
            setNewsTitle(dom.title, self.data, infoType);
            // console.log(self.data);
        }
    }, {
        isBBS: 1
        // \u5728\u56DE\u590D\u6846\u8BC4\u8BBA\u540E\u662F\u5426\u6EDA\u52A8\u6700\u65B0\u8BC4\u8BBA\u5904
        // scrollToLatest:false
    });

    // \u83B7\u53D6\u6392\u884C\u699C
    getTopList(dom.topList, infoType, channel);
    // \u83B7\u53D6\u8BC4\u8BBA\u6570\u548C\u56DE\u590D\u6570
    getCommentData();
    // \u8BBE\u7F6E\u7528\u6237\u6570\u636E
    setUserInfo();
    // \u56FA\u5B9A\u5E7F\u544A
    fixAD();
    // \u4F7F\u7528\u63D0\u793A
    bindTip();
})(window);