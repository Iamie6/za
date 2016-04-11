/**
 * @file 简易方法库
 * @author Daichang <daichang@staff.sina.com.cn>
 */
(function(exports,undefined) {
	var C = {
		U:'undefined'
	};
	var doc = document;
	var byId = function(id) {
		if (typeof id === 'string') {
			return doc.getElementById(id);
		}
		return id;
	};
	var byTag = function(tag){
		if (typeof tag === 'string') {
			return doc.getElementsByTagName(tag);
		}
		return tag;
	};
	var byAttr = function(node, attname, attvalue) {
		if (typeof node == 'string') {
			node = byId(node);
		}
		var nodes = [];
		attvalue = attvalue || '';
		var getAttr = function(node) {
			return node.getAttribute(attname);
		};
		for (var i = 0, l = node.childNodes.length; i < l; i++) {
			if (node.childNodes[i].nodeType == 1) {
				var fit = false;
				if (attvalue) {
					fit = (getAttr(node.childNodes[i]) == attvalue);
				} else {
					fit = !! getAttr(node.childNodes[i]);
				}
				if (fit) {
					nodes.push(node.childNodes[i]);
				}
				if (node.childNodes[i].childNodes.length > 0) {
					nodes = nodes.concat(arguments.callee.call(null, node.childNodes[i], attname, attvalue));
				}
			}
		}
		return nodes;
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
	var toggleClass = function(el, clz) {
		if (hasClass(el, clz)) {
			removeClass(el, clz);
		} else {
			addClass(el, clz);
		}
	};
	var preventDefault = function(e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	};
	var stopPropagation = function(e) {
		if (e && e.stopPropagation) {
			e.stopPropagation();
		} else {
			window.event.cancelBubble = true;
		}
		return false;
	};
	var contains = function(a, b) {
		try {
			return a.contains ? a != b && a.contains(b) : !! (a.compareDocumentPosition(b) & 16);
		} catch (e) {}
	};
	var create = function(tag) {
		tag = tag.toUpperCase();
		if (tag == 'TEXT') {
			return doc.createTextNode('');
		}
		if (tag == 'BUFFER') {
			return doc.createDocumentFragment();
		}
		return doc.createElement(tag);
	};
	var insertAfter = function(newElement, targetElement) {
		var parent = targetElement.parentNode;
		if (parent.lastChild == targetElement) {
			parent.appendChild(newElement);
		} else {
			parent.insertBefore(newElement, targetElement.nextSibling);
		}
	};
	var ua = (function() {
		var userAgent = navigator.userAgent.toLowerCase();
		var ua = {};
		ua.isIE = /msie/.test(userAgent);
		ua.isOPERA = /opera/.test(userAgent);
		ua.isMOZ = /gecko/.test(userAgent);
		ua.isIE6 = /msie 6/.test(userAgent);
		ua.isIE7 = /msie 7/.test(userAgent);
		ua.isSAFARI = /safari/.test(userAgent);
		ua.iswinXP = /windows nt 5.1/.test(userAgent);
		ua.iswinVista = /windows nt 6.0/.test(userAgent);
		ua.isFF = /firefox/.test(userAgent);
		ua.isIOS = /\((iPhone|iPad|iPod)/i.test(userAgent);
		return ua;
	})();
	var domReady = (function() {
		var fns = [],
			inited = 0,
			isReady = 0;
		var checkReady = function() {
			if (doc.readyState === 'complete') {
				return 1;
			}
			return isReady;
		};

		var onReady = function(type) {
			if (isReady) {
				return;
			}
			isReady = 1;

			if (fns) {
				while (fns.length) {
					fns.shift()();
				}
			}
			fns = null;
		};
		var bindReady = function() {
			if (inited) {
				return;
			}
			inited = 1;

			//开始初始化domReady函数，判定页面的加载情况
			if (doc.readyState === 'complete') {
				onReady();
			} else if (doc.addEventListener) {
				doc.addEventListener('DOMContentLoaded', function() {
					doc.removeEventListener('DOMContentLoaded', arguments.callee, false);
					onReady();
				}, false);
				//不加这个有时chrome firefox不起作用
				window.addEventListener('load', function() {
					window.removeEventListener('load', arguments.callee, false);
					onReady();
				}, false);
			} else {
				doc.attachEvent('onreadystatechange', function() {
					if (doc.readyState == 'complete') {
						doc.detachEvent('onreadystatechange', arguments.callee);
						onReady();
					}
				});
				(function() {
					if (isReady) {
						return;
					}
					var node = new Image();
					try {
						node.doScroll();
						node = null; //防止IE内存泄漏
					} catch (e) {
						setTimeout(arguments.callee, 64);
						return;
					}
					onReady();
				})();
			}
		};
		return function(fn) {
			bindReady();
			if (!checkReady()) {
				fns.push(fn);
				return;
			}
			//onReady();
			fn.call();
		};
	})();
	var timeoutHandle = (function() {
		var events = [];
		var handle = {
			success: function(id) {
				var eve = events[id];
				if (!eve) {
					return;
				}
				eve.isSuccess = true;
				clearTimeout(eve.timer);
			},
			timeout: function(id, fn) {
				var eve = events[id];
				if (!eve) {
					return;
				}
				eve.timer = setTimeout(function() {
					if (eve.isSuccess) {
						return;
					}
					if (typeof fn == 'function') {
						fn.call(this);
					}
				}, eve.time);
			}
		};
		return function(id, fn, time) {
			if (events[id]) {
				throw new Error(id + '已经被占用');
			}
			events[id] = {};
			events[id].time = time || 5e3;
			events[id].isSuccess = false;
			if (typeof fn == 'function') {
				fn.call(this, handle);
			}
		};
	})();
	var cssSupports = (function() {
		var div = document.createElement('div'),
			vendors = 'Khtml O Moz Webkit'.split(' '),
			len = vendors.length;
		return function(prop) {
			if (prop in div.style){
				return true;
			}
			if ('-ms-' + prop in div.style){
				return true;
			}

			prop = prop.replace(/^[a-z]/, function(val) {
				return val.toUpperCase();
			});
			while (len--) {
				if (vendors[len] + prop in div.style) {
					return true;
				}
			}
			return false;
		};
	})();
	var getXY = (function() {
		var getXY = function(el) {
			if ((el.parentNode == null || el.offsetParent == null || getStyle(el, 'display') == 'none') && el != doc.body) {
				return [0,0];
			}
			var box;
			// IE
			box = el.getBoundingClientRect();
			var scrollPos = getScrollPos(el.ownerDocument);
			return [box.left + scrollPos[1], box.top + scrollPos[0]];
			// IE end
		};
		if (!ua.isIE) {
			getXY = function(el) {
				if ((el.parentNode == null || el.offsetParent == null || getStyle(el, 'display') == 'none') && el != doc.body) {
					return false;
				}
				var parentNode = null;
				var pos = [];
				var isSAFARI = ua.isSAFARI;

				// FF
				pos = [el.offsetLeft, el.offsetTop];
				parentNode = el.offsetParent;
				var hasAbs = getStyle(el, 'position') == 'absolute';

				if (parentNode != el) {
					while (parentNode) {
						pos[0] += parentNode.offsetLeft + parseInt($.getStyle(parentNode, 'borderLeftWidth'), 10);
						pos[1] += parentNode.offsetTop + parseInt($.getStyle(parentNode, 'borderTopWidth'), 10);
						if (isSAFARI && !hasAbs && getStyle(parentNode, 'position') == 'absolute') {
							hasAbs = true;
						}
						parentNode = parentNode.offsetParent;
					}
				}

				if (isSAFARI && hasAbs) {
					pos[0] -= el.ownerDocument.body.offsetLeft;
					pos[1] -= el.ownerDocument.body.offsetTop;
				}
				parentNode = el.parentNode;
				// FF End
				while (parentNode.tagName && !/^body|html$/i.test(parentNode.tagName)) {
					if (getStyle(parentNode, 'display').search(/^inline|table-row.*$/i)) {
						pos[0] -= parentNode.scrollLeft;
						pos[1] -= parentNode.scrollTop;
					}
					parentNode = parentNode.parentNode;
				}
				return pos;
			};
		}
		return getXY;
	})();
	var getScrollPos = function() {
		var dd = doc.documentElement;
		var db = doc.body;
		return [
			Math.max(dd.scrollTop, db.scrollTop),
			Math.max(dd.scrollLeft, db.scrollLeft),
			Math.max(dd.scrollWidth, db.scrollWidth),
			Math.max(dd.scrollHeight, db.scrollHeight)
		];
	};
	var getPosition = function(el) {
		if (!el) {
			return {
				left: 0,
				top: 0
			};
		}
		var top = 0,
			left = 0;
		if ('getBoundingClientRect' in document.documentElement) {
			var box = el.getBoundingClientRect(),
				doc = el.ownerDocument,
				body = doc.body,
				docElem = doc.documentElement,
				clientTop = docElem.clientTop || body.clientTop || 0,
				clientLeft = docElem.clientLeft || body.clientLeft || 0;
				top = box.top + (exports.pageYOffset || docElem && docElem.scrollTop || body.scrollTop) - clientTop,
				left = box.left + (exports.pageXOffset || docElem && docElem.scrollLeft || body.scrollLeft) - clientLeft;
		} else {
			do {
				top += el.offsetTop || 0;
				left += el.offsetLeft || 0;
				el = el.offsetParent;
			} while (el);
		}
		return {
			left: left,
			top: top
		};
	};
	var getStyle = function(elem, style) {
		if ('getComputedStyle' in window) {
			return getComputedStyle(elem, null)[style];
		} else {
			style = style.replace(/\-(\w)/g, function($, $1) {
				return $1.toUpperCase();
			});

			var val = elem.currentStyle[style];

			if ((val === 'auto' || val == '100%') && (style === 'width' || style === 'height')) {
				var rect = elem.getBoundingClientRect();
				if (style === 'width') {
					return rect.right - rect.left + 'px';
				} else {
					return rect.bottom - rect.top + 'px';
				}
			}
			return val;
		}
	};
	var getOuterStyle = function(elem, style) {
		var getStyle2 = function(elem, style) {
			var val = getStyle(elem, style);
			var borderStyles = {
				thin: ['1', '2'],
				medium: ['3', '4'],
				thick: ['5', '6']
			};
			if (/^(border).+(Width)$/.test(style)&&borderStyles[val]) {
				val =  !!window.XDomainRequest ? borderStyles[val][0] : borderStyles[val][1];
			}
			// var val = getStyle(elem, style) || 0;
			return parseInt(val.replace('px', ''), 10);
		};
		if (style === 'width') {
			return getStyle2(elem, style) + getStyle2(elem, 'paddingLeft') + getStyle2(elem, 'paddingRight') + getStyle2(elem, 'borderLeftWidth') + getStyle2(elem, 'borderRightWidth');
		} else {
			return getStyle2(elem, style) + getStyle2(elem, 'paddingTop') + getStyle2(elem, 'paddingBottom') + getStyle2(elem, 'borderTopWidth') + getStyle2(elem, 'borderBottomWidth');
		}
	};

	var setStyle = function(elem, prop) {
		if (!elem) {
			return;
		}
		for (var i in prop) {
			elem.style[i] = prop[i];
		}
	};
	var trim = function(str) {
		//return str.replace(/(^\s*)|(\s*$)/g, "");
		//包括全角空格
		return str.replace(/(^[\s\u3000]*)|([\s\u3000]*$)/g, '');
	};
	var encodeHTML = function(str) {
		// var s = '';
		// var div = create('div');
		// div.appendChild(doc.createTextNode(str));
		// s = div.innerHTML;
		// div = null;
		// s = s.replace(/\s/g, '&nbsp;');
		// return s;

		var s = '';
		if(typeof str !== 'string'){
			return str;
		}
		if (str.length === 0){
			return '';
		}
		s = str.replace(/&/g, '&gt;');
		s = s.replace(/</g, '&lt;');
		s = s.replace(/>/g, '&gt;');
		s = s.replace(/ /g, '&nbsp;');
		s = s.replace(/\'/g, '\'');
		s = s.replace(/\"/g, '&quot;');
		s = s.replace(/\n/g, '<br>');
		return s;
	};
	var decodeHTML = function(str){
		/*var div = document.createElement('div');
		div.innerHTML = str;
		return div.innerText== undefined?div.textContent:div.innerText;*/
		var s = '';
		if(typeof str !== 'string'){
			return str;
		}
		if (str.length === 0){
			return '';
		}
		s = str.replace(/&gt;/g, '&');
		s = s.replace(/&lt;/g, '<');
		s = s.replace(/&gt;/g, '>');
		s = s.replace(/&nbsp;/g, ' ');
		s = s.replace(/'/g, '\'');
		s = s.replace(/&quot;/g, '\"');
		s = s.replace(/<br>/g, '\n');
		return s;
	};
	var encodeDoubleByte = function(str) {
		if(typeof str !== 'string') {
			return str;
		}
		return encodeURIComponent(str);
	};
	var byteLength = function(str) {
		if (typeof str == C.U) {
			return 0;
		}
		var aMatch = str.match(/[^\x00-\x80]/g);
		return (str.length + (!aMatch ? 0 : aMatch.length));
	};
	var strLeft = function(s, n) {
		var ELLIPSIS = '...';
		var s2 = s.slice(0, n),
			i = s2.replace(/[^\x00-\xff]/g, '**').length,
			j = s.length,
			k = s2.length;
		//if (i <= n) return s2;
		if (i < n) {
			return s2;
		} else if (i == n) {
			//原样返回
			if (n == j || k == j) {
				return s2;
			} else {
				return s.slice(0, n - 2) + ELLIPSIS;
			}
		}
		//汉字
		i -= s2.length;
		switch (i) {
			case 0:
				return s2;
			case n:
				var s4;
				if (n == j) {
					s4 = s.slice(0, (n >> 1) - 1);
					return s4 + ELLIPSIS;
				} else {
					s4 = s.slice(0, n >> 1);
					return s4;
				}
				break;
			default:
				var m = n - i,
					s3 = s.slice(m, n);
				j = s3.replace(/[\x00-\xff]/g, '').length;
				return j ? s.slice(0, m) + arguments.callee(s3, j) : s.slice(0, m);
		}
	};
	var indexOf = function(oElement, aArray) {
		if (aArray.indexOf) {
			return aArray.indexOf(oElement);
		}
		var i = 0,
			len = aArray.length;
		while (i < len) {
			if (aArray[i] === oElement) {
				return i;
			}
			i++;
		}
		return -1;
	};
	var inArray = function(oElement, aSource) {
		return indexOf(oElement, aSource) > -1;
	};
	var isArray = function(o) {
		return Object.prototype.toString.call(o) === '[object Array]';
	};
	var isEmptyObj = function(o, isprototype) {
		var ret = true;
		for (var k in o) {
			if (isprototype) {
				ret = false;
				break;
			} else {
				if (o.hasOwnProperty(k)) {
					ret = false;
					break;
				}
			}
		}
		return ret;
	};
	var extend = function(target, source) {
		for (var property in source) {
			target[property] = source[property];
		}
		return target;
	};
	var jsonToQuery = (function() {
		var _fdata = function(data, isEncode) {
			data = data == null ? '' : data;
			data = trim(data.toString());
			if (isEncode) {
				return encodeURIComponent(data);
			} else {
				return data;
			}
		};
		return function(JSON, isEncode) {
			var _Qstring = [];
			if (typeof JSON == 'object') {
				for (var k in JSON) {
					if (JSON[k] instanceof Array) {
						for (var i = 0, len = JSON[k].length; i < len; i++) {
							_Qstring.push(k + '=' + _fdata(JSON[k][i], isEncode));
						}
					} else {
						if (typeof JSON[k] != 'function') {
							_Qstring.push(k + '=' + _fdata(JSON[k], isEncode));
						}
					}
				}
			}
			if (_Qstring.length) {
				return _Qstring.join('&');
			} else {
				return '';
			}
		};
	})();
	var queryToJson = function(QS, isDecode) {
		var _Qlist = trim(QS).split('&');
		var _json = {};
		var _hsh;
		var _value;
		var _key;
		var _fData = function(data) {
			if (isDecode) {
				return decodeURIComponent(data);
			} else {
				return data;
			}
		};
		for (var i = 0, len = _Qlist.length; i < len; i++) {
			if (_Qlist[i]) {
				_hsh = _Qlist[i].split('=');
				_key = _hsh[0];
				_value = _hsh[1];

				// 如果只有key没有value, 那么将全部丢入一个$nullName数组中
				if (_hsh.length < 2) {
					_value = _key;
					_key = '$nullName';
				}
				// 如果缓存堆栈中没有这个数据
				if (!_json[_key]) {
					_json[_key] = _fData(_value);
				}
				// 如果堆栈中已经存在这个数据，则转换成数组存储
				else {
					if (isArray(_json[_key]) !== true) {
						_json[_key] = [_json[_key]];
					}
					_json[_key].push(_fData(_value));
				}
			}
		}
		return _json;
	};
	var addEvent = function(elm, evType, func, useCapture) {
		var _el = byId(elm);
		if (_el == null) {
			throw new Error('addEvent 找不到对象：' + elm);
		}
		if (typeof useCapture == C.U) {
			useCapture = false;
		}
		if (typeof evType == C.U) {
			evType = 'click';
		}
		if (_el.addEventListener) {
			_el.addEventListener(evType, func, useCapture);
			return true;
		} else if (_el.attachEvent) {
			_el.attachEvent('on' + evType, func);
			return true;
		} else {
			_el['on' + evType] = func;
		}
	};
	var removeEvent = function(oElement, sName, fHandler) {
		var _el = byId(oElement);
		if (_el == null) {
			throw ('removeEvent 找不到对象：' + oElement);
		}
		if (typeof fHandler != 'function') {
			return;
		}
		if (typeof sName == C.U) {
			sName = 'click';
		}
		if (_el.addEventListener) {
			_el.removeEventListener(sName, fHandler, false);
		} else if (_el.attachEvent) {
			_el.detachEvent('on' + sName, fHandler);
		}
		fHandler[sName] = null;
	};
	var fixEvent = function(e) {
		if (typeof e == C.U) {
			e = window.event;
		}
		if (!e.target) {
			e.target = e.srcElement;
			e.pageX = e.x;
			e.pageY = e.y;
		}
		if (typeof e.layerX == C.U) {
			e.layerX = e.offsetX;
		}
		if (typeof e.layerY == C.U) {
			e.layerY = e.offsetY;
		}
		return e;
	};
	var byClass = (function() {
        var by;
        if ('function' === typeof document.getElementsByClassName) {
            by = function(clz, wrap) {
                if (wrap) {
                    return wrap.getElementsByClassName(clz);
                } else {
                    return document.getElementsByClassName(clz);
                }
            };
        } else {
            by = function(clz, wrap) {
				for (var i = -1, results = [], finder = new RegExp('(?:^|\\s)' + clz + '(?:\\s|$)'), a = wrap && wrap.getElementsByTagName && wrap.getElementsByTagName('*') || document.all || document.getElementsByTagName('*'), l = a.length; ++i < l; finder.test(a[i].className) && results.push(a[i])){}
                a = null;
                return results;
            };
        }
        return by;
    })();
	var builder = function(wrap, type) {
		var list, nodes, ids;
		wrap = (function() {
			if (typeof wrap == 'string') {
				return byId(wrap);
			}
			return wrap;
		})();
		nodes = byAttr(wrap, type);
		list = {};
		ids = {};
		for (var i = 0, len = nodes.length; i < len; i++) {
			var j = nodes[i].getAttribute(type);
			if (!j) {
				continue;
			}
			list[j] || (list[j] = []);
			list[j].push(nodes[i]);
			ids[j] || (ids[j] = nodes[i]);
		}
		ids.wrap = wrap;
		return {
			box: wrap,
			list: list,
			ids: ids
		};
	};
	/**
	 * @name mysInacMNT.custEvent
	 * @description 自定义事件
	 * @example
	 * custEvent.define($,'my_ce_login');
	 * custEvent.add($,'my_ce_login',function(){do();});
	 */
	var custEvent = (function() {
		var _custAttr = '__custEventKey__',
			_custKey = 1,
			_custCache = {},
			/**
			 * 从缓存中查找相关对象
			 * 当已经定义时
			 * 有type时返回缓存中的列表 没有时返回缓存中的对象
			 * 没有定义时返回false
			 * @param {Object|number} obj 对象引用或获取的key
			 * @param {String} type 自定义事件名称
			 */
			_findObj = function(obj, type) {
				var _key = (typeof obj == 'number') ? obj : obj[_custAttr];
				return (_key && _custCache[_key]) && {
					obj: (typeof type == 'string' ? _custCache[_key][type] : _custCache[_key]),
					key: _key
				};
			};

		return {
			/**
			 * @description 对象自定义事件的定义 未定义的事件不得绑定
			 * @method define
			 * @memberOf custEvent
			 * @static
			 * @param {Object|number} obj 对象引用或获取的下标(key); 必选
			 * @param {String|Array} type 自定义事件名称; 必选
			 * @return {number} key 下标
			 */
			define: function(obj, type) {
				if (obj && type) {
					var _key = (typeof obj == 'number') ? obj : obj[_custAttr] || (obj[_custAttr] = _custKey++),
						_cache = _custCache[_key] || (_custCache[_key] = {});
					type = [].concat(type);
					for (var i = 0; i < type.length; i++) {
						_cache[type[i]] || (_cache[type[i]] = []);
					}
					return _key;
				}
			},

			/**
			 * @description 对象自定义事件的取消定义
			 * 当对象的所有事件定义都被取消时 删除对对象的引用
			 * @method define
			 * @memberOf custEvent
			 * @static
			 * @param {Object|number} obj 对象引用或获取的(key); 必选
			 * @param {String} type 自定义事件名称; 可选 不填可取消所有事件的定义
			 */
			undefine: function(obj, type) {
				if (obj) {
					var _key = (typeof obj == 'number') ? obj : obj[_custAttr];
					if (_key && _custCache[_key]) {
						if (typeof type == 'string') {
							if (type in _custCache[_key]) {
								delete _custCache[_key][type];
							}
						} else {
							delete _custCache[_key];
						}
					}
				}
			},

			/**
			 * @description 事件添加或绑定
			 * @method add
			 * @memberOf custEvent
			 * @static
			 * @param {Object|number} obj 对象引用或获取的(key); 必选
			 * @param {String} type 自定义事件名称; 必选
			 * @param {Function} fn 事件处理方法; 必选
			 * @param {*} data 扩展数据任意类型; 可选
			 * @return {number} key 下标
			 */
			add: function(obj, type, fn, data) {
				if (obj && typeof type == 'string' && fn) {
					var _cache = _findObj(obj, type);
					if (!_cache || !_cache.obj) {
						throw 'custEvent (' + type + ') is undefined !';
					}
					_cache.obj.push({
						fn: fn,
						data: data
					});
					return _cache.key;
				}
			},

			/**
			 * @description 事件删除或解绑
			 * @method remove
			 * @memberOf custEvent
			 * @static
			 * @param {Object|number} obj 对象引用或获取的(key); 必选
			 * @param {String} type 自定义事件名称; 可选; 为空时删除对象下的所有事件绑定
			 * @param {Function} fn 事件处理方法; 可选; 为空且type不为空时 删除对象下type事件相关的所有处理方法
			 * @return {number} key 下标
			 */
			remove: function(obj, type, fn) {
				if (obj) {
					var _cache = _findObj(obj, type),
						_obj;
					var i;
					if (_cache && (_obj = _cache.obj)) {
						if (isArray(_obj)) {
							if (fn) {
								for (i = 0; i < _obj.length && _obj[i].fn !== fn; i++) {
									_obj.splice(i, 1);
								}

							} else {
								_obj.splice(0);
							}
						} else {
							for (i in _obj) {
								_obj[i] = [];
							}
						}
						return _cache.key;
					}
				}
			},

			/**
			 * @description 事件触发
			 * @method fire
			 * @memberOf custEvent
			 * @static
			 * @param {Object|number} obj 对象引用或获取的(key); 必选
			 * @param {String} type 自定义事件名称; 必选
			 * @param {Any|Array} args 参数数组或单个的其他数据; 可选
			 * @return {number} key 下标
			 */
			fire: function(obj, type, args) {
				if (obj && typeof type == 'string') {
					var _cache = _findObj(obj, type),
						_obj;
					if (_cache && (_obj = _cache.obj)) {
						if (!isArray(args)) {
							args = args !== undefined ? [args] : [];
						}
						for (var i = 0; i < _obj.length; i++) {
							var fn = _obj[i].fn;
							if (fn && fn.apply) {
								fn.apply($, [{
									type: type,
									data: _obj[i].data
								}].concat(args));
							}
						}
						return _cache.key;
					}
				}
			},
			/**
			 * @description 销毁
			 * @method destroy
			 * @memberOf custEvent
			 * @static
			 */
			destroy: function() {
				_custCache = {};
				_custKey = 1;
			}
		};
	})();
	/**
	 * @name mysInacMNT.delegatedEvent
	 * @description 事件委派
	 * @example
	 * // html <a href="javascript:;" action-type="vote" action-data="mid=123">投票</a>
	 * var delegatedEle = delegatedEvent(ele);
	 * delegatedEle.add('vote','click',function(o){
	 *   var el = o.el;
	 *   var data = o.data;
	 *   var mid = data.mid;
	 *   do();
	 * });
	 */
	var delegatedEvent = (function() {
		var checkContains = function(list, el) {
			for (var i = 0, len = list.length; i < len; i += 1) {
				if (contains(list[i], el)) {
					return true;
				}
			}
			return false;
		};
		var isEmptyObj = function(obj) {
			var hack = function() {};
			for (var key in obj) {
				hack(key);
				return false;
			}
			return true;
		};
		return function(actEl, expEls, aType) {
			if (!expEls) {
				expEls = [];
			}
			if (isArray(expEls)) {
				expEls = [expEls];
			}
			var evtList = {};
			aType = aType || 'action-type';
			var bindEvent = function(e) {
				var evt = e || window.event;
				var el = evt.target || evt.srcElement;
				var type = e.type;
				if (checkContains(expEls, el)) {
					return false;
				} else if (!contains(actEl, el)) {
					return false;
				} else {
					var actionType = null;
					var checkBuble = function() {
						if (evtList[type] && evtList[type][actionType]) {
							return evtList[type][actionType]({
								'evt': evt,
								'el': el,
								'e': e,
								'data': queryToJson(el.getAttribute('action-data') || '')
							});
						} else {
							return true;
						}
					};
					while (el && el !== actEl) {
						if (!el.getAttribute) {
							break;
						}
						actionType = el.getAttribute(aType);
						if (checkBuble() === false) {
							break;
						}
						el = el.parentNode;
					}

				}
			};
			var that = {};
			that.add = function(funcName, evtType, process) {
				if (!evtList[evtType]) {
					evtList[evtType] = {};
					addEvent(actEl, evtType, bindEvent);
				}
				var ns = evtList[evtType];
				ns[funcName] = process;
			};
			that.remove = function(funcName, evtType) {
				if (evtList[evtType]) {
					delete evtList[evtType][funcName];
					if (isEmptyObj(evtList[evtType])) {
						delete evtList[evtType];
						removeEvent(actEl, evtType, bindEvent);
					}
				}
			};

			that.pushExcept = function(el) {
				expEls.push(el);
			};

			that.removeExcept = function(el) {
				if (!el) {
					expEls = [];
				} else {
					for (var i = 0, len = expEls.length; i < len; i += 1) {
						if (expEls[i] === el) {
							expEls.splice(i, 1);
						}
					}
				}

			};

			that.clearExcept = function(el) {
				expEls = [];
			};

			that.destroy = function() {
				for (var k in evtList) {
					for (var l in evtList[k]) {
						delete evtList[k][l];
					}
					delete evtList[k];
					removeEvent(actEl, bindEvent, k);
				}
			};
			return that;
		};
	})();
	var bind2 = (function() {
		/**
		 * 保留原型扩展
		 * stan | chaoliang@staff.sina.com.cn
		 * @param {Object} object
		 */
		Function.prototype.bind2 = function(object) {
			var __method = this;
			return function() {
				return __method.apply(object, arguments);
			};
		};
		return function(fFunc, object) {
			var __method = fFunc;
			return function() {
				return __method.apply(object, arguments);
			};
		};
	})();
	var parseParam = function(oSource, oParams) {
		var key;
		try {
			if (typeof oParams != C.U) {
				for (key in oSource) {
					if (oParams[key] != null) {
						oSource[key] = oParams[key];
					}
				}
			}
		} finally {
			key = null;
			return oSource;
		}
	};
	var Url = (function() {
		Url = function(url) {
			url = url || '';
			this.url = url;
			this.query = {};
			this.parse();
		};

		Url.prototype = {
			/**
			 * 解析URL，注意解析锚点必须在解析GET参数之前，以免锚点影响GET参数的解析
			 * @param{String} url? 如果传入参数，则将会覆盖初始化时的传入的url 串
			 */
			parse: function(url) {
				if (url) {
					this.url = url;
				}
				this.parseAnchor();
				this.parseParam();
			},
			/**
			 * 解析锚点 #anchor
			 */
			parseAnchor: function() {
				var anchor = this.url.match(/\#(.*)/);
				anchor = anchor ? anchor[1] : null;
				this._anchor = anchor;
				if (anchor != null) {
					this.anchor = this.getNameValuePair(anchor);
					this.url = this.url.replace(/\#.*/, '');
				}
			},

			/**
			 * 解析GET参数 ?name=value;
			 */
			parseParam: function() {
				var query = this.url.match(/\?([^\?]*)/);
				query = query ? query[1] : null;
				if (query != null) {
					this.url = this.url.replace(/\?([^\?]*)/, '');
					this.query = this.getNameValuePair(query);
				}
			},
			/**
			 * 目前对json格式的value 不支持
			 * @param {String} str 为值对形式,其中value支持 '1,2,3'逗号分割
			 * @return 返回str的分析结果对象
			 */
			getNameValuePair: function(str) {
				var o = {};
				str.replace(/([^&=]*)(?:\=([^&]*))?/gim, function(w, n, v) {
					if (n === '') {
						return;
					}
					//v = v || '';//alert(v)
					//o[n] = ((/[a-z\d]+(,[a-z\d]+)*/.test(v)) || (/^[\u00ff-\ufffe,]+$/.test(v)) || v=='') ? v : (v.j2o() ? v.j2o() : v);
					o[n] = v || '';
				});
				return o;
			},
			/**
			 * 从 URL 中获取指定参数的值
			 * @param {Object} sPara
			 */
			getParam: function(sPara) {
				return this.query[sPara] || '';
			},
			/**
			 * 清除URL实例的GET请求参数
			 */
			clearParam: function() {
				this.query = {};
			},

			/**
			 * 设置GET请求的参数，当个设置
			 * @param {String} name 参数名
			 * @param {String} value 参数值
			 */
			setParam: function(name, value) {
				if (name == null || name === '' || typeof(name) != 'string') {
					throw new Error('no param name set');
				}
				this.query = this.query || {};
				this.query[name] = value;
			},

			/**
			 * 设置多个参数，注意这个设置是覆盖式的，将清空设置之前的所有参数。设置之后，URL.query将指向o，而不是duplicate了o对象
			 * @param {Object} o 参数对象，其属性都将成为URL实例的GET参数
			 */
			setParams: function(o) {
				this.query = o;
			},

			/**
			 * 序列化一个对象为值对的形式
			 * @param {Object} o 待序列化的对象，注意，只支持一级深度，多维的对象请绕过，重新实现
			 * @return {String} 序列化之后的标准的值对形式的String
			 */
			serialize: function(o) {
				var ar = [];
				for (var i in o) {
					if (o[i] == null || o[i] === '') {
						ar.push(i + '=');
					} else {
						ar.push(i + '=' + o[i]);
					}
				}
				return ar.join('&');
			},
			/**
			 * 将URL对象转化成为标准的URL地址
			 * @return {String} URL地址
			 */
			toString: function() {
				var queryStr = this.serialize(this.query);
				return this.url + (queryStr.length > 0 ? '?' + queryStr : '') + (this.anchor ? '#' + this.serialize(this.anchor) : '');
			},

			/**
			 * 得到anchor的串
			 * @param {Boolean} forceSharp 强制带#符号
			 * @return {String} 锚anchor的串
			 */
			getHashStr: function(forceSharp) {
				return this.anchor ? '#' + this.serialize(this.anchor) : (forceSharp ? '#' : '');
			}
		};
		return Url;
	})();
	var placeholder = (function() {
		var supportPlaceholder = 'placeholder' in create('input');
		return function(inputs) {
			function p(input) {
				//如果支持placeholder,返回
				if (supportPlaceholder) {
					return;
				}
				//已经初始化，hasPlaceholder为1
				var hasPlaceholder = input.getAttribute('hasPlaceholder') || 0;
				if (hasPlaceholder === '1') {
					return;
				}
				var toggleTip = function() {
					// var defaultValue = input.defaultValue;
					if (input.value === '') {
						addClass(input, 'gray');
						input.value = text;
					}
					input.onfocus = function() {
						// if(input.value === defaultValue || input.value === text){
						if (input.value === '' || input.value === text) {
							this.value = '';
							removeClass(input, 'gray');
						}
					};
					input.onblur = function() {
						if (input.value === '') {
							this.value = text;
							addClass(input, 'gray');
						}
					};
				};
				var simulateTip = function() {
					var pwdPlaceholder = create('input');
					pwdPlaceholder.type = 'text';
					pwdPlaceholder.className = 'pwd_placeholder gray ' + input.className;
					pwdPlaceholder.value = text;
					pwdPlaceholder.autocomplete = 'off';
					input.style.display = 'none';
					input.parentNode.appendChild(pwdPlaceholder);
					pwdPlaceholder.onfocus = function() {
						pwdPlaceholder.style.display = 'none';
						input.style.display = '';
						input.focus();
					};
					input.onblur = function() {
						if (input.value === '') {
							pwdPlaceholder.style.display = '';
							input.style.display = 'none';
						}
					};
				};

				//如果没有placeholder或者没有placeholder值，返回
				var text = input.getAttribute('placeholder');
				if (!text) {
					//ie10 下的ie7 无法用input.getAttribute('placeholder')取到placeholder值，奇怪！
					if (input.attributes && input.attributes.placeholder) {
						text = input.attributes.placeholder.value;
					}
				}
				var tagName = input.tagName;
				if (tagName == 'INPUT') {
					var inputType = input.type;
					if (inputType == 'password' && text) {
						simulateTip();
					} else if (inputType == 'text' && text) {
						toggleTip();
					}
				} else if (tagName == 'TEXTAREA') {
					toggleTip();
				}
				input.setAttribute('hasPlaceholder', '1');
			}
			for (var i = inputs.length - 1; i >= 0; i--) {
				var input = inputs[i];
				p(input);
			}

		};
	})();
	var Timer = function() {
		this.list = {};
		this.refNum = 0;
		this.clock = null;
		this.allpause = false;
		this.delay = 25;

		this.add = function(fun) {
			if (typeof fun != 'function') {
				throw ('The timer needs add a function as a parameters');
			}
			var key = '' + (new Date()).getTime() + (Math.random()) * Math.pow(10, 17);

			this.list[key] = {
				'fun': fun,
				'pause': false
			};
			if (this.refNum <= 0) {
				this.start();
			}
			this.refNum++;
			return key;
		};

		this.remove = function(key) {
			if (this.list[key]) {
				delete this.list[key];
				this.refNum--;
			}
			if (this.refNum <= 0) {
				this.stop();
			}
		};

		this.pause = function(key) {
			if (this.list[key]) {
				this.list[key].pause = true;
			}
		};

		this.play = function(key) {
			if (this.list[key]) {
				this.list[key].pause = false;
			}
		};

		this.stop = function() {
			clearInterval(this.clock);
			this.clock = null;
		};

		this.start = function() {
			var _this = this;
			this.clock = setInterval(
				function() {
					_this.loop.apply(_this);
				},
				this.delay
			);
		};

		this.loop = function() {
			for (var k in this.list) {
				if (!this.list[k].pause) {
					this.list[k].fun();
				}
			}
		};
	};
	var throttle = function(method, context) {
		clearTimeout(method.__tId__);
		method.__tId__ = setTimeout(function() {
			method.call(context);
		}, 100);
	};
	var reachBottom = (function() {
		var docEle = doc.documentElement;
		var docBody = doc.body;
		var _min = Math.min;
		var _max = Math.max;
		var reachBottom = function() {
			var scrollTop = 0;
			var clientHeight = 0;
			var scrollHeight = 0;
			try {
				// bshare浮层会导致这段代码出错
				if (docEle && docEle.scrollTop) {
					scrollTop = docEle.scrollTop;
				} else if (docBody) {
					scrollTop = docBody.scrollTop;
				}
				if (docBody.clientHeight && docEle.clientHeight) {
					clientHeight = _min(docBody.clientHeight, docEle.clientHeight);
					// clientHeight = (docBody.clientHeight < docEle.clientHeight) ? docBody.clientHeight : docEle.clientHeight;
				} else {
					clientHeight = _max(docBody.clientHeight, docEle.clientHeight);
					// clientHeight = (docBody.clientHeight > docEle.clientHeight) ? docBody.clientHeight : docEle.clientHeight;
				}
				scrollHeight = _max(docBody.scrollHeight, docEle.scrollHeight);
				return (scrollTop + clientHeight > scrollHeight - 150);
			} catch (e) {
				return false;
			}
		};
		return reachBottom;
	})();

	var shine = (function() {
		var Timer1 = new Timer();
		var b = function(a) {
			return a.slice(0, a.length - 1).concat(a.concat([]).reverse());
		};
		return function(c, d) {
			var e = parseParam({
				start: '#fff',
				color: '#fbb',
				times: 2,
				step: 5,
				length: 4
			}, d),
				f = e.start.split(''),
				g = e.color.split(''),
				h = [];
			var i;
			for (i = 0; i < e.step; i += 1) {
				var j = f[0];
				for (var k = 1; k < e.length; k += 1) {
					var l = parseInt(f[k], 16),
						m = parseInt(g[k], 16);
					j += Math.floor(parseInt(l + (m - l) * i / e.step, 10)).toString(16);
				}
				h.push(j);
			}
			for (i = 0; i < e.times; i += 1) {
				h = b(h);
			}
			var n = !1,
				o = Timer1.add(function() {
					if (!h.length) {
						Timer1.remove(o);
					} else {
						if (n) {
							n = !1;
							return;
						}
						n = !0;
						c.style.backgroundColor = h.pop();
					}
				});
		};
	})();
	var Clz = function(parent) {
		var propertyName = '___ytreporp___';
		var klass = function() {
			this.init.apply(this, arguments);
		};
		if (parent) {
			var Subclass = function() {};
			Subclass.prototype = parent.prototype;
			klass.prototype = new Subclass();
		}
		klass.prototype.init = function() {};
		klass.prototype.set = function(k, v) {
			if (!this[propertyName]) {
				this[propertyName] = {};
			}
			var i = 0,
				un = this[propertyName],
				ns = k.split('.'),
				len = ns.length,
				upp = len - 1,
				key;
			while (i < len) {
				key = ns[i];
				if (i == upp) {
					un[key] = v;
				}
				if (un[key] === undefined) {
					un[key] = {};
				}
				un = un[key];
				i++;
			}
		};
		klass.prototype.get = function(k) {
			if (!this[propertyName]) {
				this[propertyName] = {};
			}
			var i = 0,
				un = this[propertyName],
				ns = k.split('.'),
				len = ns.length,
				upp = len - 1,
				key;
			while (i < len) {
				key = ns[i];
				if (i == upp) {
					return un[key];
				}
				if (un[key] === undefined) {
					un[key] = {};
				}
				un = un[key];
				i++;
			}
		};
		klass.fn = klass.prototype;
		klass.fn.parent = klass;
		klass._super = klass.__proto__;
		klass.extend = function(obj) {
			var extended = obj.extended;
			for (var i in obj) {
				klass[i] = obj[i];
			}
			if (extended) {
				extended(klass);
			}
		};
		klass.include = function(obj) {
			var included = obj.included;
			for (var i in obj) {
				klass.fn[i] = obj[i];
			}
			if (included) {
				included(klass);
			}
		};
		return klass;
	};
	var animate = (function() {
		var Tween = {
			Linear: function(t, b, c, d) {
				return c * t / d + b;
			},
			Quad: {
				easeIn: function(t, b, c, d) {
					return c * (t /= d) * t + b;
				},
				easeOut: function(t, b, c, d) {
					return -c * (t /= d) * (t - 2) + b;
				},
				easeInOut: function(t, b, c, d) {
					if ((t /= d / 2) < 1) {
						return c / 2 * t * t + b;
					}
					return -c / 2 * ((--t) * (t - 2) - 1) + b;
				}
			},
			Cubic: {
				easeIn: function(t, b, c, d) {
					return c * (t /= d) * t * t + b;
				},
				easeOut: function(t, b, c, d) {
					return c * ((t = t / d - 1) * t * t + 1) + b;
				},
				easeInOut: function(t, b, c, d) {
					if ((t /= d / 2) < 1) {
						return c / 2 * t * t * t + b;
					}
					return c / 2 * ((t -= 2) * t * t + 2) + b;
				}
			},
			Quart: {
				easeIn: function(t, b, c, d) {
					return c * (t /= d) * t * t * t + b;
				},
				easeOut: function(t, b, c, d) {
					return -c * ((t = t / d - 1) * t * t * t - 1) + b;
				},
				easeInOut: function(t, b, c, d) {
					if ((t /= d / 2) < 1) {
						return c / 2 * t * t * t * t + b;
					}
					return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
				}
			},
			Quint: {
				easeIn: function(t, b, c, d) {
					return c * (t /= d) * t * t * t * t + b;
				},
				easeOut: function(t, b, c, d) {
					return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
				},
				easeInOut: function(t, b, c, d) {
					if ((t /= d / 2) < 1) {
						return c / 2 * t * t * t * t * t + b;
					}
					return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
				}
			},
			Sine: {
				easeIn: function(t, b, c, d) {
					return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
				},
				easeOut: function(t, b, c, d) {
					return c * Math.sin(t / d * (Math.PI / 2)) + b;
				},
				easeInOut: function(t, b, c, d) {
					return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
				}
			},
			Expo: {
				easeIn: function(t, b, c, d) {
					return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
				},
				easeOut: function(t, b, c, d) {
					return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
				},
				easeInOut: function(t, b, c, d) {
					if (t === 0) {
						return b;
					}
					if (t == d) {
						return b + c;
					}
					if ((t /= d / 2) < 1) {
						return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
					}
					return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
				}
			},
			Circ: {
				easeIn: function(t, b, c, d) {
					return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
				},
				easeOut: function(t, b, c, d) {
					return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
				},
				easeInOut: function(t, b, c, d) {
					if ((t /= d / 2) < 1) {
						return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
					}
					return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
				}
			},
			Elastic: {
				easeIn: function(t, b, c, d, a, p) {
					if (t === 0) {
						return b;
					}
					if ((t /= d) == 1) {
						return b + c;
					}
					if (!p) {
						p = d * 0.3;
					}
					var s;
					if (!a || a < Math.abs(c)) {
						a = c;
						s = p / 4;
					} else {
						s = p / (2 * Math.PI) * Math.asin(c / a);
					}
					return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
				},
				easeOut: function(t, b, c, d, a, p) {
					if (t === 0) {
						return b;
					}
					if ((t /= d) == 1) {
						return b + c;
					}
					if (!p) {
						p = d * 0.3;
					}
					var s;
					if (!a || a < Math.abs(c)) {
						a = c;
						s = p / 4;
					} else {
						s = p / (2 * Math.PI) * Math.asin(c / a);
					}
					return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
				},
				easeInOut: function(t, b, c, d, a, p) {
					if (t === 0) {
						return b;
					}
					if ((t /= d / 2) == 2) {
						return b + c;
					}
					if (!p) {
						p = d * (0.3 * 1.5);
					}
					var s;
					if (!a || a < Math.abs(c)) {
						a = c;
						s = p / 4;
					} else {
						s = p / (2 * Math.PI) * Math.asin(c / a);
					}
					if (t < 1) {
						return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
					}
					return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
				}
			},
			Back: {
				easeIn: function(t, b, c, d, s) {
					if (s === undefined) {
						s = 1.70158;
					}
					return c * (t /= d) * t * ((s + 1) * t - s) + b;
				},
				easeOut: function(t, b, c, d, s) {
					if (s === undefined) {
						s = 1.70158;
					}
					return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
				},
				easeInOut: function(t, b, c, d, s) {
					if (s === undefined) {
						s = 1.70158;
					}
					if ((t /= d / 2) < 1) {
						return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
					}
					return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
				}
			},
			Bounce: {
				easeIn: function(t, b, c, d) {
					return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
				},
				easeOut: function(t, b, c, d) {
					if ((t /= d) < (1 / 2.75)) {
						return c * (7.5625 * t * t) + b;
					} else if (t < (2 / 2.75)) {
						return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
					} else if (t < (2.5 / 2.75)) {
						return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
					} else {
						return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
					}
				},
				easeInOut: function(t, b, c, d) {
					if (t < d / 2) {
						return Tween.Bounce.easeIn(t * 2, 0, c, d) * 0.5 + b;
					} else {
						return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
					}
				}
			}
		};
		var color = {
			sub: function(str, start, len) {
				if (len) {
					return str.substring(start, start + len);
				} else {
					return str.substring(start);
				}
			},
			hex: function(i) {
				if (i < 0) {
					return '00';
				} else if (i > 255) {
					return 'ff';
				} else {
					var str = '0' + i.toString(16);
					return str.substring(str.length - 2);
				}
			},
			GetColors: function(sColor) {
				sColor = sColor.replace('#', '');
				var r, g, b;
				if (sColor.length > 3) {
					r = color.sub(sColor, 0, 2);
					g = color.sub(sColor, 2, 2);
					b = color.sub(sColor, 4, 2);
				} else {
					r = color.sub(sColor, 0, 1);
					g = color.sub(sColor, 1, 1);
					b = color.sub(sColor, 2, 1);
					r += r;
					g += g;
					b += b;
				}
				return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
			}
		};
		var fn = {
			getElement: function(id) {
				return typeof id == 'string' ? doc.getElementById(id) : id;
			},
			objType: function(obj) {
				switch (Object.prototype.toString.call(obj)) {
					case '[object Object]':
						return 'Object';
					case '[object Number]':
						return 'Number';
					case '[object Array]':
						return 'Array';
				}
			},
			getStyle: function(elem, name) {

				var w3style;
				if (doc.defaultView) {
					var style = doc.defaultView.getComputedStyle(elem, null);
					name == 'borderWidth' ? name = 'borderLeftWidth' : name;
					w3style = name in style ? style[name] : style.getPropertyValue(name);
					w3style == 'auto' ? w3style = '0px' : w3style;
				}
				return elem.style[name] || (elem.currentStyle && (elem.currentStyle[name] == 'auto' ? '0px' : elem.currentStyle[name])) || w3style;
			},
			getOriCss: function(elem, cssObj) {
				var cssOri = [];
				for (var prop in cssObj) {
					if (!cssObj.hasOwnProperty(prop)) {
						continue;
					}
					if (fn.getStyle(elem, prop) == 'transparent' || /^#|rgb\(/.test(fn.getStyle(elem, prop))) {
						if (fn.getStyle(elem, prop) == 'transparent') {
							cssOri.push([255, 255, 255]);
						}
						if (/^#/.test(fn.getStyle(elem, prop))) {
							cssOri.push(color.GetColors(fn.getStyle(elem, prop)));
						}
						if (/^rgb\(/.test(fn.getStyle(elem, prop))) {
							var regexp = /^rgb\(([0-9]{0,3}),\s([0-9]{0,3}),\s([0-9]{0,3})\)/g;
							var re = fn.getStyle(elem, prop).replace(regexp, '$1 $2 $3').split(' ');
							cssOri.push([parseInt(re[0]), parseInt(re[1]), parseInt(re[2])]);
						}
					} else if (prop == 'opacity') {
						cssOri.push(100 * fn.getStyle(elem, prop));
					} else {
						cssOri.push(parseInt(fn.getStyle(elem, prop)));
					}
				}
				return cssOri;
			},
			getEndCss: function(cssobj) {
				var cssEnd = [];
				for (var prop in cssobj) {
					if (!cssobj.hasOwnProperty(prop)) {
						continue;
					}
					if (prop == 'opacity') {
						cssEnd.push(100 * cssobj[prop]);
					} else if (/^#/.test(cssobj[prop])) {
						cssEnd.push(color.GetColors(cssobj[prop]));
					} else {
						cssEnd.push(parseInt(cssobj[prop]));
					}
				}
				return cssEnd;
			}
		};

		function Anim( /*elemId, cssObj, time, animType, funObj*/ ) {
			this.init.apply(this, arguments[0]);
		}
		Anim.prototype = {
			init: function() {
				this.elem = fn.getElement(arguments[0]);
				this.cssObj = arguments[1];
				this.cssOri = fn.getOriCss(this.elem, arguments[1]);
				this.cssEnd = fn.getEndCss(arguments[1]);
				this.durtime = arguments[2];
				this.animType = 'Tween.Linear';
				this.funObj = null;
				this.start = false;
				this.complete = false;
				this.onPause = false;
				this.onRestart = false;
				var p;
				if (arguments.length < 3) {
					throw new Error('至少要传入3个参数');
				} else if (arguments.length == 4) {
					if (fn.objType(arguments[3]) == 'Object') {
						this.funObj = arguments[3];
						for (p in this.funObj) {
							if (p.toString() == 'start') {
								this.start = true;
							}
							if (p.toString() == 'complete') {
								this.complete = true;
							}
						}
					}
					if (typeof(arguments[3]) == 'string') {
						this.animType = arguments[3];
					}
				} else if (arguments.length == 5) {
					this.animType = arguments[3];
					if (fn.objType(arguments[4]) == 'Object') {
						this.funObj = arguments[4];
						for (p in this.funObj) {
							if (p.toString() == 'start') {
								this.start = true;
							}
							if (p.toString() == 'complete') {
								this.complete = true;
							}
						}
					}
				}
				this.startAnim();
			},
			startAnim: function() {
				if (this.start) {
					this.funObj.start.call(this, this.elem);
				}
				var that = this;
				var t = 0;
				var props = [];
				for (var pro in this.cssObj) {
					if (!this.cssObj.hasOwnProperty(pro)) {
						continue;
					}
					props.push(pro);
				}
				clearInterval(this.timer);
				this.timer = setInterval(function() {
					var d;
					var c1, c2, c3;
					var b1, b2, b3;
					var r, g, b;
					var i;
					if (that.onPause) {
						clearInterval(that.timer);
						return;
					}
					if (t < that.durtime / 10) {
						t++;
						for (i = 0; i < props.length; i++) {
							var c;
							fn.objType(that.cssOri[i]) != 'Array' && (b = that.cssOri[i]);
							fn.objType(that.cssEnd[i]) != 'Array' && (c = that.cssEnd[i] - that.cssOri[i]);
							d = that.durtime / 10;
							if (fn.objType(that.cssOri[i]) == 'Array' && fn.objType(that.cssEnd[i]) == 'Array') {
								b1 = that.cssOri[i][0];
								b2 = that.cssOri[i][1];
								b3 = that.cssOri[i][2];
								c1 = that.cssEnd[i][0] - that.cssOri[i][0];
								c2 = that.cssEnd[i][1] - that.cssOri[i][1];
								c3 = that.cssEnd[i][2] - that.cssOri[i][2];
								r = color.hex(Math.ceil((eval(that.animType))(t, b1, c1, d)));
								g = color.hex(Math.ceil((eval(that.animType))(t, b2, c2, d)));
								b = color.hex(Math.ceil((eval(that.animType))(t, b3, c3, d)));
								that.elem.style[props[i]] = '#' + r + g + b;
							} else if (props[i].toString() == 'opacity') {
								that.elem.style[props[i]] = Math.ceil((eval(that.animType))(t, b, c, d)) / 100;
							} else {
								that.elem.style[props[i]] = Math.ceil((eval(that.animType))(t, b, c, d)) + 'px';
							}
						}
					} else {
						for (i = 0; i < props.length; i++) {
							if (fn.objType(that.cssOri[i]) == 'Array' && fn.objType(that.cssEnd[i]) == 'Array') {
								c1 = that.cssEnd[i][0];
								c2 = that.cssEnd[i][1];
								c3 = that.cssEnd[i][2];
								r = color.hex(Math.ceil((eval(that.animType))(t, b1, c1, d)));
								g = color.hex(Math.ceil((eval(that.animType))(t, b2, c2, d)));
								b = color.hex(Math.ceil((eval(that.animType))(t, b3, c3, d)));
								that.elem.style[props[i]] = '#' + r + g + b;
							} else if (props[i].toString() == 'opacity') {
								that.elem.style[props[i]] = that.cssEnd[i] / 100;
							} else {
								that.elem.style[props[i]] = that.cssEnd[i] + 'px';
							}
						}
						clearInterval(that.timer);
						if (that.complete) {
							that.funObj.complete.call(that, that.elem);
						}
					}
				}, 10);
			},
			pause: function() {
				this.onPause = true;
			}
		};
		return function() {
			return new Anim(arguments);
		};
	})();
	var getGuid = function() {
		return Math.abs((new Date()).getTime()) + '_' + Math.round(Math.random() * 1e8);
	};
	var jsonp = function(url, cb) {
		var head = byTag('head')[0];
		var ojs = byId(url);
		ojs && head.removeChild(ojs);
		if (url.indexOf('&') == -1) {
			url += '?';
		} else {
			url += '&';
		}
		//添加时间戳
		url = url + '_t' + getGuid();
		//添加回调
		var fun = exports.fun = 'jsonp_' + getGuid();
		if (typeof cb == 'function') {
			eval(fun + '=function(res){cb(res)}');
		}
		url = url + '&callback=' + fun;
		var js = create('script');
		js.src = url;
		js.id = url;
		js.type = 'text/javascript';
		js.language = 'javascript';
		head.appendChild(js);
	};
	var jsLoad = function(url, cb) {
		var head = byTag('head')[0];
		var js = create('script'),
			isLoaded = false;
		js.onload = js.onreadystatechange = function() {
			if (!isLoaded && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
				isLoaded = true;
				js.onload = js.onreadystatechange = null;
				typeof cb == 'function' && cb();
			}
		};
		js.src = url;
		try {
			head.appendChild(js);
		} catch (e) {}
	};
	var ijax = (function() {
		return {
			/**
			 * @name arrTaskLists
			 * @description 保存缓冲的任务列表
			 * @memberOf ijax
			 */
			arrTaskLists: [],
			/**
			 * @name createLoadingIframe
			 * @description 创建 iframe 节点用于载入数据，因为支持双线程，同时建立两个，减少 DOM 操作次数
			 * @memberOf ijax
			 */
			createLoadingIframe: function() {
				if (this.loadFrames != null) {
					return false;
				}
				/**
				 * 生成随机 ID 来保证提交到当前页面的数据交互 iframe
				 */
				var rndId1 = 'loadingIframe_thread' + Math.ceil(Math.random() * 10000);
				var rndId2 = 'loadingIframe_thread' + Math.ceil((Math.random() + 1) * 10000);
				this.loadFrames = [rndId1, rndId2];

				var iframeSrc = '';
				if (ua.isIE6) {
					// ie6 父页面或在iframe页面中设置doc.domain后，无论是和当前域名相同还是根域名，一律视为跨域
					iframeSrc = 'javascript:void((function(){document.open();document.domain="sina.com.cn";document.close()})())';
				}
				var html = '<iframe id="' + rndId1 + '" name="' + rndId1 + '" class="invisible" scrolling="no" src="" allowTransparency="true" style="display:none;" frameborder="0" ><\/iframe><iframe id="' + rndId2 + '" name="' + rndId2 + '" class="invisible" scrolling="no" src="' + iframeSrc + '" allowTransparency="true" style="display:none;" frameborder="0" ><\/iframe>';
				var oIjaxIframeCnt = create('div');
				oIjaxIframeCnt.id = 'ijax_iframes';
				oIjaxIframeCnt.innerHTML = html;
				doc.body.appendChild(oIjaxIframeCnt);
				// 记录两个 iframe 加载器，默认是空闲状态

				var loadTimer = setInterval(bind2(function() {
					if (byId(this.loadFrames[0]) != null && byId(this.loadFrames[1]) != null) {
						clearInterval(loadTimer);
						loadTimer = null;
						this.loadingIframe = {
							'thread1': {
								'container': byId(this.loadFrames[0]),
								'isBusy': false
							},
							'thread2': {
								'container': byId(this.loadFrames[1]),
								'isBusy': false
							}
						};
						this.loadByList();
					}
				}, this), 10);
			},
			/**
			 * @name isIjaxReady
			 * @description 判断是否可以开始加载数据，必须是两个 iframe 节点可用的情况下
			 * @memberOf ijax
			 */
			isIjaxReady: function() {
				if (typeof this.loadingIframe == C.U) {
					return false;
				}
				for (var oLoadCnt in this.loadingIframe) {
					if (!this.loadingIframe[oLoadCnt].isBusy) {
						this.loadingIframe[oLoadCnt].isBusy = true;
						return this.loadingIframe[oLoadCnt];
					}
				}
				return false;
			},
			/**
			 * @name request
			 * @description 处理请求参数接收
			 * @memberOf ijax
			 * @param {String} url 必选参数。请求数据的URL，是一个 URL 字符串，不支持数组
			 * @param {Object} option 可选参数
			 */
			request: function(url, option) {
				var oTask = {};
				oTask.url = url;
				oTask.option = option || {};
				this.arrTaskLists.push(oTask);
				if (this.loadFrames == null) {
					this.createLoadingIframe();
				} else {
					this.loadByList();
				}
			},
			/**
			 * @name loadByList
			 * @description 缓冲列表管理
			 * @memberOf ijax
			 */
			loadByList: function() {
				// 如果等待列表为空，则终止加载
				if (this.arrTaskLists.length === 0) {
					// 重新建立 iframe
					return false;
				}
				// 取得两个加载器的状态，看是否有空闲的
				var loadStatus = this.isIjaxReady();
				if (!loadStatus) {
					return false;
				}
				var newData = this.arrTaskLists[0];
				this.loadData(newData.url, newData.option, loadStatus);
				// 删除列表第一条
				this.arrTaskLists.shift();
			},
			/**
			 * @name loadData
			 * @description 加载数据
			 * @memberOf ijax
			 * @param  {String} url    接口地址
			 * @param  {Object} option 选项
			 * @param  {Function} loader 回调
			 */
			loadData: function(url, option, loader) {
				var _url = new Url(url);
				if (option.GET) {
					for (var key in option.GET) {
						_url.setParam(key, encodeDoubleByte(option.GET[key]));
					}
				}
				_url = _url.toString();
				// 当前用于加载数据的 iframe 对象
				var ifm = loader.container;
				ifm.listener = bind2(function() {
					if (option.onComplete || option.onException) {
						try {
							var iframeObject = ifm.contentWindow.document,
								sResult;
							// 临时函数
							var tArea = byTag('textarea')[0];
							if (typeof tArea != C.U) {
								sResult = tArea.value;
							} else {
								sResult = iframeObject.body.innerHTML;
							}
							if (option.onComplete) {
								option.onComplete(sResult);
							} else {
								option.onException();
							}
						} catch (e) {
							if (option.onException) {
								option.onException(e.message, _url.toString());
							}
						}
					}
					loader.isBusy = false;
					removeEvent(ifm, 'load', ifm.listener);
					this.loadByList();
				}, this);

				addEvent(ifm, 'load', ifm.listener);

				// 如果需要 post 数据
				if (option.POST) {
					var oIjaxForm = create('form');
					oIjaxForm.id = 'IjaxForm';
					oIjaxForm.action = _url;
					oIjaxForm.method = 'post';
					oIjaxForm.target = ifm.id;
					for (var oItem in option.POST) {
						var oInput = create('input');
						oInput.type = 'hidden';
						oInput.name = oItem;
						//oInput.value = str.encodeDoubleByte(option.POST[oItem]);
						//encodeDoubleByte就是encodeURIComponent，会把gbk字符转成utf-8造成乱码
						oInput.value = option.POST[oItem];
						oIjaxForm.appendChild(oInput);
					}
					doc.body.appendChild(oIjaxForm);
					try {
						oIjaxForm.submit();
					} catch (e) {

					}
				} else {
					try {
						window.frames(ifm.id).location.href = _url;
					} catch (e) {
						ifm.src = _url;
					}
				}
			}
		};
	})();
	var html5Ijax = (function() {
		var NOOP = function() {},
			RE_URL = /^http\s?\:\/\/[a-z\d\-\.]+/i,
			ID_PREFIX = 'ijax-html5-iframe-',

			/**
			 * Message sender class
			 */
			MsgSender = function(cfg) {
				cfg = cfg || {};
				this.init(cfg);
			};
		MsgSender.prototype = {
			ready: false,

			init: function(cfg) {
				if (this.ready) {
					return;
				}
				var self = this,
					iframeId, iframeHtml, iframe, loaded, receiver,
					proxyUrl = cfg.proxyUrl;
				self.onsuccess = cfg.onsuccess || NOOP;
				self.onfailure = cfg.onfailure || NOOP;
				if (!proxyUrl) {
					return;
				}

				receiver = function(e) {
					if (!self.ready || e.origin !== self.target) {
						self.destroy();
						return;
					}
					var ret = e.data;
					if (!ret || ret === 'failure') {
						self.destroy();
						self.onfailure && self.onfailure();
					} else {
						self.onsuccess && self.onsuccess(e.data);
						self.destroy();
					}
				};
				addEvent(window, 'message', receiver);

				// insert an iframe
				iframeId = ID_PREFIX + Date.parse(new Date());
				iframeHtml = '<iframe id="' + iframeId + '" name="' + iframeId +
					'" src="' + proxyUrl + '" frameborder="0" ' +
					'style="width:0;height:0;display:none;"></iframe>';
				var oIjaxIframeCnt = create('div');
				oIjaxIframeCnt.id = ID_PREFIX + 'iframes';
				oIjaxIframeCnt.innerHTML = iframeHtml;
				// doc.body.appendChild(oIjaxIframeCnt);
				iframe = oIjaxIframeCnt.childNodes[0];
				loaded = function() {
					self.ready = true;
					var src = iframe.src,
						matched = src.match(RE_URL);
					self.target = (matched && matched[0]) || '*';
				};
				addEvent(iframe, 'load', loaded);
				doc.body.insertBefore(iframe, doc.body.firstChild);

				self._iframe = iframe;
				self._iframeLoaded = loaded;
				self._receiver = receiver;
			},

			send: function(cfg) {
				cfg = cfg || {};
				var self = this,
					url = cfg.url,
					data = cfg.data,
					onsuccess = cfg.onsuccess,
					onfailure = cfg.onfailure;
				if (!url || typeof url !== 'string') {
					return;
				}
				if (onsuccess) {
					self.onsuccess = onsuccess;
				}
				if (onfailure) {
					self.onfailure = onfailure;
				}

				if (!self.ready) {
					setTimeout(function() {
						self.send(cfg);
					}, 50);
					return;
				}

				if (data) {
					data += '&_url=' + window.encodeURIComponent(url);
				} else {
					data = '_url=' + window.encodeURIComponent(url);
				}
				self._iframe.contentWindow.postMessage(data, self.target);
			},
			destroy: function() {
				var iframe = this._iframe;
				removeEvent(iframe, 'load', this._iframeLoaded);
				iframe.parentNode.removeChild(iframe);
				removeEvent(window, 'message', this._receiver);
				this._iframe = null;
				this._iframeLoaded = null;
				this._receiver = null;
			}
		};

		return MsgSender;
	})();
	var $ = {
		C:C,
		doc:doc,
		byId: byId,
		byTag:byTag,
		byAttr: byAttr,
		hasClass: hasClass,
		addClass: addClass,
		removeClass: removeClass,
		toggleClass: toggleClass,
		preventDefault: preventDefault,
		stopPropagation: stopPropagation,
		contains: contains,
		create: create,
		insertAfter: insertAfter,
		ua: ua,
		domReady: domReady,
		timeoutHandle: timeoutHandle,
		cssSupports:cssSupports,
		getXY: getXY,
		getScrollPos: getScrollPos,
		getPosition: getPosition,
		getStyle: getStyle,
		getOuterStyle:getOuterStyle,
		setStyle: setStyle,
		trim: trim,
		encodeHTML: encodeHTML,
		decodeHTML:decodeHTML,
		encodeDoubleByte: encodeDoubleByte,
		byteLength: byteLength,
		strLeft: strLeft,
		indexOf: indexOf,
		inArray: inArray,
		isArray: isArray,
		isEmptyObj: isEmptyObj,
		extend: extend,
		jsonToQuery: jsonToQuery,
		queryToJson: queryToJson,
		addEvent: addEvent,
		removeEvent: removeEvent,
		fixEvent: fixEvent,
		byClass: byClass,
		builder: builder,
		custEvent: custEvent,
		delegatedEvent: delegatedEvent,
		bind2: bind2,
		parseParam: parseParam,
		Url: Url,
		placeholder: placeholder,
		Timer: Timer,
		throttle: throttle,
		reachBottom: reachBottom,
		shine: shine,
		Clz: Clz,
		animate: animate,
		getGuid: getGuid,
		jsonp: jsonp,
		jsLoad: jsLoad,
		ijax: ijax,
		html5Ijax: html5Ijax
	};
	$.register = function(namespace, method) {
		var i = 0,
			un = $,
			ns = namespace.split('.'),
			len = ns.length,
			upp = len - 1,
			key;
		while (i < len) {
			key = ns[i];
			if (i == upp) {
				if (un[key] !== undefined) {
					throw ns + ':: has registered';
				}
				un[key] = method($);
			}
			if (un[key] === undefined) {
				un[key] = {};
			}
			un = un[key];
			i++;
		}
	};
	/**
	 * @name mysInacMNT
	 * @description 简易方法库
	 * @global
	 */
	var EXPORTS_NAME = 'mysInacMNT';
	var UGLIFY_NAME = '___' + EXPORTS_NAME + '___';
	exports[UGLIFY_NAME] = $;
	if (exports[EXPORTS_NAME]) {
		throw '个性化推荐全局变量名"' + EXPORTS_NAME + '"已经被占用，可使用' + UGLIFY_NAME;
	} else {
		exports[EXPORTS_NAME] = $;
	}
})(window);