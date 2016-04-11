(function(exports) {
  var $ = exports.___sinacMNT___;
  $.register('msg', function() {
    var all = {
      I001: '评论成功',
      I002: '并已转发微博',
      I003: '请输入评论',
      I004: '请输入密码',
      I005: '请先登录再提交评论',
      I006: '已到最后一页',
      I007: '发布',
      I008: '赞',
      I009: '回复',
      I010: '微博账号/博客/邮箱',
      I011: '下次自动登录',
      I012: '注册',
      I013: '忘记密码？',
      I014: '点击加载更多',
      I015: '最热评论',
      I016: '最新评论',
      I017: '刷新',
      I018: '分享到微博',
      I019: '分享',
      I020: '分享到新浪微博',
      I021: '分享到腾讯微博',
      I022: '月',
      I023: '日',
      I024: '今天',
      I025: '秒前',
      I026: '分钟前',
      I027: '更多精彩评论&gt;&gt;',
      I028: '<span>还有<em><% this.num %></em>条评论，</span>',
      I029: '登录',
      I030:'退出',
      I031:'<em><% this.comment %></em>条评论',
      I032:'<em><% this.person %></em>人参与',
      I033:'<em><% this.post %></em>条相关帖子',
      I034:'查看对话',
      I035:'收起对话',
      I036:'回复<% this.userLnk %>：',
      I037:'：',
      I038:'我有话说',
      I039:'<span class="reply-form-tip"><em>点赞成功！</em>再对TA说点什么吧~</span>',
      I040:'&lt;&lt;查看更早对话',
      I041:'加载中，请稍候...',
      I042:'评论超时，请稍候再试',
      I043:'举报'
    };
    var msg = (function() {
      var Control = {
        set: function(code, desc) {
          if (code !== 'all') {
            all[code] = desc;
          } else {
            all = desc;
          }
        },
        get: function(code) {
          if (typeof code == 'undefined') {
            return all;
          }
          return all[code];
        }
      };
      return Control;
    })();
    return msg;
  });
})(window);