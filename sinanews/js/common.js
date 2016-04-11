 /**
 * author 刘鹏
 * date : 2015-12-16
 * email: liupeng_luck@outlook.com
 * website: http://focusbe.com/
 */ 
$(function() {

});

function setFontsize(standardsize) {
    ww = $(window).width();
    var standardNum = 375 / standardsize;
    window.fontsize = ww / standardNum;
    $('html').css({
        fontSize: fontsize + 'px'
    });
}
var device = {
    Android: function() {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function() {
        return navigator.userAgent.match(/iPad|iPod|iPhone/i) ? true : false;
    },
    iphone: function() {
        return navigator.userAgent.match(/iPhone/i) ? true : false;
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    any: function() {
        return (device.Android() || device.BlackBerry() || device.Windows() || device.iOS());
    }
};


function isWeixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

var news = {
    new_index: 0,
    total: -1,
    loadedNum: 0,
    curPage: 0,
    curCat:'',
    init: function(cat) {
        if(typeof(cat)=='undefined')
        {
            cat = 'index';
        }
        if(this.curCat==cat)
        {
            return;
        }
        this.curCat = cat;
        this.new_index = 0;
        this.total=  -1;
        this.loadedNum=  0;
        this.curPage=  0;
        this.curCat = cat;
        var self = this;
        this.bind();
        $(".news_list").html('');
        this.getList(this.curPage + 1, 0, function() {
            self.judgeScroll();
        });
    },
    bind: function() {
        var self = this;
        var scrollT;
        $(window).scroll(function() {
            self.judgeScroll();
        });
        $(".news_cat li a").click(function(){
            $(".news_cat li a").removeClass('cur');
            $(this).addClass('cur');
            self.init($(this).attr('data-cat'));
        });
    },
    judgeScroll: function() {
        var self = this;
        scrollT = $(window).scrollTop();
        if ($(document).height() - scrollT - $(window).height() < 20) {
            self.getList(self.curPage + 1);
        }
    },
    showLoading: function() {
        $(".loading").show();
        $(".error").hide();
    },
    hideLoading: function() {
        $(".loading").hide();
    },
    showError:function(){
        $(".loading").hide();
        $(".error").show();
    },
    getList: function(page, limit, callback) {
        var self = this;
        if(!this.curCat)
        {
            this.curCat = 'index';
        }
        if (page > self.total && self.total != -1 || page < 1) {
            if (typeof(callback) == 'function') {
                callback();
            }
            return;
        }
        if (this.ajaxRequest_ != undefined && this.ajaxRequest_.readyState < 4) {
            if (typeof(callback) == 'function') {
                callback();
            }
            return false;
        }
        this.showLoading();
        this.ajaxRequest_ = $.ajax({
            type: 'GET',
            url: "/html/news/"+self.curCat+"-" + page + ".shtml",
            success: function(data) {
                if (self.total == -1) {
                    self.total = parseInt(data.split("@@@")[1]);
                }
                data = $.parseJSON(data.substr(0, data.lastIndexOf("@@@"))); //将字符串转换成json
                var html = '';
                var time, timeattr;
                if (typeof(limit) == 'undefined' || !limit) {
                    limit = data.length;
                }
                var j = 0;
                for (var i in data) {
                    j++;
                    if (j > limit) {
                        break;
                    }
                    var n = data[i];
                    if (n.id != '') {
                        timeattr = n.publishdate.split('-');
                        time = timeattr[1] + '-' + timeattr[2];
                        var catClass;
                        if (n.type == '新闻') {
                            catClass = 'cat1';
                        } else if (n.type == '公告') {
                            catClass = 'cat2'
                        } else {
                            catClass = 'cat3';
                        }
                        html = html + "<li><a href='/phone/news/newsinfo_" + n.id + ".html'><span class='cat " + catClass + "'>" + n.type + "</span><span class='title'>" + n.title + "</span><span class='time'>" + time + "</span></a></li>";
                    }
                }
                $(".news_list").append(html);
                self.curPage++;
                if (typeof(callback) == 'function') {
                    callback();
                }
                self.hideLoading();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status == 404) {
                    // $('.nextpage').hide();
                    self.showError();
                }
            }
        });
    }
}

//设置分享文案
function setShareInfo() {
    var url = window.location.protocol + '//' + window.location.host + window.location.pathname;
    var hostname = window.location.protocol + '//' + window.location.host;
    window.shareInfo = {
        title: '全球第一MOBA手游《虚荣》莅临中国 还有谁!',
        desc: '绝不贩卖属性，绝对竞技为王，苹果最佳设计奖得主、次时代巅峰电竞手游《虚荣》，等你来战！',
        link: url,
        img: hostname + "/phone/images/v2/share.jpg"
    }
    if ($(".detail_title>h2").length > 0 && $.trim($(".detail_title>h2").html()) != '') {
        shareInfo.title = $.trim($(".detail_title>h2").html());
    }
    if ($(".detail_content").length > 0 && $.trim($(".detail_content").html()) != '') {
        var text = delHtmlTag($.trim($(".detail_content").html()));
        text = text.subCHStr(0,100)+'...';
        shareInfo.desc = text;
    }
}
function delHtmlTag(str) {
    return str.replace(/<[^>]+>/g, "").replace(/&[^>]+;/g,""); //去掉所有的html标记  
}
String.prototype.strLen = function() {
        var len = 0;
        for (var i = 0; i < this.length; i++) {
            if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) len += 2;
            else len++;
        }
        return len;
    }
    //将字符串拆成字符，并存到数组中
String.prototype.strToChars = function() {
        var chars = new Array();
        for (var i = 0; i < this.length; i++) {
            chars[i] = [this.substr(i, 1), this.isCHS(i)];
        }
        String.prototype.charsArray = chars;
        return chars;
    }
    //判断某个字符是否是汉字
String.prototype.isCHS = function(i) {
        if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0)
            return true;
        else
            return false;
    }
    //截取字符串（从start字节到end字节）
String.prototype.subCHString = function(start, end) {
        var len = 0;
        var str = "";
        this.strToChars();
        for (var i = 0; i < this.length; i++) {
            if (this.charsArray[i][1])
                len += 2;
            else
                len++;
            if (end < len)
                return str;
            else if (start < len)
                str += this.charsArray[i][0];
        }
        return str;
    }
    //截取字符串（从start字节截取length个字节）
String.prototype.subCHStr = function(start, length) {
    return this.subCHString(start, start + length);
}

var getParam = function () {
    var search = window.location.hash;
    var params = {};

    if (search.indexOf('#') >= 0) {
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