/*!
* comment
* v 3.0.0
* svn ../ui/project/comment3/
* 2015-08-12 11:47
* [${p_id},${t_id},${d_id}] published at ${publishdate} ${publishtime}
*/
/**
 * @file \u7B80\u6613\u65B9\u6CD5\u5E93
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

			//\u5F00\u59CB\u521D\u59CB\u5316domReady\u51FD\u6570\uFF0C\u5224\u5B9A\u9875\u9762\u7684\u52A0\u8F7D\u60C5\u51B5
			if (doc.readyState === 'complete') {
				onReady();
			} else if (doc.addEventListener) {
				doc.addEventListener('DOMContentLoaded', function() {
					doc.removeEventListener('DOMContentLoaded', arguments.callee, false);
					onReady();
				}, false);
				//\u4E0D\u52A0\u8FD9\u4E2A\u6709\u65F6chrome firefox\u4E0D\u8D77\u4F5C\u7528
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
						node = null; //\u9632\u6B62IE\u5185\u5B58\u6CC4\u6F0F
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
				throw new Error(id + '\u5DF2\u7ECF\u88AB\u5360\u7528');
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
		//\u5305\u62EC\u5168\u89D2\u7A7A\u683C
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
			//\u539F\u6837\u8FD4\u56DE
			if (n == j || k == j) {
				return s2;
			} else {
				return s.slice(0, n - 2) + ELLIPSIS;
			}
		}
		//\u6C49\u5B57
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

				// \u5982\u679C\u53EA\u6709key\u6CA1\u6709value, \u90A3\u4E48\u5C06\u5168\u90E8\u4E22\u5165\u4E00\u4E2A$nullName\u6570\u7EC4\u4E2D
				if (_hsh.length < 2) {
					_value = _key;
					_key = '$nullName';
				}
				// \u5982\u679C\u7F13\u5B58\u5806\u6808\u4E2D\u6CA1\u6709\u8FD9\u4E2A\u6570\u636E
				if (!_json[_key]) {
					_json[_key] = _fData(_value);
				}
				// \u5982\u679C\u5806\u6808\u4E2D\u5DF2\u7ECF\u5B58\u5728\u8FD9\u4E2A\u6570\u636E\uFF0C\u5219\u8F6C\u6362\u6210\u6570\u7EC4\u5B58\u50A8
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
			throw new Error('addEvent \u627E\u4E0D\u5230\u5BF9\u8C61\uFF1A' + elm);
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
			throw ('removeEvent \u627E\u4E0D\u5230\u5BF9\u8C61\uFF1A' + oElement);
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
	 * @description \u81EA\u5B9A\u4E49\u4E8B\u4EF6
	 * @example
	 * custEvent.define($,'my_ce_login');
	 * custEvent.add($,'my_ce_login',function(){do();});
	 */
	var custEvent = (function() {
		var _custAttr = '__custEventKey__',
			_custKey = 1,
			_custCache = {},
			/**
			 * \u4ECE\u7F13\u5B58\u4E2D\u67E5\u627E\u76F8\u5173\u5BF9\u8C61
			 * \u5F53\u5DF2\u7ECF\u5B9A\u4E49\u65F6
			 * \u6709type\u65F6\u8FD4\u56DE\u7F13\u5B58\u4E2D\u7684\u5217\u8868 \u6CA1\u6709\u65F6\u8FD4\u56DE\u7F13\u5B58\u4E2D\u7684\u5BF9\u8C61
			 * \u6CA1\u6709\u5B9A\u4E49\u65F6\u8FD4\u56DEfalse
			 * @param {Object|number} obj \u5BF9\u8C61\u5F15\u7528\u6216\u83B7\u53D6\u7684key
			 * @param {String} type \u81EA\u5B9A\u4E49\u4E8B\u4EF6\u540D\u79F0
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
			 * @description \u5BF9\u8C61\u81EA\u5B9A\u4E49\u4E8B\u4EF6\u7684\u5B9A\u4E49 \u672A\u5B9A\u4E49\u7684\u4E8B\u4EF6\u4E0D\u5F97\u7ED1\u5B9A
			 * @method define
			 * @memberOf custEvent
			 * @static
			 * @param {Object|number} obj \u5BF9\u8C61\u5F15\u7528\u6216\u83B7\u53D6\u7684\u4E0B\u6807(key); \u5FC5\u9009
			 * @param {String|Array} type \u81EA\u5B9A\u4E49\u4E8B\u4EF6\u540D\u79F0; \u5FC5\u9009
			 * @return {number} key \u4E0B\u6807
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
			 * @description \u5BF9\u8C61\u81EA\u5B9A\u4E49\u4E8B\u4EF6\u7684\u53D6\u6D88\u5B9A\u4E49
			 * \u5F53\u5BF9\u8C61\u7684\u6240\u6709\u4E8B\u4EF6\u5B9A\u4E49\u90FD\u88AB\u53D6\u6D88\u65F6 \u5220\u9664\u5BF9\u5BF9\u8C61\u7684\u5F15\u7528
			 * @method define
			 * @memberOf custEvent
			 * @static
			 * @param {Object|number} obj \u5BF9\u8C61\u5F15\u7528\u6216\u83B7\u53D6\u7684(key); \u5FC5\u9009
			 * @param {String} type \u81EA\u5B9A\u4E49\u4E8B\u4EF6\u540D\u79F0; \u53EF\u9009 \u4E0D\u586B\u53EF\u53D6\u6D88\u6240\u6709\u4E8B\u4EF6\u7684\u5B9A\u4E49
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
			 * @description \u4E8B\u4EF6\u6DFB\u52A0\u6216\u7ED1\u5B9A
			 * @method add
			 * @memberOf custEvent
			 * @static
			 * @param {Object|number} obj \u5BF9\u8C61\u5F15\u7528\u6216\u83B7\u53D6\u7684(key); \u5FC5\u9009
			 * @param {String} type \u81EA\u5B9A\u4E49\u4E8B\u4EF6\u540D\u79F0; \u5FC5\u9009
			 * @param {Function} fn \u4E8B\u4EF6\u5904\u7406\u65B9\u6CD5; \u5FC5\u9009
			 * @param {*} data \u6269\u5C55\u6570\u636E\u4EFB\u610F\u7C7B\u578B; \u53EF\u9009
			 * @return {number} key \u4E0B\u6807
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
			 * @description \u4E8B\u4EF6\u5220\u9664\u6216\u89E3\u7ED1
			 * @method remove
			 * @memberOf custEvent
			 * @static
			 * @param {Object|number} obj \u5BF9\u8C61\u5F15\u7528\u6216\u83B7\u53D6\u7684(key); \u5FC5\u9009
			 * @param {String} type \u81EA\u5B9A\u4E49\u4E8B\u4EF6\u540D\u79F0; \u53EF\u9009; \u4E3A\u7A7A\u65F6\u5220\u9664\u5BF9\u8C61\u4E0B\u7684\u6240\u6709\u4E8B\u4EF6\u7ED1\u5B9A
			 * @param {Function} fn \u4E8B\u4EF6\u5904\u7406\u65B9\u6CD5; \u53EF\u9009; \u4E3A\u7A7A\u4E14type\u4E0D\u4E3A\u7A7A\u65F6 \u5220\u9664\u5BF9\u8C61\u4E0Btype\u4E8B\u4EF6\u76F8\u5173\u7684\u6240\u6709\u5904\u7406\u65B9\u6CD5
			 * @return {number} key \u4E0B\u6807
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
			 * @description \u4E8B\u4EF6\u89E6\u53D1
			 * @method fire
			 * @memberOf custEvent
			 * @static
			 * @param {Object|number} obj \u5BF9\u8C61\u5F15\u7528\u6216\u83B7\u53D6\u7684(key); \u5FC5\u9009
			 * @param {String} type \u81EA\u5B9A\u4E49\u4E8B\u4EF6\u540D\u79F0; \u5FC5\u9009
			 * @param {Any|Array} args \u53C2\u6570\u6570\u7EC4\u6216\u5355\u4E2A\u7684\u5176\u4ED6\u6570\u636E; \u53EF\u9009
			 * @return {number} key \u4E0B\u6807
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
			 * @description \u9500\u6BC1
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
	 * @description \u4E8B\u4EF6\u59D4\u6D3E
	 * @example
	 * // html <a href="javascript:;" action-type="vote" action-data="mid=123">\u6295\u7968</a>
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
		 * \u4FDD\u7559\u539F\u578B\u6269\u5C55
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
			 * \u89E3\u6790URL\uFF0C\u6CE8\u610F\u89E3\u6790\u951A\u70B9\u5FC5\u987B\u5728\u89E3\u6790GET\u53C2\u6570\u4E4B\u524D\uFF0C\u4EE5\u514D\u951A\u70B9\u5F71\u54CDGET\u53C2\u6570\u7684\u89E3\u6790
			 * @param{String} url? \u5982\u679C\u4F20\u5165\u53C2\u6570\uFF0C\u5219\u5C06\u4F1A\u8986\u76D6\u521D\u59CB\u5316\u65F6\u7684\u4F20\u5165\u7684url \u4E32
			 */
			parse: function(url) {
				if (url) {
					this.url = url;
				}
				this.parseAnchor();
				this.parseParam();
			},
			/**
			 * \u89E3\u6790\u951A\u70B9 #anchor
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
			 * \u89E3\u6790GET\u53C2\u6570 ?name=value;
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
			 * \u76EE\u524D\u5BF9json\u683C\u5F0F\u7684value \u4E0D\u652F\u6301
			 * @param {String} str \u4E3A\u503C\u5BF9\u5F62\u5F0F,\u5176\u4E2Dvalue\u652F\u6301 '1,2,3'\u9017\u53F7\u5206\u5272
			 * @return \u8FD4\u56DEstr\u7684\u5206\u6790\u7ED3\u679C\u5BF9\u8C61
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
			 * \u4ECE URL \u4E2D\u83B7\u53D6\u6307\u5B9A\u53C2\u6570\u7684\u503C
			 * @param {Object} sPara
			 */
			getParam: function(sPara) {
				return this.query[sPara] || '';
			},
			/**
			 * \u6E05\u9664URL\u5B9E\u4F8B\u7684GET\u8BF7\u6C42\u53C2\u6570
			 */
			clearParam: function() {
				this.query = {};
			},

			/**
			 * \u8BBE\u7F6EGET\u8BF7\u6C42\u7684\u53C2\u6570\uFF0C\u5F53\u4E2A\u8BBE\u7F6E
			 * @param {String} name \u53C2\u6570\u540D
			 * @param {String} value \u53C2\u6570\u503C
			 */
			setParam: function(name, value) {
				if (name == null || name === '' || typeof(name) != 'string') {
					throw new Error('no param name set');
				}
				this.query = this.query || {};
				this.query[name] = value;
			},

			/**
			 * \u8BBE\u7F6E\u591A\u4E2A\u53C2\u6570\uFF0C\u6CE8\u610F\u8FD9\u4E2A\u8BBE\u7F6E\u662F\u8986\u76D6\u5F0F\u7684\uFF0C\u5C06\u6E05\u7A7A\u8BBE\u7F6E\u4E4B\u524D\u7684\u6240\u6709\u53C2\u6570\u3002\u8BBE\u7F6E\u4E4B\u540E\uFF0CURL.query\u5C06\u6307\u5411o\uFF0C\u800C\u4E0D\u662Fduplicate\u4E86o\u5BF9\u8C61
			 * @param {Object} o \u53C2\u6570\u5BF9\u8C61\uFF0C\u5176\u5C5E\u6027\u90FD\u5C06\u6210\u4E3AURL\u5B9E\u4F8B\u7684GET\u53C2\u6570
			 */
			setParams: function(o) {
				this.query = o;
			},

			/**
			 * \u5E8F\u5217\u5316\u4E00\u4E2A\u5BF9\u8C61\u4E3A\u503C\u5BF9\u7684\u5F62\u5F0F
			 * @param {Object} o \u5F85\u5E8F\u5217\u5316\u7684\u5BF9\u8C61\uFF0C\u6CE8\u610F\uFF0C\u53EA\u652F\u6301\u4E00\u7EA7\u6DF1\u5EA6\uFF0C\u591A\u7EF4\u7684\u5BF9\u8C61\u8BF7\u7ED5\u8FC7\uFF0C\u91CD\u65B0\u5B9E\u73B0
			 * @return {String} \u5E8F\u5217\u5316\u4E4B\u540E\u7684\u6807\u51C6\u7684\u503C\u5BF9\u5F62\u5F0F\u7684String
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
			 * \u5C06URL\u5BF9\u8C61\u8F6C\u5316\u6210\u4E3A\u6807\u51C6\u7684URL\u5730\u5740
			 * @return {String} URL\u5730\u5740
			 */
			toString: function() {
				var queryStr = this.serialize(this.query);
				return this.url + (queryStr.length > 0 ? '?' + queryStr : '') + (this.anchor ? '#' + this.serialize(this.anchor) : '');
			},

			/**
			 * \u5F97\u5230anchor\u7684\u4E32
			 * @param {Boolean} forceSharp \u5F3A\u5236\u5E26#\u7B26\u53F7
			 * @return {String} \u951Aanchor\u7684\u4E32
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
				//\u5982\u679C\u652F\u6301placeholder,\u8FD4\u56DE
				if (supportPlaceholder) {
					return;
				}
				//\u5DF2\u7ECF\u521D\u59CB\u5316\uFF0ChasPlaceholder\u4E3A1
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

				//\u5982\u679C\u6CA1\u6709placeholder\u6216\u8005\u6CA1\u6709placeholder\u503C\uFF0C\u8FD4\u56DE
				var text = input.getAttribute('placeholder');
				if (!text) {
					//ie10 \u4E0B\u7684ie7 \u65E0\u6CD5\u7528input.getAttribute('placeholder')\u53D6\u5230placeholder\u503C\uFF0C\u5947\u602A\uFF01
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
				// bshare\u6D6E\u5C42\u4F1A\u5BFC\u81F4\u8FD9\u6BB5\u4EE3\u7801\u51FA\u9519
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
					throw new Error('\u81F3\u5C11\u8981\u4F20\u51653\u4E2A\u53C2\u6570');
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
		//\u6DFB\u52A0\u65F6\u95F4\u6233
		url = url + '_t' + getGuid();
		//\u6DFB\u52A0\u56DE\u8C03
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
			 * @description \u4FDD\u5B58\u7F13\u51B2\u7684\u4EFB\u52A1\u5217\u8868
			 * @memberOf ijax
			 */
			arrTaskLists: [],
			/**
			 * @name createLoadingIframe
			 * @description \u521B\u5EFA iframe \u8282\u70B9\u7528\u4E8E\u8F7D\u5165\u6570\u636E\uFF0C\u56E0\u4E3A\u652F\u6301\u53CC\u7EBF\u7A0B\uFF0C\u540C\u65F6\u5EFA\u7ACB\u4E24\u4E2A\uFF0C\u51CF\u5C11 DOM \u64CD\u4F5C\u6B21\u6570
			 * @memberOf ijax
			 */
			createLoadingIframe: function() {
				if (this.loadFrames != null) {
					return false;
				}
				/**
				 * \u751F\u6210\u968F\u673A ID \u6765\u4FDD\u8BC1\u63D0\u4EA4\u5230\u5F53\u524D\u9875\u9762\u7684\u6570\u636E\u4EA4\u4E92 iframe
				 */
				var rndId1 = 'loadingIframe_thread' + Math.ceil(Math.random() * 10000);
				var rndId2 = 'loadingIframe_thread' + Math.ceil((Math.random() + 1) * 10000);
				this.loadFrames = [rndId1, rndId2];

				var iframeSrc = '';
				if (ua.isIE6) {
					// ie6 \u7236\u9875\u9762\u6216\u5728iframe\u9875\u9762\u4E2D\u8BBE\u7F6Edoc.domain\u540E\uFF0C\u65E0\u8BBA\u662F\u548C\u5F53\u524D\u57DF\u540D\u76F8\u540C\u8FD8\u662F\u6839\u57DF\u540D\uFF0C\u4E00\u5F8B\u89C6\u4E3A\u8DE8\u57DF
					iframeSrc = 'javascript:void((function(){document.open();document.domain="sina.com.cn";document.close()})())';
				}
				var html = '<iframe id="' + rndId1 + '" name="' + rndId1 + '" class="invisible" scrolling="no" src="" allowTransparency="true" style="display:none;" frameborder="0" ><\/iframe><iframe id="' + rndId2 + '" name="' + rndId2 + '" class="invisible" scrolling="no" src="' + iframeSrc + '" allowTransparency="true" style="display:none;" frameborder="0" ><\/iframe>';
				var oIjaxIframeCnt = create('div');
				oIjaxIframeCnt.id = 'ijax_iframes';
				oIjaxIframeCnt.innerHTML = html;
				doc.body.appendChild(oIjaxIframeCnt);
				// \u8BB0\u5F55\u4E24\u4E2A iframe \u52A0\u8F7D\u5668\uFF0C\u9ED8\u8BA4\u662F\u7A7A\u95F2\u72B6\u6001

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
			 * @description \u5224\u65AD\u662F\u5426\u53EF\u4EE5\u5F00\u59CB\u52A0\u8F7D\u6570\u636E\uFF0C\u5FC5\u987B\u662F\u4E24\u4E2A iframe \u8282\u70B9\u53EF\u7528\u7684\u60C5\u51B5\u4E0B
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
			 * @description \u5904\u7406\u8BF7\u6C42\u53C2\u6570\u63A5\u6536
			 * @memberOf ijax
			 * @param {String} url \u5FC5\u9009\u53C2\u6570\u3002\u8BF7\u6C42\u6570\u636E\u7684URL\uFF0C\u662F\u4E00\u4E2A URL \u5B57\u7B26\u4E32\uFF0C\u4E0D\u652F\u6301\u6570\u7EC4
			 * @param {Object} option \u53EF\u9009\u53C2\u6570
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
			 * @description \u7F13\u51B2\u5217\u8868\u7BA1\u7406
			 * @memberOf ijax
			 */
			loadByList: function() {
				// \u5982\u679C\u7B49\u5F85\u5217\u8868\u4E3A\u7A7A\uFF0C\u5219\u7EC8\u6B62\u52A0\u8F7D
				if (this.arrTaskLists.length === 0) {
					// \u91CD\u65B0\u5EFA\u7ACB iframe
					return false;
				}
				// \u53D6\u5F97\u4E24\u4E2A\u52A0\u8F7D\u5668\u7684\u72B6\u6001\uFF0C\u770B\u662F\u5426\u6709\u7A7A\u95F2\u7684
				var loadStatus = this.isIjaxReady();
				if (!loadStatus) {
					return false;
				}
				var newData = this.arrTaskLists[0];
				this.loadData(newData.url, newData.option, loadStatus);
				// \u5220\u9664\u5217\u8868\u7B2C\u4E00\u6761
				this.arrTaskLists.shift();
			},
			/**
			 * @name loadData
			 * @description \u52A0\u8F7D\u6570\u636E
			 * @memberOf ijax
			 * @param  {String} url    \u63A5\u53E3\u5730\u5740
			 * @param  {Object} option \u9009\u9879
			 * @param  {Function} loader \u56DE\u8C03
			 */
			loadData: function(url, option, loader) {
				var _url = new Url(url);
				if (option.GET) {
					for (var key in option.GET) {
						_url.setParam(key, encodeDoubleByte(option.GET[key]));
					}
				}
				_url = _url.toString();
				// \u5F53\u524D\u7528\u4E8E\u52A0\u8F7D\u6570\u636E\u7684 iframe \u5BF9\u8C61
				var ifm = loader.container;
				ifm.listener = bind2(function() {
					if (option.onComplete || option.onException) {
						try {
							var iframeObject = ifm.contentWindow.document,
								sResult;
							// \u4E34\u65F6\u51FD\u6570
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

				// \u5982\u679C\u9700\u8981 post \u6570\u636E
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
						//encodeDoubleByte\u5C31\u662FencodeURIComponent\uFF0C\u4F1A\u628Agbk\u5B57\u7B26\u8F6C\u6210utf-8\u9020\u6210\u4E71\u7801
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
	 * @description \u7B80\u6613\u65B9\u6CD5\u5E93
	 * @global
	 */
	var EXPORTS_NAME = 'mysInacMNT';
	var UGLIFY_NAME = '___' + EXPORTS_NAME + '___';
	exports[UGLIFY_NAME] = $;
	if (exports[EXPORTS_NAME]) {
		throw '\u4E2A\u6027\u5316\u63A8\u8350\u5168\u5C40\u53D8\u91CF\u540D"' + EXPORTS_NAME + '"\u5DF2\u7ECF\u88AB\u5360\u7528\uFF0C\u53EF\u4F7F\u7528' + UGLIFY_NAME;
	} else {
		exports[EXPORTS_NAME] = $;
	}
})(window);
(function(exports) {
  var $ = exports.___mysInacMNT___;
  $.register('msg', function() {
    var all = {
      I001: '\u8BC4\u8BBA\u6210\u529F',
      I002: '\u5E76\u5DF2\u8F6C\u53D1\u5FAE\u535A',
      I003: '\u8BF7\u8F93\u5165\u8BC4\u8BBA',
      I004: '\u8BF7\u8F93\u5165\u5BC6\u7801',
      I005: '\u8BF7\u5148\u767B\u5F55\u518D\u63D0\u4EA4\u8BC4\u8BBA',
      I006: '\u5DF2\u5230\u6700\u540E\u4E00\u9875',
      I007: '\u53D1\u5E03',
      I008: '\u8D5E',
      I009: '\u56DE\u590D',
      I010: '\u5FAE\u535A\u8D26\u53F7/\u535A\u5BA2/\u90AE\u7BB1',
      I011: '\u4E0B\u6B21\u81EA\u52A8\u767B\u5F55',
      I012: '\u6CE8\u518C',
      I013: '\u5FD8\u8BB0\u5BC6\u7801\uFF1F',
      I014: '\u6EDA\u52A8\u52A0\u8F7D\u66F4\u591A',
      I015: '\u6700\u70ED\u8BC4\u8BBA',
      I016: '\u6700\u65B0\u8BC4\u8BBA',
      I017: '\u5237\u65B0',
      I018: '\u5206\u4EAB\u5230\u5FAE\u535A',
      I019: '\u5206\u4EAB',
      I020: '\u5206\u4EAB\u5230\u65B0\u6D6A\u5FAE\u535A',
      I021: '\u5206\u4EAB\u5230\u817E\u8BAF\u5FAE\u535A',
      I022: '\u6708',
      I023: '\u65E5',
      I024: '\u4ECA\u5929',
      I025: '\u79D2\u524D',
      I026: '\u5206\u949F\u524D',
      I027: '\u5DF2\u5230\u6700\u540E\u4E00\u9875',
      I028: '<span>\u8FD8\u6709<em><% this.num %></em>\u6761\u8BC4\u8BBA\uFF0C</span>',
      I029: '\u767B\u5F55',
      I030:'\u9000\u51FA',
      I031:'<em><% this.comment %></em>\u6761\u8BC4\u8BBA',
      I032:'<em><% this.person %></em>\u4EBA\u53C2\u4E0E',
      I033:'<em><% this.post %></em>\u6761\u76F8\u5173\u5E16\u5B50',
      I034:'\u70B9\u51FB\u5C55\u5F00\u4E4B\u524D\u7684\u8BC4\u8BBA',
      I035:'\u70B9\u51FB\u6536\u8D77\u4E4B\u524D\u7684\u8BC4\u8BBA',
      I036:'\u56DE\u590D<% this.userLnk %>\uFF1A',
      I037:'\uFF1A',
      I038:'\u6211\u6709\u8BDD\u8BF4',
      I039:'<span class="reply-form-tip"><em>\u70B9\u8D5E\u6210\u529F\uFF01</em>\u518D\u5BF9TA\u8BF4\u70B9\u4EC0\u4E48\u5427~</span>',
      I040:'',
      I041:'\u52A0\u8F7D\u4E2D\uFF0C\u8BF7\u7A0D\u5019...',
      I042:'\u8BC4\u8BBA\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u5019\u518D\u8BD5',
      I043:'\u4E3E\u62A5',
      I100:'\u60A8\u5C1A\u672A\u53D1\u8868\u4EFB\u4F55\u8BC4\u8BBA\u54E6\u3002\u770B\u770B\u7F51\u53CB\u4EEC\u7684 <a href="http://news.sina.com.cn/hotnews/" target="_blank">\u70ED\u8BC4\u65B0\u95FB</a> \u4E2D\u6709\u6CA1\u6709\u4F60\u611F\u5174\u8DA3\u7684\u5427~',
      I101:'\u8FD8\u6CA1\u4EBA\u56DE\u590D\u60A8\u7684\u8BC4\u8BBA\u54E6\u3002\u7EE7\u7EED\u52AA\u529B\uFF0C\u591A\u591A\u53D1\u8868\u8BC4\u8BBA\u548C\u5927\u5BB6\u4E00\u8D77\u4E92\u52A8\u5427~'
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
/**
 * @file \u767B\u5F55\u76F8\u5173
 * @author Daichang <daichang@staff.sina.com.cn>
 */
(function(exports,undefined) {
	/*1.\u6E32\u67D3\u7528\u6237\u540D\u7684\u65B9\u6CD5
	2.\u767B\u5F55\uFF0C\u9000\u51FA\u8981\u4FEE\u6539\u8BC4\u8BBA\u4E2D\u6240\u6709\u663E\u793A\u7528\u6237\u540D\u7684\u5730\u65B9
	3.\u767B\u5F55\u6210\u529F\uFF0C\u9000\u51FA\u6210\u529F\u7684\u56DE\u8C03\uFF08\u4F9B\u4F7F\u7528\u8005\u4F7F\u7528\uFF09
	4.\u663E\u793A\u767B\u5F55\u6210\u529F\u90E8\u5206\uFF08\u5982\u7528\u6237\u540D\uFF09\uFF0C\u663E\u793A\u9000\u51FA\u6210\u529F\u90E8\u5206\uFF08\u5982\u767B\u5F55\u6309\u94AE\uFF09*/
	var $ = exports.___mysInacMNT___;
	// \u767B\u5F55\uFF0C\u767B\u5F55\u5FAE\u535A\u4E8B\u4EF6, \u767B\u5F55\u51FA\u9519\u4E8B\u4EF6, \u9000\u51FA\u4E8B\u4EF6
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
		 * @description \u767B\u5F55\u76F8\u5173
		 * @class
		 * @static
		 */
		var Login = new $.Clz();

		var addBodyClz = function(type,keep){
			// type login weibo_login logout
			var types = ['login','weibo_login','logout','weibo_login_security'];
			var clzPrefix = 'mysInacMNT_';
			// \u662F\u5426\u4FDD\u7559\u5176\u5B83\u7C7B
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
		// \u662F\u5426\u5B9E\u540D\u8BA4\u8BC1\u7528\u6237\uFF0C\u4E0D\u662F\u7684\u8BDD\uFF0C\u5173\u95ED\u5206\u4EAB\u529F\u80FD
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
				// \u8BBE\u7F6E\u9009\u9879
				self._setOpt(opt);
				self._setLogin();
			},
			/**
			 * \u8BBE\u7F6E\u9009\u9879
			 * @member _setOpt
			 * @private
			 * @param {Object} opt
			 * @param {Function} opt.loginSuccess \u767B\u5F55\u6210\u529F\u56DE\u8C03
			 * @param {Function} opt.logoutSuccess \u9000\u51FA\u6210\u529F\u56DE\u8C03
			 * @param {Function} opt.error \u767B\u5F55\u6216\u9000\u51FA\u9519\u8BEF\u56DE\u8C03
			 */
			_setOpt: function(opt) {
				this.set('opt', $.extend({
					// \u52A0\u8F7D\u5B8C\u6210\u540E
					loginSuccess: function() {},
					logoutSuccess: function() {},
					// \u8D85\u65F6\u5904\u7406
					error: function(msg) {}
				}, opt, true));
			},
			/**
			 * \u8BBE\u7F6E\u767B\u5F55\u9009\u9879
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
			 * \u9000\u51FA\u6210\u529F\u540E
			 * @member _setOpt
			 * @private
			 */
			lOutSuccess: function() {
				var self = this;
				var opt = self.get('opt');
				// \u9000\u51FA\u6210\u529F
				$.custEvent.fire($, 'my_ce_logout');
				opt.logoutSuccess();
				addBodyClz('logout');
			},
			/**
			 * \u767B\u5F55\u6210\u529F\u540E
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
						// \u68C0\u67E5\u662F\u5426\u662F\u5FAE\u535A\u7684\u5B9E\u540D\u9A8C\u8BC1\u7528\u6237\uFF0C\u975E\u5B9E\u540D\u9A8C\u8BC1\u7528\u6237\u4E0D\u663E\u793A\u201C\u5206\u4EAB\u5230\u5FAE\u535A\u201D\uFF0C\u201C\u5206\u4EAB\u201D\u4E24\u4E2A\u529F\u80FD
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
			 * \u767B\u5F55\u51FA\u9519\u540E
			 * @member _setOpt
			 * @private
			 */
			lInError: function(loginStatus) {
				var self = this;
				var opt = self.get('opt');
				//4049 \u9A8C\u8BC1\u7801
				// {result: false, errno: "5024", reason: "\u4E3A\u4E86\u60A8\u7684\u5E10\u53F7\u5B89\u5168\uFF0C\u8BF7\u586B\u5199\u5FAE\u76FE\u52A8\u6001\u7801"}
				// \u9700\u8981\u9A8C\u8BC1\u7684\u8DF3\u8F6C
				// 4038 \u767B\u5F55\u5C1D\u8BD5\u6B21\u6570\u8FC7\u4E8E\u9891\u7E41\uFF0C\u8BF7\u7A0D\u540E\u518D\u767B\u5F55
				var validated = !$.inArray(loginStatus.errno, ['5024', '5025', '4049', '2070']);
				// \u767B\u5F55\u5931\u8D25
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
			 * \u662F\u5426\u5DF2\u7ECF\u767B\u5F55
			 * @member
			 * @return {Boolean} \u662F\u5426\u5DF2\u7ECF\u767B\u5F55
			 */
			isLogin: function() {
				return LoginLayer.isLogin();
			},
			/**
			 * \u83B7\u53D6\u5FAE\u535A\u4FE1\u606F
			 * @member getWeiboInfo
			 * @param  {Function} succ \u6210\u529F\u56DE\u8C03
			 * @param  {Function} fail \u5931\u8D25\u56DE\u8C03
			 * @return {[type]}      [description]
			 */
			getWeiboInfo: function(succ, fail) {
				var co = exports.sinaSSOController.getSinaCookie();
				var url = 'http://api.sina.com.cn/weibo/2/users/show.json?uid=' + co.uid + '&source=2835469272';
				var TIMEOUT_NAME = $.getGuid();
				$.timeoutHandle(TIMEOUT_NAME, function(handle) {
					handle.timeout(TIMEOUT_NAME, function() {
						// \u8D85\u65F6\u5904\u7406
						fail();
					});
					$.jsonp(url, function(msg) {
						// \u6570\u636E\u5904\u7406
						succ(msg);
						// \u6210\u529F\u901A\u77E5
						handle.success(TIMEOUT_NAME);
					});
				}, 3e3);
			},
			/**
			 * \u9000\u51FA\u767B\u5F55
			 * @member
			 */
			lOut: function() {
				LoginLayer.logout();
			},
			/**
			 * \u767B\u5F55
			 * @member
			 * @param  {String} user      \u7528\u6237\u540D
			 * @param  {String} psd       \u5BC6\u7801
			 * @param  {Number} savestate \u4FDD\u6301\u767B\u5F55\u72B6\u6001\u5929\u6570
			 */
			lIn: function(user, psd, savestate) {
				// // savestate \u4FDD\u6301\u767B\u5F55\u72B6\u6001\u7684\u5929\u6570\uFF0C\u53EF\u9009\uFF1B \u9ED8\u8BA4\u4E3A\u4E0D\u4FDD\u6301\u767B\u5F55\u72B6\u6001\uFF0C\u6700\u957F\u4E3A30\u5929\uFF1B
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
			 * \u83B7\u53D6\u767B\u5F55\u94FE\u63A5\u6216\u767B\u5F55\u540D
			 * @member
			 * @return {String||HTMLString} \u8FD4\u56DE\u7528\u6237\u540D\u7684HTML\u5B57\u7B26\u4E32\u6216\u5B57\u7B26\u4E32
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
			 * \u83B7\u53D6\u767B\u5F55\u5934\u50CF\u94FE\u63A5
			 * @member
			 * @return {String||HTMLString} \u8FD4\u56DE\u7528\u6237\u540D\u7684HTML\u5B57\u7B26\u4E32\u6216\u5B57\u7B26\u4E32
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
/**
 * @file \u5DE5\u5177\u5E94\u7528
 * @author Daichang <daichang@staff.sina.com.cn>
 */
(function(exports,undefined) {
	var $ = exports.___mysInacMNT___;
	var doc = $.doc;
	$.register('app', function() {
		/**
		 * @name mysInacMNT.app
		 * @description \u5DE5\u5177\u5E94\u7528
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
		 * @description \u8BC4\u8BBA\u6846\u6587\u5B57\u5904\u7406\u5DE5\u5177\u96C6
		 * @module app
		 * @submodule textareaUtils
		 */
		// \u8BC4\u8BBA\u6846\u6587\u5B57\u5904\u7406
		app.textareaUtils = (function() {
			var T = {}, ds = doc.selection;
			/**
			 * \u83B7\u53D6\u6307\u5B9ATextarea\u7684\u5149\u6807\u4F4D\u7F6E
			 * @param {HTMLElement} oElement \u5FC5\u9009\u53C2\u6570\uFF0CTextarea\u5BF9\u50CF
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
			 * \u9009\u62E9\u6307\u5B9A\u6709\u5F00\u59CB\u548C\u7ED3\u675F\u4F4D\u7F6E\u7684\u6587\u672C
			 * @param {HTMLElement} oElement \u5FC5\u9009\u53C2\u6570\uFF0CTextarea\u5BF9\u50CF
			 * @param {Number}      iStart   \u5FC5\u9009\u53C2\u6570, \u8D77\u59CB\u4F4D\u7F6E
			 * @param {Number}      iEnd     \u5FC5\u9009\u53C2\u6570\uFF0C\u7ED3\u675F\u4F4D\u7F6E
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
			 * \u5728\u8D77\u59CB\u4F4D\u7F6E\u63D2\u5165\u6216\u66FF\u6362\u6587\u672C
			 * @param {HTMLElement} oElement    \u5FC5\u9009\u53C2\u6570\uFF0CTextarea\u5BF9\u50CF
			 * @param {String}      sInsertText \u5FC5\u9009\u53C2\u6570\uFF0C\u63D2\u5165\u7684\u6587\u672C
			 * @param {Number}      iStart      \u5FC5\u9009\u53C2\u6570\uFF0C\u63D2\u5165\u4F4D\u7F6E
			 * @param {Number}      iLength     \u975E\u5FC5\u9009\u53C2\u6570\uFF0C\u66FF\u6362\u957F\u5EA6
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
			 * @param {object} \u6587\u672C\u5BF9\u8C61
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
			 * @param {object} \u6587\u672C\u5BF9\u8C61
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
			 * @param {object} \u6587\u672C\u5BF9\u8C61
			 * @param {int} pars.rcs Range cur start
			 * @param {int} pars.rccl  Range cur cover length
			 * \u7528\u6CD5
			 * setCursor(obj) cursor\u5728\u6587\u672C\u6700\u540E
			 * setCursor(obj,5)\u7B2C\u4E94\u4E2A\u6587\u5B57\u7684\u540E\u9762
			 * setCursor(obj,5,2)\u9009\u4E2D\u7B2C\u4E94\u4E2A\u4E4B\u540E2\u4E2A\u6587\u672C
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
			 * @param {object} \u6587\u672C\u5BF9\u8C61
			 * @param {Json} \u63D2\u5165\u6587\u672C
			 * @param {Json} pars \u6269\u5C55json\u53C2\u6570
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
			//\u83B7\u53D6\u5143\u7D20
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
				//textarea\u6216input\u5219\u53D6value\uFF0C\u5176\u5B83\u60C5\u51B5\u53D6innerHTML
				var html = /^(textarea|input)$/i.test(str.nodeName) ? str.value : str.innerHTML;
				return tplEngine(html, data);
			} else {
				//\u662F\u6A21\u677F\u5B57\u7B26\u4E32\uFF0C\u5219\u751F\u6210\u4E00\u4E2A\u51FD\u6570
				//\u5982\u679C\u76F4\u63A5\u4F20\u5165\u5B57\u7B26\u4E32\u4F5C\u4E3A\u6A21\u677F\uFF0C\u5219\u53EF\u80FD\u53D8\u5316\u8FC7\u591A\uFF0C\u56E0\u6B64\u4E0D\u8003\u8651\u7F13\u5B58
				return tplEngine(str, data);
			}
		};
		// \u6A21\u62DFcheckbox
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
		// \u81EA\u52A8\u589E\u9AD8textarea
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
					// clone\u5BB9\u5668class\u524D\u7F00
					clzPrefix:'autogrow-textarea-',
					// \u6700\u5C0F\u9AD8\u5EA6\uFF0C\u9ED8\u8BA4\u4E3Atextarea\u7684\u521D\u59CB\u9AD8\u5EA6
					minHeight:'auto',
					// \u6700\u5927\u9AD8\u5EA6\uFF0C\u9ED8\u8BA4\u4E3A\u65E0\u9650
					maxHeight:Infinity,
					// clone\u7684\u7236\u5BB9\u5668
					context:textarea.parentNode,
					// \u624B\u52A8\u8BBE\u7F6Eclone\u6837\u5F0F\uFF0C\u9ED8\u8BA4\u91C7\u7528textarea\u7684\u6837\u5F0F
					styles:{},
					// \u5B9E\u65F6\u68C0\u6D4Btextarea\u7684\u6837\u5F0F\uFF0C\u5E76\u4E14\u540C\u6B65\u5230\u9690\u85CF\u7684div\u4E2D
					realTime:true,
					// \u68C0\u6D4B\u901F\u5EA6\uFF08\u6BEB\u79D2\uFF09
					speed:200
				};
				config = $.extend(defaults,config);
				if(config.minHeight === 'auto'){
					// \u5982\u679C\u6CA1\u8BBE\u7F6E\u6700\u5C0F\u9AD8\u5EA6\uFF0C\u5219\u53D6\u52A0\u8F7D\u8FDB\u6765\u65F6\u7684\u9AD8\u5EA6\u4E3A\u6700\u5C0F\u9AD8\u5EA6
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
						// \u6BCF\u6B21\u90FD\u68C0\u67E5textarea\u7684\u6837\u5F0F\u5E76\u540C\u6B65
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
		// \u83B7\u53D6\u53EF\u89C6\u533A\u9AD8\u5EA6
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
					// \u8D85\u65F6\u5904\u7406
					if (typeof timeoutCb == 'function') {
						timeoutCb();
					}
				});
				window[cbName] = function(m) {
					if (typeof m == 'string') {
						// firefox \u4E0B \u63A5\u53E3\u8FD4\u56DE\u6570\u636E\u4E0D\u5BF9\uFF0C\u6682\u65F6\u6CE8\u91CA\uFF0C\u4E0Deval
						m = eval('(' + m + ')');
					}
					// \u6570\u636E\u5904\u7406
					if (typeof cb == 'function') {
						cb(m);
					}
					// \u6210\u529F\u901A\u77E5
					handle.success(TIMEOUT_NAME);
				};
				// iframe===1\u65F6\u4E0D\u518D\u533A\u5206firefox
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
/**
 * @file \u8BC4\u8BBA\u76F8\u5173
 * @author Daichang <daichang@staff.sina.com.cn>
 */
(function(exports,undefined) {
	// \u5411\u5916\u66B4\u9732\u53EF\u76F4\u63A5\u4F7F\u7528\u7684api
	var $ = exports.___mysInacMNT___;
	var doc = $.doc;
	var uaTrack = $.app.track;
	var UNDEFINED = $.C.U;
	var app = $.app;
	var getMsg = $.msg.get;
	var appTemplate = $.app.template;
	if (!$.cssSupports('borderRadius')) {
		var docEle = document.documentElement;
		$.addClass(docEle,'mysInacMNT-no-border-radius');
	}
	var stripHTML = function(str) {
		var reTag = /<(?:.|\s)*?>/g;
		return str.replace(reTag, '');
	};
	var getSudatType = function(type){
		if(type==='cmnt'){
			return 'mycomment_';
		}else{
			return 'replymy_';
		}
	};
	var getSudaStr = function(value,prefix){
		prefix = prefix||'';
		return ' suda-uatrack="key=index_mycenter&value='+ prefix + value +'" ';
	};
	$.register('cmnt', function() {
		/**
		 * @name mysInacMNT.cmnt
		 * @description \u8BC4\u8BBA\u76F8\u5173
		 * @module cmnt
		 */
		var cmnt = {};
		/**
		 * @name mysInacMNT.cmnt.config
		 * @description \u8BBE\u7F6E,\u5168\u5C40\u8BBE\u7F6E
		 * @namespace
		 */
		cmnt.config = {
			encoding:'gbk',
			comment:{

			}
		};
		// \u6570\u636E\u5B58\u50A8\u5668
		cmnt.data = (function() {
			// dialogList
			var all = {};
			var _isArray = $.isArray;
			var _extend = $.extend;
			return {
				set: function(newsid, type, data) {
					// \u8BC4\u8BBA\u5217\u8868\u662F\u6570\u7EC4\u7684\u8BDD\uFF0C\u5F97\u5148\u6309mid\u8F6C\u6362\u6210\u5BF9\u8C61\u5408\u5E76\uFF0C\u6709\u90E8\u5206\u8BC4\u8BBA\u662F\u6CA1\u6709\u65B0\u95FB\u6807\u9898(newstitle)\u7684;\u6709\u90E8\u5206\u65B0\u95FB\u4E5F\u662F\u6570\u7EC4
					if (typeof all[newsid] == UNDEFINED) {
						all[newsid] = {};
					}
					if (typeof all[newsid][type] == UNDEFINED) {
						all[newsid][type] = {};
					}
					var allType = all[newsid][type];
					var item, id;
					if (_isArray(data)) {
						for (var i = 0, len = data.length; i < len; i++) {
							item = data[i];
							// \u6CE8\u610F\u8BC4\u8BBA\u5217\u8868\u91CC\u9762\u7684item\u4E5F\u6709newsid
							if (item.mid) {
								id = item.mid;
							} else if (item.newsid) {
								id = item.newsid;
							}
							allType[id] = item;
						}
					} else {
						allType = _extend(allType, data);
					}
					all[newsid][type] = allType;

				},
				get: function(newsid, type, id) {
					if (!newsid) {
						return all;
					}
					if (!type) {
						return all[newsid] || all;
					}
					// \u53EA\u8FD4\u56DE\u67D0\u4E00\u7C7B\u578B\u6570\u636E
					if (!id) {
						return all[newsid][type] || all[type] || all;
					}
					// \u6309id\u8FD4\u56DE\u67D0\u4E00\u7C7B\u578B\u7684\u4E00\u7EC4\u6570\u636E
					return all[newsid][type][id];
				}
			};
		})();
		/**
		 * @name face
		 * @description \u8868\u60C5\u76F8\u5173
		 * @module app
		 * @submodule face
		 */
		cmnt.face = (function() {
			var commonFacesBase = 'http://www.sinaimg.cn/dy/deco/2012/1217/face/';
			var allFacesBase = 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/';
			var commonFaces = {
				'\u54C8\u54C8': 'haha',
				'\u5077\u7B11': 'tx',
				'\u6CEA': 'lei',
				'\u563B\u563B': 'xixi',
				'\u7231\u4F60': 'aini',
				'\u6316\u9F3B\u5C4E': 'wbs',
				'\u5FC3': 'xin'
			};
			var allFaces = {
				'\u56FD\u65D7': 'dc/flag_thumb',
				'\u8D70\u4F60': 'ed/zouni_thumb',
				'\u7B11\u54C8\u54C8': '32/lxhwahaha_thumb',
				'\u6C5F\u5357style': '67/gangnamstyle_thumb',
				'\u5410\u8840': '8c/lxhtuxue_thumb',
				'\u597D\u6FC0\u52A8': 'ae/lxhjidong_thumb',
				'lt\u5207\u514B\u95F9': '73/ltqiekenao_thumb',
				'moc\u8F6C\u53D1': 'cb/moczhuanfa_thumb',
				'ala\u8E66': 'b7/alabeng_thumb',
				'gst\u8010\u4F60': '1b/gstnaini_thumb',
				'xb\u538B\u529B': 'e0/xbyali_thumb',
				'din\u63A8\u649E': 'dd/dintuizhuang_thumb',
				'\u8349\u6CE5\u9A6C': '7a/shenshou_thumb',
				'\u795E\u9A6C': '60/horse2_thumb',
				'\u6D6E\u4E91': 'bc/fuyun_thumb',
				'\u7ED9\u529B': 'c9/geili_thumb',
				'\u56F4\u89C2': 'f2/wg_thumb',
				'\u5A01\u6B66': '70/vw_thumb',
				'\u718A\u732B': '6e/panda_thumb',
				'\u5154\u5B50': '81/rabbit_thumb',
				'\u5965\u7279\u66FC': 'bc/otm_thumb',
				'\u56E7': '15/j_thumb',
				'\u4E92\u7C89': '89/hufen_thumb',
				'\u793C\u7269': 'c4/liwu_thumb',
				'\u5475\u5475': 'ac/smilea_thumb',
				'\u563B\u563B': '0b/tootha_thumb',
				'\u54C8\u54C8': '6a/laugh',
				'\u53EF\u7231': '14/tza_thumb',
				'\u53EF\u601C': 'af/kl_thumb',
				'\u6316\u9F3B\u5C4E': 'a0/kbsa_thumb',
				'\u5403\u60CA': 'f4/cj_thumb',
				'\u5BB3\u7F9E': '6e/shamea_thumb',
				'\u6324\u773C': 'c3/zy_thumb',
				'\u95ED\u5634': '29/bz_thumb',
				'\u9119\u89C6': '71/bs2_thumb',
				'\u7231\u4F60': '6d/lovea_thumb',
				'\u6CEA': '9d/sada_thumb',
				'\u5077\u7B11': '19/heia_thumb',
				'\u4EB2\u4EB2': '8f/qq_thumb',
				'\u751F\u75C5': 'b6/sb_thumb',
				'\u592A\u5F00\u5FC3': '58/mb_thumb',
				'\u61D2\u5F97\u7406\u4F60': '17/ldln_thumb',
				'\u53F3\u54FC\u54FC': '98/yhh_thumb',
				'\u5DE6\u54FC\u54FC': '6d/zhh_thumb',
				'\u5618': 'a6/x_thumb',
				'\u8870': 'af/cry',
				'\u59D4\u5C48': '73/wq_thumb',
				'\u5410': '9e/t_thumb',
				'\u6253\u54C8\u6B20': 'f3/k_thumb',
				'\u62B1\u62B1': '27/bba_thumb',
				'\u6012': '7c/angrya_thumb',
				'\u7591\u95EE': '5c/yw_thumb',
				'\u998B\u5634': 'a5/cza_thumb',
				'\u62DC\u62DC': '70/88_thumb',
				'\u601D\u8003': 'e9/sk_thumb',
				'\u6C57': '24/sweata_thumb',
				'\u56F0': '7f/sleepya_thumb',
				'\u7761\u89C9': '6b/sleepa_thumb',
				'\u94B1': '90/money_thumb',
				'\u5931\u671B': '0c/sw_thumb',
				'\u9177': '40/cool_thumb',
				'\u82B1\u5FC3': '8c/hsa_thumb',
				'\u54FC': '49/hatea_thumb',
				'\u9F13\u638C': '36/gza_thumb',
				'\u6655': 'd9/dizzya_thumb',
				'\u60B2\u4F24': '1a/bs_thumb',
				'\u6293\u72C2': '62/crazya_thumb',
				'\u9ED1\u7EBF': '91/h_thumb',
				'\u9634\u9669': '6d/yx_thumb',
				'\u6012\u9A82': '89/nm_thumb',
				'\u5FC3': '40/hearta_thumb',
				'\u4F24\u5FC3': 'ea/unheart',
				'\u732A\u5934': '58/pig',
				'ok': 'd6/ok_thumb',
				'\u8036': 'd9/ye_thumb',
				'good': 'd8/good_thumb',
				'\u4E0D\u8981': 'c7/no_thumb',
				'\u8D5E': 'd0/z2_thumb',
				'\u6765': '40/come_thumb',
				'\u5F31': 'd8/sad_thumb',
				'\u8721\u70DB': '91/lazu_thumb',
				'\u86CB\u7CD5': '6a/cake',
				'\u949F': 'd3/clock_thumb',
				'\u8BDD\u7B52': '1b/m_thumb'
			};
			var F = {
				iniTarget: null,
				srcInput: null,
				iconLayer: null,
				iconText: '',
				isShow: false,
				callback: function() {}
			};

			function hideFace(e) {
				if (!F.isShow) {
					return;
				}
				if (!e) {
					return;
				}
				var t = e.target || e.srcElement;
				if (t !== F.iniTarget && !$.contains(F.iconLayer, t)) {
					F.hide();
				}
			}

			function renderFace(wrap, layerWidth, faces, imgURI) {
				layerWidth = layerWidth || '360px';
				faces = faces || {};
				var list = [];
				for (var i in faces) {
					list.push('<li><a href="javascript:void(0)" action-type="face-insert"' +
						'action-data="text=[' + i + ']" title="' + i + '">' +
						'<img src="' + imgURI + faces[i] + '.gif" alt="' + i + '" /></a></li>');
				}
				var icons = [];
				icons.push('<table class="my-sina-comment-layer">');
				icons.push('<tbody><tr> <td class="a-l-top-l"></td> <td class="a-l-top-c"></td> <td class="a-l-top-r"></td> </tr> <tr> <td class="a-l-m-l"></td> <td class="a-l-m-c"><div class="a-l-box">');
				icons.push('<div class="a-l-box-con" style="' + layerWidth + '">');
				icons.push('<div class="my-sina-comment-face-list clearfix">');
				icons.push('<div class="a-l-arrow"></div>');
				icons.push('<div class="a-l-close-wrap">');
				icons.push('<a action-type="face-close" class="a-l-close" href="javascript:;" title="\u5173\u95ED"></a>');
				icons.push('</div>');
				icons.push('<div class="face-list-items">');
				icons.push('<ul>');
				icons.push(list.join(''));
				icons.push('</ul>');
				icons.push('</div>');
				icons.push('</div>');
				icons.push('</div>');
				icons.push('</div></td><td class="a-l-m-r"></td></tr><tr><td class="a-l-btm-l"></td> <td class="a-l-btm-c"></td><td class="a-l-btm-r"></td></tr></tbody></table>');
				var box = $.create('div');
				box.innerHTML = icons.join('');
				box.style.display = 'none'; //\u907F\u514DIE\u4E0B\u8868\u60C5\u56FE\u7247\u5B9A\u4F4D\u9519\u8BEF
				(wrap || document.body).appendChild(box);
				return box;
			}
			/**
			 * \u5728\u5149\u6807\u4F4D\u7F6E\u63D2\u5165\u6587\u672C
			 * @param{Object}oInput
			 * @param{String}text
			 * */
			function insertText(oInput, text) {
				if ($.ua.isIE) {
					var range = oInput.createTextRange();
					range.collapse(true);
					if (oInput.caretPos) {
						var caretPos = oInput.caretPos;
						caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == ' ' ? text + ' ' : text;
						range.moveStart('character', oInput.value.indexOf(text) + 1);
						range.moveEnd('character', text.length - 2);
					} else {
						var sel = doc.selection.createRange();
						doc.selection.empty();
						sel.text = text;
					}
				} else if (oInput.setSelectionRange) {
					var start = oInput.selectionStart;
					var end = oInput.selectionEnd;
					var str1 = oInput.value.substring(0, start);
					var str2 = oInput.value.substring(end);
					var v = str1 + text,
						len = v.length;
					oInput.value = v + str2;
					oInput.setSelectionRange(len, len);
				} else {
					oInput.value += text;
				}
			}
			/**
			 * \u663E\u793A\u8868\u60C5\u5C42
			 * @param{HTML Element}target \u5B9A\u4F4D\u76F8\u5BF9\u5143\u7D20\uFF08\u5982\u67D0\u6309\u94AE\uFF09
			 * @param{HTML Element}input \u8F93\u5165\u76EE\u6807(\u7528\u4E8E\u8BBE\u7F6E\u8FD4\u56DE\u8868\u60C5\u503C)
			 * @param{HTML Element}wrap \u8868\u60C5\u5C42\u7684\u7236\u7EA7\uFF0C\u9ED8\u8BA4\u4E3Abody
			 *
			 * @param{Number}dX \u53EF\u9009\u53C2\u6570 \u5FAE\u8C03left\u503C
			 * @param{Number}dY \u53EF\u9009\u53C2\u6570 \u5FAE\u8C03top\u503C
			 * @param{String}layerWidth \u53EF\u9009\u53C2\u6570 \u8868\u60C5\u5C42\u5BBD\u5EA6\u503C\uFF08\u9ED8\u8BA4360px\uFF09
			 * */
			F.show = function(target, input, wrap, dX, dY, layerWidth) {
				var iconLayer = F.iconLayer;
				var position;
				if (iconLayer) {
					hideFace();
				}
				// \u6CA1\u6709\u8868\u60C5\u5C42\u6216\u8005\u7236\u7EA7\u4E0D\u540C\u65F6\u8981\u6E32\u67D3\u8868\u60C5\u5C42
				F.wrap = F.wrap || null;
				if (!iconLayer || F.wrap != wrap) {
					iconLayer = renderFace(wrap, layerWidth, allFaces, allFacesBase);
					F.wrap = wrap;
				}
				if (wrap && wrap != document.body) {
					position = {
						top:0,
						left:0
					};
				} else {
					position = $.getPosition(target);
					position.top += target.offsetHeight;
				}

				if ($.ua.isIE) {
					position.left += -10;
				}
				if (!isNaN(dX)) {
					position.left += dX;
				}
				if (!isNaN(dY)) {
					position.top += +dY;
				}
				//add "zoom:1" hack to enable IE haslayout,\u900F\u660E\u8FB9\u6846\u6548\u679C
				iconLayer.style.cssText = 'left:' + position.left + 'px;top:' + position.top + 'px;' +
					'position:absolute;z-index:1700;display:"";zoom:1;';

				F.iconLayer = iconLayer;
				F.iniTarget = target;
				F.srcInput = input;
				F.iconText = null;
				F.isShow = true;
				$.addClass(target, 'trigger-active');
				$.addEvent(document.body, 'click', hideFace, false);
				return F.iconLayer;
			};

			/**
			 * \u9690\u85CF\u8868\u60C5
			 * */
			F.hide = function() {
				var iconLayer = F.iconLayer;
				iconLayer && (iconLayer.style.display = 'none');
				if (F.iniTarget) {
					$.removeClass(F.iniTarget, 'trigger-active');
				}
				$.removeEvent(document.body, 'click', hideFace);
				F.isShow = false;
				return iconLayer;
			};

			/**
			 * \u83B7\u5F97\u9009\u4E2D\u7684\u8868\u60C5\u7B26\u53F7(\u8F6C\u8BD1\u6587\u5B57)
			 * */
			F.getFace = function() {
				return F.iconText;
			};

			F.insert = function(txt, cb) {
				var srcInput = F.srcInput;
				if (txt) {
					F.hide();
					if (srcInput) {
						//\u5728\u5149\u6807\u4F4D\u7F6E\u63D2\u5165\u8868\u60C5\u6587\u672C
						srcInput.focus();
						setTimeout(
							function() {
								var range = srcInput.getAttribute('range');
								if (range == null) { //\u8BC4\u8BBA\u8868\u60C5\u5904\u7406
									insertText(srcInput, txt);
								} else { //\u53D1\u5E03\u5668\u8868\u60C5\u5904\u7406
									var pos = range.split('&');
									$.app.textareaUtils.unCoverInsertText(srcInput, txt, {
										'rcs': pos[0],
										'rccl': pos[1]
									});
									//reset
									var newPos = $.app.textareaUtils.getCursorPos(srcInput, txt);

									srcInput.setAttribute('range', newPos + '&0');
								}
								if (cb) {
									cb();
								}
							}, 10
						);
					}
				}
			};
			F.set = function(type, base, faces) {
				if (type == 'all') {
					allFacesBase = base;
					allFaces = faces;
				} else {
					commonFacesBase = base;
					commonFaces = faces;
				}

			};
			F.get = function(type) {
				if (type == 'all') {
					return {
						faces: allFaces,
						base: allFacesBase
					};
				} else {
					return {
						faces: commonFaces,
						base: commonFacesBase
					};
				}
			};
			F.filter = (function() {
				var regExp = /\[(.*?)\]/g;
				return function(text) {
					text = text || '';
					text = text.replace(regExp, function($0, $1) {
						var imgUrl = allFaces[$1];
						if (imgUrl) {
							imgUrl = allFacesBase + imgUrl + '.gif';
						}
						return !imgUrl ? $1 : '<img class="my-sina-comment-txt-face" title="' + $1 + '" alt="' + $1 + '" src="' + imgUrl + '" />';
					});
					return text;
				};
			})();
			return F;
		})();
		// \u8BC4\u8BBA\u63D0\u793A
		cmnt.commentTip = (function() {
			var Tip = {};
			Tip.timeout = null;
			Tip.animate = null;
			var getTip = function() {
				var div = $.create('div');
				div.className = 'my-sina-comment-tip';
				div.style.visibility = 'hidden';
				div.style.position = 'absolute';
				$.byTag('body')[0].appendChild(div);
				return div;
			};
			var hide = function(time) {
				if (!Tip.dom) {
					Tip.dom = getTip();
				}
				clearTimeout(Tip.timeout);
				if (Tip.animate) {
					Tip.animate.pause();
				}
				time = time||0;
				if(!time){
					$.setStyle(Tip.dom, {
						left: '-9999px',
						opacity: 0
						// display:'none'
					});
				}else{
					$.animate(Tip.dom, {
						opacity: 0
					}, time, 'Tween.Quad.easeOut', {
						start: function(el) {
							// el.innerHTML = 'start!';
						},
						complete: function(el) {
							$.setStyle(Tip.dom, {
								left: '-9999px',
								opacity: 0
								// display:'none'
							});
						}
					});
				}

			};
			var getWH = function(ele, w, h) {
				var width = 0;
				var height = 0;
				if(ele){
					width = $.getStyle(ele, 'width');
					height = $.getStyle(ele, 'height');
				}
				width = parseFloat(width);
				width = isNaN(width) ? w : width;
				height = parseFloat(height);
				height = isNaN(height) ? h : height;
				return {
					width: width,
					height: height
				};
			};
			var show = function(ele, type, txt, closeTime) {
				if (!Tip.dom) {
					Tip.dom = getTip();
				}
				clearTimeout(Tip.timeout);
				if (Tip.animate) {
					Tip.animate.pause();
				}
				Tip.dom.innerHTML = '<div class="inner ' + type + '"><i></i><div class="txt">' + txt + '</div> </div>';
				// var offset = $.getXY(ele);
				var offset = $.getPosition(ele);
				var tipWH = getWH(Tip.dom, 100, 30);
				var eleWH = getWH(ele, 100, 40);
				// \u6CE8\u610F\u5BBD\u9AD8\u9700\u8981\u52A0\u4E0Apadding
				$.setStyle(Tip.dom, {
					top: (offset.top + eleWH.height / 2+6 - tipWH.height / 2) + 'px',
					left: (offset.left + eleWH.width / 2+6 - tipWH.width / 2) + 'px',
					// left: '50%',
					// marginLeft: -tipWH.width / 2 + 'px',
					opacity: 0,
					visibility: 'visible'
				});
				closeTime = closeTime || 0;
				if (closeTime) {
					Tip.timeout = setTimeout(function() {
						Tip.hide(200);
					}, closeTime);
				}
				/*elemId, cssObj, time, animType, funObj*/
				$.animate(Tip.dom, {
					opacity: 1
				}, 200, 'Tween.Quad.easeIn', {
					start: function(el) {
						// el.innerHTML = 'start!';
					},
					complete: function(el) {
						// el.innerHTML = 'Completed!';
					}
				});
			};
			Tip.show = show;
			Tip.hide = hide;
			return Tip;
		})();
		// \u5C55\u5F00\u6536\u8D77
		cmnt.truncate = (function() {
			var trailing_whitespace = false;

			var htmlEntities = function(str) {
				return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
			};

			var recursivelyTruncate = function(node, maxLength) {
				return (node.nodeType == 3) ? truncateText(node, maxLength) : truncateNode(node, maxLength);
			};

			var truncateNode = function(node, maxLength) {
				var new_node = node.cloneNode(true);
				new_node.setAttribute('comment-type', '');
				if (new_node.innerHTML) {
					new_node.innerHTML = '';
				}
				var fragment = document.createDocumentFragment();
				fragment.innerHTML = '';
				var truncatedChild;
				var childNodes = node.childNodes;

				for (var i = 0, len = childNodes.length; i < len; i++) {
					var item = childNodes[i];
					var remaining_length = maxLength - getText(new_node).length;
					if (remaining_length === 0) {
						return new_node;
					}
					truncatedChild = recursivelyTruncate(item, remaining_length);
					if (truncatedChild) {
						if (typeof truncatedChild == 'string') {
							truncatedChild = document.createTextNode(truncatedChild);
						}
						new_node.appendChild(truncatedChild);
					}
				}
				return new_node;
			};

			var truncateText = function(node, maxLength) {
				var text = squeeze(node.data);
				if (trailing_whitespace) {
					text = text.replace(/^ /, '');
				}
				trailing_whitespace = !!text.match(/ $/);
				text = text.slice(0, maxLength);
				return htmlEntities(text);
			};

			var getText = function(e) {
				if (e.innerText) {
					return e.innerText;
				}
				var str = '';
				//\u5982\u679C\u4F20\u5165\u7684\u662F\u5143\u7D20\uFF0C\u83B7\u53D6\u5B83\u7684\u5B50\u5143\u7D20,\u5426\u5219\uFF0C\u5F53\u5B83\u662F\u4E00\u4E2A\u6570\u7EC4
				e = e.childNodes || e;
				for (var i = 0; i < e.length; i++) {
					//\u5982\u679C\u662Ftext\u5C31\u83B7\u53D6\u5B83\u7684\u6587\u672C\uFF0C\u5426\u5219\uFF0C\u904D\u5386\u5B83\u7684\u5B50\u5143\u7D20
					str += e[i].nodeType != 1 ? e[i].nodeValue : getText(e[i].childNodes);
				}
				return str;
			};
			var trim = function(str) {
				return str.replace(/(^[\s\u3000]*)|([\s\u3000]*$)/g, '');
			};
			var appendLnk = function(node, txt, clz, type) {
				var lnk = document.createElement('a');
				lnk.href = 'javascript:;';
				lnk.className = clz;
				lnk.setAttribute('action-type', 'txt-toggle');
				lnk.setAttribute('action-data', 'type=' + type);
				lnk.innerHTML = txt;
				node.appendChild(lnk);
			};

			var squeeze = function(string) {
				return string.replace(/\s+/g, ' ');
			};
			return {
				handle: function(wrap, maxLenth) {
					var contentLength = trim(squeeze(getText(wrap))).length;
					if (contentLength <= maxLenth || wrap.__truncated__) {
						return;
					}
					wrap.__truncated__ = true;
					// \u5B9E\u9645\u6700\u5927\u957F\u5EA6
					var actualMaxLength = maxLenth - 5;
					actualMaxLength = Math.max(actualMaxLength, 0);
					var truncated_node = recursivelyTruncate(wrap, actualMaxLength);
					wrap.style.display = 'none';
					$.insertAfter(truncated_node, wrap);
					appendLnk(wrap, '[\u6536\u8D77]&uarr;', 'txt-less txt-toggle', 'less');
					appendLnk(truncated_node, '[\u5C55\u5F00]&darr;', 'txt-more txt-toggle', 'more');
				},
				toggle: function(trigger, type) {
					var txts = $.byClass('txt', trigger.parentNode.parentNode);
					if (type == 'more') {
						txts[1].style.display = 'none';
						txts[0].style.display = '';
					} else {
						txts[1].style.display = '';
						txts[0].style.display = 'none';
					}

				}
			};
		})();

		// \u9876
		cmnt.vote = function(opt) {
			var api = 'http://comment5.news.sina.com.cn/cmnt/vote';
			var param = $.extend({
				channel: '',
				newsid: '',
				parent: '',
				format: 'js',
				vote: 1,
				callback: function(d) {},
				domain: 'sina.com.cn'
			}, opt, true);
			$.ijax.request(api, {
				//param:param,
				POST: param
			});
		};
		/**
		 * @name voteTip
		 * @description \u6295\u7968\u63D0\u793A
		 * @return {[type]} [description]
		 */
		cmnt.voteTip = (function() {
			var Tip = {};
			Tip.timeout = null;
			Tip.animate = null;
			var getTip = function() {
				var div = $.create('div');
				div.className = 'my-sina-comment-vote-tip';
				div.style.display = 'none';
				div.style.position = 'absolute';
				$.byTag('body')[0].appendChild(div);
				return div;
			};
			var hide = function() {
				if (!Tip.dom) {
					Tip.dom = getTip();
				}
				clearTimeout(Tip.timeout);
				if (Tip.animate) {
					Tip.animate.pause();
				}
				$.animate(Tip.dom, {
					opacity: 0
				}, 200, 'Tween.Quad.easeOut', {
					start: function(el) {
						// el.innerHTML = 'start!';
					},
					complete: function(el) {
						$.setStyle(Tip.dom, {
							left: '-9999px',
							opacity: 0,
							display: 'none'
						});
					}
				});
			};
			var getWH = function(ele, w, h) {
				var width = $.getOuterStyle(ele, 'width');
				var height = $.getOuterStyle(ele, 'height');
				width = parseFloat(width);
				width = isNaN(width) ? w : width;
				height = parseFloat(height);
				height = isNaN(height) ? h : height;
				return {
					width: width,
					height: height
				};
			};
			var show = function(ele, closeTime) {
				if (!Tip.dom) {
					Tip.dom = getTip();
				}
				clearTimeout(Tip.timeout);
				if (Tip.animate) {
					Tip.animate.pause();
				}
				// var offset = $.getXY(ele);

				var offset = $.getPosition(ele);

				var tipWH = getWH(Tip.dom, 100, 30);
				var eleWH = getWH(ele, 100, 40);

				$.setStyle(Tip.dom, {
					top: (offset.top) + 'px',
					left: (offset.left + eleWH.width / 2 - tipWH.width / 2) + 'px',
					// marginLeft:-tipWH.width/2+'px',
					opacity: 0,
					display: 'block'
				});
				closeTime = closeTime || 0;
				if (closeTime) {
					Tip.timeout = setTimeout(function() {
						Tip.hide();
					}, closeTime);
				}
				/*elemId, cssObj, time, animType, funObj*/
				$.animate(Tip.dom, {
					top: (offset.top - 35) + 'px',
					opacity: 1
				}, 200, 'Tween.Quad.easeIn', {
					start: function(el) {
						// el.innerHTML = 'start!';
					},
					complete: function(el) {
						// el.innerHTML = 'Completed!';
					}
				});
			};
			Tip.show = show;
			Tip.hide = hide;
			return Tip;
		})();
		cmnt.comment = function(opt,cb,timeoutCb) {
			// \u8BC4\u8BBA\u9700\u8981\u5BA1\u67E5\u8FC7\u6EE4\uFF0C\u63D0\u4EA4\u540E\u540E\u7AEF\u6CA1\u6709\u56DE\u8C03
			// \u5728\u7EC4\u65B0\u95FB\u91CC\uFF0C\u53EF\u80FD\u9700\u8981\u52A8\u6001\u4FEE\u6539\u8BC4\u8BBA\u7684newsid,share_url,video_url\u53CAimg_url
			var commentConfig = cmnt.config.comment;
			var api = 'http://comment5.news.sina.com.cn/cmnt/submit';
			var encoding = cmnt.config.encoding;

			var param = $.extend({
				channel: '',
				newsid: '',
				parent: '',
				content: '',
				format: 'json',
				ie: encoding,
				oe: encoding,
				ispost: 0,
				share_url: location.href.split('#')[0],
				video_url: '',
				img_url: '',
				iframe:1
			}, opt, true);
			// \u4EE5\u7528\u6237\u8BBE\u7F6E\u7684commentConfig\u4E3A\u51C6,\u5982\uFF1A\u9AD8\u6E05\u56FE\u6BCF\u5207\u6362\u4E00\u5F20\u56FE\u7247\uFF0C\u5F97\u6362\u53E6\u4E00\u4E2Anewsid,img_url\u53CAshare_url\u5F97\u5E26#p=\u7B2C\u51E0\u5F20
			param = $.extend(param, commentConfig);

			$.app.post(api,param,function(m){
				cb(m);
			},function(){
				// \u8D85\u65F6
				timeoutCb();
			});
		};

		// \u65F6\u95F4\u683C\u5F0F\u5316
		cmnt.formateTime = function(nDate, oDate) {
			var monthSrt = getMsg('I022'),
				dayStr = getMsg('I023'),
				todayStr = getMsg('I024'),
				secondStr = getMsg('I025'),
				minStr = getMsg('I026');
			var nYear = nDate.getFullYear(),
				oYear = oDate.getFullYear(),
				nMonth = nDate.getMonth() + 1,
				oMonth = oDate.getMonth() + 1,
				nDay = nDate.getDate(),
				oDay = oDate.getDate(),
				nHour = nDate.getHours(),
				oHour = oDate.getHours();
			oHour < 10 && (oHour = '0' + oHour);
			var oMin = oDate.getMinutes();
			oMin < 10 && (oMin = '0' + oMin);
			var dDate = nDate - oDate;
			dDate = dDate > 0 ? dDate : 0;
			dDate = dDate / 1e3;
			if (nYear != oYear) {
				return oYear + '-' + oMonth + '-' + oDay + ' ' + oHour + ':' + oMin;
			}
			if (nMonth != oMonth || nDay != oDay) {
				return oMonth + monthSrt + oDay + dayStr + oHour + ':' + oMin;
			}
			if (nHour != oHour && dDate > 3600) {
				return todayStr + oHour + ':' + oMin;
			}
			if (dDate < 51) {
				dDate = dDate < 1 ? 1 : dDate;
				return Math.floor((dDate - 1) / 10) + 1 + '0' + secondStr;
			}
			return Math.floor(dDate / 60 + 1) + minStr;
		};
		cmnt.updateTime = (function() {
			var formatTime = cmnt.formateTime,
				cDate = 0,
				d = function(wrap) {
					var dateDom = $.byAttr(wrap, 'comment-type', 'time'),
						tDate = new Date();
					tDate.setTime(tDate.getTime() - cDate);
					var g;
					for (var h = 0; h < dateDom.length; h++) {
						var item = dateDom[h],
							dateStr = item.getAttribute('date');
						if (!/^\s*\d+\s*$/.test(dateStr)) {
							continue;
						}
						var tDate1 = new Date();
						tDate1.setTime(parseInt(dateStr, 10));
						item.innerHTML = formatTime(tDate, tDate1);
						g === undefined && (g = tDate.getTime() - tDate1.getTime() < 6e4);
					}
					return g;
				};
			return function(wrap) {
				var TIME = 1e3;
				var upDateTimer;
				var setUpDateTimer = function(t) {
					clearTimeout(upDateTimer);
					upDateTimer = setTimeout(function() {
						d(wrap) ? setUpDateTimer(TIME) : setUpDateTimer(6e4);
					}, t);
				};
				var g = function() {
					setUpDateTimer(TIME);
				};
				setUpDateTimer(TIME);
				var UT = {
					destroy: function() {
						clearTimeout(upDateTimer);
						UT = wrap = upDateTimer = setUpDateTimer = g = null;
					}
				};
				return UT;
			};
		})();
		cmnt.getTimeStr = (function() {
			var formatTime = cmnt.formateTime;
			return function(time, clz) {
				clz = clz || 'time';
				var formatStr = '\u521A\u521A';
				var timeStr = '';
				if (time) {
					//\u53D1\u5E03\u65F6\u95F4 tDate1,\u5982\u679Ctime\u4E3A\u7A7A
					var tDate1 = new Date();
					time = time.replace(/-/g, '/');
					timeStr = Date.parse(time);
					tDate1.setTime(parseInt(timeStr, 10));
					//\u6B64\u65F6\u65F6\u95F4 tDate
					var tDate = new Date();
					tDate.setTime(tDate.getTime());
					formatStr = formatTime(tDate, tDate1);
				} else {
					timeStr = Date.parse(new Date());
				}
				return '<span class="' + clz + '" comment-type="time" date="' + timeStr + '">' + formatStr + '</span>';
			};
		})();
		/**
		 * @name mysInacMNT.cmnt.tpls
		 * @description \u6A21\u677F\u5B58\u50A8\u5668
		 * @namespace
		 */
		cmnt.tpls = (function() {
			// \u8BC4\u8BBA\u5185\u5BB9\u6A21\u677F comment
			// \u697C\u5C42\u5185\u5BB9\u6A21\u677F
			// \u8BC4\u8BBA\u6846\u6A21\u677F
			// \u56DE\u590D\u6846\u6A21\u677F
			// var divs = '<div';
			// var dive = '</div>';
			// var as = '<a';
			// var ae = '</a>';
			// var spans = '<span';
			// var spane = '</span>';
			// // em\u4E00\u822C\u6CA1\u6709\u5176\u5B83\u6807\u7B7E\u5C5E\u6027
			// var ems = '<em>';
			// var ems2 = '<em';
			// var eme = '</em>';
			/** @private */
			var adata = ' action-data=';
			/** @private */
			var atype = ' action-type=';
			/** @private */
			var clz = ' class=';
			/** @private */
			var ctype = ' comment-type=';
			/** @private */
			var getFillStr = function(str) {
				return '<% this.' + str + ' %>';
			};
			/** @private */
			var all = null;
			var getAll = function(){
				return {
							// formList: '<div class="my-sina-comment-form my-sina-comment-top"' + ctype + '"form"> </div> <div class="my-sina-comment-list"' + ctype + '"list"> </div>',
							list: [
								/*'<div class="latest-tip"><a href="#url" target="_blank">\u60A8\u67095\u6761\u65B0\u6D88\u606F\uFF0C\u70B9\u51FB\u67E5\u770B</a></div>',*/
								'<div' + clz + '"latest-wrap"' + ctype + '"latestWrap">',
								'<div' + clz + '"list"' + ctype + '"latestList"></div>',
								'<div' + clz + '"more"' + ctype + '"more"><a href="javascript:;">'+getMsg('I014')+'</a></div>',
								'<div' + clz + '"latest-loading loading"><a href="javascript:;"></a></div>',
								'</div>'
							].join(''),
							dialogItem: [
								'<!-- \u5934\u50CF start -->',
								'<div' + clz + '"head">' + getFillStr('userFace') + '</div>',
								'<!-- \u5934\u50CF end -->',

								'<% if(this.floor==="new1") {%>',
									// '<span' + clz + '"num num-new">new</span>',
								'<% }else{ %>',
									// '<span' + clz + '"num">' + getFillStr('floor') + '</span>',
								'<%}%>',

								'<!-- \u5185\u5BB9 start -->',
								'<div' + clz + '"cont"' + ctype + '"itemCont">',
								'<div' + clz + '"txt"><span' + clz + '"name ' + getFillStr('icoClz') + '">' + getFillStr('userLnk') + '</span>'+ getFillStr('lastUserLnk') + getFillStr('cont') + '</div>',
								'<div' + clz + '"action">' + getFillStr('time'),
								'<a class="report" href="http://comment5.news.sina.com.cn/comment/skin/feedback_jb.html?mid='+ getFillStr('mid') +'" target="_blank">'+getMsg('I043')+'</a>',
								'<span' + clz + '"btns">',
								'<a' + clz + '"vote" title="'+getMsg('I008')+'"' + atype + '"vote"' + adata + '"channel=' + getFillStr('channel') + '&newsid=' + getFillStr('newsid') + '&mid=' + getFillStr('mid') + '&dialogParentMid='+ getFillStr('dialogParentMid') +'&pos=dialog&floor=' + getFillStr('floor')+'" href="javascript:;"'+getSudaStr('vote_click',getFillStr('sudaDialogType'))+'>',
								'<span>',
								getMsg('I008'),
								'<% if(parseInt(this.agree)) {%>',
									'<em '+ ctype +'"voteNum">' + getFillStr('agree') + '</em>',
								'<% }else{ %>',
									'<em '+ ctype +'"voteNum"></em>',
								'<%}%>',
								'</span>',
								'</a>',
								'<a' + clz + '"reply"' + atype + '"reply"' + adata + '"channel=' + getFillStr('channel') + '&allNewsid=' + getFillStr('allNewsid') + '&newsid=' + getFillStr('newsid') + '&mid=' + getFillStr('mid') + '&dialogParentMid='+ getFillStr('dialogParentMid') +'&pos=dialog&floor=' + getFillStr('floor') + '&dialogType=' + getFillStr('dialogType')+'" href="javascript:;" hidefocus '+getSudaStr('reply_click',getFillStr('sudaDialogType'))+'>'+ getMsg('I009') +'</a>',
								'</span>',
								'</div>',
								'</div>'
							].join(''),
					comment: [
						'<div ' + clz + '"hd clearfix">',
						'<span' + ctype + '"count" href="#url"' + clz + '"count"></span>',
						'<span' + clz + '"tip">' + getMsg('I038') + '</span>',
						'</div>',
						'<div' + clz + '"bd">',

						'<div' + clz + '"editor">',
						'<div' + clz + '"inner">',
						'<textarea' + ctype + '"cont"' + clz + '"box" tabindex="1" autocomplete="off" placeholder="' + getFillStr('postTip') + '" value="' + getFillStr('content') + '">' + getFillStr('content') + '</textarea>',
						'</div>',
						'<span' + clz + '"arrow"></span>',
						'</div>',
						'<!-- \u767B\u5F55\u4FE1\u606F start -->',
						'<div' + clz + '"user">',
						'<div' + clz + '"form-head"  comment-type="head">',
						getFillStr('face'), ,
						'</div>',
						'<span' + clz + '"name"' + ctype + '"name">',
						getFillStr('name'),
						'</span>',
						'<a' + ctype + '"logout"' + clz + '"logout" href="javascript:;" onclick="return false;" title="' + getMsg('I030') + '">' + getMsg('I030') + '</a>',
						'</div>',
						'<div' + clz + '"user user-default">',
						'<div' + clz + '"form-head"  comment-type="head">',
						'<a href="http://weibo.com/" target="_blank">',
						'<img width="80" height="80" src="http://img.t.sinajs.cn/t5/style/images/face/male_180.png"></a>',
						'</div>',
						'</div>',
						'<!-- \u767B\u5F55\u4FE1\u606F end -->',
						'</div>',
						'<div' + clz + '"ft clearfix">',
						'<div' + clz + '"face">',
						'<a href="javascript:;"' + clz + '"trigger"' + atype + '"face-toggle">\u8868\u60C5</a>',
						'</div>',
						'<div' + ctype + '"weibo"' + clz + '"weibo my-sina-comment-chkbox"' + atype + '"checkbox-toggle"> <i></i>',
						'<span>' + getMsg('I018') + '</span>',
						'</div>',
						'<!-- \u53D1\u5E03 start -->',
						'<a' + ctype + '"submit" href="javascript:;"' + atype + '"tip-toggle"' + clz + '"comment btn btn-red btn-disabled">' + getMsg('I007') + '</a>',
						'<!-- \u53D1\u5E03 end -->',
						'<!-- \u767B\u5F55\u4E0E\u6CE8\u518C start -->',
						'<div' + clz + '"login">',
						'<a' + atype + '"login"' + clz + '"login-lnk" href="javascript:;" onclick="return false;" title="' + getMsg('I029') + '">' + getMsg('I029') + '</a>|<a' + clz + '"register-lnk" target="_blank" href="https://login.sina.com.cn/signup/signup.php" onclick="try{if(window._S_uaTrack){_S_uaTrack(\'entcomment\', \'logon\');}}catch(e){}">' + getMsg('I012') + '</a>',
						'</div>',
						'<!-- \u767B\u5F55\u4E0E\u6CE8\u518C\u524D end -->',
						'</div>'
					].join(''),

					reply: [
						'<div' + clz + '"reply-form-top"' + ctype + '"replyArrow"> <em>\u25C6</em><span>\u25C6</span></div>',
						'<div' + clz + '"my-sina-comment-form reply-form"' + ctype + '"form">',
						'<div class="hd"' + ctype + '"hd">',
						'</div>',
						'<div class="bd">',
						'<div' + clz + '"editor">',
						'<div' + clz + '"inner">',
						'<textarea' + ctype + '"cont"' + clz + '"box" tabindex="1" autocomplete="off" placeholder="' + getFillStr('postTip') + '" value="' + getFillStr('content') + '">' + getFillStr('content') + '</textarea>',
						'</div>',
						'<span' + clz + '"arrow"></span>',
						'</div>',
						'<div' + clz + '"user">',
						'<div' + clz + '"form-head"  comment-type="head">',
						getFillStr('face'),
						'</div>',
						'</div>',
						'<div' + clz + '"user user-default">',
						'<div' + clz + '"form-head"  comment-type="head">',
						'<a href="http://weibo.com/" target="_blank">',
						'<img width="80" height="80" src="http://img.t.sinajs.cn/t5/style/images/face/male_180.png"></a>',
						'</div>',
						'</div>',
						'</div>',
						'<div class="ft clearfix">',
						'<div' + clz + '"face">',
						'<a href="javascript:;"' + clz + '"trigger"' + atype + '"face-toggle">\u8868\u60C5</a>',
						'</div>',
						'<div' + ctype + '"weibo"' + clz + '"weibo my-sina-comment-chkbox"' + atype + '"checkbox-toggle"> <i></i>',
						'<span>' + getMsg('I018') + '</span>',
						'</div>',
						'<a' + ctype + '"submit" href="javascript:;"' + atype + '"tip-toggle"' + clz + '"comment btn btn-red btn-disabled">' + getMsg('I007') + '</a>',

						// '<div class="user">',
						// '<span' + clz + '"name"' + ctype + '"name">',
						// getFillStr('name'),
						// '</span>|',
						// '<a' + ctype + '"logout"' + clz + '"logout" href="javascript:;" onclick="return false;" title="' + getMsg('I030') + '">' + getMsg('I030') + '</a>',
						// '</div>',
						'<div' + clz + '"login">',

						'<a' + atype + '"login"' + clz + '"login-lnk" href="javascript:;" onclick="return false;" title="' + getMsg('I029') + '">' + getMsg('I029') + '</a>|<a' + clz + '"register-lnk" target="_blank" href="https://login.sina.com.cn/signup/signup.php" onclick="try{if(window._S_uaTrack){_S_uaTrack(\'entcomment\', \'logon\');}}catch(e){}">' + getMsg('I012') + '</a>',
						'</div>',
						'</div>',
						'</div>',
						'</div>'
					].join('')
					};
			};
			/** @scope mysInacMNT.cmnt.tpls */
			return {
				/**
				 * @name mysInacMNT.cmnt.tpls.set
				 * @memberOf mysInacMNT.cmnt.tpls
				 * @param  {String=} type \u7C7B\u578B\uFF0C\u76EE\u524D\u6709\uFF1A\u5E26\u8BC4\u8BBA\u6846\u7684\u8BC4\u8BBA\u5217\u8868\u7ED3\u6784\u6A21\u677F(formList)\uFF1B\u5217\u8868\u7ED3\u6784\u6A21\u677F (list); \u8BC4\u8BBA\u7ED3\u6784\u6A21\u677F (cont); \u76D6\u697C\u7ED3\u6784\u6A21\u677F (floor); \u8BC4\u8BBA\u6846\u7ED3\u6784\u6A21\u677F (comment); \u56DE\u590D\u6846\u7ED3\u6784\u6A21\u677F (reply); \u5206\u4EAB\u6A21\u677F (share);
				 * @example
				 * cmnt.tpls.set('list',html);
				 * @param  {String}      \u5BF9\u5E94\u6A21\u677F\u5B57\u7B26\u4E32
				 */
				set: function(type, tpl) {
					// \u901A\u8FC7getAll\u65B9\u6CD5\u5EF6\u8FDF\u6267\u884C\u6A21\u677F\u4E2D\u7684\uFF0CgetMsg\u65B9\u6CD5
					all = all||getAll();
					all[type] = tpl;
				},

				/**
				 * @name mysInacMNT.cmnt.tpls.get
				 * @memberOf mysInacMNT.cmnt.tpls
				 * @param  {String=} type \u7C7B\u578B\uFF0C\u76EE\u524D\u6709\uFF1A\u5E26\u8BC4\u8BBA\u6846\u7684\u8BC4\u8BBA\u5217\u8868\u7ED3\u6784\u6A21\u677F(formList)\uFF1B\u5217\u8868\u7ED3\u6784\u6A21\u677F (list); \u8BC4\u8BBA\u7ED3\u6784\u6A21\u677F (cont); \u76D6\u697C\u7ED3\u6784\u6A21\u677F (floor); \u8BC4\u8BBA\u6846\u7ED3\u6784\u6A21\u677F (comment); \u56DE\u590D\u6846\u7ED3\u6784\u6A21\u677F (reply); \u5206\u4EAB\u6A21\u677F (share);
				 * @return {String}      \u5BF9\u5E94\u6A21\u677F\u5B57\u7B26\u4E32
				 * @example
				 * var listTplHTML = cmnt.tpls.get('list');
				 */
				get: function(type) {
					// \u901A\u8FC7getAll\u65B9\u6CD5\u5EF6\u8FDF\u6267\u884C\u6A21\u677F\u4E2D\u7684\uFF0CgetMsg\u65B9\u6CD5
					all = all||getAll();
					if (typeof type == UNDEFINED) {
						return all;
					}
					return all[type];
				}
			};
		})();
		/**
		 * @name mysInacMNT.cmnt.getWBName
		 * @desc \u901A\u8FC7\u5355\u6761\u8BC4\u8BBA\u6570\u636E\u83B7\u53D6\u8BE5\u8BC4\u8BBA\u4F5C\u8005\u7684\u5FAE\u535A\u540D\uFF0C\u65E0\u5FAE\u535A\u540D\u5219\u8FD4\u56DE\u7A7A\u5B57\u7B26\u4E32
		 * @param  {Object} data \u5355\u6761\u8BC4\u8BBA\u6570\u636E
		 * @return {String}      \u5FAE\u535A\u540D
		 */
		cmnt.getWBName = function(data) {
			if (typeof data.config == UNDEFINED) {
				return '';
			}
			var temp = data.config.match(/wb_screen_name=([^&]*)/i);
			return temp ? temp[1] : '';
		};
		/**
		 * @name mysInacMNT.cmnt.getWBV
		 * @desc \u901A\u8FC7\u5355\u6761\u8BC4\u8BBA\u6570\u636E\u83B7\u53D6\u8BE5\u8BC4\u8BBA\u4F5C\u8005\u7684\u5FAE\u535A\u7684\u8BA4\u8BC1\u7C7B\u578B\u8FD4\u56DE\u7A7A\u5B57\u7B26\u4E32
		 * @param  {Object} data \u5355\u6761\u8BC4\u8BBA\u6570\u636E
		 * @return {String}      \u8BA4\u8BC1\u7C7B\u578B\uFF0Cy\uFF08\u4E2A\u4EBA\u8BA4\u8BC1\uFF09,b\uFF08\u673A\u6784\u8BA4\u8BC1\uFF09\u6216\u7A7A\u5B57\u7B26\u4E32
		 */
		cmnt.getWBV = function(data) {
			if (typeof data.config == UNDEFINED) {
				return '';
			}
			var v = '';
			var config = $.queryToJson(data.config);
			var verified = config.wb_verified;
			var type = config.wb_verified_type;

			if (typeof verified != UNDEFINED && verified == '1') {
				if (type == '0') {
					//\u9EC4
					v = 'y';
				} else {
					//\u84DD
					v = 'b';
				}
			}
			return v;
		};
		/**
		 * @name mysInacMNT.cmnt.getUserLnk
		 * @desc \u901A\u8FC7\u5355\u6761\u8BC4\u8BBA\u6570\u636E\u83B7\u53D6\u8BE5\u8BC4\u8BBA\u4F5C\u8005\u4E3B\u9875\u7684\u94FE\u63A5
		 * @param  {Object} data \u5355\u6761\u8BC4\u8BBA\u6570\u636E
		 * @return {HTMLString}      \u4E3B\u9875\u94FE\u63A5
		 */
		cmnt.getUserLnk = function(data,prefix,suffix) {
			prefix = prefix||'';
			suffix = suffix||'';
			var vImg = '';
			var vType = cmnt.getWBV(data);
			var vTit = '\u65B0\u6D6A\u4E2A\u4EBA\u8BA4\u8BC1';
			var wrapPrefix = '<span class="my-sina-comment-user-lnk-wrap">';
			var wrapSuffix = '</span>';
			if (vType) {
				if (vType == 'b') {
					vTit = '\u65B0\u6D6A\u673A\u6784\u8BA4\u8BC1';
				}
				vImg = '<img src="http://www.sinaimg.cn/dy/deco/2013/0608/v' + vType + '.png" title="' + vTit + '" style="vertical-align: middle;" />';
			}
			var wbName = cmnt.getWBName(data);
			//\u5982\u679Cwb_screen_name\u4E3A\u7A7A\u7684\u8BDD\uFF0C\u8BF4\u660E\u4E0D\u662F\u7528\u5FAE\u535A\u540D\u6765\u8BC4\u8BBA\u7684
			var userLnk = 'http://comment5.news.sina.com.cn/comment/skin/default.html?info_type=1&style=1&user_uid=';
			var result = '';
			if (!wbName) {
				if (data.uid && data.uid != '0') {
					result = '<a target="_blank" href="' + userLnk + data.uid + '" title="'+data.nick+'">' + prefix + data.nick + suffix+'</a>';
				} else {
					result = prefix+data.nick+suffix;
				}
			} else {
				// \u4E4B\u524D\u94FE\u63A5\u5230\u7528\u6237\u7684\u8BC4\u8BBA\u4E2D\u5FC3 @\u738B\u56FE\u52C7 @\u9AD8\u857E \u94FE\u63A5\u5230\u5FAE\u535A 20140828114356
				result = '<a target="_blank" href="http://weibo.com/u/' + data.uid + '" title="'+wbName+'">'+ prefix + wbName + vImg + suffix+'</a>';
			}
			return wrapPrefix+result+wrapSuffix;
		};
		/**
		 * @name mysInacMNT.cmnt.getUserFace
		 * @desc \u901A\u8FC7\u5355\u6761\u8BC4\u8BBA\u6570\u636E\u83B7\u53D6\u8BE5\u8BC4\u8BBA\u4F5C\u8005\u5934\u50CF
		 * @param  {Object} data \u5355\u6761\u8BC4\u8BBA\u6570\u636E
		 * @return {HTMLString}      \u5934\u50CF
		 */
		cmnt.getUserFace = function(data) {
			var WBUURL = 'http://weibo.com/u/';
			var config = data.config || '';
			var face = $.queryToJson(config, true).wb_profile_img || 'http://www.sinaimg.cn/dy/deco/2012/1018/sina_comment_defaultface.png';
			var wbName = cmnt.getWBName(data);
			//\u5982\u679Cwb_screen_name\u4E3A\u7A7A\u7684\u8BDD\uFF0C\u8BF4\u660E\u4E0D\u662F\u7528\u5FAE\u535A\u540D\u6765\u8BC4\u8BBA\u7684
			var userLnk = 'http://comment5.news.sina.com.cn/comment/skin/default.html?info_type=1&style=1&user_uid=';
			if (!wbName) {
				if (data.uid && data.uid != '0') {
					face = 'http://portrait5.sinaimg.cn/'+ data.uid +'/blog/50';
					return '<a target="_blank" href="' + userLnk + data.uid + '" title="'+data.nick+'"><img src="' + face + '"/></a>';
				} else {
					return '<img src="' + face + '"/>';
				}

			} else {
				face = 'http://tp1.sinaimg.cn/'+ data.uid +'/50/1';
				return '<a href="' + WBUURL + data.uid + '" title="' + wbName + '" target="_blank"><img src="' + face + '"/></a>';
			}
		};
		/**
		 * @name mysInacMNT.cmnt.getUserIco
		 * @desc \u901A\u8FC7\u5355\u6761\u8BC4\u8BBA\u6570\u636E\u83B7\u53D6\u8BE5\u8BC4\u8BBA\u4F5C\u8005\u56FE\u6807\u7C7B
		 * @param  {Object} data \u5355\u6761\u8BC4\u8BBA\u6570\u636E
		 * @return {String}      \u56FE\u6807css\u7C7B\uFF0Cname-mobile\uFF08\u624B\u673A\u7528\u6237\uFF09\u6216name-weibo\uFF08\u5FAE\u535A\u7528\u6237\uFF09
		 */
		cmnt.getUserIco = function(data) {
			//\u7528\u6237\u7C7B\u578Bcss\u7C7B
			var typeClzObj = {
				'wap': 'name-mobile',
				'wb': 'name-weibo'
			};
			var typeClz = typeClzObj[data.usertype];
			typeClz = typeClz || '';
			if (!typeClz) {
				//\u5982\u679C\u6709\u5FAE\u535A\u94FE\u63A5\u5C31\u662F\u5FAE\u535A\u7528\u6237
				var wbName = cmnt.getWBName(data);
				//\u5982\u679Cwb_screen_name\u4E3A\u7A7A\u7684\u8BDD\uFF0C\u8BF4\u660E\u4E0D\u662F\u7528\u5FAE\u535A\u540D\u6765\u8BC4\u8BBA\u7684
				if (!wbName) {
					typeClz = '';
				} else {
					typeClz = typeClzObj.wb;
				}
			}
			return typeClz;
		};
		/**
		 * @name mysInacMNT.cmnt.insertList
		 * @desc \u628A\u5185\u5BB9\u63D2\u5230\u5E76\u6EDA\u52A8\u5230\u5217\u8868\u6700\u524D\u65B9
		 * @param {HTMLElement} wrap \u5BB9\u5668
		 * @param {HTMLElement} node \u64AD\u5165\u5185\u5BB9
		 */
		//
		cmnt.insertList = function(wrap, node, scroll) {
			var pos;
			var gap = 0;
			wrap.insertBefore(node, wrap.firstChild);
			if(scroll){
				setTimeout(function() {
					pos = $.getPosition(wrap);
					gap = pos.top - 80;
					try {
						doc.documentElement.scrollTop = gap;
						document.body.scrollTop = gap;
					} catch (e) {}
				}, 1e3);
			}
		};

		/**
		 * @name mysInacMNT.cmnt.getNewsLink
		 * @description \u901A\u8FC7\u8BC4\u8BBA\u4E2D\u7684\u65B0\u95FBid\u5728newsdict\u4E2D\u83B7\u53D6\u65B0\u95FB\u94FE\u63A5
		 * @param  {String} id   \u65B0\u95FBid
		 * @param  {Object} data \u5217\u8868\u6570\u636E
		 * @return {HTMLString}      \u65B0\u95FB\u94FE\u63A5HTML
		 */
		cmnt.getNewsLink = function(id, data,type) {
			var item = '';
			var html = '';
			type = getSudatType(type);
			if (data.newsdict) {
				var newsdict = data.newsdict;
				item = newsdict[id];
				if (typeof item != UNDEFINED) {
					html = '<p class="lnk"><a target="_blank" href="' + item.url + '" title="' + item.title + '"'+getSudaStr('head_click',type)+'>\u300A' + item.title + '\u300B</a></p>';
				}
			}
			return html;
		};

		/**
		 * @name mysInacMNT.cmnt.dialogInsertList
		 * @desc \u628A\u5185\u5BB9\u63D2\u5230\u5E76\u6EDA\u52A8\u5230\u5217\u8868\u6700\u540E\u65B9
		 * @param {HTMLElement} wrap \u5BB9\u5668
		 * @param {HTMLElement} node \u64AD\u5165\u5185\u5BB9
		 */
		//
		cmnt.dialogInsertList = function(wrap, node) {
			var lastChild = wrap.lastChild;
			var lastChildClz = lastChild.className;
			// \u56DE\u590D\u540E\uFF0C\u5355\u6761\u5185\u5BB9\u4F1A\u53D8\u6210\u7B2C\u4E00\u4E2A
			lastChildClz = lastChildClz.replace('item-one','item-first').replace('item-last', '').replace('item-me', '');
			lastChild.className = lastChildClz;
			wrap.appendChild(node);
		};
		/**
		 * @name mysInacMNT.cmnt.dialogItemInnerRender
		 * @param  {String} newsid     \u65B0\u95FBid
		 * @param  {Object} d          \u8BE5\u6761\u8BC4\u8BBA\u6570\u636E
		 * @param  {Object} data       \u5217\u8868\u6570\u636E
		 * @param  {Object} tReplyList \u8BE5\u6761\u8BC4\u8BBA\u5BF9\u5E94\u7684\u56DE\u590D\u5217\u8868\u6570\u636E
		 * @return {HTMLString}            \u62FC\u88C5\u597D\u7684\u8BC4\u8BBA\u9879\u7684innerHTML
		 */
		cmnt.dialogItemInnerRender = (function() {
			var getTimeStr = cmnt.getTimeStr;
			var splitNum = $.app.splitNum;
			// \u56DE\u590DXXX:
			var atTplHtml = getMsg('I036');
			var colon = getMsg('I037');

			return function(newsid, item,i,lastUserLnk) {
				var area = (item.area ? '[' + item.area + ']' : '&nbsp;');
				//\u662F\u5426\u6709\u56DE\u590D
				var hasReply = '';
				if (i !== 0) {
					hasReply = 1;
				}
				var tplHtml = '';
				var tempHtml = '';
				var userLnk = cmnt.getUserLnk(item,'',colon);
				var cont = cmnt.face.filter(app.cmntEncodeHtml(item.content));

				// \u65E0\u76D6\u697C\u7684\u8BDD\uFF0C\u76D6\u697C\u5185\u5BB9\u94FE\u63A5\u6210\u5B57\u7B26\u4E32
				var tplData = {
					allNewsid: newsid||item.newsid,
					channel: item.channel,
					newsid: item.newsid,
					mid: item.mid,
					dialogParentMid:item.dialogParentMid,
					dialogType:item.dialogType,
					sudaDialogType:getSudatType(item.dialogType),
					// \u7528\u6237\u5934\u50CF
					userFace: cmnt.getUserFace(item),
					floor: (i + 1),
					userIco: cmnt.getUserIco(item),
					userLnk: userLnk,
					lastUserLnk:(lastUserLnk?appTemplate(atTplHtml, {userLnk:lastUserLnk}):''),
					area: area,
					cont: cont,
					time: getTimeStr(item.time, 'time'),
					agree: splitNum(item.agree),
					hasReply: hasReply
				};
				tplHtml = cmnt.tpls.get('dialogItem');
				tempHtml = appTemplate(tplHtml, tplData);
				return tempHtml;
			};
		})();

		/**
		 * @name mysInacMNT.cmnt.itemRender
		 * @param  {String} newsid     \u65B0\u95FBid
		 * @param  {Object} item          \u8BE5\u6761\u8BC4\u8BBA\u6570\u636E
		 * @param  {Object} data       \u5217\u8868\u6570\u636E
		 * @return {HTMLString}            \u62FC\u88C5\u597D\u7684\u8BC4\u8BBA\u9879HTML\u5B57\u7B26\u4E32
		 */
		cmnt.dialogItemRender = function(newsid, item, i,lastUserLnk, isHidden,isMe,isLast,isFirst,isMiddle,isOne){
			var hiddenClz = isHidden?' item-hide':'';
			var meClz = isMe?' item-me':'';
			var lastClz = isLast?' item-last':'';
			var firstClz = isFirst?' item-first':'';
			var middleClz = isMiddle?' item-middle':'';
			var oneClz = isOne?' item-one':'';

			var preixHTML = isFirst?'<div class="dialog-list-hack-top"></div>':'';
			var suffixHTML = isLast?'<div class="dialog-list-hack-btm"></div>':'';
			return '<div class="item clearfix'+hiddenClz+meClz+lastClz+firstClz+middleClz+oneClz+'" comment-type="item">'+ preixHTML + cmnt.dialogItemInnerRender(newsid, item,i, lastUserLnk) + suffixHTML+ '</div>';
		};

		/**
		 * @name mysInacMNT.cmnt.dialogListRender
		 * @param  {String} newsid     \u5BF9\u5E94\u8BC4\u8BBA\u7684\u65B0\u95FBid
		 * @param  {String} mid        \u5BF9\u5E94\u8BC4\u8BBA\u7684id
		 * @param  {Array} tReplyList \u56DE\u590D\u5217\u8868\u6570\u636E
		 * @return {HTMLString}        \u62FC\u88C5\u597D\u7684\u56DE\u590D\u5217\u8868\u5B57\u7B26\u4E32
		 */
		cmnt.dialogListRender = (function() {

			return function(newsid, d,config) {
				if (typeof d.mid == UNDEFINED) {
					return '';
				}
				var data = config.data;
				var uid = config.uid;
				var type = config.type;
				var mid = d.mid;

				var dialogList = data.replydict[d.mid];

				if(!$.isArray(dialogList)){
					dialogList = [];
				}
				// \u5F53\u524D\u8BC4\u8BBA\u5BF9\u8BDD\u5217\u8868\u4E2D\uFF01
				dialogList.push(d);

				cmnt.data.set(d.newsid, 'dialogList', dialogList);

				var dialogHtml = [];
				var lastUserLnk = '';
				var hdHtml = '';

				// 2\uFF0C\u6700\u65B0\u4E00\u5C42\u4E3A\u5927\u5934\u50CF
				// 3\uFF0C\u56DE\u590D\u6211\u7684\u548C\u6211\u8BC4\u8BBA\u7684\uFF0C\u697C\u5C42\u6574\u4F53\u5927\u4E8E3\uFF08\u4E0D\u5305\u542B3\uFF09\uFF0C\u5219\u9690\u85CF\u524D\u9762\u7684\u5C42\u7EA7\uFF0C\u4FDD\u7559\u5C55\u793A\u6700\u65B0\u4E00\u5C42\u548C\u5012\u6570\u7B2C\u4E8C\u5C42\u3002@\u5434\u66CC
				var maxHiddenLen = 3;
				var dialogListLen = dialogList.length;
				var meIndex = dialogListLen - 1;
				var needHidden = dialogListLen > maxHiddenLen;
				var i;
				/*var meIndex = (function(t){
					var meIndex = Infinity;
					for (i = 0; i < dialogListLen; i++) {
						var item = dialogList[i];
						if(item.uid===uid){
							meIndex = i;
							if(t==='reply'){
								break;
							}
						}
					}
					return meIndex;
				})(type);*/


				for (i = 0; i < dialogListLen; i++) {
					var isHidden = (needHidden &&(i+maxHiddenLen <= dialogListLen));
					var item = dialogList[i];

					var isMe = (meIndex===i);

					item.dialogParentMid = mid;
					item.dialogType = type;

					var isFirst = (i===0);
					var isLast = (i+1===dialogListLen);
					var isMiddle = (!isLast&&!isFirst&&isMe&&dialogListLen>2);
					var isOne = (dialogListLen===1);
					dialogHtml.push(cmnt.dialogItemRender(newsid,item,i,lastUserLnk,isHidden,isMe,isLast,isFirst,isMiddle,isOne));

					// \u6709\u9690\u85CF\u5185\u5BB9\uFF0C\u5219\u5728\u5012\u6570\u7B2C\u4E00\u6761\u52A0\u5165\u201C\u5C55\u5F00\u6536\u8D77\u89E6\u53D1\u5668\u201D
					if(needHidden&&i===(dialogListLen-maxHiddenLen)){
						dialogHtml.push('<div class="dialog-list-bd" action-type="dialogMore" comment-type="dialogBd"><a href="javascript:;" hidefocus=""><i><em></em></i>'+getMsg('I034')+'</a></div>');
					}


					lastUserLnk = cmnt.getUserLnk(item,'@');
				}
				if (dialogListLen!==0) {
					dialogHtml = '<div class="dialog-list-wrap" comment-type="dialogWrap"> <div class="dialog-list-title clearfix" newsid="'+d.newsid+'">' + cmnt.getNewsLink(d.newsid,data,type) +' </div> <div class="dialog-list" comment-type="dialogList">' + dialogHtml.join('') + '</div></div>';
				}
				return dialogHtml;
			};
		})();
		cmnt.layer = (function(){
			var Layer = {};
			Layer.timeout = null;
			Layer.animate = null;
			var getLayer = function() {
				var div = $.create('div');
				div.className = 'my-sina-comment-list-layer';
				div.style.visibility = 'hidden';
				$.byTag('body')[0].appendChild(div);
				return div;
			};
			var hide = function() {
				if (!Layer.dom) {
					Layer.dom = getLayer();
				}
				clearTimeout(Layer.timeout);
				if (Layer.animate) {
					Layer.animate.pause();
				}
				$.animate(Layer.dom, {
					opacity: 0
				}, 200, 'Tween.Quad.easeOut', {
					start: function(el) {
						// el.innerHTML = 'start!';
					},
					complete: function(el) {
						$.setStyle(Layer.dom, {
							left: '-9999px',
							opacity: 0
							// display:'none'
						});
					}
				});
			};
			var getWH = function(ele, w, h) {
				var width = $.getStyle(ele, 'width');
				var height = $.getStyle(ele, 'height');
				width = parseFloat(width);
				width = isNaN(width) ? w : width;
				height = parseFloat(height);
				height = isNaN(height) ? h : height;
				return {
					width: width,
					height: height
				};
			};
			var show = function(ele, html, closeTime) {
				if (!Layer.dom) {
					Layer.dom = getLayer();
				}
				clearTimeout(Layer.timeout);
				if (Layer.animate) {
					Layer.animate.pause();
				}
				Layer.dom.innerHTML = '<div class="my-sina-comment-list-layer-hd"><h2>\u67E5\u770B\u5BF9\u8BDD</h2><a action-type="layerHide" href="javascript:;" class="close"></a></div><div class="my-sina-comment-list-layer-bd">'+(html||'')+'</div>';
				var winSize = $.app.getWinSize();
				var layerWH = getWH(Layer.dom, 648, 380);
				var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
				// \u6CE8\u610F\u5BBD\u9AD8\u9700\u8981\u52A0\u4E0Apadding
				$.setStyle(Layer.dom, {
					top: scrollTop+(winSize.height - layerWH.height)/2 + 'px',
					// left: (winSize.width - layerWH.width)/2 + 'px',
					left:'50%',
					marginLeft:-layerWH.width/2 +'px',
					opacity: 0,
					visibility: 'visible'
				});
				closeTime = closeTime || 0;
				if (closeTime) {
					Layer.timeout = setTimeout(function() {
						Layer.hide();
					}, closeTime);
				}
				/*elemId, cssObj, time, animType, funObj*/
				$.animate(Layer.dom, {
					opacity: 1
				}, 200, 'Tween.Quad.easeIn', {
					start: function(el) {
						// el.innerHTML = 'start!';
					},
					complete: function(el) {
						// el.innerHTML = 'Completed!';
					}
				});
			};
			Layer.show = show;
			Layer.hide = hide;
			return Layer;
		})();

		/**
		 * @name DataLoader
		 * @class \u4E13\u7528\u4E8E\u52A0\u8F7D\u8BC4\u8BBA\u6570\u636E
		 * @constructor
		 * @param {String} url \u6570\u636E\u63A5\u53E3\u5730\u5740
		 * @param {Object} opt \u914D\u7F6E\u9009\u9879
		 * @param {Object} opt.param \u6570\u636E\u63A5\u53E3\u53C2\u6570
		 * @param {Function} opt.beforeLoad \u6570\u636E\u52A0\u8F7D\u524D\u56DE\u8C03
		 * @param {Function} opt.loaded \u6570\u636E\u52A0\u8F7D\u540E\u56DE\u8C03
		 * @param {Function} opt.error \u6570\u636E\u52A0\u8F7D\u51FA\u9519\u56DE\u8C03
		 * @example
		 *   var DataLoader1 = new DataLoader('http://api.sina.com.cn/test',{
		 *      page:1,
		 *      pageSize:20
		 *   });
		 */
		cmnt.DataLoader = (function() {
			var Loader = new $.Clz();
			Loader.include({
				init: function(opt) {
					var self = this;
					self._setOpt(opt);
					self.data = null;
					self.loading = false;
					self.getData();
				},
				_setOpt: function(opt) {
					this.set('opt', $.extend({
						url: '',
						param: {},
						beforeLoad: function() {},
						loaded: function(self) {},
						error: function(error) {}
					}, opt, true));
				},
				/**
				 * @name getData
				 * @description \u83B7\u53D6\u6570\u636E
				 * @member getData
				 */
				getData: function(cb) {
					var self = this;
					var opt = self.get('opt');
					var url = opt.url;
					var param = opt.param;
					var guid = 'loader_' + $.getGuid();
					if (url.indexOf('?') > -1) {
						url += '&';
					} else {
						url += '?';
					}
					url = url + $.jsonToQuery(param) + '&jsvar=' + guid;
					self.loading = true;
					// \u52A0\u8F7D\u524D
					opt.beforeLoad();

					$.jsLoad(url, function() {
						var msg = exports[guid];
						if (typeof msg == UNDEFINED) {
							return;
						}
						// \u6709\u65F6\u51FA\u9519\u65F6code\u4E5F\u4E3A0\uFF0C\u4F46\u5B58\u5728error\u5B57\u6BB5
						if (msg.result.status.code === 0 && typeof msg.result.error == UNDEFINED) {
							self.data = msg.result;
							// \u52A0\u8F7D\u5B8C\u6210\u540E
							opt.loaded(self);
						} else {
							var error = msg.result.status.msg;
							// \u6570\u636E\u52A0\u8F7D\u51FA\u9519
							opt.error(error);
							throw new Error('\u6570\u636E\u52A0\u8F7D\u51FA\u9519\uFF1A' + error + ';URL:' + url);
						}

						self.loading = false;
						if(cb&&typeof cb === 'function'){
							cb(msg);
						}
					});
				}
			});
			return Loader;
		})();
		/**
		 * @name List
		 * @class \u4E13\u7528\u4E8E\u52A0\u8F7D\u8BC4\u8BBA\u5217\u8868\u5E76\u6E32\u67D3
		 * @constructor
		 * @extends DataLoader
		 * @param  {HTMLElement|String} wrap   \u5BB9\u5668id\u6216\u5BB9\u5668\u8282\u70B9
		 * @param  {String} url    \u6570\u636E\u63A5\u53E3
		 * @param  {Object} config \u914D\u7F6E\u9009\u9879\uFF0C
		 * @param  {Object} config.param \u6570\u636E\u63A5\u53E3\u53C2\u6570
		 * @example
		 *  List1 = new $.cmnt.List('SI_List','http://comment5.news.sina.com.cn/page/info',{
		 *     channel: 'ty',
		 *     newsid: '6-12-342371',
		 *     group: 1,
		 *     page: 1,
		 *     pageSize: 20
		 *  });
		 */
		cmnt.List = (function() {
			var listRender = (function() {
				//\u9ED8\u8BA4\u663E\u793A\u9875\u9762\u6570
				var sudaHasMore = false;
				return function(newsid, cmntlist, config) {
					var html = [];
					if (typeof cmntlist !== 'object' || cmntlist.length === 0) {
						return '';
					}
					// var dis = 'none';
					var htmlStr = '';
					var i = 0,len,item;
					//\u6700\u65B0\u8BC4\u8BBA\u53EA\u663E\u793A\u7B2C\u4E00\u9875\uFF0C\u5176\u5B83\u901A\u8FC7\u66F4\u591A\u6765\u52A0\u8F7D
					for (i = 0, len = cmntlist.length; i < len; i++) {
						var item = cmntlist[i];
						html.push(cmnt.dialogListRender(newsid, item, config));

					}
					htmlStr = html.join('');
					return htmlStr;
				};
			})();

			var List = new $.Clz(cmnt.DataLoader);
			var ReplyForm = null;
			List.include({
				init: function(wrap, url, config) {
					var self = this;
					// \u76EE\u524D\u6253\u5F00\u7684\u5BF9\u8BDD\u5217\u8868
					self.currentDialog = null;
					var defaultConfig = {
						maxWordCount:Infinity,
						// \u6BCF\u6B21\u5206\u9875\u6761\u6570
						pageNum: 10
					};
					config = $.extend(defaultConfig,config);

					var encoding = cmnt.config.encoding;
					var options = {
						url: url || 'http://comment5.news.sina.com.cn/page/info',
						config: config,
						param: {
							format: 'js',
							// channel: config.channel,
							// newsid: config.newsid,
							//style=1\u672C\u6765\u4E3A\u76AE\u80A4\uFF0C\u5E94\u8BE5\u4E3Agroup=1
							// group: config.group || config.style,
							// compress: 0,
							ie: encoding,
							oe: encoding,
							page: 1,
							// \u540E\u7AEF\u63A5\u53E3 page_size must is 20,50,100
							page_size: config.pageSize||20
						},
						listType: 'all',
						beforeLoad: function() {
							self.beforeLoad();
							if (typeof config.beforeLoad === 'function') {
								config.beforeLoad();
							}
						},
						loaded: function(self) {
							self.render(self);
							self.loaded(self);
							if (typeof config.loaded === 'function') {
								config.loaded(self);
							}
						}
					};
					self.firstRender = true;
					self.isReflash = true;
					self._setOpt(options);
					self.loading = false;
					self._setDom(wrap);
					self.getData();
				},
				/**
				 * \u83B7\u53D6wrap\u4E0B\u7684\u76F8\u5173dom\u8282\u70B9\uFF0C\u5E76\u5B58\u50A8\u8D77\u6765
				 * @member _setDom
				 * @private
				 * @param  {HTMLElement|String} wrap \u5BB9\u5668
				 */
				_setDom: function(wrap) {
					var self = this;
					wrap = $.byId(wrap);
					var tempHtml = $.cmnt.tpls.get('list');
					wrap.innerHTML = appTemplate(tempHtml, {});
					var builder = $.builder(wrap, 'comment-type');
					self.set('dom', builder.ids);
				},
				/**
				 * \u5217\u8868\u52A0\u8F7D\u524D\u6267\u884C\u65B9\u6CD5
				 * @member beforeLoad
				 * @private
				 */
				beforeLoad: function() {
					var self = this;
					var dom = self.get('dom');
					var opt = self.get('opt');
					var optConfig = opt.config;
					$.addClass(dom.wrap, 'my-sina-comment-list-loading');
				},
				/**
				 * \u5217\u8868\u52A0\u8F7D\u540E\u6267\u884C\u65B9\u6CD5
				 * @member loaded
				 * @private
				 */
				loaded: function() {
					var self = this;
					var dom = self.get('dom');
					var opt = self.get('opt');
					var type = opt.config.type;
					var data = self.data;
					$.removeClass(dom.wrap, 'my-sina-comment-list-loading');
					var hasData = (function(){
						var flag = true;
						if(type==='reply'){
							flag = !!data.usercount.l_reply;
						}else{
							flag = !!data.usercount.l_count;
						}
						return flag;
					})();
					// \u6CA1\u6709\u8BC4\u8BBA
					if(!data.cmntlist||!hasData){
						if(opt.config.type==='cmnt'){
							self.setMore(getMsg('I100'));
						}else{
							self.setMore(getMsg('I101'));
						}
						return;
					}
					//\u89E6\u53D1\u81EA\u5B9A\u4E49\u4E8B\u4EF6
					if (self.firstRender) {
						//\u5B9A\u65F6\u66F4\u65B0\u65F6\u95F4
						cmnt.updateTime(dom.wrap);
						self.firstRender = false;
					}
					// I006: '\u5DF2\u5230\u6700\u540E\u4E00\u9875',\u63D0\u793A\u6539\u6210I027
					if (data.cmntlist.length === 0) {
						self.setMore(getMsg('I027'));
					}else{
						self.setMore(getMsg('I014'));
					}
				},
				setMore:function(html){
					var self = this;
					var dom = self.get('dom');
					if (dom.more) {
						dom.more.innerHTML = html;
					}
				},
				render: function() {
					var self = this;
					var data = self.data;
					var dom = self.get('dom');
					var opt = self.get('opt');
					var optConfig = opt.config;
					// \u5982\u679C\u8981\u9690\u85CF\u5217\u8868\uFF0C\u521A\u4E0D\u6E32\u67D3\u5217\u8868
					if (optConfig.hideList) {
						return;
					}
					// pageNum \u6700\u65B0\u8BC4\u8BBA\u5047\u5206\u9875\u6761\u6570\uFF0C\u5982\u6BCF\u6B21\u52A0\u8F7D100\u6761\uFF0CpageNum\u4E3A10\u6761\uFF0C\u5C31\u5206\u621010\u9875\uFF0C\u53EA\u663E\u793A\u7B2C1\u9875\uFF0C\u70B9\u51FB\u66F4\u591A\u65F6\uFF0C\u9010\u4E00\u663E\u793A\u4F59\u4E0B9\u9875
					var pageNum = optConfig.pageNum;
					// hotPageNum \u6700\u70ED\u8BC4\u8BBA\u5047\u5206\u9875\uFF0C\u7C7B\u4F3CpageNum
					// \u70ED\u5E16\u7B2C\u4E00\u9875\u8BC4\u8BBA\u6570\u6539\u4E3A\u70ED\u8D34\u663E\u793A\u6570\uFF0C\u6CA1\u6709\u66F4\u591A\uFF0C\u9ED8\u8BA410\u6761 201312311503
					var hotPageNum = optConfig.hotPageNum;
					var param = opt.param;
					var newsid = param.newsid;
					//\u6570\u636E\u603B\u6761\u6570 20130422 by wanglei12
					if (typeof data.count == UNDEFINED) {
						self.totalNum = 0;
					} else {
						self.totalNum = self.data.count.show;
					}

					//\u8BC4\u8BBA\u5217\u8868
					var cmntlist = data.cmntlist;
					if (typeof cmntlist === 'undefined' || !cmntlist.length) {
						return;
					}
					//\u628A\u6BCF\u6B21\u52A0\u8F7D\u8FDB\u6765\u7684\u8BC4\u8BBA\u5217\u8868\u5408\u5E76\u8D77\u6765
					if (self.cList) {
						self.cList = self.cList.concat(cmntlist);
					} else {
						self.cList = cmntlist;
					}

					var latestHtml = '';
					var config = {
						uid:optConfig.uid,
						data: data,
						pageNum: pageNum,
						type:optConfig.type
					};

					latestHtml = listRender(newsid, cmntlist, config);
					//\u7B2C\u4E00\u6B21\u52A0\u8F7D,\u4E5F\u5C31\u662F\u7B2C\u4E00\u9875\u65F6\uFF0C\u518D\u6E32\u67D3\u70ED\u95E8\u8BC4\u8BBA\u548CinnerHTML\u65F6\u6700\u65B0\u8BC4\u8BBA,\u5426\u5219appenchild\u52A0\u5230\u7ED3\u5C3E
					if (param.page == 1) {
						dom.latestList.innerHTML = latestHtml;
					} else {
						var fragment = $.create('div');
						fragment.innerHTML = latestHtml;
						dom.latestList.appendChild(fragment);
					}

					self.setDataClz(latestHtml);
					//\u52A0\u8F7D\u5B8C\u6210
					self.loading = false;
					self.bindEvent();
					return self;
				},
				bindEvent: function() {
					var self = this;
					var dom = self.get('dom');
					// \u901A\u8FC7\u201C\u8D5E\u201D\u6309\u94AE\u6765\u83B7\u53D6\u201C\u56DE\u590D\u201D\u6309\u94AE\u7684\u4FE1\u606F
					var getReplyDataByVoteBtn = function(ele){
						var par = ele.parentNode;
						var reply = $.byAttr(par, 'action-type', 'reply')[0];
						var data = reply.getAttribute('action-data');
						data = $.queryToJson(data);
						return {
							el:reply,
							data:data
						};
					};
					if (self.firstRender) {
						// \u9632\u6B62\u5728\u540C\u4E00\u4E2Adiv\u91CC\u91CD\u590D\u6DFB\u52A0\u59D4\u6D3E\u4E8B\u4EF6
						if(dom.wrap.getAttribute('delegated') === 'true'){
							return;
						}
						var dldEvtObj = $.delegatedEvent(dom.wrap);
						dom.wrap.setAttribute('delegated','true');
						// var dldEvtBody = $.delegatedEvent($.byTag('body')[0]);
						dldEvtObj.add('dialogMore', 'click', function(o) {
								var wrap = o.el.parentNode;
								var clz = 'dialog-list-show';
								var action = 'add';
								var txt = 'I035';
								if($.hasClass(wrap,clz)){
									action = 'remove';
									txt = 'I034';
								}
								$[action+'Class'](wrap,clz);
								o.el.getElementsByTagName('a')[0].innerHTML = '<i><em></em></i>'+ getMsg(txt);
						});
						//\u5C55\u5F00
						dldEvtObj.add('txt-toggle', 'click', function(o) {
							$.cmnt.truncate.toggle(o.el,o.data.type);
						});
						//\u9876
						dldEvtObj.add('vote', 'click', function(o) {
							var ele = o.el;
							var oData = o.data;
							var hasVoted = ele.getAttribute('voted');
							if (hasVoted == 'true') {
								return;
							}
							// \u8D5E\u7684\u540C\u65F6\u8FD8\u63D0\u793A\u7528\u6237\u56DE\u590D
							var replyData  = getReplyDataByVoteBtn(ele);
							self.showReply(replyData);
							ReplyForm.showHdTip(getMsg('I039'));
							$.cmnt.commentTip.hide();

							$.cmnt.vote({
								channel: oData.channel,
								newsid: oData.newsid,
								parent: oData.mid
							});

							app.track('entcomment','up');

							$.cmnt.voteTip.show(ele, 1e3);
							$.addClass(ele, 'vote-active');

							var vote = ele.title;
							var voted = '\u5DF2' + vote;

							var num = 0;

							var numEle = $.byAttr(ele,'comment-type','voteNum')[0];

							if(numEle && numEle.innerHTML){
								num = parseInt(numEle.innerHTML.replace(/[^\d]/g, ''), 10);
								if(isNaN(num)){
									num = 0;
								}
							}else{
								numEle.innerHTML = num;
							}
							var html = ele.innerHTML;

							var newnum = num+1;

							ele.innerHTML = html.replace($.app.splitNum(num), $.app.splitNum(newnum)).replace(vote, voted);
							ele.title = voted;
							ele.setAttribute('voted', 'true');
						});
						// \u56DE\u590D
						dldEvtObj.add('reply', 'click', function(o) {
							console.log('reply');
							self.toggleReply(o);
							$.cmnt.commentTip.hide();
						});
						// \u52A0\u8F7D\u66F4\u591A \u6700\u65B0\u8BC4\u8BBA
						dldEvtObj.add('getMore', 'click', function(o) {
							self.getMore();
						});
					}
				},
				getMore:function(){
					var self = this;
					var page = self.get('opt.param.page');
					self.setPage(page + 1).getData();
				},
				toggleReply:function(config){
					var self = this;
					var actionData = config.data;
					var mid = actionData.mid;
					if (ReplyForm) {
						var oldMid = ReplyForm.get('opt.parent');
						ReplyForm.destroy();
						ReplyForm = null;

						if (oldMid == mid) {
							return;
						}
					}
					self.showReply(config);
				},
				showReply:function(config){
					var self = this;
					var ele = config.el;
					var actionData = config.data;
					var opt = self.get('opt');
					var optConfig = opt.config;
					var getListWrap = function(ele) {
						var par = ele.parentNode;
						if (par && par.getAttribute('comment-type') == 'dialogList') {
							return par;
						} else {
							return arguments.callee(par);
						}
					};
					if (ReplyForm) {
						ReplyForm.destroy();
						ReplyForm = null;
					}
					// var content = '//@' + actionData.userLnk + ' ' + actionData.cont;
					var commented = function(content, dialogCommentHTML) {
						var latestList = self.get('dom.latestList');
						var config = self.get('opt.config');
						var listWrap = getListWrap(ele);
						if(dialogCommentHTML&&listWrap){
							cmnt.dialogInsertList(listWrap, dialogCommentHTML);
						}
						if(typeof opt.config.commented === 'function'){
							opt.config.commented();
						}
					};
					var postTip = '';
					if(actionData.userLnk){
						postTip = getMsg('I009')+actionData.userLnk;
					}

					// \u56DE\u590D\u5E94\u8BE5\u4F7F\u7528\u7684\u662F\u5355\u6761\u8BC4\u8BBA\u7684newsid
					ReplyForm = new $.cmnt.ReplyForm(ele, {
						allNewsid: actionData.allNewsid,
						channel: actionData.channel,
						newsid: actionData.newsid,
						parent: actionData.mid,
						dialogType:actionData.dialogType,
						dialogParentMid:actionData.dialogParentMid,
						// content: content,
						commented: commented,
						autoGrow:typeof optConfig.autoGrow === 'undefined'?false: optConfig.autoGrow,
						postTip:postTip,
						// \u7528\u4E8E\u6A21\u62DF\u56DE\u590D\u65F6\u201C\u56DE\u590D@XXX\u201D
						floor:actionData.floor
					});
					var contBox = ReplyForm.get('dom.cont');
					// \u65E0\u76D6\u697C\u7684\u8BDD\uFF0C\u70B9\u51FB\u6253\u5F00\u56DE\u590D\u6846\u65F6\uFF0C\u5149\u6807\u5E94\u8BE5\u63D2\u5165\u5230\u5185\u5BB9\u6700\u524D\u9762
					$.app.textareaUtils.insertText(contBox, '', 0, 0);
				},
				setDataClz: function(html) {
					var self = this;
					var dom = self.get('dom');
					// \u6DFB\u52A0\u5C55\u5F00\u6536\u8D77
					var maxWordCount = self.get('opt.config.maxWordCount');
					if(maxWordCount !== Infinity||maxWordCount<=0){
						var items = $.byAttr(dom.wrap,'comment-type','itemTxt');
						for (var i = 0, len = items.length; i < len; i++) {
							var item = items[i];
							$.cmnt.truncate.handle(item, maxWordCount);
						}
					}

				},
				/**
				 * \u8BBE\u7F6E\u9875\u9762\uFF0C\u4E3A\u4E0B\u6B21\u52A0\u8F7D\u6570\u636E\u505A\u51C6\u5907
				 * @member setPage
				 * @param {Number} page \u8981\u8BBE\u7F6E\u7684\u9875\u6570
				 */
				setPage: function(page) {
					if (page < 1) {
						return this;
					}
					this.set('opt.param.page', page);
					return this;
				}
			});
			return List;
		})();

		/**
		 * @name Form
		 * @class \u8BC4\u8BBA\u8868\u5355
		 * @constructor
		 * @param  {HTMLElement|String} wrap   \u5BB9\u5668id\u6216\u5BB9\u5668\u8282\u70B9
		 * @param  {String} url    \u6570\u636E\u63A5\u53E3
		 * @param  {Object} opt \u914D\u7F6E\u9009\u9879\uFF0C
		 * @param  {String} opt.allNewsid \u7EC4\u65B0\u95FBid
		 * @param  {String} opt.channel \u9891\u9053
		 * @param  {String} opt.newsid \u56DE\u590D\u8BC4\u8BBA\u7684\u65B0\u95FBid
		 * @param  {String} opt.parent \u56DE\u590D\u7684\u7684mid,\u8BC4\u8BBA\u65F6mid\u4E3A\u7A7A
		 * @param  {String} opt.share_url \u5206\u4EAB\u7684\u94FE\u63A5
		 * @param  {String} opt.video_url \u5206\u4EAB\u7684\u89C6\u9891\u5730\u5740
		 * @param  {String} opt.img_url \u5206\u4EAB\u56FE\u7247\u5730\u5740
		 * @param  {String} opt.postTip \u8F93\u5165\u63D0\u793A
		 * @param  {String} opt.content \u9ED8\u8BA4\u8BC4\u8BBA\u5185\u5BB9
		 * @param {Function} opt.commented \u8BC4\u8BBA\u540E\u56DE\u8C03
		 * @example
		 *  var Form1 = new $.cmnt.Form('SI_Form1',{
		 *      channel:'kj',
		 *      newsid:'2-1-9216383',
		 *      parent:'',
		 *      commented : function() {
		 *      }
		 *  });
		 */
		cmnt.Form = (function() {
			var commentTip = cmnt.commentTip;
			var addEvt = $.addEvent;
			var cusEvt = $.custEvent;
			var onceInited = false;
			var getPlaceholer = function(input) {
				var text = input.getAttribute('placeholder');
				if (!text) {
					//ie10 \u4E0B\u7684ie7 \u65E0\u6CD5\u7528input.getAttribute('placeholder')\u53D6\u5230placeholder\u503C\uFF0C\u5947\u602A\uFF01
					if (input.attributes && input.attributes.placeholder) {
						text = input.attributes.placeholder.value;
					}
				}
				return text || '';
			};
			var Form = new $.Clz();
			Form.include({
				init: function(wrap, opt) {
					var self = this;
					self.commenting = false;
					self.commentType = 'normal';
					self._setOpt(opt);
					self._setDom(wrap);
					self.bindEvent();
				},
				_setOpt: function(opt) {
					opt.allNewsid = opt.allNewsid || opt.newsid;

					this.set('opt', $.extend({
						allNewsid: '',
						channel: '',
						newsid: '',
						parent: '',
						share_url: location.href.split('#')[0],
						video_url: '',
						img_url: '',
						// \u8F93\u5165\u63D0\u793A\uFF0C\u5982\u201C\u8BF7\u8F93\u5165\u8BC4\u8BBA\u201D
						postTip: getMsg('I003'),
						// \u8F93\u5165\u6846\u662F\u5426\u81EA\u52A8\u589E\u9AD8
						autoGrow:false,
						// \u9ED8\u8BA4\u8BC4\u8BBA\u5185\u5BB9\uFF0C\u5982\u6DFB\u52A0\u8BDD\u9898\u201C#\u5218\u5FB7\u534E\u519B\u540C\u6B3E\u519B\u5927\u8863#\u201D
						content: '',
						commented: function() {}
					}, opt, true));
				},
				_setDom: function(wrap) {
					var self = this;
					var opt = self.get('opt');
					wrap = $.byId(wrap);
					var faces = $.cmnt.face.get('common');
					var tplData = {
						content: opt.content,
						postTip: opt.postTip,
						name: $.login.getName(),
						face: $.login.getFace(),
						commonFaces: faces.faces,
						commonFacesBase: faces.base
					};

					var tempHtml = $.cmnt.tpls.get('comment');
					wrap.innerHTML = appTemplate(tempHtml, tplData);
					var builder = $.builder(wrap, 'comment-type');
					self.set('dom', builder.ids);
				},
				bindEvent: function() {
					var self = this;
					var dom = self.get('dom');
					var opt = self.get('opt');
					var domCont = dom.cont;
					var submitComment = function() {
						self.commenting = true;
						var content = $.trim(domCont.value);
						var emptyTip = getPlaceholer(domCont);
						if (content === '' || content === emptyTip) {
							domCont.focus();
							commentTip.show(domCont, 'error', getMsg('I003'), 3e3);
							return;
						}
						//\u8D85\u8FC73000\u5B57\u4E0D\u5141\u8BB8\u63D0\u4EA4
						if ($.byteLength(content) > 6000) {
							domCont.focus();
							commentTip.show(domCont, 'error', '\u60A8\u7684\u8BC4\u8BBA\u5B57\u6570\u8D85\u51FA\u4E86\u4E0A\u96503000\u5B57,\u8BF7\u4FEE\u6539\u540E\u518D\u63D0\u4EA4\uFF01', 3e3);
							return;
						}
						//$globalInfo.isLogin\u4E3A\u901A\u8FC7\u81EA\u5B9A\u4E49\u767B\u5F55\u6210\u529F\u4E8B\u4EF6\u8BBE\u7F6E\u7684\uFF0C\u6BD4\u8F83\u6162\uFF0C\u6709\u7528\u6237\u9000\u51FA\u8FD8\u53EF\u4E3Atrue\u7684\u60C5\u51B5
						//if(!$globalInfo.isLogin){
						if (!$.login.isLogin()) {

							//\u672A\u767B\u5F55,\u5C1D\u8BD5\u767B\u5F55\uFF0C\u767B\u5F55\u6210\u529F\u540E\u8BC4\u8BBA
							// var user = $.trim(dom.user.value);
							//\u5F53\u7528\u6237\u540D\u6216\u5BC6\u7801\u4E3A\u7A7A\u65F6\u4E0D\u5C1D\u8BD5\u767B\u5F55\u8BC4\u8BBA\uFF0C\u8FD4\u56DE
							// \u8BF7\u5148\u767B\u5F55\u518D\u63D0\u4EA4\u8BC4\u8BBA
							// commentTip.show(domCont, 'error', getMsg('I005'), 3e3);
							// dom.user.focus();
							//\u6709\u53EF\u80FD\u5728\u5176\u5B83\u9875\u9762\u6267\u884C\u4E86\u9000\u51FA\uFF0C\u4F46\u672C\u9875\u9762ui\u672A\u53D8\uFF08\u5982\u8FD8\u4E0D\u663E\u793A\u7528\u6237\u540D\u548C\u5BC6\u7801\u8F93\u5165\u6846\uFF09\uFF0C\u518D\u8C03\u7528\u4E00\u6B21\u9000\u51FA\u65B9\u6CD5\u6765\u89E6\u53D1ui\u53D8\u5316
							// TODO \u767B\u5F55\u7EC4\u4EF6\u9000\u51FA\uFF0C\u4F1A\u5BFC\u81F4\u767B\u5F55\u6D6E\u5C42\u9F20\u6807\u79FB\u51FA\u6D88\u5931\uFF0C\u6682\u65F6\u6CE8\u91CA
							// $.login.lOut();

							//\u7ED1\u5B9A\u767B\u5F55\u540E\u8BC4\u8BBA
							self.loginWithComment = true;
							cusEvt.add($, 'my_ce_login', function(e) {
								if (e.data.action === 'loginWithComment' && self.loginWithComment) {
									self.comment();
									self.commenting = false;
									self.loginWithComment = false;
								}
							}, {
								action: 'loginWithComment'
							});
							self.login();

						} else {
							//\u5DF2\u7ECF\u767B\u5F55\u9A6C\u4E0A\u8BC4\u8BBA
							self.comment();
						}
						/*/\u4EA7\u54C1\u4E0D\u8981\u767B\u5F55\u6309\u94AE\uFF0C\u8BC4\u8BBA\u524D\u767B\u5F55*/
					};
					var addPropertyChangeEvent = function(obj, fn) {
						if (window.ActiveXObject) {
							obj.onpropertychange = fn;
						} else {
							obj.addEventListener('input', fn, false);
						}
					};
					//\u70B9\u51FB\u9000\u51FA
					if(dom.logout){
						addEvt(dom.logout, 'click', function(o) {
							$.login.lOut();
						});
					}

					//\u662F\u5426\u8F6C\u53D1\u5230\u5FAE\u535A
					addEvt(dom.weibo, 'click', function(o) {
						//suda\u7EDF\u8BA1\u70B9\u51FB
						uaTrack('entcomment', 'toweibo');
					});
					//\u8BC4\u8BBA
					addEvt(dom.submit, 'click', function() {
						submitComment();
					});

					addEvt(domCont, 'keydown', function(e) {
						e = e || window.event;
						if (e.keyCode == 13 && e.ctrlKey) {
							submitComment();
						}
					});
					addEvt(domCont, 'keyup', function(e) {
						setTimeout(function() {
							self.toggleSubmitBtn();
						}, 200);
					});
					addEvt(dom.wrap, 'click', function(e) {
						setTimeout(function() {
							self.toggleSubmitBtn();
						}, 200);
					});
					addEvt(domCont, 'focus', function(e) {
						setTimeout(function() {
							self.toggleSubmitBtn();
						}, 200);
					});
					addPropertyChangeEvent(domCont, function() {
						self.toggleSubmitBtn();
					});

					if(opt.autoGrow){
						// \u8BBE\u7F6E\u81EA\u52A8\u589E\u9AD8textarea
						self.textareaAugoGrow = new $.app.textareaAutoGrow(domCont,{
							maxHeight:72
						});
					}

					//placeholder
					var placeholders = [domCont];
					$.placeholder(placeholders);

					// \u59D4\u6D3E\u4E8B\u4EF6\u53EA\u6267\u884C\u4E00\u6B21
					if (!onceInited) {
						// \u8868\u60C5\u63D2\u5165
						var Face = $.cmnt.face;
						var dldEvtObj = $.delegatedEvent($.byTag('body')[0]);
						var getTextarea = function(ele) {
							var par = ele.parentNode;
							if (par && par.getAttribute('comment-type') == 'form') {
								return par.getElementsByTagName('textarea')[0];
							} else {
								return arguments.callee(par);
							}
						};
						//\u663E\u793A\u767B\u5F55\u6846
						dldEvtObj.add('login', 'click', function(o) {
							cmnt.commentTip.hide();
							$.login.lIn();
						});
						//\u663E\u793A\u9690\u85CF\u8868\u60C5
						dldEvtObj.add('face-toggle', 'click', function(o) {
							var target = o.el;
							var input = getTextarea(target);
							var faceWrap = '';
							var left = -20;
							var top = 5;
							var layerWidth = '360';
							var cb = null;
							Face.hide();
							Face.show(target, input, faceWrap, left, top, layerWidth, cb);
						});
						//\u63D2\u5165\u8868\u60C5
						dldEvtObj.add('face-insert', 'click', function(o) {
							var target = o.el;
							var txt = o.data.text;
							var type = o.data.type;
							if (type && type == 'out') {
								Face.srcInput = getTextarea(target);
							}
							Face.insert(txt);
						});
						//\u5173\u95ED\u8868\u60C5
						dldEvtObj.add('face-close', 'click', function(o) {
							// if(Face.isShow){
							Face.hide();
							// }
						});

						//\u663E\u793A\u9690\u85CF\u8868\u60C5
						dldEvtObj.add('checkbox-toggle', 'click', function(o) {
							var target = o.el;
							$.app.simCheckbox(target);
						});
						onceInited = true;
					}
					cusEvt.add($, 'my_ce_login', function() {
						self.setName();
					});
					cusEvt.add($, 'my_ce_logout', function() {
						self.setName();
					});
					cusEvt.add($, 'my_ce_weiboLogin', function() {
						self.setName();
					});
					cusEvt.add($, 'my_ce_weiboLogout', function() {
						self.setName();
					});

					return self;
				},
				setName: function() {
					var dom = this.get('dom');
					if(dom.name){
						dom.name.innerHTML = $.login.getName();
					}
					if(dom.head){
						dom.head.innerHTML = $.login.getFace();
					}
				},
				toggleSubmitBtn: function() {
					var self = this;
					var dom = self.get('dom');
					var content = dom.cont;
					var submit = dom.submit;
					var cont = $.trim(content.value);
					var emptyTip = getPlaceholer(content);
					var disableClz = 'btn-disabled';
					if (cont === '' || cont === emptyTip) {
						$.addClass(submit, disableClz);
					} else {
						$.removeClass(submit, disableClz);
					}
				},
				comment: function() {
					var self = this;
					var dom = self.get('dom');
					var opt = self.get('opt');
					var parent = opt.parent;
					//\u8BC4\u8BBA\u5185\u5BB9
					var content = $.trim(dom.cont.value);
					// content = content.replace(/\r\n/g, '<br/>');
					// content = content.replace(/\n/g, '<br/>');
					// content = content.replace(/\r/g, '<br />');
					// content = content.replace(/\t/g, '!@');

					content = content.replace(/\r\n/g, ' ');
					content = content.replace(/\n/g, ' ');
					content = content.replace(/\r/g, ' ');
					content = content.replace(/\t/g, ' ');

					/*var regExp = new RegExp('','g');
					content = content.replace(regExp , '&nbsp');*/
					//\u662F\u5426\u8F6C\u53D1\u5230\u5FAE\u535A\uFF0C\u8F6C\u53D1\u5230\u5FAE\u535A\u9644\u52A0\u539F\u6587\u94FE\u63A5\uFF0C\u5982\u679C\u6709\u89C6\u9891\u94FE\u63A5\u9644\u52A0\u89C6\u9891\u94FE\u63A5
					var toweibo = dom.weibo.getAttribute('checked');

					//\u8BC4\u8BBA\u63A5\u53E3
					$.cmnt.comment({
						channel: opt.channel,
						newsid: opt.newsid,
						parent: parent,
						content: content,
						ispost: toweibo,
						share_url: opt.share_url,
						video_url: opt.video_url,
						img_url: opt.img_url
					},function(m){
						dom.cont.value = '';
						self.commented(content);
						// \u8BC4\u8BBA\u6210\u529F
						var tip = getMsg('I001');
						if (toweibo == '1') {
							// \u8BC4\u8BBA\u6210\u529F\u5E76\u5DF2\u8F6C\u53D1\u5FAE\u535A
							tip = tip+getMsg('I002');
						}
						cmnt.commentTip.show(dom.cont, 'succ', tip, 2e3);
						//\u8BC4\u8BBA\u540E\u52A8\u4F5C\uFF0C\u6A21\u62DF\u5DF2\u7ECF\u8BC4\u8BBA\uFF0C\u76D6\u697C
						// self.commented(content,toweibo);
						//suda\u7EDF\u8BA1\u70B9\u51FB
						uaTrack('entcomment', 'comment');
					},function(){
						cmnt.commentTip.show(dom.cont, 'error', getMsg('I042'), 3e3);
					});

				},
				commented: function(content) {
					var self = this;
					var opt = self.get('opt');
					var allNewsid = opt.allNewsid;
					var loginInfo = $.login.getInfo();
					// \u5047\u6570\u636E\u5904\u7406
					var data = {};
					var hackCmnt = {
						newsid: allNewsid,
						mid: '',
						content: content,
						time: '',
						agree: 0,
						config: $.login.getCommentConfig(),
						nick: loginInfo.sina.nick,
						uid: loginInfo.sina.uid,
						usertype: '',
						area: ''
					};
					var frag = (function(){
						var frag = $.create('div');
						frag.className = 'item item-hack clearfix';
						frag.setAttribute('comment-type', 'item');
						frag.innerHTML = cmnt.itemInnerRender(allNewsid, hackCmnt, data, []);
						return frag;
					})();
					opt.commented(content, frag);
				},
				login: function() {
					uaTrack('entcomment', 'login');
					if ($.login.isLogin()) {
						return;
					}
					$.login.lIn();
				},

				destroy: function() {
					var self = this;
					var dom = self.get('dom');
					var wrap = dom.wrap;
					if (wrap && wrap.parentNode) {
						wrap.parentNode.removeChild(wrap);
					}
					self.set('opt.parent', '');
					self = null;
				}
			});
			return Form;
		})();
		/**
		 * @name ReplyForm
		 * @description \u56DE\u590D\u8868\u5355,\u4E00\u822C\u7528\u4E8E\u70B9\u51FB\u201C\u56DE\u590D\u201D\u65F6\u521B\u5EFA
		 * @class \u56DE\u590D\u8868\u5355
		 * @constructor
		 * @extends Form
		 * @param  {HTMLElement|String} wrap   \u5BB9\u5668id\u6216\u5BB9\u5668\u8282\u70B9
		 * @param  {String} url    \u6570\u636E\u63A5\u53E3
		 * @param  {Object} opt \u914D\u7F6E\u9009\u9879\uFF0C
		 * @param  {String} opt.allNewsid \u7EC4\u65B0\u95FBid
		 * @param  {String} opt.channel \u9891\u9053
		 * @param  {String} opt.newsid \u56DE\u590D\u8BC4\u8BBA\u7684\u65B0\u95FBid
		 * @param  {String} opt.parent \u56DE\u590D\u7684\u7684mid,\u8BC4\u8BBA\u65F6mid\u4E3A\u7A7A
		 * @param  {String} opt.share_url \u5206\u4EAB\u7684\u94FE\u63A5
		 * @param  {String} opt.video_url \u5206\u4EAB\u7684\u89C6\u9891\u5730\u5740
		 * @param  {String} opt.img_url \u5206\u4EAB\u56FE\u7247\u5730\u5740
		 * @param  {String} opt.postTip \u8F93\u5165\u63D0\u793A
		 * @param  {String} opt.content \u9ED8\u8BA4\u8BC4\u8BBA\u5185\u5BB9\uFF0C\u5982\u6DFB\u52A0\u8BDD\u9898
		 * @param {Function} opt.commented \u8BC4\u8BBA\u540E\u56DE\u8C03
		 * @example
		 *  var Form1 = new $.cmnt.ReplyForm('SI_Form1',{
		 *      channel:'kj',
		 *      newsid:'2-1-9216383',
		 *      parent:'',
		 *      commented : function(content,node) {
		 *          // content\u8BC4\u8BBA\u5185\u5BB9 node\u8BC4\u8BBA\u5185\u5BB9\u751F\u6210\u7684\u8BC4\u8BBA\u8282\u70B9
		 *      }
		 *  });
		 */
		cmnt.ReplyForm = (function() {
			var getPar = function(ele, type) {
				var par = ele.parentNode;
				if (par && par.getAttribute && par.getAttribute('comment-type') == type) {
					return par;
				} else if (par.tagName.toLowerCase() == 'body') {
					return par;
				} else {
					return arguments.callee(par, type);
				}
			};
			var cmntData = cmnt.data;
			var Reply = new $.Clz(cmnt.Form);
			Reply.include({
				init: function(wrap, opt) {
					var self = this;
					self.commenting = false;
					self._setOpt(opt);
					self._setDom(wrap);
					self.bindEvent();

				},
				_setDom: function(wrap) {
					var self = this;
					var opt = self.get('opt');
					var trigger = $.byId(wrap);
					wrap = $.create('div');
					wrap.className = 'reply-form-wrap';
					var tplData = {
						name: $.login.getName(),
						face: $.login.getFace(),
						content: opt.content,
						postTip:opt.postTip
					};
					var tempHtml = $.cmnt.tpls.get('reply');
					wrap.innerHTML = appTemplate(tempHtml, tplData);
					// itemCont \u5185\u5BB9\u5BB9\u5668
					var itemCont = getPar(trigger, 'itemCont');
					// itemWrap \u6574\u4E2A\u5F53\u524D\u8BC4\u8BBA\u7684\u5BB9\u5668
					var itemWrap = itemCont.parentNode;
					// commentType in\u4E3A\u697C\u5185\u8BC4\u8BBA out\u4E3A\u697C\u5916\u8BC4\u8BBA

					if (itemWrap.getAttribute('comment-type') == 'item') {
						self.commentType = 'out';
						itemWrap.appendChild(wrap);
					} else {
						self.commentType = 'in';
						$.insertAfter(wrap, itemCont);
					}
					var builder = $.builder(wrap, 'comment-type');
					builder.ids.trigger = trigger;
					builder.ids.itemCont = itemCont;
					builder.ids.itemWrap = itemWrap;
					self.set('dom', builder.ids);

					self.setArrowPos();
				},
				showHdTip:function(txt){
					var self = this;
					var dom = self.get('dom');
					var hd = dom.hd;
					hd.innerHTML = txt;
					hd.style.display = '';
					hd.style.height = 'auto';
				},
				hideHdTip:function(){
					var self = this;
					var dom = self.get('dom');
					var hd = dom.hd;
					hd.style.display = 'none';
					hd.style.height = '0';
				},
				setArrowPos: function() {
					var self = this;
					var dom = self.get('dom');
					if (!dom.replyArrow || !dom.trigger) {
						return;
					}
					var triggerPos = $.getXY(dom.trigger);
					var wrapPos = $.getXY(dom.wrap);
					var arrowWidth = $.getOuterStyle(dom.replyArrow, 'width');
					var triggerWidth = $.getOuterStyle(dom.trigger, 'width');
					var wrapWidth = $.getOuterStyle(dom.wrap, 'width');
					var right = (wrapPos[0] + wrapWidth - triggerPos[0] - triggerWidth / 2 - arrowWidth / 2) + 'px';
					dom.replyArrow.style.right = right;
				},
				commented: function(content) {
					var self = this;
					var opt = self.get('opt');
					var allNewsid = opt.allNewsid;
					var loginInfo = $.login.getInfo();

					console.log(opt);

					// \u5047\u6570\u636E\u5904\u7406
					var dialogList = cmntData.get(allNewsid, 'dialogList');

					// \u7531\u4E8E\u5BF9\u8BDD\u5217\u8868\u662F\u7531\u5F53\u524D\u8BC4\u8BBA\uFF08\u5BF9\u8BDD\u5217\u8868\u6700\u540E\u4E00\u6761\u4E3A\u5F53\u524D\u8BC4\u8BBA\uFF09\u53CA\u5176\u76F8\u5E94\u7684\u56DE\u590D\u5217\u8868\u7EC4\u6210\u7684\uFF0C\u4E5F\u5C31\u662F\u76F8\u672C\u6765\u7684\u7236\u5B50\u5173\u7CFB\u786C\u751F\u751F\u7684\u6539\u4E3A\u5144\u5F1F\u5173\u7CFB\uFF0C
					// \u6240\u6709\u5728\u56DE\u590D\u5BF9\u8BDD\u5217\u8868\u4E2D\u7684\u8BC4\u8BBA\u65F6\uFF08\u9664\u6700\u540E\u4E00\u6761\uFF09\uFF0C\u90FD\u9700\u8981\u8981\u5148\u627E\u5230\u5F53\u524D\u8BC4\u8BBA\u7684mid(opt.dialogParentMid)\uFF0C\u7136\u540E\u627E\u5230\u56DE\u590D\u5217\u8868

					var hackCmnt = {
						newsid: allNewsid,
						mid: '',
						content: content,
						time: '',
						agree: 0,
						config: $.login.getCommentConfig(),
						nick: loginInfo.sina.nick,
						uid: loginInfo.sina.uid,
						usertype: '',
						area: ''
					};


					// \u5047\u6570\u636E\u5904\u7406
					hackCmnt.newsid = allNewsid;

					// \u697C\u5C421\u5F00\u59CB\uFF0C\u9700\u8981-1
					var lastItem = dialogList[opt.parent];
					var atUserName = '';
					if(typeof lastItem !==$.C.U){
						atUserName = cmnt.getUserLnk(lastItem,'@');
					}


					var dialogFrag = (function(){
						var preixHTML = '<div class="dialog-list-hack-btm"></div>';
						var frag = $.create('div');
						var suffixClz = '';
						if(opt.dialogType==='cmnt'){
							suffixClz = ' item-me';
						}
						frag.className = 'item item-hack clearfix item-me item-last' + suffixClz;
						frag.setAttribute('comment-type', 'item');
						frag.innerHTML = preixHTML+cmnt.dialogItemInnerRender(allNewsid, hackCmnt, 'new', atUserName);
						return frag;
					})();
					opt.commented(content, dialogFrag);

					setTimeout(function(){
						self.destroy();
					},2e3);
				}
			});
			return Reply;
		})();
		return cmnt;
	});

})(window);