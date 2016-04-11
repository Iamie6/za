/**
 * @file 评论相关
 * @author Daichang <daichang@staff.sina.com.cn>
 */
(function(exports,undefined) {
	// 向外暴露可直接使用的api
	var $ = exports.___sinacMNT___;
	var doc = $.doc;
	var uaTrack = $.app.track;
	var UNDEFINED = $.C.U;
	var app = $.app;
	var getMsg = $.msg.get;
	var appTemplate = $.app.template;
	if (!$.cssSupports('borderRadius')) {
		var docEle = document.documentElement;
		$.addClass(docEle,'sinacMNT-no-border-radius');
	}
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
	$.register('cmnt', function() {
		/**
		 * @name sinacMNT.cmnt
		 * @description 评论相关
		 * @module cmnt
		 */
		var cmnt = {};
		/**
		 * @name sinacMNT.cmnt.config
		 * @description 设置,全局设置
		 * @namespace
		 */
		cmnt.config = {
			encoding:'gbk',
			fixFace:false,
			comment:{

			}
		};
		// 数据存储器
		cmnt.data = (function() {
			// cmntlist, replydict, newsdict
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
				icons.push('<table class="sina-comment-layer">');
				icons.push('<tbody><tr> <td class="a-l-top-l"></td> <td class="a-l-top-c"></td> <td class="a-l-top-r"></td> </tr> <tr> <td class="a-l-m-l"></td> <td class="a-l-m-c"><div class="a-l-box">');
				icons.push('<div class="a-l-box-con" style="' + layerWidth + '">');
				icons.push('<div class="sina-comment-face-list clearfix">');
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
				// 根据设置表情添加插件父亲节点功能，利于跟随屏幕固定
				// TODO 移到配置中
				if(cmnt.config.fixFace){
					wrap = getPar(target,'form');
				}
				if (!iconLayer || F.wrap != wrap) {
					iconLayer = renderFace(wrap, layerWidth, allFaces, allFacesBase);
					F.wrap = wrap;
				}

				if (wrap && wrap !== document.body) {
					position = {
						top:target.offsetTop+target.offsetHeight,
						left:target.offsetLeft
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
				iconLayer.className = 'sina-comment-layer-wrap';
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
						return !imgUrl ? $1 : '<img class="sina-comment-txt-face" title="' + $1 + '" alt="' + $1 + '" src="' + imgUrl + '" />';
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
				div.className = 'sina-comment-tip';
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
				div.className = 'sina-comment-vote-tip';
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
		// 分享
		cmnt.shareTip = (function() {
			var encode = encodeURIComponent;
			/**
			 * 通过微博名和新浪昵称返回要分享的名字
			 * @param  {String} name           微博名
			 * @param  {String} nick           新闻昵称
			 * @return {String}                名字
			 */
			var getShareName = function(data) {
				var getWBName = function(data) {
					if (typeof data.config == UNDEFINED) {
						return '';
					}
					var temp = data.config.match(/wb_screen_name=([^&]*)/i);
					return temp ? temp[1] : '';
				};
				var wbNmae = getWBName(data);
				var name = '';
				var nick = data.nick;
				var usertype = data.usertype;
				if (wbNmae) {
					name = '@' + wbNmae;
				} else {
					if (usertype == 'wap') {
						name = '新浪手机用户';
						if (nick != '手机用户') {
							name += nick;
						}
					} else {
						name = '新浪网友';
						if (nick) {
							name += nick;
						}
					}
				}
				return name;
			};
			var getShareContent = function(title, shareName, content) {
				title = title.replace(/<.*?>/ig, '');
				var tplData = {
					title: title,
					name: shareName,
					content: content
				};
				var tplHtml = $.cmnt.tpls.get('share');
				title = appTemplate(tplHtml, tplData);
				return encode(title);
			};
			var getUrlData = function(data, newWin) {
				// 分享【新浪微博用户 @微博号】 对【标题】的#精彩新闻评论# 【评论地址】
				///从评论列表中找出当前评论数据
				// var s = screen;
				// var d = document;

				// 该条评论的相关内容及对应新闻的内容都可以通过curCmntlist拿到

				// 需要分享到的站点
				var site = data.site;
				var mid = data.mid;
				var sinaAppkey = data.sinaAppkey||'';
				var tencentAppkey = data.tencentAppkey||'';
				// 当前评论
				var curCmntlist = cmnt.data.get(data.allNewsid, 'cmntlist', mid);
				// 评论内容
				var content = curCmntlist.content;
				// 新闻id
				var newsid = curCmntlist.newsid;
				// 新闻所属频道
				var channel = curCmntlist.channel;
				// 分享图片
				var img = '';
				var setWinUrl = function() {
					var link = location.href;

					var shareName = getShareName(curCmntlist);
					// 新闻标题
					var newsData = (function() {
						// 新闻标题 注意单条评论接口并没有新闻信息，新闻信息都放在单条评论中
						var newsData = cmnt.data.get(data.allNewsid, 'newsdict', newsid);
						if (typeof newsData == UNDEFINED && curCmntlist.news_info) {
							return curCmntlist.news_info;
						} else {
							return newsData;
						}
					})();
					link = newsData.url||link;
					var cont = getShareContent(newsData.title||'', shareName, content);

					var API = {
						'sina': {
							base: 'http://v.t.sina.com.cn/share/share.php?',
							param: ['url=', encode(link), '&title=', cont, '&source=', encode('新浪新闻评论'), '&sourceUrl=', encode('http://news.sina.com.cn/hotnews/'), '&content=', 'gb2312', '&pic=', encode(img), '&appkey=', (sinaAppkey||'445563689')].join('')
						},
						'tencent': {
							base: 'http://share.v.t.qq.com/index.php?',
							param: ['c=', 'share', '&a=', 'index', '&url=', encode(link), '&title=', cont, '&content=', 'gb2312', '&pic=', encode(img), '&appkey=', (tencentAppkey||'dcba10cb2d574a48a16f24c9b6af610c'), '&assname=', '${RALATEUID}'].join('')
						}
					};

					if (newWin) {
						newWin.location.href = [API[site].base, API[site].param].join('');
					}
				};

				//获取评论截图
				var getImgSrc = function(o) {
					var cbName = 'iJax' + Date.parse(new Date());
					var url = 'http://comment5.news.sina.com.cn/image';
					try {
						doc.domain = 'sina.com.cn';
					} catch (e) {

					}
					window[cbName] = function(m) {
						if (typeof m == 'string') {
							m = eval('(' + m + ')');
						}
						var cmntImg = m.result.image || '';
						//新闻图片+评论截图
						img = img ? img + '||' + cmntImg : cmntImg;
						if (/Firefox/.test(navigator.userAgent)) {
							setTimeout(function() {
								setWinUrl();
							}, 30);
						} else {
							setWinUrl();
						}
					};
					var param = '';
					if (!$.ua.isFF) {
						param = {
							channel: channel,
							newsid: newsid,
							mid: mid,
							version:'1',
							format: 'js',
							callback: cbName
						};
						$.ijax.request(url, {
							POST: param
						});
					} else {
						param = 'channel=' + channel + '&newsid=' + newsid + '&mid=' + mid+ '&version=1';
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
				};
				//如果不带回复评论或者评论不超过80字直接只带新闻配图，否则还带评论截图,楼里回复（data.type == 'reply'）
				var maxCmntLen = 80;
				if (data.hasReply || $.byteLength(content) > maxCmntLen * 2) {
					content = $.strLeft(content, maxCmntLen * 2);
					// 获取截图后，在回调里设置窗口地址
					getImgSrc();
				} else {
					//直接设置窗口地址
					setWinUrl();
				}
			};

			var Tip = {};
			Tip.timeout = null;
			Tip.animate = null;
			Tip.trigger = null;

			var getTip = function(config) {
				var query = $.jsonToQuery(config);
				if (!Tip.dom) {
					Tip.dom = $.create('div');
					Tip.dom.className = 'sina-comment-share';
					Tip.dom.style.display = 'none';
					Tip.dom.style.position = 'absolute';
					$.byTag('body')[0].appendChild(Tip.dom);
					$.addEvent(Tip.dom, 'mouseover', function() {
						clearTimeout(Tip.timeout);
					});
					$.addEvent(Tip.dom, 'mouseout', function() {
						Tip.hide(2e3);
					});
					var dldEvtObj = $.delegatedEvent(Tip.dom);
					dldEvtObj.add('share', 'click', function(o) {
						var oData = o.data;
						//点击时马上打开窗口，防止被拦截
						var newWin = window.open('', 'mb', ['toolbar=0,status=0,resizable=1,width=440,height=430,left=', (screen.width - 440) / 2, ',top=', (screen.height - 430) / 2].join(''));
						//获取url数据（用来填充窗口地址）
						getUrlData(oData, newWin);
					});
				}
				Tip.dom.innerHTML = '<a title="'+getMsg('I020')+'" class="sina-comment-share-sina" href="javascript:;" action-type="share" action-data="' + query + '&site=sina">新浪</a><a title="'+getMsg('I021')+'" class="sina-comment-share-qq" href="javascript:;" action-type="share" action-data="' + query + '&site=tencent">腾讯</a>';
			};
			var hide = function(closeTime) {
				clearTimeout(Tip.timeout);
				if (Tip.animate) {
					Tip.animate.pause();
				}
				closeTime = closeTime || 0;
				if (closeTime) {
					Tip.timeout = setTimeout(function() {
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
								$.removeClass(Tip.trigger, 'share-active');
								Tip.trigger = null;
							}
						});
					}, closeTime);
				}

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
			var show = function(ele, config, closeTime) {
				if (Tip.trigger == ele) {
					return;
				}
				getTip(config);
				clearTimeout(Tip.timeout);
				if (Tip.animate) {
					Tip.animate.pause();
				}
				// var offset = $.getXY(ele);
				var offset = $.getPosition(ele);
				var tipWH = getWH(Tip.dom, 100, 30);
				var eleWH = getWH(ele, 100, 40);
				$.removeClass(Tip.trigger, 'share-active');
				Tip.trigger = ele;
				$.setStyle(Tip.dom, {
					top: (offset.top) + 'px',
					left: (offset.left + eleWH.width / 2 - tipWH.width / 2) + 'px',
					// marginLeft:-tipWH.width/2+'px',
					opacity: 0,
					display: 'block'
				});
				Tip.hide(closeTime);

				/*elemId, cssObj, time, animType, funObj*/
				$.animate(Tip.dom, {
					top: (offset.top - 37) + 'px',
					opacity: 1
				}, 200, 'Tween.Quad.easeIn', {
					start: function(el) {
						$.addClass(Tip.trigger, 'share-active');
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
		 * @name sinacMNT.cmnt.tpls
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
							formList: '<div class="sina-comment-form sina-comment-top"' + ctype + '"form"> </div> <div class="sina-comment-list"' + ctype + '"list"> </div>',
							list: [
								/*'<div class="latest-tip"><a href="#url" target="_blank">您有5条新消息，点击查看</a></div>',*/
								'<div' + clz + '"hot-wrap"' + ctype + '"hotWrap">',
								'<div' + clz + '"title"><span' + clz + '"name">'+getMsg('I015')+'</span> <a' + atype + '"reflash"' + adata + '"type=hot"' + clz + '"reflash" href="javascript:;"' + ctype + '"hotReflash">'+getMsg('I017')+'</a> </div>',
								'<div' + clz + '"hot-loading loading"><a href="javascript:;"></a></div>',
								'<div' + clz + '"list"' + ctype + '"hotList"></div>',
								'</div>',
								'<div' + clz + '"latest-wrap"' + ctype + '"latestWrap">',
								'<div' + clz + '"title"><span' + clz + '"name">'+getMsg('I016')+'</span> <a' + atype + '"reflash"' + adata + '"type=latest"' + clz + '"reflash" href="javascript:;"' + ctype + '"latestReflash">'+getMsg('I017')+'</a> </div>',
								'<div' + clz + '"latest-loading loading"><a href="javascript:;"></a></div>',
								'<div' + clz + '"list"' + ctype + '"latestList"></div>',
								'<div' + clz + '"more"' + atype + '"getMore"' + adata + '"type=latest" ' + ctype + '"latestMore"><a href="javascript:;">'+getMsg('I014')+'</a></div>',
								'</div>',
								'<div' + clz + '"all-loading loading"><a href="javascript:;"></a></div>',
							].join(''),
							cont: [
								'<!-- 头像 start -->',
								'<div' + clz + '"head">' + getFillStr('userFace') + '</div>',
								'<!-- 头像 end -->',
								'<!-- 内容 start -->',
								'<div' + clz + '"cont"' + ctype + '"itemCont">',
								'<div' + clz + '"info">',
								'<span' + clz + '"name ' + getFillStr('userIco') + '">',
								getFillStr('userLnk'),
								'</span>',
								'<span' + clz + '"area">' + getFillStr('area') + '</span>',
								getFillStr('newsLnk'),
								'</div>',
								'<div' + clz + '"txt" comment-type="itemTxt">',
									getFillStr('contWithReply'),
								'</div>',
								'<div' + clz + '"action">',
								getFillStr('time'),
								'<a class="report" href="http://comment5.news.sina.com.cn/comment/skin/feedback_jb.html?mid='+ getFillStr('mid') +'" target="_blank">'+getMsg('I043')+'</a>',
								'<span' + clz + '"btns">',


								'<% if(this.hasReply && parseInt(this.hasReply)) {%>',
									'<a' + clz + '"show"' + atype + '"dialogShow"' + adata + '"channel=' + getFillStr('channel') + '&allNewsid=' + getFillStr('allNewsid') + '&newsid=' + getFillStr('newsid') + '&mid=' + getFillStr('mid') + '&userLnk=' + getFillStr('oUserLnk') + '&cont=' + getFillStr('oCont') + '" href="javascript:;" hidefocus>'+getMsg('I034')+'</a>',
								'<% }%>',


								'<a' + clz + '"vote" title="'+getMsg('I008')+'"' + atype + '"vote"' + adata + '"channel=' + getFillStr('channel') + '&newsid=' + getFillStr('newsid') + '&mid=' + getFillStr('mid') + '" href="javascript:;">',
								'<span>',
								getMsg('I008'),

								'<% if(parseInt(this.agree)) {%>',
									'<em '+ ctype +'"voteNum">' + getFillStr('agree') + '</em>',
								'<% }else{ %>',
									'<em '+ ctype +'"voteNum"></em>',
								'<%}%>',

								'</span>',
								'</a>',
								'<a' + clz + '"reply"' + atype + '"reply"' + adata + '"channel=' + getFillStr('channel') + '&allNewsid=' + getFillStr('allNewsid') + '&newsid=' + getFillStr('newsid') + '&mid=' + getFillStr('mid')  + '&userLnk=' + getFillStr('oUserLnk') + '&cont=' + getFillStr('oCont') + '" href="javascript:;" hidefocus>'+getMsg('I009')+'</a>',
								/*'<a' + clz + '"share"' + atype + '"shareHover"' + adata + '"hasReply=' + getFillStr('hasReply') + '&channel=' + getFillStr('channel') + '&allNewsid=' + getFillStr('allNewsid') + '&newsid=' + getFillStr('newsid') + '&mid=' + getFillStr('mid') + '" href="javascript:;">',
								'<em>'+getMsg('I019')+'</em>',
								'</a>',*/
								'</span>',
								'</div>',
								'</div>',
								'<!-- 内容 end -->'
							].join(''),
							floor: [
								'<!-- 头像 start -->',
								'<div' + clz + '"head">' + getFillStr('userFace') + '</div>',
								'<!-- 头像 end -->',
								'<!-- 内容 start -->',
								'<div' + clz + '"cont"' + ctype + '"itemCont">',
								'<div' + clz + '"info">',
								'<span' + clz + '"num">' + getFillStr('floor') + '</span>',
								'<span' + clz + '"name ' + getFillStr('icoClz') + '">' + getFillStr('userLnk') + '</span>',
								'<span' + clz + '"area">' + getFillStr('area') + '</span>',
								'</div>',
								'<div' + clz + '"txt">' + getFillStr('cont') + '</div>',
								'<div' + clz + '"action">' + getFillStr('time') + '<span' + clz + '"btns">',

								'<a' + clz + '"vote" title="'+getMsg('I008')+'"' + atype + '"vote"' + adata + '"channel=' + getFillStr('channel') + '&newsid=' + getFillStr('newsid') + '&mid=' + getFillStr('mid') + '" href="javascript:;">',
								'<span>',
								getMsg('I008'),
								'<% if(parseInt(this.agree)) {%>',
									'<em '+ ctype +'"voteNum">' + getFillStr('agree') + '</em>',
								'<% }else{ %>',
									'<em '+ ctype +'"voteNum"></em>',
								'<%}%>',
								'</span>',
								'</a>',
								'<a' + clz + '"reply"' + atype + '"reply"' + adata + '"channel=' + getFillStr('channel') + '&allNewsid=' + getFillStr('allNewsid') + '&newsid=' + getFillStr('newsid') + '&mid=' + getFillStr('mid') + '" href="javascript:;" hidefocus>回复</a>',
								/*'<a' + clz + '"share"' + atype + '"shareHover"' + adata + '"hasReply=' + getFillStr('hasReply') + '&channel=' + getFillStr('channel') + '&allNewsid=' + getFillStr('allNewsid') + '&newsid=' + getFillStr('newsid') + '&mid=' + getFillStr('mid') + '" href="javascript:;">',
								'<em>'+getMsg('I019')+'</em>',
								'</a>',*/
								'</span>',
								'</div>',
								'</div>'
							].join(''),
							dialogItem: [
								'<!-- 头像 start -->',
								'<div' + clz + '"head">' + getFillStr('userFace') + '</div>',
								'<!-- 头像 end -->',

								'<% if(this.floor==="new1") {%>',
									'<span' + clz + '"num num-new">new</span>',
								'<% }else{ %>',
									'<span' + clz + '"num">' + getFillStr('floor') + '</span>',
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
								'<a' + clz + '"reply"' + atype + '"reply"' + adata + '"channel=' + getFillStr('channel') + '&allNewsid=' + getFillStr('allNewsid') + '&newsid=' + getFillStr('newsid') + '&mid=' + getFillStr('mid') + '&dialogParentMid='+ getFillStr('dialogParentMid') +'&pos=dialog&floor=' + getFillStr('floor')+'" href="javascript:;" hidefocus>回复</a>',
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
						'<textarea' + ctype + '"cont"' + clz + '"box"  autocomplete="off" placeholder="' + getFillStr('postTip') + '" value="' + getFillStr('content') + '">' + getFillStr('content') + '</textarea>',
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
						'<div' + ctype + '"weibo"' + clz + '"weibo sina-comment-chkbox"' + atype + '"checkbox-toggle"> <i></i>',
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
						'<div' + clz + '"sina-comment-form reply-form"' + ctype + '"form">',
						'<div class="hd"' + ctype + '"hd">',
						'</div>',
						'<div class="bd">',
						'<div' + clz + '"editor">',
						'<div' + clz + '"inner">',
						'<textarea' + ctype + '"cont"' + clz + '"box"  autocomplete="off" placeholder="' + getFillStr('postTip') + '" value="' + getFillStr('content') + '">' + getFillStr('content') + '</textarea>',
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
						'<div' + ctype + '"weibo"' + clz + '"weibo sina-comment-chkbox"' + atype + '"checkbox-toggle"> <i></i>',
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
					].join(''),
							share: '#精彩评论#【' + getFillStr('title') + '】' + getFillStr('name') + '：' + getFillStr('content')
					};
			};
			/** @scope sinacMNT.cmnt.tpls */
			return {
				/**
				 * @name sinacMNT.cmnt.tpls.set
				 * @memberOf sinacMNT.cmnt.tpls
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
				 * @name sinacMNT.cmnt.tpls.get
				 * @memberOf sinacMNT.cmnt.tpls
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
		 * @name sinacMNT.cmnt.getWBName
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
		 * @name sinacMNT.cmnt.getWBV
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
		 * @name sinacMNT.cmnt.getUserLnk
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
			var wrapPrefix = '<span class="sina-comment-user-lnk-wrap">';
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
		 * @name sinacMNT.cmnt.getUserFace
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
		 * @name sinacMNT.cmnt.getUserIco
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
		 * @name sinacMNT.cmnt.insertList
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
		 * @name sinacMNT.cmnt.replyListRender
		 * @param  {String} newsid     对应评论的新闻id
		 * @param  {String} mid        对应评论的id
		 * @param  {Array} tReplyList 回复列表数据
		 * @param  {Boolean} add        是否添加到cmnt.data评论数据库中
		 * @return {HTMLString}        拼装好的回复列表字符串
		 */
		cmnt.replyListRender = (function() {
			var getTimeStr = cmnt.getTimeStr;
			var splitNum = $.app.splitNum;
			var _cmntData = cmnt.data;

			return function(newsid, mid, tReplyList,  add,showReply) {
				//该条评论的回复列表
				if (add) {
					_cmntData.set(newsid, 'cmntlist', tReplyList);
				}
				var tReplyHtml = '';
				if (tReplyList && tReplyList.length > 0) {
					for (var i = 0, len = tReplyList.length; i < len; i++) {
						var item = tReplyList[i];

						var area = (item.area ? '[' + item.area + ']' : '&nbsp;');
						//是否有回复
						var hasReply = '';
						if (i !== 0) {
							hasReply = 1;
						}
						var tplHtml = '';
						var tempHtml = '';
						var userLnk = cmnt.getUserLnk(item,showReply?'':'@');
						var cont = $.cmnt.face.filter(app.cmntEncodeHtml(item.content));
						// 无盖楼的话，盖楼内容链接成字符串
						if(!showReply){
							tReplyHtml = '//'+ userLnk+'：'+cont+tReplyHtml;
						}else{
							var tplData = {
								allNewsid: newsid,
								channel: item.channel,
								newsid: item.newsid,
								mid: item.mid,
								floor: (i + 1),
								userIco: cmnt.getUserIco(item),
								userLnk: userLnk,
								area: area,
								cont: cont,
								time: getTimeStr(item.time, 'time'),
								agree: splitNum(item.agree),
								hasReply: hasReply
							};
							tplHtml = $.cmnt.tpls.get('floor');
							tempHtml = appTemplate(tplHtml, tplData);
							// tReplyHtml = '<div comment-type="floor" class="floor clearfix">' + tReplyHtml + tempHtml + '</div>';
							tReplyHtml = tReplyHtml + '<div comment-type="floor" class="floor floor-out clearfix">' + tempHtml + '</div>';
						}
					}
				}
				if (tReplyHtml !== '') {
					tReplyHtml = '<div class="floor-wrap flat-floor-wrap">' + tReplyHtml + '</div>';
				}
				return tReplyHtml;
			};
		})();
		/**
		 * @name sinacMNT.cmnt.getNewsLink
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
		 * @name sinacMNT.cmnt.itemInnerRender
		 * @param  {String} newsid     新闻id
		 * @param  {Object} d          该条评论数据
		 * @param  {Object} data       列表数据
		 * @param  {Object} tReplyList 该条评论对应的回复列表数据
		 * @return {HTMLString}            拼装好的评论项的innerHTML
		 */
		cmnt.itemInnerRender = (function() {
			var getTimeStr = cmnt.getTimeStr;
			var splitNum = $.app.splitNum;
			var stripHTML = function(str) {
				var reTag = /<(?:.|\s)*?>/g;
				return str.replace(reTag, '');
			};

			return function(newsid, d, data, tReplyList,showReply) {
				if (typeof d.mid == UNDEFINED) {
					return '';
				}
				showReply = showReply||0;
				// 当加载评论组的新闻列表时，有两个以上的新闻id，一个总新闻id,另外的为子新闻id
				var newsid2 = d.newsid;
				var mid = d.mid;
				// var area = (d.usertype == 'wb'||d.area=='')?'&nbsp;':'['+d.area+']';
				var area = (d.area ? '[' + d.area + ']' : '&nbsp;');
				// 回复时，需要模板回复列表
				try{
					tReplyList = tReplyList || data.replydict[mid];
				}catch(e){

				}
				var tReplyHtml = '';
				if(!showReply){
					tReplyHtml = cmnt.replyListRender(newsid, mid, tReplyList,  1,showReply);
				}

				//是否有回复
				var hasReply = '';
				if (tReplyHtml) {
					hasReply = 1;
				}
				var cont = $.cmnt.face.filter(app.cmntEncodeHtml(d.content));
				// 无盖楼时，最新内容放前面
				var contWithReply = cont+tReplyHtml;
				// var wb_name = cmnt.getWBName(d);
				var tplData = {
					// 频道
					channel: d.channel,
					// 组newsid，当列表加载内容不是组时，allNewsid与newsid一致
					allNewsid: newsid,
					// 该条评论所属的新闻id
					newsid: newsid2,
					mid: mid,
					// 用户头像
					userFace: cmnt.getUserFace(d),
					// 新闻链接,当加载组新闻时，会显示
					newsLnk: cmnt.getNewsLink(newsid2, data),
					userIco: cmnt.getUserIco(d),
					// 带html标签的作者名，用于头像显示
					userLnk: cmnt.getUserLnk(d),
					// 不带html标签的作者名，用于“无盖楼”时的，回复引用，如“//@用户名”
					oUserLnk: stripHTML(cmnt.getUserLnk(d)),
					// 地区
					area: area,
					// 已经渲染好的回复列表html
					reply: tReplyHtml,
					// 已经把[表情]转化为img标签的评论内容
					cont: cont,
					contWithReply:contWithReply,
					// 原始评论内容
					oCont: $.encodeHTML(d.content),
					// 已经格式化的时间，如“1秒前”等
					time: getTimeStr(d.time, 'time'),
					// 已经千分位的支持数
					agree: splitNum(d.agree),
					// 该评论是否有回复列表
					hasReply: hasReply
				};
				var tplHtml = $.cmnt.tpls.get('cont');
				return appTemplate(tplHtml, tplData);
			};
		})();

		/**
		 * @name sinacMNT.cmnt.itemRender
		 * @param  {String} newsid     新闻id
		 * @param  {Object} d          该条评论数据
		 * @param  {Object} data       列表数据
		 * @return {HTMLString}            拼装好的评论项HTML字符串
		 */
		cmnt.itemRender = function(newsid, d, data,showReply){
			return '<div class="item clearfix" comment-type="item">' + cmnt.itemInnerRender(newsid, d, data, null,showReply||0) + '</div>';
		};
		/**
		 * @name sinacMNT.cmnt.dialogInsertList
		 * @desc 把内容插到并滚动到列表最后方
		 * @param {HTMLElement} wrap 容器
		 * @param {HTMLElement} node 播入内容
		 */
		//
		cmnt.dialogInsertList = function(wrap, node) {
			wrap.appendChild(node);
		};
		/**
		 * @name sinacMNT.cmnt.dialogItemInnerRender
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
					allNewsid: newsid,
					channel: item.channel,
					newsid: item.newsid,
					mid: item.mid,
					dialogParentMid:item.dialogParentMid,
					// 用户头像
					userFace: cmnt.getUserFace(item),
					floor: (i + 1),
					userIco: cmnt.getUserIco(item),
					userLnk: userLnk,
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
		 * @name sinacMNT.cmnt.itemRender
		 * @param  {String} newsid     新闻id
		 * @param  {Object} item          该条评论数据
		 * @param  {Object} data       列表数据
		 * @return {HTMLString}            拼装好的评论项HTML字符串
		 */
		cmnt.dialogItemRender = function(newsid, item, i,lastUserLnk, isHidden){
			var hiddenClz = isHidden?'item-hide':'';

			return '<div class="item clearfix '+hiddenClz+'" comment-type="item">' + cmnt.dialogItemInnerRender(newsid, item,i, lastUserLnk) + '</div>';
		};

		/**
		 * @name sinacMNT.cmnt.dialogListRender
		 * @param  {String} newsid     对应评论的新闻id
		 * @param  {String} mid        对应评论的id
		 * @param  {Array} tReplyList 回复列表数据
		 * @return {HTMLString}        拼装好的回复列表字符串
		 */
		cmnt.dialogListRender = (function() {

			return function(newsid, d,data) {
				if (typeof d.mid == UNDEFINED) {
					return '';
				}
				var defaultLen = 5;
				var mid = d.mid;
				// 回复时，需要模板回复列表
				var tReplyList = data.replydict[mid];
				// 把当前评论也添加到回复列表中，模拟成对话列表，也就是父子关系改为兄弟关系，具体咨询 @陈军！
				if(!$.inArray(d,tReplyList)){
					tReplyList.push(d);
				}
				var tReplyHtml = '';
				var lastUserLnk = '';
				var hdHtml = '';
				if (tReplyList && tReplyList.length > 0) {
					var len = tReplyList.length;
					for (var i = 0; i < len; i++) {
						var item = tReplyList[i];
						item.dialogParentMid = mid;
						var isHidden = (i<len- defaultLen);
						// tReplyHtml = '<div comment-type="floor" class="floor clearfix">' + tReplyHtml + tempHtml + '</div>';
						tReplyHtml = tReplyHtml + cmnt.dialogItemRender(newsid,item,i,lastUserLnk,isHidden);
						lastUserLnk = cmnt.getUserLnk(item,'@');
					}
					if(len>defaultLen){
						hdHtml = '<div class="dialog-list-hd" comment-type="dialogHd"><a class="more" action-type="dialogMore" href="javascript:;" hidefocus="">'+getMsg('I040')+'</a></div>';
					}
				}


				if (tReplyHtml !== '') {
					tReplyHtml = '<div class="dialog-list-wrap" comment-type="dialogWrap">'+ hdHtml +'<div class="dialog-list" comment-type="dialogList">' + tReplyHtml + '</div><div class="dialog-list-ft"><a class="fold" action-type="dialogHide" href="javascript:;" hidefocus="">'+getMsg('I035')+'<em></em></a></div></div>';
				}
				return tReplyHtml;
			};
		})();
		/**
		 * @name sinacMNT.cmnt.itemRender
		 * @param  {String} newsid     新闻id
		 * @param  {Object} d          该条评论数据
		 * @param  {Object} data       列表数据
		 * @return {HTMLString}            拼装好的评论项HTML字符串
		 */
		cmnt.dialogRender = function(newsid, d, data){
			if (typeof d.mid == UNDEFINED) {
				return '';
			}
			// 用回复列表来模拟对话，模仿微博，不知道为什么要这么干？？具体咨询陈军和王图勇
			var dialogListItems = cmnt.dialogListRender(newsid,d,data);
			return dialogListItems;
		};
		cmnt.getDialog = (function(){

			return function(data){
				var mid = data.mid;
				// 当前评论
				var allNewsid = data.allNewsid;
				var allData = cmnt.data.get(allNewsid);
				var curCmntlist = cmnt.data.get(allNewsid, 'cmntlist', mid);

				var html = cmnt.dialogRender(allNewsid, curCmntlist, allData);
				return html;
			};
		})();
		cmnt.layer = (function(){
			var Layer = {};
			Layer.timeout = null;
			Layer.animate = null;
			var getLayer = function() {
				var div = $.create('div');
				div.className = 'sina-comment-list-layer';
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
				Layer.dom.innerHTML = '<div class="sina-comment-list-layer-hd"><h2>查看对话</h2><a action-type="layerHide" href="javascript:;" class="close"></a></div><div class="sina-comment-list-layer-bd">'+(html||'')+'</div>';
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
		 * @name Dialog
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
		cmnt.Dialog = (function() {

			// var cmntData = cmnt.data;
			var Dialog = new $.Clz();
			Dialog.include({
				init: function(trigger, opt) {
					var self = this;
					self.set('opt',opt);
					self.trigger = trigger;
					self.render();
					self.show();
				},
				render:function(){
					var self = this;
					var opt = self.get('opt');
					var commentItem = getPar(self.trigger, 'item');
					var wrap = document.createElement('div');
					wrap.innerHTML = $.cmnt.getDialog(opt);
					$.insertAfter(wrap,commentItem);
					var builder = $.builder(wrap, 'comment-type');
					self.set('dom', builder.ids);
					self.wrap = wrap;
					self.commentItem = commentItem;
				},
				show:function(){
					var self = this;
					// self.commentItem.style.display = 'none';
					self.wrap.style.display = 'block';
					self.trigger.innerHTML = getMsg('I035');
					self.set('show',true);

					app.track('entcomment','details');
				},
				hide:function(){
					var self = this;
					// self.commentItem.style.display = '';
					self.wrap.style.display = 'none';
					self.trigger.innerHTML = getMsg('I034');
					self.set('show',false);
					self.hideMore();
				},
				showMore:function(){
					var self = this;
					$.addClass(self.wrap,'dialog-list-show');
				},
				hideMore:function(){
					var self = this;
					$.removeClass(self.wrap,'dialog-list-show');
				}

			});
			return Dialog;
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
							if(window.console&&console.log){
								console.log('数据加载出错：' + error + ';URL:' + url);
							}
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
					var PAGENUM = config.pageNum;
					// firstPageNum 第一页显示多少条，默认和pagenum一致辞
					var FIRSTPAGENUM = config.firstPageNum||PAGENUM;
					var HOTPAGNUM = config.hotPageNum;
					var html = [];
					if (typeof cmntlist !== 'object' || cmntlist.length === 0) {
						return '';
					}
					var type = config.type;
					var data = config.data;
					var index = 0;
					var divNum = 0;
					var totalPages = 0;
					// var dis = 'none';
					var htmlStr = '';
					var i = 0,len,item;

					var numCount = 0;
					//最新评论只显示第一页，其它通过更多来加载
					if (type == 'latest') {
						for (i = 0, len = cmntlist.length; i < len; i++) {
							numCount++;
							var separatorPageNum = index<FIRSTPAGENUM?FIRSTPAGENUM:PAGENUM;

							item = cmntlist[i];
							if (numCount === 1) {
								html.push('<div class="sina-comment-page sina-comment-page-hide" style="display:none;">');
								divNum++;
								totalPages++;
							}
							html.push(cmnt.itemRender(newsid, item,data));
							if (numCount === separatorPageNum) {
								html.push('</div>');
								divNum++;
								numCount = 0;
							}
							index++;
						}
						// 如果div为单数则补充一个闭合div标签
						if (divNum % 2) {
							html.push('</div>');
						}
					} else if (type == 'hot') {
						for (i = 0, len = cmntlist.length; i < len; i++) {
							item = cmntlist[i];
							//最热评论全部显示 热贴不再分页，全部显示 20131231
							if (index < HOTPAGNUM) {
								html.push(cmnt.itemRender(newsid, item, data));
								index++;
							}
						}
					} else {
						//单条评论渲染
						for (i = 0, len = cmntlist.length; i < len; i++) {
							item = cmntlist[i];
							html.push(cmnt.itemRender(newsid, item, data));
							if ((index + 1) / HOTPAGNUM == 1) {
								html.push('</div>');
								divNum++;
							}
						}
					}
					if (!sudaHasMore && totalPages > 1) {
						//suda统计点击,显示第一个“更多评论”的次数，说白了就是每个正文加载时多于10条的次数
						uaTrack('entcomment', 'onemorepageview');
						sudaHasMore = true;
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
						clickMoreTimes:Infinity,
						maxWordCount:Infinity,
						// 每次分页条数
						pageNum: 10,
						// 热门评论条数
						hotPageNum: 10,
						// 是否隐藏列表
						hideList:0
					};
					config = $.extend(defaultConfig,config);
					// 用于记录“更多”点击次数，在刷新重新加载“最新评论”时，需要清零
					self.set('clickMoreTimes',0);
					// 用于记录“已显示”的评论条数
					self.set('countShowed',0);

					var encoding = cmnt.config.encoding;
					var options = {
						url: url || 'http://comment5.news.sina.com.cn/page/info',
						config: config,
						param: {
							version:1,
							format: 'js',
							channel: config.channel,
							newsid: config.newsid,
							//style=1本来为皮肤，应该为group=1
							group: config.group || config.style,
							compress: 0,
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
					var listType = self.get('opt.listType');
					$.addClass(dom.wrap, 'sina-comment-list-' + listType + '-loading');
					if(optConfig.hideList){
						dom.wrap.style.display = 'none';
					}
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
					var data = self.data;
					var listType = opt.listType;
					//触发自定义事件
					if (self.firstRender) {
						//定时更新时间
						cmnt.updateTime(dom.wrap);
						self.firstRender = false;
					}
					$.removeClass(dom.wrap, 'sina-comment-list-' + listType + '-loading');

					//数据中有评论是否关闭的变量
					if (data.news && data.news.status == 'N_CLOSE') {
						dom.wrap.style.display = 'none';
						return;
					}
					// I006: '已到最后一页',提示改成I027
					if (data.cmntlist.length === 0) {
						if(opt.config.isBBS){
							self.setMore(getMsg('I006'));
						}else{
							self.setMoreLink(getMsg('I027'));
						}

					}
				},
				setMoreLink:function(txt,prefix){
					var self = this;
					var opt = self.get('opt');
					var group = opt.param.group||'0';
					var html = (prefix||'')+'<a target="_blank" href="http://comment5.news.sina.com.cn/comment/skin/default.html?channel=' + opt.param.channel + '&newsid=' + opt.param.newsid + '&group=' + group + '">'+txt+'</a>';
					self.setMore(html);
				},
				setMore:function(html){
					var self = this;
					var dom = self.get('dom');
					if (dom.latestMore) {
						if(!dom.latestMore.__innerHTML__){
							dom.latestMore.__innerHTML__ = dom.latestMore.innerHTML;
						}
						// 去掉“点击更多”委派事件
						dom.latestMore.setAttribute('action-type','');
						dom.latestMore.innerHTML = html;

					}
				},
				// 恢复“加载更多”
				reSetMoreLink:function(){
					var self = this;
					var dom = self.get('dom');
					if (dom.latestMore&&dom.latestMore.__innerHTML__) {
						dom.latestMore.innerHTML = dom.latestMore.__innerHTML__;
					}
					// 恢复“点击更多”委派事件
					dom.latestMore.setAttribute('action-type','getMore');
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
					var listType = opt.listType;
					//本条新闻信息
					self.setNewsData(data);
					//数据总条数 20130422 by wanglei12
					if (typeof data.count == UNDEFINED) {
						self.totalNum = 0;
					} else {
						self.totalNum = self.data.count.show;
					}

					//评论列表
					var cmntlist = data.cmntlist;
					var hotlist = data.hot_list;
					if (!cmntlist.length) {
						self.bindEvent();
						return;
					}
					//把每次加载进来的评论列表合并起来
					if (self.cList) {
						self.cList = self.cList.concat(cmntlist);
					} else {
						self.cList = cmntlist;
					}
					self.cList = self.cList.concat(hotlist);

					var latestHtml = '';
					var hotHtml = '';
					var config = {
						data: data,
						pageNum: pageNum,
						hotPageNum: hotPageNum,
						firstPageNum:optConfig.firstPageNum
					};
					//如果列表类型listType为hot只更新hot列表，latest类似，all时全部更新,默认为all,刷新时区分hot和latest
					if (listType == 'all') {
						config.type = 'hot';
						hotHtml = listRender(newsid, hotlist, config);
						config.type = 'latest';
						latestHtml = listRender(newsid, cmntlist, config);
						dom.hotList && (dom.hotList.innerHTML = hotHtml);
						dom.latestList.innerHTML = latestHtml;
						// 新渲染的评论都是隐藏的，得通过showFirstHidePage展示第一个隐藏评论页
						self.showFirstHidePage();
						// 检查点击“更多”次数
						self.checkClickTimes(self.get('clickMoreTimes'));
					} else if (listType == 'latest') {
						config.type = 'latest';
						latestHtml = listRender(newsid, cmntlist, config);
						//第一次加载,也就是第一页时，再渲染热门评论和innerHTML时最新评论,否则appenchild加到结尾
						if (param.page == 1) {
							dom.latestList.innerHTML = latestHtml;
						} else {
							var fragment = $.create('div');
							fragment.innerHTML = latestHtml;
							dom.latestList.appendChild(fragment);
						}

						// 新渲染的评论都是隐藏的，得通过showFirstHidePage展示第一个隐藏评论页
						self.showFirstHidePage();
						// 检查点击“更多”次数
						self.checkClickTimes(self.get('clickMoreTimes'));
					} else {
						config.type = 'hot';
						hotHtml = listRender(newsid, hotlist, config);
						dom.hotList && (dom.hotList.innerHTML = hotHtml);
					}
					self.setDataClz(listType, hotHtml, latestHtml);
					//加载完成
					self.loading = false;
					self.bindEvent();
					return self;
				},
				showFirstHidePage:function(){
					var self = this;
					var dom = self.get('dom');
					var hidePageClz = 'sina-comment-page-hide';
					var showPageClz = 'sina-comment-page-show';
					var pages = $.byClass(hidePageClz,dom.latestList);

					if(pages&&pages.length>0){
						var curPage = pages[0];
						var countShowed = self.get('countShowed');
						self.set('countShowed',0);
						if(curPage){
							var items = $.byClass('item',curPage);
							// 统计总共显示的评论数
							self.set('countShowed',countShowed + items.length);
							curPage.style.display = '';
							$.removeClass(curPage,hidePageClz);
							$.addClass(curPage,showPageClz);
						}
						return true;
					}else{
						return false;
					}
				},
				getLestNum:function(){
					var self = this;
					return self.totalNum - self.get('countShowed');
				},
				getMoreLatest:function(){
					var self = this;
					var clickMoreTimes = self.get('clickMoreTimes');

					// 先判断有没有隐藏的分页，有则直接展示，没有并且评论还没有加载完，则通过接口加载更多
					if(!self.showFirstHidePage()){
						var page = self.get('opt.param.page');
						self.setMore('<a href="javascript:;">'+getMsg('I041')+'</a>');

						if(self.getLestNum()>0){
							self.setType('latest').setPage(page + 1).getData(function(){
								if(self.data&&self.data.cmntlist&&self.data.cmntlist.length>0){
									self.reSetMoreLink();
								}
							});
						}
					}
					self.set('clickMoreTimes',clickMoreTimes+1);
					self.checkClickTimes(clickMoreTimes+1);

				},
				checkClickTimes:function(times){
					var self = this;
					var opt = self.get('opt');
					var config = opt.config;
					var num = self.getLestNum();
					var prefix = '';
					// 如果点击“更多”次数，大于或等于配置的次数，则显示“查看更多精彩评论”，请用户跳转到评论评论最终页
					if(times >= config.clickMoreTimes){
						// I028: '还有<% this.num %>条评论，'
						// I027: '更多精彩评论&gt;&gt;'

						if(num>0){
							prefix = appTemplate(getMsg('I028'),{
								num:num
							});
						}
						self.setMoreLink(prefix+getMsg('I027'));
					}
					if(num<=0){
						if(opt.config.isBBS){
							self.setMore(getMsg('I006'));
						}else{
							self.setMoreLink(prefix+getMsg('I027'));
						}
					}
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
						var dldEvtObj = $.delegatedEvent(dom.wrap);
						// var dldEvtBody = $.delegatedEvent($.byTag('body')[0]);

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
							self.toggleReply(o);
							$.cmnt.commentTip.hide();
						});
						dldEvtObj.add('dialogShow', 'click', function(o) {
							var ele = o.el;
							var oData = o.data;
							var mid = oData.mid;
							var Dialog = self.currentDialog;
							if (Dialog) {
								var oldMid = Dialog.get('opt.mid');
								var show = Dialog.get('show');
								if (oldMid == mid) {
									if(show){
										Dialog.hide();
									}else{
										Dialog.show();
									}
									return;
								}else{
									Dialog.hide();
								}
							}
							// 回复应该使用的是单条评论的newsid
							self.currentDialog = new $.cmnt.Dialog(ele, oData);
						});
						dldEvtObj.add('dialogHide', 'click', function(o) {
							var Dialog = self.currentDialog;
							if (Dialog) {
								Dialog.hide();
							}
						});
						dldEvtObj.add('dialogMore', 'click', function(o) {
							var Dialog = self.currentDialog;
							if (Dialog) {
								Dialog.showMore();
							}
						});
						// 刷新
						dldEvtObj.add('reflash', 'click', function(o) {
							var oData = o.data;
							self.setType(oData.type).getData();

							// 刷新前，更多链接可能因为 clickMoreTimes 的限制变为“查看精彩链接”，刷新之后需要重置回“更多评论”
							self.reSetMoreLink();
							// 在刷新重新加载“最新评论”时，需要清零
							self.set('clickMoreTimes',0);
							// 用于记录“已显示”的评论条数，清零
							self.set('countShowed',0);
							// 当前打开的“查看对话”被刷新
							self.currentDialog = null;
						});
						// 加载更多 最新评论
						dldEvtObj.add('getMore', 'click', function(o) {
							self.getMoreLatest();
						});
						// 分享
						dldEvtObj.add('shareHover', 'mouseover', function(o) {
							var ele = o.el;
							var oData = o.data;
							setTimeout(function(){
								$.cmnt.shareTip.show(ele, oData);
							},100);
						});
						dldEvtObj.add('shareHover', 'mouseout', function(o) {
							$.cmnt.shareTip.hide(1e3);
						});
					}
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
					if (ReplyForm) {
						ReplyForm.destroy();
						ReplyForm = null;
					}
					// var content = '//@' + actionData.userLnk + ' ' + actionData.cont;
					var commented = function(content, comentHTML,dialogCommentHTML) {
						var latestList = self.get('dom.latestList');
						var config = self.get('opt.config');

						var Dialog = self.currentDialog;
						var scroll = true;
						if (!config.hideList) {
							// 如果在对话列表内评论，只更新到对话列表后面
							if(Dialog){
								var dialogList = Dialog.get('dom.dialogList');
								if(dialogCommentHTML&&dialogList){
									scroll = false;
									cmnt.dialogInsertList(dialogList, dialogCommentHTML);
									if(typeof opt.config.commented === 'function'){
										opt.config.commented();
									}
									return;
								}
							}
							if(typeof opt.config.scrollToLatest !== 'undefined'){
								scroll = opt.config.scrollToLatest;
							}
							// 把评论内容添加到“最新评论”最前面，并滚动到最新评论
							cmnt.insertList(latestList, comentHTML,scroll);

							if(typeof opt.config.commented === 'function'){
								opt.config.commented();
							}
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
				setNewsData: function(d) {
					// 把数据统一收集在cmnt.data方便取用 20130710
					var cmntData = cmnt.data;
					var newsid = this.get('opt.param.newsid');
					if (d) {
						if (d.news) {
							cmntData.set(newsid, 'newsdict', [d.news]);
						}
						if (!$.isEmptyObj(d.newsdict)) {
							// 新闻列表
							cmntData.set(newsid, 'newsdict', d.newsdict);
						}
						// 评论列表
						cmntData.set(newsid, 'cmntlist', d.cmntlist);
						// 热门评论列表
						if (d.hot_list) {
							cmntData.set(newsid, 'cmntlist', d.hot_list);
						}
						// 回复列表
						cmntData.set(newsid, 'replydict', d.replydict);
					}
					return this;
				},
				setDataClz: function(type, hot, latest) {
					var self = this;
					var wrap = self.get('dom.wrap');
					var prefix = 'sina-comment-list-has-';
					if (hot) {
						$.addClass(wrap, prefix + type);
						if (type === 'all') {
							$.addClass(wrap, prefix + 'hot');
						}
					}
					if (latest) {
						$.addClass(wrap, prefix + type);
						if (type === 'all') {
							$.addClass(wrap, prefix + 'latest');
						}
					}
					// 添加展开收起
					var maxWordCount = self.get('opt.config.maxWordCount');
					if(maxWordCount !== Infinity||maxWordCount<=0){
						var items = $.byAttr(wrap,'comment-type','itemTxt');
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
				},
				/**
				 * 设置评论类型，为下次加载和渲染数据做准备,
				 * @member setType
				 * @param {String} type all|hot 全部评论或热门评论
				 */
				setType: function(type) {
					//all全部，hot最热
					if (type != 'all' && type != 'hot' && type != 'latest') {
						return;
					}
					this.set('opt.listType', type);
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
			var commentAfterLogin = function(e) {
				if (e.data.action === 'loginWithComment') {
					if(typeof e.data.callback === 'function'){
						e.data.callback();
					}
				}
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

							cmnt.loginWithComment = true;
							cusEvt.remove($, 'ce_login', commentAfterLogin);
							cusEvt.add($, 'ce_login', commentAfterLogin, {
								action: 'loginWithComment',
								callback:function(){
									cusEvt.remove($, 'ce_login', commentAfterLogin);

									if(self.commenting || !cmnt.loginWithComment){
										return;
									}
									self.commenting = true;
									self.comment();
									// self.commenting = false;
									cmnt.loginWithComment = false;
								}
							});
							self.login();

						} else {
							if(self.commenting){
								return;
							}
							self.commenting = true;

							// 谨防在评论之前，用户在其它页面中已经换了帐号
							if($.login.isUidChanged()){
								$.login.lInSuccess(function(){
									self.comment();
								});
							}else{
								self.comment();
							}
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
						// var getFaceWrap = function(ele){var par = ele.parentNode; if (par && par.getAttribute('comment-type') == 'form') {return par; } else {return arguments.callee(par); } };
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
							// var faceWrap = getFaceWrap(target);
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
					cusEvt.add($, 'ce_login', function() {
						self.setName();
					});
					cusEvt.add($, 'ce_preLogin', function() {
						self.setName();
					});
					cusEvt.add($, 'ce_logout', function() {
						self.setName();
					});
					cusEvt.add($, 'ce_weiboLogin', function() {
						self.setName();
					});
					cusEvt.add($, 'ce_weiboLogout', function() {
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
						self.commenting = false;
					},function(){
						cmnt.commentTip.show(dom.cont, 'error', getMsg('I042'), 3e3);
						self.commenting = false;
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
					if(dom.cont){
						dom.cont.blur();
					}
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
					var curCmnt = cmntData.get(allNewsid, 'cmntlist', opt.parent);
					var data = cmntData.get(allNewsid);

					// 由于对话列表是由当前评论（对话列表最后一条为当前评论）及其相应的回复列表组成的，也就是相本来的父子关系硬生生的改为兄弟关系，
					// 所有在回复对话列表中的评论时（除最后一条），都需要要先找到当前评论的mid(opt.dialogParentMid)，然后找到回复列表

					var tReplyList = cmntData.get(allNewsid, 'replydict', opt.dialogParentMid||opt.parent);
					if(!$.isArray(tReplyList)){
						tReplyList = [];
					}
					tReplyList.push(curCmnt);
					var hackCmnt = {
						newsid: curCmnt.newsid,
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

					var frag = $.create('div');

					// 假数据处理
					data = {};
					hackCmnt.newsid = allNewsid;
					frag.className = 'item item-hack clearfix';
					frag.setAttribute('comment-type', 'item');
					frag.innerHTML = cmnt.itemInnerRender(allNewsid, hackCmnt, data, tReplyList);


					// 如果在对话框里回复
					var dialogFrag = null;
					if(opt.pos==='dialog'){
						// 楼层1开始，需要-1
						var lastItem = tReplyList[opt.floor-1];
						var lastUserLnk = '';
						if(typeof lastItem !==$.C.U){
							lastUserLnk = cmnt.getUserLnk(lastItem,'@');
						}
						dialogFrag = (function(){
							var frag = $.create('div');
							frag.className = 'item item-hack clearfix';
							frag.setAttribute('comment-type', 'item');
							frag.innerHTML = cmnt.dialogItemInnerRender(allNewsid, hackCmnt, 'new', lastUserLnk);
							return frag;
						})();
					}
					opt.commented(content, frag,dialogFrag);

					setTimeout(function(){
						self.destroy();
					},2e3);
				}
			});
			return Reply;
		})();
		/**
		 * 带评论框的评论列表
		 * @class FormList
		 * @constructor
		 * @param  {HTMLElement|String} wrap   容器id或容器节点
		 * @param  {Object} formOpt 评论表单选项
		 * @param  {Object} listOpt 评论列表选项
		 * @param {Boolean} listOpt.hideList 是否隐藏评论列表
		 * @param  {Object} opt     配置选项
		 * @param {Boolean} opt.isBBS 是否是论坛页面
		 * @example
		 *  var FormList1 = new $.cmnt.FormList('SI_FormList2',{
		 *     channel:'yl',
		 *     newsid:'28-3-4108633',
		 *     parent:''
		 *  },{
		 *     channel: 'yl',
		 *     newsid: '28-3-4108633',
		 *     //style=1本来为皮肤，应该为group=1
		 *     group: 0,
		 *     page: 1,
		 *     pageSize: 20,
		 *      // 隐藏评论列表
		 *     hideList:0
		 *  },{});
		 */
		cmnt.FormList = (function() {
			var FList = new $.Clz();
			FList.include({
				/**
				 * 初始化带表单的列表，
				 * 其中包括设置选项，获取dom节点并渲染表单及列表
				 *
				 * @param  {HTMLElement|String} wrap   容器id或容器节点
				 * @param  {Object} formOpt 评论表单选项
				 * @param  {Object} listOpt 评论列表选项
				 * @param {Boolean} listOpt.hideList 是否隐藏评论列表
				 * @param  {Object} opt     配置选项
				 * @param {Boolean} opt.isBBS 是否是论坛页面
				 */
				init: function(wrap, formOpt, listOpt, opt) {
					var self = this;
					self._setOpt(opt);
					self._setDom(wrap);
					self.render(formOpt, listOpt);
				},
				/**
				 * 设置选项
				 * @member _setOpt
				 * @private
				 * @param {Object} opt 选项
				 */
				_setOpt: function(opt) {
					this.set('opt', $.extend({
						// 是否是论坛页面
						isBBS: 0,
						// 隐藏列表：某些新闻需要隐藏列表，加载数据但不渲染列表
						hideList: 0
					}, opt, true));
				},
				/**
				 * 设置dom节点
				 * @member _setDom
				 * @private
				 * @param  {String} wrap 容器id或容器节点
				 */
				_setDom: function(wrap) {
					var self = this;
					wrap = $.byId(wrap);
					$.addClass(wrap, 'sina-comment-wrap');
					var tempHtml = $.cmnt.tpls.get('formList');
					wrap.innerHTML = appTemplate(tempHtml, {});
					var builder = $.builder(wrap, 'comment-type');
					self.set('domList', builder.list);
					self.set('dom', builder.ids);
				},
				render: function(formOpt, listOpt) {
					var self = this;
					var domList = self.get('domList');
					var dom = self.get('dom');
					var opt = self.get('opt');
					var forms = domList.form;
					self.commentForms = [];
					var commented = formOpt.commented;
					formOpt.commented = function(content, comentHTML) {
						self.commented(content, comentHTML);
						if (typeof commented == 'function') {
							commented(content, comentHTML);
						}
					};
					var loaded = listOpt.loaded;
					listOpt.loaded = function(listSelf) {
						self.loaded(listSelf);
						if (typeof loaded == 'function') {
							loaded(listSelf);
						}
					};

					// 可能会有多个评论框，比如论坛评论有上下两个评论框
					if (domList.form) {
						for (var i = forms.length - 1; i >= 0; i--) {
							var form = forms[i];
							self.commentForms.push(new cmnt.Form(form, formOpt));
						}
					}
					// 如果设置不显示评论列表，则不渲染评论列表
					self.commentList = null;
					if (!opt.hideList) {
						self.commentList = new cmnt.List(dom.list, listOpt.url, listOpt);
					}
				},
				/**
				 * 设置表单选项
				 * @member setFormOpt
				 * @private
				 * @param {String} key 选项名
				 * @param {Object|String} val 选项值
				 */
				setFormOpt: function(key, val) {
					var self = this;
					var forms = self.commentForms;
					for (var i = forms.length - 1; i >= 0; i--) {
						var form = forms[i];
						form.set('opt.' + key, val);
					}
				},
				// 设置列表选项
				setListOpt: function(key, val) {
					var self = this;
					var list = self.commentList;
					list.set('opt.' + key, val);
				},
				/**
				 * 设置列表页数
				 * @member setListPage
				 * @param {Number} val 页数
				 */
				setListPage: function(val) {
					var self = this;
					var list = self.commentList;
					list.setPage(val);
				},
				setCount: function() {
					var self = this;
					var isBBS = self.get('opt.isBBS');
					var commentList = self.commentList;
					var listOpt = commentList.get('opt');
					var data = self.commentList.data;
					var cmntBaseUrl = 'http://comment5.news.sina.com.cn/comment/skin/default.html';
					var separator = '<span>|</span>';

					var nums = {
						// 评论数
						comment:'',
						// 参与人数
						person:'',
						// 帖子数
						post:''
					};

					// 条评论+人参与
					var tplHtml = getMsg('I031')+separator+getMsg('I032');

					if(data&&data.count){
						nums.comment = $.app.splitNum(data.count.show);
						nums.person = $.app.splitNum(data.count.total);
					}


					if(isBBS){
						// 最终页
						if (!listOpt.config.group && data.grouplist && data.grouplist.length !== 0) {
							var relatedData = data.grouplist[0];
							// XX条评论+XX人参与+XX条相关帖子
							tplHtml += separator+getMsg('I033');
							nums.post = '<a href="' + cmntBaseUrl + '?channel=' + relatedData.news.channel + '&newsid=' + relatedData.news.newsid + '&group=1">' + $.app.splitNum(relatedData.count.total) + '</a>';
						}

					}else{
						var moreCommentLink = cmntBaseUrl + '?channel=' + data.news.channel + '&newsid=' + data.news.newsid;
						//如果是专题评论链接加style=1(其实是group=1,历史遗留问题，具体咨询王磊)
						if ((listOpt.group === 1)) {
							moreCommentLink += '&style=1';
						}
						// 给XX条评论+XX人参与 的XX加上链接
						nums.comment = '<a href="' + moreCommentLink + '">' + nums.comment + '</a>';
						nums.person = '<a href="' + moreCommentLink + '">' + nums.person + '</a>';
					}

					var countHtml = appTemplate(tplHtml, nums);

					var forms = self.commentForms;
					var form, dom;
					for (var i = forms.length - 1; i >= 0; i--) {
						form = forms[i];
						dom = form.get('dom');
						if(dom.count){
							dom.count.innerHTML = countHtml;
						}
					}
				},
				loaded: function(listSelf) {
					var self = this;
					self.setCount();
				},
				commented: function(content, comentHTML) {
					var self = this;
					var opt = self.get('opt');
					if (!self.commentList || opt.hideList) {
						return;
					}
					var List = self.commentList;
					var latestList = List.get('dom.latestList');
					var hideList = List.get('opt.config.hideList');
					var scroll = true;
					if(typeof opt.scrollToLatest !== 'undefined'){
						scroll = opt.scrollToLatest;
					}

					if (typeof hideList !== UNDEFINED && hideList !== 1) {

						// 把评论内容添加到“最新评论”最前面，并滚动到最新评论
						cmnt.insertList(latestList, comentHTML,scroll);
						// 插入后，显示列表
						List.setDataClz('all',(List.data.hot_list&&List.data.hot_list.length>1),1);
					}
				}
			});
			return FList;
		})();
		return cmnt;
	});

})(window);