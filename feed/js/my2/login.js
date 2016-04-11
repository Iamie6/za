/**
 * @file 登录相关
 * @author Daichang <daichang@staff.sina.com.cn>
 */
(function(exports,undefined) {
	/*1.渲染用户名的方法
	2.登录，退出要修改评论中所有显示用户名的地方
	3.登录成功，退出成功的回调（供使用者使用）
	4.显示登录成功部分（如用户名），显示退出成功部分（如登录按钮）*/
	var $ = exports.___mysInacMNT___;
	// 登录，登录微博事件, 登录出错事件, 退出事件
	$.custEvent.define($, ['my_ce_login','my_ce_weiboLogin','my_ce_weiboLogout', 'my_ce_loginError', 'my_ce_logout','my_ce_cmnt_new','my_ce_cmnt_close']);

	if (!exports.SINA_OUTLOGIN_LAYER) {
		throw new Error('http://i.sso.sina.com.cn/js/outlogin_layer.js not loaded');
	}
	var LoginLayer = exports.SINA_OUTLOGIN_LAYER;
	/*var UserPanel =  exports.SINA_USER_PANEL;*/

	var USERLNK = 'http://comment5.news.sina.com.cn/comment/skin/default.html?info_type=1&style=1&user_uid=';

	$.register('login', function() {
		/**
		 * @name login
		 * @description 登录相关
		 * @class
		 * @static
		 */
		var Login = new $.Clz();

		var addBodyClz = function(type,keep){
			// type login weibo_login logout
			var types = ['login','weibo_login','logout','weibo_login_security'];
			var clzPrefix = 'mysInacMNT_';
			// 是否保留其它类
			keep = keep||0;
			// $.domReady(function(){
				var body = $.byTag('body')[0];
				if(body){
					$.addClass(body,clzPrefix+type);
					for (var i = 0, len = types.length; i < len; i++) {
						var item = types[i];
						if(item!=type&&!keep){
							$.removeClass(body,clzPrefix+item);
						}
					}
				}
			// });
		};
		// 是否实名认证用户，不是的话，关闭分享功能
		var securityCheck = function(cb){
			$.jsonp('http://comment5.news.sina.com.cn/user/security',function(msg){
				if(msg&&msg.result&&msg.result.data){
					var isSecurity = msg.result.data.is_security||false;
					if(isSecurity&&typeof cb=='function'){
						cb();
					}
				}
			});
		};

		var weiboInfo = null;
		Login.include({
			init: function(opt) {
				var self = this;
				// 设置选项
				self._setOpt(opt);
				self._setLogin();
			},
			/**
			 * 设置选项
			 * @member _setOpt
			 * @private
			 * @param {Object} opt
			 * @param {Function} opt.loginSuccess 登录成功回调
			 * @param {Function} opt.logoutSuccess 退出成功回调
			 * @param {Function} opt.error 登录或退出错误回调
			 */
			_setOpt: function(opt) {
				this.set('opt', $.extend({
					// 加载完成后
					loginSuccess: function() {},
					logoutSuccess: function() {},
					// 超时处理
					error: function(msg) {}
				}, opt, true));
			},
			/**
			 * 设置登录选项
			 * @member _setLogin
			 * @private
			 */
			_setLogin: function() {
				var self = this;

				var lSTK = LoginLayer.STK;
				lSTK.Ready(function() {
					LoginLayer
					.register('login_success', function() {
						self.lInSuccess();
					})
					.register('logout_success', function() {
						self.lOutSuccess();
					})
					.register('login_error',function(loginStatus){
						self.lInError(loginStatus);
					});
					// if(!LoginLayer.hasBeenInitialed()){
						LoginLayer.init();
					// }
					if(!self.isLogin()){
						addBodyClz('logout');
					}
				});
			},
			/**
			 * 退出成功后
			 * @member _setOpt
			 * @private
			 */
			lOutSuccess: function() {
				var self = this;
				var opt = self.get('opt');
				// 退出成功
				$.custEvent.fire($, 'my_ce_logout');
				opt.logoutSuccess();
				addBodyClz('logout');
			},
			/**
			 * 登录成功后
			 * @member _setOpt
			 * @private
			 */
			lInSuccess: function() {
				var self = this;
				var opt = self.get('opt');
				self.getWeiboInfo(function(msg) {
					addBodyClz('weibo_login');
					if(msg.result && msg.result.data){
						weiboInfo = msg.result.data;
						$.custEvent.fire($, 'my_ce_weiboLogin');
						// 检查是否是微博的实名验证用户，非实名验证用户不显示“分享到微博”，“分享”两个功能
						securityCheck(function(){
							addBodyClz('weibo_login_security',1);
						});
					}else{
						weiboInfo = null;
						$.custEvent.fire($, 'my_ce_weiboLogout');
					}
					$.custEvent.fire($, 'my_ce_login');

				}, function() {
					addBodyClz('login');
				});
				opt.loginSuccess();
			},
			/**
			 * 登录出错后
			 * @member _setOpt
			 * @private
			 */
			lInError: function(loginStatus) {
				var self = this;
				var opt = self.get('opt');
				//4049 验证码
				// {result: false, errno: "5024", reason: "为了您的帐号安全，请填写微盾动态码"}
				// 需要验证的跳转
				// 4038 登录尝试次数过于频繁，请稍后再登录
				var validated = !$.inArray(loginStatus.errno, ['5024', '5025', '4049', '2070']);
				// 登录失败
				if (!loginStatus.result) {
					$.custEvent.fire($, 'my_ce_loginError', {
						validated: validated,
						info: loginStatus
					});
					opt.error();
					return false;
				}
			},
			/**
			 * 是否已经登录
			 * @member
			 * @return {Boolean} 是否已经登录
			 */
			isLogin: function() {
				return LoginLayer.isLogin();
			},
			/**
			 * 获取微博信息
			 * @member getWeiboInfo
			 * @param  {Function} succ 成功回调
			 * @param  {Function} fail 失败回调
			 * @return {[type]}      [description]
			 */
			getWeiboInfo: function(succ, fail) {
				var co = exports.sinaSSOController.getSinaCookie();
				var url = 'http://api.sina.com.cn/weibo/2/users/show.json?uid=' + co.uid + '&source=2835469272';
				var TIMEOUT_NAME = $.getGuid();
				$.timeoutHandle(TIMEOUT_NAME, function(handle) {
					handle.timeout(TIMEOUT_NAME, function() {
						// 超时处理
						fail();
					});
					$.jsonp(url, function(msg) {
						// 数据处理
						succ(msg);
						// 成功通知
						handle.success(TIMEOUT_NAME);
					});
				}, 3e3);
			},
			/**
			 * 退出登录
			 * @member
			 */
			lOut: function() {
				LoginLayer.logout();
			},
			/**
			 * 登录
			 * @member
			 * @param  {String} user      用户名
			 * @param  {String} psd       密码
			 * @param  {Number} savestate 保持登录状态天数
			 */
			lIn: function(user, psd, savestate) {
				// // savestate 保持登录状态的天数，可选； 默认为不保持登录状态，最长为30天；
				// controller.login(user, psd, savestate);
				if(window.SINA_USER_PANEL){
					var UserPanel = window.SINA_USER_PANEL;
// var winSize = $.app.getWinSize(); var scrollTop = document.body.scrollTop || document.documentElement.scrollTop var pos = { 'l': (winSize.width - 477) / 2, 't': scrollTop + (winSize.height - 264) / 2 }; // 477 264 UserPanel.setOutLoginLayerPosition(pos);
					try{
						UserPanel.setOutLoginMiddle(true);
					}catch(e){}
					UserPanel.getOutLogin().show();
				}else{
					LoginLayer.show();
				}
			},
			/**
			 * 获取登录链接或登录名
			 * @member
			 * @return {String||HTMLString} 返回用户名的HTML字符串或字符串
			 */
			getName: function() {
				var html = '';
				var sinaInfo = LoginLayer.getSinaCookie();
				if (weiboInfo) {
					html = '<a href="http://weibo.com/u/'+weiboInfo.id+'/" target="_blank">' + (weiboInfo.screen_name || weiboInfo.name) + '</a>';
				} else if (sinaInfo) {
					html = '<a href="'+USERLNK+sinaInfo.uid+'" target="_blank">' + (sinaInfo.nick || sinaInfo.name) + '</a>';
				}
				return html;
			},
			/**
			 * 获取登录头像链接
			 * @member
			 * @return {String||HTMLString} 返回用户名的HTML字符串或字符串
			 */
			getFace: function() {
				var title = '';
				var src = 'http://img.t.sinajs.cn/t5/style/images/face/male_180.png';
				var sinaInfo = LoginLayer.getSinaCookie();
				var href  = 'http://weibo.com/';
				if (weiboInfo) {
					href = 'http://weibo.com/u/'+weiboInfo.id+'/';
					title = (weiboInfo.screen_name || weiboInfo.name);
					src = weiboInfo.profile_image_url.replace('/50/','/180/');
				} else if (sinaInfo) {
					src = 'http://portrait5.sinaimg.cn/'+ sinaInfo.uid +'/blog/50';
					title = sinaInfo.nick || sinaInfo.name;
					href = USERLNK+sinaInfo.uid;
				}
				return '<a href="'+href+'" target="_blank" title="'+title+'"><img src="'+src+'" alt="" /></a>';
			},

			getInfo: function() {
				return {
					sina: LoginLayer.getSinaCookie(),
					weibo: weiboInfo
				};
			},
			getCommentConfig: function() {
				var info = this.getInfo();
				var config = '';
				if (info.weibo) {
					var weiboData = info.weibo;
					config = '&wb_verified=' + weiboData.verified + '&wb_screen_name=' + weiboData.screen_name + '&wb_user_id=' + weiboData.idstr + '&wb_time=&wb_profile_img=' + weiboData.profile_image_url;
				}
				return config;
			}

		});
		return new Login();
	});
})(window);