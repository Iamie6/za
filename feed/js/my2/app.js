/**
 * @file 工具应用
 * @author Daichang <daichang@staff.sina.com.cn>
 */
(function(exports,undefined) {
	var $ = exports.___mysInacMNT___;
	var doc = $.doc;
	$.register('app', function() {
		/**
		 * @name mysInacMNT.app
		 * @description 工具应用
		 * @module app
		 */

		var app = {};
		app.track = function(key,val){
			try {
				exports._S_uaTrack(key, val);
			} catch (e) {

			}
		};

		/**
		 * @name mysInacMNT.app.textareaUtils
		 * @description 评论框文字处理工具集
		 * @module app
		 * @submodule textareaUtils
		 */
		// 评论框文字处理
		app.textareaUtils = (function() {
			var T = {}, ds = doc.selection;
			/**
			 * 获取指定Textarea的光标位置
			 * @param {HTMLElement} oElement 必选参数，Textarea对像
			 */
			T.selectionStart = function(oElement) {
				if (!ds) {
					return oElement.selectionStart;
				}
				var er = ds.createRange(),
					s = 0;
				var er1 = doc.body.createTextRange();
				er1.moveToElementText(oElement);
				for (s; er1.compareEndPoints('StartToStart', er) < 0; s++) {
					er1.moveStart('character', 1);
				}
				return s;
			};
			T.selectionBefore = function(oElement) {
				return oElement.value.slice(0, T.selectionStart(oElement));
			};
			/**
			 * 选择指定有开始和结束位置的文本
			 * @param {HTMLElement} oElement 必选参数，Textarea对像
			 * @param {Number}      iStart   必选参数, 起始位置
			 * @param {Number}      iEnd     必选参数，结束位置
			 */
			T.selectText = function(oElement, nStart, nEnd) {
				oElement.focus();
				if (!ds) {
					oElement.setSelectionRange(nStart, nEnd);
					return;
				}
				var c = oElement.createTextRange();
				c.collapse(1);
				c.moveStart('character', nStart);
				c.moveEnd('character', nEnd - nStart);
				c.select();
			};
			/**
			 * 在起始位置插入或替换文本
			 * @param {HTMLElement} oElement    必选参数，Textarea对像
			 * @param {String}      sInsertText 必选参数，插入的文本
			 * @param {Number}      iStart      必选参数，插入位置
			 * @param {Number}      iLength     非必选参数，替换长度
			 */
			T.insertText = function(oElement, sInsertText, nStart, nLen) {
				oElement.focus();
				nLen = nLen || 0;
				if (!ds) {
					var text = oElement.value,
						start = nStart - nLen,
						end = start + sInsertText.length;
					oElement.value = text.slice(0, start) + sInsertText + text.slice(nStart, text.length);
					T.selectText(oElement, end, end);
					return;
				}
				var c = ds.createRange();
				c.moveStart('character', -nLen);
				c.text = sInsertText;
			};

			/**
			 * @param {object} 文本对象
			 */
			T.getCursorPos = function(obj) {
				var CaretPos = 0;
				if ($.ua.isIE) {
					obj.focus();
					var range = null;
					range = ds.createRange();
					var storedRange = range.duplicate();
					storedRange.moveToElementText(obj);
					storedRange.setEndPoint('EndToEnd', range);
					obj.selectionStart = storedRange.text.length - range.text.length;
					obj.selectionEnd = obj.selectionStart + range.text.length;
					CaretPos = obj.selectionStart;
				} else if (obj.selectionStart || obj.selectionStart === '0') {
					CaretPos = obj.selectionStart;
				}
				return CaretPos;
			};
			/**
			 * @param {object} 文本对象
			 */
			T.getSelectedText = function(obj) {
				var selectedText = '';
				var getSelection = function(e) {
					if (e.selectionStart !== undefined && e.selectionEnd !== undefined) {
						return e.value.substring(e.selectionStart, e.selectionEnd);
					} else {
						return '';
					}
				};
				if (window.getSelection) {
					selectedText = getSelection(obj);
				} else {
					selectedText = ds.createRange().text;
				}
				return selectedText;
			};
			/**
			 * @param {object} 文本对象
			 * @param {int} pars.rcs Range cur start
			 * @param {int} pars.rccl  Range cur cover length
			 * 用法
			 * setCursor(obj) cursor在文本最后
			 * setCursor(obj,5)第五个文字的后面
			 * setCursor(obj,5,2)选中第五个之后2个文本
			 */
			T.setCursor = function(obj, pos, coverlen) {
				pos = pos === null ? obj.value.length : pos;
				coverlen = coverlen === null ? 0 : coverlen;
				obj.focus();
				if (obj.createTextRange) { //hack ie
					var range = obj.createTextRange();
					range.move('character', pos);
					range.moveEnd('character', coverlen);
					range.select();
				} else {
					obj.setSelectionRange(pos, pos + coverlen);
				}
			};
			/**
			 * @param {object} 文本对象
			 * @param {Json} 插入文本
			 * @param {Json} pars 扩展json参数
			 * @param {int} pars.rcs Range cur start
			 * @param {int} pars.rccl  Range cur cover length
			 *
			 */
			T.unCoverInsertText = function(obj, str, pars) {
				pars = (pars === null) ? {} : pars;
				pars.rcs = pars.rcs === null ? obj.value.length : pars.rcs * 1;
				pars.rccl = pars.rccl === null ? 0 : pars.rccl * 1;
				var text = obj.value,
					fstr = text.slice(0, pars.rcs),
					lstr = text.slice(pars.rcs + pars.rccl, text === '' ? 0 : text.length);
				obj.value = fstr + str + lstr;
				this.setCursor(obj, pars.rcs + (str === null ? 0 : str.length));
			};
			return T;
		})();
		app.splitNum = function(num) {
			num = num + '';
			var re = /(-?\d+)(\d{3})/;
			while (re.test(num)) {
				num = num.replace(re, '$1,$2');
			}
			return num;
		};
		// dome https://gist.github.com/barretlee/7765698
		app.template = function(str, data) {
			//获取元素
			// var element = doc.getElementById(str);
			function isNode(node) {
				return !!((typeof node != 'undefined') && node.nodeName && node.nodeType);
			}

			function tplEngine(tpl, data) {
				var reg = /<%([^%>]+)?%>/g,
					regOut = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
					code = 'var r=[];\n',
					cursor = 0;
				var match;
				var add = function(line, js) {
					js ? (code += line.match(regOut) ? line + '\n' : 'r.push(' + line + ');\n') :
						(code += line ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
					return add;
				};
				while ((match = reg.exec(tpl))) {
					add(tpl.slice(cursor, match.index))(match[1], true);
					cursor = match.index + match[0].length;
				}
				add(tpl.substr(cursor, tpl.length - cursor));
				code += 'return r.join("");';
				return new Function(code.replace(/[\r\t\n]/g, '')).apply(data);
			}
			if (isNode(str)) {
				//textarea或input则取value，其它情况取innerHTML
				var html = /^(textarea|input)$/i.test(str.nodeName) ? str.value : str.innerHTML;
				return tplEngine(html, data);
			} else {
				//是模板字符串，则生成一个函数
				//如果直接传入字符串作为模板，则可能变化过多，因此不考虑缓存
				return tplEngine(str, data);
			}
		};
		// 模拟checkbox
		app.simCheckbox = function(ele) {
			var selectClass = 'my-sina-comment-chkbox-selected';
			var checked = $.hasClass(ele, selectClass);
			if (checked) {
				$.removeClass(ele, selectClass);
				ele.setAttribute('checked', 0);
			} else {
				$.addClass(ele, selectClass);
				ele.setAttribute('checked', 1);
			}
		};
		// 自动增高textarea
		app.textareaAutoGrow = (function(){
			var times = function(string, number) {
				for (var i = 0, r = ''; i < number; i++){
					r += string;
				}
				return r;
			};
			var getVal = function(textarea) {
				var val = textarea.value.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/&/g, '&amp;')
					.replace(/\n$/, '<br/>&nbsp;')
					.replace(/\n/g, '<br/>')
					.replace(/ {2,}/g, function(space) {
						return times('&nbsp;', space.length - 1) + ' ';
					});
				return val;
			};
			var Autogrow = function(textarea,config){
				var self = this;
				var defaults = {
					// clone容器class前缀
					clzPrefix:'autogrow-textarea-',
					// 最小高度，默认为textarea的初始高度
					minHeight:'auto',
					// 最大高度，默认为无限
					maxHeight:Infinity,
					// clone的父容器
					context:textarea.parentNode,
					// 手动设置clone样式，默认采用textarea的样式
					styles:{},
					// 实时检测textarea的样式，并且同步到隐藏的div中
					realTime:true,
					// 检测速度（毫秒）
					speed:200
				};
				config = $.extend(defaults,config);
				if(config.minHeight === 'auto'){
					// 如果没设置最小高度，则取加载进来时的高度为最小高度
					config.minHeight = $.getStyle(textarea,'height').replace('px','');
				}
				if(!textarea){
					return;
				}
				self.stop = false;
				self.config = config;
				self.textarea = textarea;
				self._bindEvent();
				self.setCloneStyle();
				self.grow();
			};
			Autogrow.prototype = {
				constructor:Autogrow,
				_bindEvent:function(){
					var self = this;
					var textarea = self.textarea;

					$.addEvent(textarea, 'keyup', function(e) {
						self.throttleGrow();
					});
					$.addEvent(textarea, 'focus', function(e) {
						self.throttleGrow();
					});
					$.addEvent(window, 'resize', function(e) {
						self.throttleGrow();
					});
				},
				setCloneStyle:function(){
					var self = this;
					var config = self.config;
					var textarea = self.textarea;
					if(!self.clone){
						self.clone = document.createElement('div');
						self.clone.className = config.clzPrefix+'clone';
						config.context.appendChild(self.clone);
					}
					var clone = self.clone;
					var defaultStyles = {
						position: 'absolute',
						wordWrap: 'break-word',
						top: 0,
						left: '-9999px'
					};
					var styles = {};
					if(!$.isEmptyObj(config.styles)){
						styles = $.extend(defaultStyles,config.styles);
					}else{
						styles = $.extend(defaultStyles,{
							width: $.getStyle(textarea,'width'),
							fontSize: $.getStyle(textarea,'fontSize'),
							fontFamily: $.getStyle(textarea,'fontFamily'),
							lineHeight: $.getStyle(textarea,'lineHeight')
						});
					}
					$.setStyle(clone,styles);
				},
				throttleGrow:function(){
					var self = this;
					if(self.stop){
						return;
					}
					$.throttle(self.grow,self,self.config.speed);
				},
				grow:function(){
					var self = this;
					var config = self.config;
					if(config.realTime){
						// 每次都检查textarea的样式并同步
						self.setCloneStyle();
					}
					self.clone.innerHTML = getVal(self.textarea);

					var height = $.getStyle(self.clone,'height').replace('px','');
					var overflow = 'hidden';
					height = Math.max(height,config.minHeight);
					if(height>config.maxHeight){
						height = config.maxHeight;
						overflow = 'auto';
					}
					height = Math.min(height,config.maxHeight);
					$.setStyle(self.textarea,{
						'height':height + 'px',
						'overflow':overflow
					});
				},
				revive:function(){
					var self = this;
					self.stop = false;
				},
				destroy:function(){
					var self = this;
					self.stop = true;
				}
			};
			return Autogrow;
		})();
		// 获取可视区高度
		app.getWinSize = function(_target){
			var w, h ,target;
			if (_target) {
				target = _target.document;
			}
			else {
				target = document;
			}

			if(target.compatMode === 'CSS1Compat') {
				w = target.documentElement.clientWidth;
				h = target.documentElement.clientHeight;
			}else if (window.innerHeight) { // all except Explorer
				if (_target) {
					target = _target.self;
				}
				else {
					target = window;
				}
				w = target.innerWidth;
				h = target.innerHeight;

			}else if (target.documentElement && target.documentElement.clientHeight) { // Explorer 6 Strict Mode
				w = target.documentElement.clientWidth;
				h = target.documentElement.clientHeight;

			}else if (target.body) { // other Explorers
				w = target.body.clientWidth;
				h = target.body.clientHeight;
			}
			if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i) && !window.navigator.standalone&&w>h) {
				h = 672;
			}
			return {
				width: w,
				height: h
			};
		};
		app.post = function(url,param,cb,timeoutCb,time){

			var cbName = 'iJax' + Date.parse(new Date());
			try {
				doc.domain = 'sina.com.cn';
			} catch (e) {

			}

			param.callback = cbName;

			var TIMEOUT_NAME = 'TD_'+ (new Date()).getTime();
			$.timeoutHandle(TIMEOUT_NAME, function(handle) {
				handle.timeout(TIMEOUT_NAME, function() {
					// 超时处理
					if (typeof timeoutCb == 'function') {
						timeoutCb();
					}
				});
				window[cbName] = function(m) {
					if (typeof m == 'string') {
						// firefox 下 接口返回数据不对，暂时注释，不eval
						m = eval('(' + m + ')');
					}
					// 数据处理
					if (typeof cb == 'function') {
						cb(m);
					}
					// 成功通知
					handle.success(TIMEOUT_NAME);
				};
				// iframe===1时不再区分firefox
				if (!$.ua.isFF||(param.iframe&&param.iframe===1)) {
					$.ijax.request(url, {
						POST: param
					});
				} else {
					param.callback = undefined;
					param = $.jsonToQuery(param);

					var Sender = new $.html5Ijax({
						proxyUrl: 'http://comment5.news.sina.com.cn/comment/postmsg.html'
					});
					Sender.send({
						url: url,
						data: param,
						onsuccess: window[cbName],
						onfailure: function() {}
					});
				}
			}, time || 5e3);
		};
		app.cmntEncodeHtml = function(str){
			return $.encodeHTML($.decodeHTML(str));
		};

		return app;
	});
})(window);