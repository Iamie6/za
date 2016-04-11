/**
 * @file 评论相关
 * @author Daichang <daichang@staff.sina.com.cn>
 */
(function(exports,undefined) {
	// 向外暴露可直接使用的api
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
	$.register('cmnt', function() {
		/**
		 * @name mysInacMNT.cmnt
		 * @description 评论相关
		 * @module cmnt
		 */
		var cmnt = {};
		/**
		 * @name mysInacMNT.cmnt.config
		 * @description 设置,全局设置
		 * @namespace
		 */
		cmnt.config = {
			encoding:'gbk',
			comment:{

			}
		};
		// 数据存储器
		cmnt.data = (function() {
			// dialogList
			var all = {};
			var _isArray = $.isArray;
			var _extend = $.extend;
			return {
				set: function(newsid, type, data) {
					// 评论列表是数组的话，得先按mid转换成对象合并，有部分评论是没有新闻标题(newstitle)的;有部分新闻也是数组
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
							// 注意评论列表里面的item也有newsid
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
					// 只返回某一类型数据
					if (!id) {
						return all[newsid][type] || all[type] || all;
					}
					// 按id返回某一类型的一组数据
					return all[newsid][type][id];
				}
			};
		})();
		/**
		 * @name face
		 * @description 表情相关
		 * @module app
		 * @submodule face
		 */
		cmnt.face = (function() {
			var commonFacesBase = 'http://www.sinaimg.cn/dy/deco/2012/1217/face/';
			var allFacesBase = 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/';
			var commonFaces = {
				'哈哈': 'haha',
				'偷笑': 'tx',
				'泪': 'lei',
				'嘻嘻': 'xixi',
				'爱你': 'aini',
				'挖鼻屎': 'wbs',
				'心': 'xin'
			};
			var allFaces = {
				'国旗': 'dc/flag_thumb',
				'走你': 'ed/zouni_thumb',
				'笑哈哈': '32/lxhwahaha_thumb',
				'江南style': '67/gangnamstyle_thumb',
				'吐血': '8c/lxhtuxue_thumb',
				'好激动': 'ae/lxhjidong_thumb',
				'lt切克闹': '73/ltqiekenao_thumb',
				'moc转发': 'cb/moczhuanfa_thumb',
				'ala蹦': 'b7/alabeng_thumb',
				'gst耐你': '1b/gstnaini_thumb',
				'xb压力': 'e0/xbyali_thumb',
				'din推撞': 'dd/dintuizhuang_thumb',
				'草泥马': '7a/shenshou_thumb',
				'神马': '60/horse2_thumb',
				'浮云': 'bc/fuyun_thumb',
				'给力': 'c9/geili_thumb',
				'围观': 'f2/wg_thumb',
				'威武': '70/vw_thumb',
				'熊猫': '6e/panda_thumb',
				'兔子': '81/rabbit_thumb',
				'奥特曼': 'bc/otm_thumb',
				'囧': '15/j_thumb',
				'互粉': '89/hufen_thumb',
				'礼物': 'c4/liwu_thumb',
				'呵呵': 'ac/smilea_thumb',
				'嘻嘻': '0b/tootha_thumb',
				'哈哈': '6a/laugh',
				'可爱': '14/tza_thumb',
				'可怜': 'af/kl_thumb',
				'挖鼻屎': 'a0/kbsa_thumb',
				'吃惊': 'f4/cj_thumb',
				'害羞': '6e/shamea_thumb',
				'挤眼': 'c3/zy_thumb',
				'闭嘴': '29/bz_thumb',
				'鄙视': '71/bs2_thumb',
				'爱你': '6d/lovea_thumb',
				'泪': '9d/sada_thumb',
				'偷笑': '19/heia_thumb',
				'亲亲': '8f/qq_thumb',
				'生病': 'b6/sb_thumb',
				'太开心': '58/mb_thumb',
				'懒得理你': '17/ldln_thumb',
				'右哼哼': '98/yhh_thumb',
				'左哼哼': '6d/zhh_thumb',
				'嘘': 'a6/x_thumb',
				'衰': 'af/cry',
				'委屈': '73/wq_thumb',
				'吐': '9e/t_thumb',
				'打哈欠': 'f3/k_thumb',
				'抱抱': '27/bba_thumb',
				'怒': '7c/angrya_thumb',
				'疑问': '5c/yw_thumb',
				'馋嘴': 'a5/cza_thumb',
				'拜拜': '70/88_thumb',
				'思考': 'e9/sk_thumb',
				'汗': '24/sweata_thumb',
				'困': '7f/sleepya_thumb',
				'睡觉': '6b/sleepa_thumb',
				'钱': '90/money_thumb',
				'失望': '0c/sw_thumb',
				'酷': '40/cool_thumb',
				'花心': '8c/hsa_thumb',
				'哼': '49/hatea_thumb',
				'鼓掌': '36/gza_thumb',
				'晕': 'd9/dizzya_thumb',
				'悲伤': '1a/bs_thumb',
				'抓狂': '62/crazya_thumb',
				'黑线': '91/h_thumb',
				'阴险': '6d/yx_thumb',
				'怒骂': '89/nm_thumb',
				'心': '40/hearta_thumb',
				'伤心': 'ea/unheart',
				'猪头': '58/pig',
				'ok': 'd6/ok_thumb',
				'耶': 'd9/ye_thumb',
				'good': 'd8/good_thumb',
				'不要': 'c7/no_thumb',
				'赞': 'd0/z2_thumb',
				'来': '40/come_thumb',
				'弱': 'd8/sad_thumb',
				'蜡烛': '91/lazu_thumb',
				'蛋糕': '6a/cake',
				'钟': 'd3/clock_thumb',
				'话筒': '1b/m_thumb'
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
				icons.push('<a action-type="face-close" class="a-l-close" href="javascript:;" title="关闭"></a>');
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
				box.style.display = 'none'; //避免IE下表情图片定位错误
				(wrap || document.body).appendChild(box);
				return box;
			}
			/**
			 * 在光标位置插入文本
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
			 * 显示表情层
			 * @param{HTML Element}target 定位相对元素（如某按钮）
			 * @param{HTML Element}input 输入目标(用于设置返回表情值)
			 * @param{HTML Element}wrap 表情层的父级，默认为body
			 *
			 * @param{Number}dX 可选参数 微调left值
			 * @param{Number}dY 可选参数 微调top值
			 * @param{String}layerWidth 可选参数 表情层宽度值（默认360px）
			 * */
			F.show = function(target, input, wrap, dX, dY, layerWidth) {
				var iconLayer = F.iconLayer;
				var position;
				if (iconLayer) {
					hideFace();
				}
				// 没有表情层或者父级不同时要渲染表情层
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
				//add "zoom:1" hack to enable IE haslayout,透明边框效果
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
			 * 隐藏表情
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
			 * 获得选中的表情符号(转译文字)
			 * */
			F.getFace = function() {
				return F.iconText;
			};

			F.insert = function(txt, cb) {
				var srcInput = F.srcInput;
				if (txt) {
					F.hide();
					if (srcInput) {
						//在光标位置插入表情文本
						srcInput.focus();
						setTimeout(
							function() {
								var range = srcInput.getAttribute('range');
								if (range == null) { //评论表情处理
									insertText(srcInput, txt);
								} else { //发布器表情处理
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
		// 评论提示
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
				// 注意宽高需要加上padding
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
		// 展开收起
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
				//如果传入的是元素，获取它的子元素,否则，当它是一个数组
				e = e.childNodes || e;
				for (var i = 0; i < e.length; i++) {
					//如果是text就获取它的文本，否则，遍历它的子元素
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
					// 实际最大长度
					var actualMaxLength = maxLenth - 5;
					actualMaxLength = Math.max(actualMaxLength, 0);
					var truncated_node = recursivelyTruncate(wrap, actualMaxLength);
					wrap.style.display = 'none';
					$.insertAfter(truncated_node, wrap);
					appendLnk(wrap, '[收起]&uarr;', 'txt-less txt-toggle', 'less');
					appendLnk(truncated_node, '[展开]&darr;', 'txt-more txt-toggle', 'more');
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

		// 顶
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
		 * @description 投票提示
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
			// 评论需要审查过滤，提交后后端没有回调
			// 在组新闻里，可能需要动态修改评论的newsid,share_url,video_url及img_url
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
			// 以用户设置的commentConfig为准,如：高清图每切换一张图片，得换另一个newsid,img_url及share_url得带#p=第几张
			param = $.extend(param, commentConfig);

			$.app.post(api,param,function(m){
				cb(m);
			},function(){
				// 超时
				timeoutCb();
			});
		};

		// 时间格式化
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
				var formatStr = '刚刚';
				var timeStr = '';
				if (time) {
					//发布时间 tDate1,如果time为空
					var tDate1 = new Date();
					time = time.replace(/-/g, '/');
					timeStr = Date.parse(time);
					tDate1.setTime(parseInt(timeStr, 10));
					//此时时间 tDate
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
		 * @description 模板存储器
		 * @namespace
		 */
		cmnt.tpls = (function() {
			// 评论内容模板 comment
			// 楼层内容模板
			// 评论框模板
			// 回复框模板
			// var divs = '<div';
			// var dive = '</div>';
			// var as = '<a';
			// var ae = '</a>';
			// var spans = '<span';
			// var spane = '</span>';
			// // em一般没有其它标签属性
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
								/*'<div class="latest-tip"><a href="#url" target="_blank">您有5条新消息，点击查看</a></div>',*/
								'<div' + clz + '"latest-wrap"' + ctype + '"latestWrap">',
								'<div' + clz + '"list"' + ctype + '"latestList"></div>',
								'<div' + clz + '"more"' + ctype + '"more"><a href="javascript:;">'+getMsg('I014')+'</a></div>',
								'<div' + clz + '"latest-loading loading"><a href="javascript:;"></a></div>',
								'</div>'
							].join(''),
							dialogItem: [
								'<!-- 头像 start -->',
								'<div' + clz + '"head">' + getFillStr('userFace') + '</div>',
								'<!-- 头像 end -->',

								'<% if(this.floor==="new1") {%>',
									// '<span' + clz + '"num num-new">new</span>',
								'<% }else{ %>',
									// '<span' + clz + '"num">' + getFillStr('floor') + '</span>',
								'<%}%>',

								'<!-- 内容 start -->',
								'<div' + clz + '"cont"' + ctype + '"itemCont">',
								'<div' + clz + '"txt"><span' + clz + '"name ' + getFillStr('icoClz') + '">' + getFillStr('userLnk') + '</span>'+ getFillStr('lastUserLnk') + getFillStr('cont') + '</div>',
								'<div' + clz + '"action">' + getFillStr('time'),
								'<a class="report" href="http://comment5.news.sina.com.cn/comment/skin/feedback_jb.html?mid='+ getFillStr('mid') +'" target="_blank">'+getMsg('I043')+'</a>',
								'<span' + clz + '"btns">',
								'<a' + clz + '"vote" title="'+getMsg('I008')+'"' + atype + '"vote"' + adata + '"channel=' + getFillStr('channel') + '&newsid=' + getFillStr('newsid') + '&mid=' + getFillStr('mid') + '&dialogParentMid='+ getFillStr('dialogParentMid') +'&pos=dialog&floor=' + getFillStr('floor')+'" href="javascript:;">',
								'<span>',
								getMsg('I008'),
								'<% if(parseInt(this.agree)) {%>',
									'<em '+ ctype +'"voteNum">' + getFillStr('agree') + '</em>',
								'<% }else{ %>',
									'<em '+ ctype +'"voteNum"></em>',
								'<%}%>',
								'</span>',
								'</a>',
								'<a' + clz + '"reply"' + atype + '"reply"' + adata + '"channel=' + getFillStr('channel') + '&allNewsid=' + getFillStr('allNewsid') + '&newsid=' + getFillStr('newsid') + '&mid=' + getFillStr('mid') + '&dialogParentMid='+ getFillStr('dialogParentMid') +'&pos=dialog&floor=' + getFillStr('floor')+ '&userLnk=' + getFillStr('oUserLnk') +'" href="javascript:;" hidefocus>回复</a>',
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
						'<!-- 登录信息 start -->',
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
						'<!-- 登录信息 end -->',
						'</div>',
						'<div' + clz + '"ft clearfix">',
						'<div' + clz + '"face">',
						'<a href="javascript:;"' + clz + '"trigger"' + atype + '"face-toggle">表情</a>',
						'</div>',
						'<div' + ctype + '"weibo"' + clz + '"weibo my-sina-comment-chkbox"' + atype + '"checkbox-toggle"> <i></i>',
						'<span>' + getMsg('I018') + '</span>',
						'</div>',
						'<!-- 发布 start -->',
						'<a' + ctype + '"submit" href="javascript:;"' + atype + '"tip-toggle"' + clz + '"comment btn btn-red btn-disabled">' + getMsg('I007') + '</a>',
						'<!-- 发布 end -->',
						'<!-- 登录与注册 start -->',
						'<div' + clz + '"login">',
						'<a' + atype + '"login"' + clz + '"login-lnk" href="javascript:;" onclick="return false;" title="' + getMsg('I029') + '">' + getMsg('I029') + '</a>|<a' + clz + '"register-lnk" target="_blank" href="https://login.sina.com.cn/signup/signup.php" onclick="try{if(window._S_uaTrack){_S_uaTrack(\'entcomment\', \'logon\');}}catch(e){}">' + getMsg('I012') + '</a>',
						'</div>',
						'<!-- 登录与注册前 end -->',
						'</div>'
					].join(''),

					reply: [
						'<div' + clz + '"reply-form-top"' + ctype + '"replyArrow"> <em>◆</em><span>◆</span></div>',
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
						'<a href="javascript:;"' + clz + '"trigger"' + atype + '"face-toggle">表情</a>',
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
				 * @param  {String=} type 类型，目前有：带评论框的评论列表结构模板(formList)；列表结构模板 (list); 评论结构模板 (cont); 盖楼结构模板 (floor); 评论框结构模板 (comment); 回复框结构模板 (reply); 分享模板 (share);
				 * @example
				 * cmnt.tpls.set('list',html);
				 * @param  {String}      对应模板字符串
				 */
				set: function(type, tpl) {
					// 通过getAll方法延迟执行模板中的，getMsg方法
					all = all||getAll();
					all[type] = tpl;
				},

				/**
				 * @name mysInacMNT.cmnt.tpls.get
				 * @memberOf mysInacMNT.cmnt.tpls
				 * @param  {String=} type 类型，目前有：带评论框的评论列表结构模板(formList)；列表结构模板 (list); 评论结构模板 (cont); 盖楼结构模板 (floor); 评论框结构模板 (comment); 回复框结构模板 (reply); 分享模板 (share);
				 * @return {String}      对应模板字符串
				 * @example
				 * var listTplHTML = cmnt.tpls.get('list');
				 */
				get: function(type) {
					// 通过getAll方法延迟执行模板中的，getMsg方法
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
		 * @desc 通过单条评论数据获取该评论作者的微博名，无微博名则返回空字符串
		 * @param  {Object} data 单条评论数据
		 * @return {String}      微博名
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
		 * @desc 通过单条评论数据获取该评论作者的微博的认证类型返回空字符串
		 * @param  {Object} data 单条评论数据
		 * @return {String}      认证类型，y（个人认证）,b（机构认证）或空字符串
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
					//黄
					v = 'y';
				} else {
					//蓝
					v = 'b';
				}
			}
			return v;
		};
		/**
		 * @name mysInacMNT.cmnt.getUserLnk
		 * @desc 通过单条评论数据获取该评论作者主页的链接
		 * @param  {Object} data 单条评论数据
		 * @return {HTMLString}      主页链接
		 */
		cmnt.getUserLnk = function(data,prefix,suffix) {
			prefix = prefix||'';
			suffix = suffix||'';
			var vImg = '';
			var vType = cmnt.getWBV(data);
			var vTit = '新浪个人认证';
			var wrapPrefix = '<span class="my-sina-comment-user-lnk-wrap">';
			var wrapSuffix = '</span>';
			if (vType) {
				if (vType == 'b') {
					vTit = '新浪机构认证';
				}
				vImg = '<img src="http://www.sinaimg.cn/dy/deco/2013/0608/v' + vType + '.png" title="' + vTit + '" style="vertical-align: middle;" />';
			}
			var wbName = cmnt.getWBName(data);
			//如果wb_screen_name为空的话，说明不是用微博名来评论的
			var userLnk = 'http://comment5.news.sina.com.cn/comment/skin/default.html?info_type=1&style=1&user_uid=';
			var result = '';
			if (!wbName) {
				if (data.uid && data.uid != '0') {
					result = '<a target="_blank" href="' + userLnk + data.uid + '" title="'+data.nick+'">' + prefix + data.nick + suffix+'</a>';
				} else {
					result = prefix+data.nick+suffix;
				}
			} else {
				// 之前链接到用户的评论中心 @王图勇 @高蕾 链接到微博 20140828114356
				result = '<a target="_blank" href="http://weibo.com/u/' + data.uid + '" title="'+wbName+'">'+ prefix + wbName + vImg + suffix+'</a>';
			}
			return wrapPrefix+result+wrapSuffix;
		};
		/**
		 * @name mysInacMNT.cmnt.getUserFace
		 * @desc 通过单条评论数据获取该评论作者头像
		 * @param  {Object} data 单条评论数据
		 * @return {HTMLString}      头像
		 */
		cmnt.getUserFace = function(data) {
			var WBUURL = 'http://weibo.com/u/';
			var config = data.config || '';
			var face = $.queryToJson(config, true).wb_profile_img || 'http://www.sinaimg.cn/dy/deco/2012/1018/sina_comment_defaultface.png';
			var wbName = cmnt.getWBName(data);
			//如果wb_screen_name为空的话，说明不是用微博名来评论的
			var userLnk = 'http://comment5.news.sina.com.cn/comment/skin/default.html?info_type=1&style=1&user_uid=';
			if (!wbName) {
				if (data.uid && data.uid != '0') {
					return '<a target="_blank" href="' + userLnk + data.uid + '" title="'+data.nick+'"><img src="' + face + '"/></a>';
				} else {
					return '<img src="' + face + '"/>';
				}

			} else {
				return '<a href="' + WBUURL + data.uid + '" title="' + wbName + '" target="_blank"><img src="' + face + '"/></a>';
			}
		};
		/**
		 * @name mysInacMNT.cmnt.getUserIco
		 * @desc 通过单条评论数据获取该评论作者图标类
		 * @param  {Object} data 单条评论数据
		 * @return {String}      图标css类，name-mobile（手机用户）或name-weibo（微博用户）
		 */
		cmnt.getUserIco = function(data) {
			//用户类型css类
			var typeClzObj = {
				'wap': 'name-mobile',
				'wb': 'name-weibo'
			};
			var typeClz = typeClzObj[data.usertype];
			typeClz = typeClz || '';
			if (!typeClz) {
				//如果有微博链接就是微博用户
				var wbName = cmnt.getWBName(data);
				//如果wb_screen_name为空的话，说明不是用微博名来评论的
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
		 * @desc 把内容插到并滚动到列表最前方
		 * @param {HTMLElement} wrap 容器
		 * @param {HTMLElement} node 播入内容
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
		 * @description 通过评论中的新闻id在newsdict中获取新闻链接
		 * @param  {String} id   新闻id
		 * @param  {Object} data 列表数据
		 * @return {HTMLString}      新闻链接HTML
		 */
		cmnt.getNewsLink = function(id, data) {
			var item = '';
			var html = '';
			if (data.newsdict) {
				var newsdict = data.newsdict;
				item = newsdict[id];
				if (typeof item != UNDEFINED) {
					html = '<p class="lnk"><a target="_blank" href="' + item.url + '" title="' + item.title + '">《' + item.title + '》</a></p>';
				}
			}
			return html;
		};
		/**
		 * @name mysInacMNT.cmnt.itemInnerRender
		 * @param  {String} newsid     新闻id
		 * @param  {Object} d          该条评论数据
		 * @param  {Object} data       列表数据
		 * @param  {Object} tReplyList 该条评论对应的回复列表数据
		 * @return {HTMLString}            拼装好的评论项的innerHTML
		 */
		// cmnt.itemInnerRender = (function() {
		// 	var getTimeStr = cmnt.getTimeStr;
		// 	var splitNum = $.app.splitNum;


		// 	return function(newsid, d, data, tReplyList,showReply) {
		// 		if (typeof d.mid == UNDEFINED) {
		// 			return '';
		// 		}
		// 		showReply = showReply||0;
		// 		// 当加载评论组的新闻列表时，有两个以上的新闻id，一个总新闻id,另外的为子新闻id
		// 		var newsid2 = d.newsid;
		// 		var mid = d.mid;
		// 		// var area = (d.usertype == 'wb'||d.area=='')?'&nbsp;':'['+d.area+']';
		// 		var area = (d.area ? '[' + d.area + ']' : '&nbsp;');
		// 		// 回复时，需要模板回复列表
		// 		try{
		// 			tReplyList = tReplyList || data.replydict[mid];
		// 		}catch(e){

		// 		}
		// 		var tReplyHtml = '';
		// 		if(!showReply){
		// 			tReplyHtml = cmnt.replyListRender(newsid, mid, tReplyList,  1,showReply);
		// 		}

		// 		//是否有回复
		// 		var hasReply = '';
		// 		if (tReplyHtml) {
		// 			hasReply = 1;
		// 		}
		// 		var cont = $.cmnt.face.filter(app.cmntEncodeHtml(d.content));
		// 		// 无盖楼时，最新内容放前面
		// 		var contWithReply = cont+tReplyHtml;
		// 		// var wb_name = cmnt.getWBName(d);
		// 		var tplData = {
		// 			// 频道
		// 			channel: d.channel,
		// 			// 组newsid，当列表加载内容不是组时，allNewsid与newsid一致
		// 			allNewsid: newsid,
		// 			// 该条评论所属的新闻id
		// 			newsid: newsid2,
		// 			mid: mid,
		// 			// 用户头像
		// 			userFace: cmnt.getUserFace(d),
		// 			// 新闻链接,当加载组新闻时，会显示
		// 			newsLnk: cmnt.getNewsLink(newsid2, data),
		// 			userIco: cmnt.getUserIco(d),
		// 			// 带html标签的作者名，用于头像显示
		// 			userLnk: cmnt.getUserLnk(d),
		// 			// 不带html标签的作者名，用于“无盖楼”时的，回复引用，如“//@用户名”
		// 			oUserLnk: stripHTML(cmnt.getUserLnk(d)),
		// 			// 地区
		// 			area: area,
		// 			// 已经渲染好的回复列表html
		// 			reply: tReplyHtml,
		// 			// 已经把[表情]转化为img标签的评论内容
		// 			cont: cont,
		// 			contWithReply:contWithReply,
		// 			// 原始评论内容
		// 			oCont: $.encodeHTML(d.content),
		// 			// 已经格式化的时间，如“1秒前”等
		// 			time: getTimeStr(d.time, 'time'),
		// 			// 已经千分位的支持数
		// 			agree: splitNum(d.agree),
		// 			// 该评论是否有回复列表
		// 			hasReply: hasReply
		// 		};
		// 		var tplHtml = $.cmnt.tpls.get('cont');
		// 		return appTemplate(tplHtml, tplData);
		// 	};
		// })();

		// /**
		//  * @name mysInacMNT.cmnt.itemRender
		//  * @param  {String} newsid     新闻id
		//  * @param  {Object} d          该条评论数据
		//  * @param  {Object} data       列表数据
		//  * @return {HTMLString}            拼装好的评论项HTML字符串
		//  */
		// cmnt.itemRender = function(newsid, d, data,showReply){
		// 	return '<div class="item clearfix" comment-type="item">' + cmnt.itemInnerRender(newsid, d, data, null,showReply||0) + '</div>';
		// };
		/**
		 * @name mysInacMNT.cmnt.dialogInsertList
		 * @desc 把内容插到并滚动到列表最后方
		 * @param {HTMLElement} wrap 容器
		 * @param {HTMLElement} node 播入内容
		 */
		//
		cmnt.dialogInsertList = function(wrap, node) {
			var firstClz = 'item-first';
			var firstChild = wrap.firstChild;
			var lastChild = wrap.lastChild;
			// 回复后，最新内容会变成第一个
			$.removeClass(firstChild,firstClz);
			// 回复后，单条内容会变成最后一个
			$.removeClass(lastChild,'item-one');
			$.addClass(lastChild,'item-last');
			wrap.insertBefore(node, firstChild);
		};
		/**
		 * @name mysInacMNT.cmnt.dialogItemInnerRender
		 * @param  {String} newsid     新闻id
		 * @param  {Object} d          该条评论数据
		 * @param  {Object} data       列表数据
		 * @param  {Object} tReplyList 该条评论对应的回复列表数据
		 * @return {HTMLString}            拼装好的评论项的innerHTML
		 */
		cmnt.dialogItemInnerRender = (function() {
			var getTimeStr = cmnt.getTimeStr;
			var splitNum = $.app.splitNum;
			// 回复XXX:
			var atTplHtml = getMsg('I036');
			var colon = getMsg('I037');

			return function(newsid, item,i,lastUserLnk) {
				var area = (item.area ? '[' + item.area + ']' : '&nbsp;');
				//是否有回复
				var hasReply = '';
				if (i !== 0) {
					hasReply = 1;
				}
				var tplHtml = '';
				var tempHtml = '';
				var userLnk = cmnt.getUserLnk(item,'',colon);
				var cont = $.cmnt.face.filter(app.cmntEncodeHtml(item.content));

				// 无盖楼的话，盖楼内容链接成字符串
				var tplData = {
					allNewsid: newsid||item.newsid,
					channel: item.channel,
					newsid: item.newsid,
					mid: item.mid,
					dialogParentMid:item.dialogParentMid,
					// 用户头像
					userFace: cmnt.getUserFace(item),
					floor: (i + 1),
					userIco: cmnt.getUserIco(item),
					userLnk: userLnk,
					// 不带html标签的作者名，用于“无盖楼”时的，回复引用，如“//@用户名”
					oUserLnk: stripHTML(cmnt.getUserLnk(item)),
					lastUserLnk:(lastUserLnk?appTemplate(atTplHtml, {userLnk:lastUserLnk}):''),
					area: area,
					cont: cont,
					time: getTimeStr(item.time, 'time'),
					agree: splitNum(item.agree),
					hasReply: hasReply,
					pos:'dialog'
				};
				tplHtml = $.cmnt.tpls.get('dialogItem');
				tempHtml = appTemplate(tplHtml, tplData);
				return tempHtml;
			};
		})();

		/**
		 * @name mysInacMNT.cmnt.itemRender
		 * @param  {String} newsid     新闻id
		 * @param  {Object} item          该条评论数据
		 * @param  {Object} data       列表数据
		 * @return {HTMLString}            拼装好的评论项HTML字符串
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
		 * @param  {String} newsid     对应评论的新闻id
		 * @param  {String} mid        对应评论的id
		 * @param  {Array} tReplyList 回复列表数据
		 * @return {HTMLString}        拼装好的回复列表字符串
		 */
		cmnt.dialogListRender = (function() {

			return function(newsid, d,data,type) {
				if (typeof d.mid == UNDEFINED) {
					return '';
				}

				var mid = d.mid;
				var dialogList = [];
				// 先通过thread在replydict里找看有没有回复列表，没有则通mid来查找
				var tReplyList = [];
				// if(type === 'reply'){
					tReplyList = data.replydict[d.thread];
					if(!tReplyList){
					    tReplyList = data.replydict[mid];
					}

					if($.isArray(tReplyList)){
						if(type === 'cmnt'){
							// 只保留自己的回复 通过d.uid判断
							tReplyList = (function(list,uid){
								var myList = [];
								for (var i = 0, len = list.length; i < len; i++) {
									var item = list[i];
									if(item.uid === uid){
										myList.push(item);
									}
								}
								return myList;
							})(tReplyList,d.uid);
						}
						dialogList = dialogList.concat(tReplyList);
					}
				// }
				// 当前评论对话列表中！
				dialogList.push(d);

				tReplyList =  data.parentdict[d.thread];
				if(!tReplyList){
				    tReplyList = data.parentdict[mid];
				}
				if($.isArray(tReplyList)){
					// if(type==='cmnt'){
						// 接口parentdict的数据顺序不对
						tReplyList.reverse();

					// }
					dialogList = dialogList.concat(tReplyList);
				}

				cmnt.data.set(d.newsid, 'dialogList', dialogList);

				var dialogHtml = [];
				var lastUserLnk = '';
				var hdHtml = '';
				var isHidden = false;
				var meIndex = Infinity;
				if (dialogList && dialogList.length > 0) {
					var len = dialogList.length;
					// if(type==='cmnt'){
					// 	dialogList.reverse();
					// }
					for (var i = 0; i < len; i++) {
						var item = dialogList[i];
						// “回复我的”倒序
						// if(type === 'reply'){
							lastUserLnk = '';
							if(i+1<len){
								// lastUserLnk = cmnt.getUserLnk(dialogList[i+1],'@');
								// 通过 cmnt_infos 找到该评论所@的人
								var parentItem = null;
								if(data.cmnt_infos){
									parentItem = data.cmnt_infos[item.parent];
								}
								if(parentItem){
									lastUserLnk = cmnt.getUserLnk(parentItem,'@');
								}
							}
						// }

						var isMe = (item.mid===mid);

						item.dialogParentMid = mid;
						var isFirst = (i===0);
						var isLast = (i+1===len);
						var isMiddle = (!isLast&&!isFirst&&isMe&&len>2);
						var isOne = (len===1);
						dialogHtml.push(cmnt.dialogItemRender(newsid,item,i,lastUserLnk,isHidden,isMe,isLast,isFirst,isMiddle,isOne));

						if(isMe){
							meIndex = i;
						}
						// cmnt默认只显示一条回复内容
						if(type==='cmnt'&&meIndex!==Infinity && meIndex+1 === i){
							// if(mid==='54756F81-3D8798DA-62DD2B70-891-99F'){
							// 	debugger;
							// }
							isHidden = true;
							if(i+1<len){
								dialogHtml.push('<div class="dialog-list-bd" action-type="dialogMore" comment-type="dialogBd"><a href="javascript:;" hidefocus=""><i><em></em></i>'+getMsg('I034')+'</a></div>');
							}
						}
						if(type==='reply'&&!isHidden&&isMe){
							isHidden = true;
							if(i+1<len){
								dialogHtml.push('<div class="dialog-list-bd" action-type="dialogMore" comment-type="dialogBd"><a href="javascript:;" hidefocus=""><i><em></em></i>'+getMsg('I034')+'</a></div>');
							}
						}
					}

				}
				if (dialogHtml.length!==0) {
					dialogHtml = '<div class="dialog-list-wrap" comment-type="dialogWrap"> <div class="dialog-list-title clearfix" newsid="'+d.newsid+'">' + cmnt.getNewsLink(d.newsid,data) +' </div> <div class="dialog-list" comment-type="dialogList">' + dialogHtml.join('') + '</div></div>';
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
				Layer.dom.innerHTML = '<div class="my-sina-comment-list-layer-hd"><h2>查看对话</h2><a action-type="layerHide" href="javascript:;" class="close"></a></div><div class="my-sina-comment-list-layer-bd">'+(html||'')+'</div>';
				var winSize = $.app.getWinSize();
				var layerWH = getWH(Layer.dom, 648, 380);
				var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
				// 注意宽高需要加上padding
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
		 * @class 专用于加载评论数据
		 * @constructor
		 * @param {String} url 数据接口地址
		 * @param {Object} opt 配置选项
		 * @param {Object} opt.param 数据接口参数
		 * @param {Function} opt.beforeLoad 数据加载前回调
		 * @param {Function} opt.loaded 数据加载后回调
		 * @param {Function} opt.error 数据加载出错回调
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
				 * @description 获取数据
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
					// 加载前
					opt.beforeLoad();

					$.jsLoad(url, function() {
						var msg = exports[guid];
						if (typeof msg == UNDEFINED) {
							return;
						}
						// 有时出错时code也为0，但存在error字段
						if (msg.result.status.code === 0 && typeof msg.result.error == UNDEFINED) {
							self.data = msg.result;
							// 加载完成后
							opt.loaded(self);
						} else {
							var error = msg.result.status.msg;
							// 数据加载出错
							opt.error(error);
							throw new Error('数据加载出错：' + error + ';URL:' + url);
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
		 * @class 专用于加载评论列表并渲染
		 * @constructor
		 * @extends DataLoader
		 * @param  {HTMLElement|String} wrap   容器id或容器节点
		 * @param  {String} url    数据接口
		 * @param  {Object} config 配置选项，
		 * @param  {Object} config.param 数据接口参数
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
				//默认显示页面数
				var sudaHasMore = false;
				return function(newsid, cmntlist, config) {
					var html = [];
					if (typeof cmntlist !== 'object' || cmntlist.length === 0) {
						return '';
					}
					var data = config.data;
					// var dis = 'none';
					var htmlStr = '';
					var i = 0,len,item;
					//最新评论只显示第一页，其它通过更多来加载
					for (i = 0, len = cmntlist.length; i < len; i++) {
						var item = cmntlist[i];
						html.push(cmnt.dialogListRender(newsid, item, data,config.type));

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
					// 目前打开的对话列表
					self.currentDialog = null;
					var defaultConfig = {
						maxWordCount:Infinity,
						// 每次分页条数
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
							//style=1本来为皮肤，应该为group=1
							// group: config.group || config.style,
							// compress: 0,
							ie: encoding,
							oe: encoding,
							page: 1,
							// 后端接口 page_size must is 20,50,100
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
				 * 获取wrap下的相关dom节点，并存储起来
				 * @member _setDom
				 * @private
				 * @param  {HTMLElement|String} wrap 容器
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
				 * 列表加载前执行方法
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
				 * 列表加载后执行方法
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
					// 没有评论
					if(!data.cmntlist||!hasData){
						if(opt.config.type==='cmnt'){
							self.setMore(getMsg('I100'));
						}else{
							self.setMore(getMsg('I101'));
						}
						return;
					}
					if(!data.cmnt_infos){
						console.error('接口没返回cmnt_infos');
					}
					//触发自定义事件
					if (self.firstRender) {
						//定时更新时间
						cmnt.updateTime(dom.wrap);
						self.firstRender = false;
					}
					// I006: '已到最后一页',提示改成I027
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
					// 如果要隐藏列表，刚不渲染列表
					if (optConfig.hideList) {
						return;
					}
					// pageNum 最新评论假分页条数，如每次加载100条，pageNum为10条，就分成10页，只显示第1页，点击更多时，逐一显示余下9页
					var pageNum = optConfig.pageNum;
					// hotPageNum 最热评论假分页，类似pageNum
					// 热帖第一页评论数改为热贴显示数，没有更多，默认10条 201312311503
					var hotPageNum = optConfig.hotPageNum;
					var param = opt.param;
					var newsid = param.newsid;
					//数据总条数 20130422 by wanglei12
					if (typeof data.count == UNDEFINED) {
						self.totalNum = 0;
					} else {
						self.totalNum = self.data.count.show;
					}

					//评论列表
					var cmntlist = data.cmntlist;
					if (typeof cmntlist === 'undefined' || !cmntlist.length) {
						return;
					}
					//把每次加载进来的评论列表合并起来
					if (self.cList) {
						self.cList = self.cList.concat(cmntlist);
					} else {
						self.cList = cmntlist;
					}

					var latestHtml = '';
					var config = {
						data: data,
						pageNum: pageNum,
						type:optConfig.type
					};

					latestHtml = listRender(newsid, cmntlist, config);
					//第一次加载,也就是第一页时，再渲染热门评论和innerHTML时最新评论,否则appenchild加到结尾
					if (param.page == 1) {
						dom.latestList.innerHTML = latestHtml;
					} else {
						var fragment = $.create('div');
						fragment.innerHTML = latestHtml;
						dom.latestList.appendChild(fragment);
					}

					self.setDataClz(latestHtml);
					//加载完成
					self.loading = false;
					self.bindEvent();
					return self;
				},
				bindEvent: function() {
					var self = this;
					var dom = self.get('dom');
					// 通过“赞”按钮来获取“回复”按钮的信息
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
						// 防止在同一个div里重复添加委派事件
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
						//展开
						dldEvtObj.add('txt-toggle', 'click', function(o) {
							$.cmnt.truncate.toggle(o.el,o.data.type);
						});
						//顶
						dldEvtObj.add('vote', 'click', function(o) {
							var ele = o.el;
							var oData = o.data;
							var hasVoted = ele.getAttribute('voted');
							if (hasVoted == 'true') {
								return;
							}
							// 赞的同时还提示用户回复
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
							var voted = '已' + vote;

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
						// 回复
						dldEvtObj.add('reply', 'click', function(o) {
							console.log('reply');
							self.toggleReply(o);
							$.cmnt.commentTip.hide();
						});
						// 加载更多 最新评论
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

					// 回复应该使用的是单条评论的newsid
					ReplyForm = new $.cmnt.ReplyForm(ele, {
						allNewsid: actionData.allNewsid,
						channel: actionData.channel,
						newsid: actionData.newsid,
						parent: actionData.mid,
						dialogParentMid:actionData.dialogParentMid,
						// content: content,
						commented: commented,
						autoGrow:typeof optConfig.autoGrow === 'undefined'?true: optConfig.autoGrow,
						postTip:postTip,
						// 用于模拟回复时“回复@XXX”
						floor:actionData.floor,
						// 用于区分回复是否是从对话列表发起的,可选值dialog
						pos:actionData.pos
					});
					var contBox = ReplyForm.get('dom.cont');
					// 无盖楼的话，点击打开回复框时，光标应该插入到内容最前面
					$.app.textareaUtils.insertText(contBox, '', 0, 0);
				},
				setDataClz: function(html) {
					var self = this;
					var dom = self.get('dom');
					// 添加展开收起
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
				 * 设置页面，为下次加载数据做准备
				 * @member setPage
				 * @param {Number} page 要设置的页数
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
		 * @class 评论表单
		 * @constructor
		 * @param  {HTMLElement|String} wrap   容器id或容器节点
		 * @param  {String} url    数据接口
		 * @param  {Object} opt 配置选项，
		 * @param  {String} opt.allNewsid 组新闻id
		 * @param  {String} opt.channel 频道
		 * @param  {String} opt.newsid 回复评论的新闻id
		 * @param  {String} opt.parent 回复的的mid,评论时mid为空
		 * @param  {String} opt.share_url 分享的链接
		 * @param  {String} opt.video_url 分享的视频地址
		 * @param  {String} opt.img_url 分享图片地址
		 * @param  {String} opt.postTip 输入提示
		 * @param  {String} opt.content 默认评论内容
		 * @param {Function} opt.commented 评论后回调
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
					//ie10 下的ie7 无法用input.getAttribute('placeholder')取到placeholder值，奇怪！
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
						// 输入提示，如“请输入评论”
						postTip: getMsg('I003'),
						// 输入框是否自动增高
						autoGrow:false,
						// 默认评论内容，如添加话题“#刘德华军同款军大衣#”
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
						//超过3000字不允许提交
						if ($.byteLength(content) > 6000) {
							domCont.focus();
							commentTip.show(domCont, 'error', '您的评论字数超出了上限3000字,请修改后再提交！', 3e3);
							return;
						}
						//$globalInfo.isLogin为通过自定义登录成功事件设置的，比较慢，有用户退出还可为true的情况
						//if(!$globalInfo.isLogin){
						if (!$.login.isLogin()) {

							//未登录,尝试登录，登录成功后评论
							// var user = $.trim(dom.user.value);
							//当用户名或密码为空时不尝试登录评论，返回
							// 请先登录再提交评论
							// commentTip.show(domCont, 'error', getMsg('I005'), 3e3);
							// dom.user.focus();
							//有可能在其它页面执行了退出，但本页面ui未变（如还不显示用户名和密码输入框），再调用一次退出方法来触发ui变化
							// TODO 登录组件退出，会导致登录浮层鼠标移出消失，暂时注释
							// $.login.lOut();

							//绑定登录后评论
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
							//已经登录马上评论
							self.comment();
						}
						/*/产品不要登录按钮，评论前登录*/
					};
					var addPropertyChangeEvent = function(obj, fn) {
						if (window.ActiveXObject) {
							obj.onpropertychange = fn;
						} else {
							obj.addEventListener('input', fn, false);
						}
					};
					//点击退出
					if(dom.logout){
						addEvt(dom.logout, 'click', function(o) {
							$.login.lOut();
						});
					}

					//是否转发到微博
					addEvt(dom.weibo, 'click', function(o) {
						//suda统计点击
						uaTrack('entcomment', 'toweibo');
					});
					//评论
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
						// 设置自动增高textarea
						self.textareaAugoGrow = new $.app.textareaAutoGrow(domCont,{
							maxHeight:72
						});
					}

					//placeholder
					var placeholders = [domCont];
					$.placeholder(placeholders);

					// 委派事件只执行一次
					if (!onceInited) {
						// 表情插入
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
						//显示登录框
						dldEvtObj.add('login', 'click', function(o) {
							cmnt.commentTip.hide();
							$.login.lIn();
						});
						//显示隐藏表情
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
						//插入表情
						dldEvtObj.add('face-insert', 'click', function(o) {
							var target = o.el;
							var txt = o.data.text;
							var type = o.data.type;
							if (type && type == 'out') {
								Face.srcInput = getTextarea(target);
							}
							Face.insert(txt);
						});
						//关闭表情
						dldEvtObj.add('face-close', 'click', function(o) {
							// if(Face.isShow){
							Face.hide();
							// }
						});

						//显示隐藏表情
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
					//评论内容
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
					//是否转发到微博，转发到微博附加原文链接，如果有视频链接附加视频链接
					var toweibo = dom.weibo.getAttribute('checked');

					//评论接口
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
						// 评论成功
						var tip = getMsg('I001');
						if (toweibo == '1') {
							// 评论成功并已转发微博
							tip = tip+getMsg('I002');
						}
						cmnt.commentTip.show(dom.cont, 'succ', tip, 2e3);
						//评论后动作，模拟已经评论，盖楼
						// self.commented(content,toweibo);
						//suda统计点击
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
					// 假数据处理
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
		 * @description 回复表单,一般用于点击“回复”时创建
		 * @class 回复表单
		 * @constructor
		 * @extends Form
		 * @param  {HTMLElement|String} wrap   容器id或容器节点
		 * @param  {String} url    数据接口
		 * @param  {Object} opt 配置选项，
		 * @param  {String} opt.allNewsid 组新闻id
		 * @param  {String} opt.channel 频道
		 * @param  {String} opt.newsid 回复评论的新闻id
		 * @param  {String} opt.parent 回复的的mid,评论时mid为空
		 * @param  {String} opt.share_url 分享的链接
		 * @param  {String} opt.video_url 分享的视频地址
		 * @param  {String} opt.img_url 分享图片地址
		 * @param  {String} opt.postTip 输入提示
		 * @param  {String} opt.content 默认评论内容，如添加话题
		 * @param {Function} opt.commented 评论后回调
		 * @example
		 *  var Form1 = new $.cmnt.ReplyForm('SI_Form1',{
		 *      channel:'kj',
		 *      newsid:'2-1-9216383',
		 *      parent:'',
		 *      commented : function(content,node) {
		 *          // content评论内容 node评论内容生成的评论节点
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
					// itemCont 内容容器
					var itemCont = getPar(trigger, 'itemCont');
					// itemWrap 整个当前评论的容器
					var itemWrap = itemCont.parentNode;
					// commentType in为楼内评论 out为楼外评论

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

					// 假数据处理
					var dialogList = cmntData.get(allNewsid, 'dialogList');

					// 由于对话列表是由当前评论（对话列表最后一条为当前评论）及其相应的回复列表组成的，也就是相本来的父子关系硬生生的改为兄弟关系，
					// 所有在回复对话列表中的评论时（除最后一条），都需要要先找到当前评论的mid(opt.dialogParentMid)，然后找到回复列表

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


					// 假数据处理
					hackCmnt.newsid = allNewsid;

					// 楼层1开始，需要-1
					var lastItem = dialogList[opt.parent];
					var lastUserLnk = '';
					if(typeof lastItem !==$.C.U){
						lastUserLnk = cmnt.getUserLnk(lastItem,'@');
					}


					var dialogFrag = (function(){
						var preixHTML = '<div class="dialog-list-hack-top"></div>';
						var frag = $.create('div');
						frag.className = 'item item-hack clearfix item-first';
						frag.setAttribute('comment-type', 'item');
						frag.innerHTML = preixHTML+cmnt.dialogItemInnerRender(allNewsid, hackCmnt, 'new', lastUserLnk);
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