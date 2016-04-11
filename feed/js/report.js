;(function(exports) {
    var UNDEFINED = 'undefined';
    var doc = document;
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
    var encodeDoubleByte = function(str) {
        if(typeof str !== 'string') {
            return str;
        }
        return encodeURIComponent(str);
    };
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
    var getParam = function(name) {
        var arr = window.location.search.match(new RegExp('(\\?|&)' + name + '=([^&]*)(&|$)'));
        if (arr != null){
            return decodeURIComponent(arr[2]);
        }
        return null;
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
    var addEvent = function(elm, evType, func, useCapture) {
        var _el = byId(elm);
        if (_el == null) {
            throw new Error('addEvent 找不到对象：' + elm);
        }
        if (typeof useCapture == UNDEFINED) {
            useCapture = false;
        }
        if (typeof evType == UNDEFINED) {
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
        if (typeof sName == UNDEFINED) {
            sName = 'click';
        }
        if (_el.addEventListener) {
            _el.removeEventListener(sName, fHandler, false);
        } else if (_el.attachEvent) {
            _el.detachEvent('on' + sName, fHandler);
        }
        fHandler[sName] = null;
    };
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
    /*var parseParam = function(oSource, oParams) {
        var key;
        try {
            if (typeof oParams != UNDEFINED) {
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
    };*/
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
                if (typeof this.loadingIframe == UNDEFINED) {
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
                            if (typeof tArea != UNDEFINED) {
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
    var trim = function(str) {
        //return str.replace(/(^\s*)|(\s*$)/g, "");
        //包括全角空格
        return str.replace(/(^[\s\u3000]*)|([\s\u3000]*$)/g, '');
    };
    var isArray = function(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };
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
    var faceFilter = (function() {
        var allFacesBase = 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/';
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
        var regExp = /\[(.*?)\]/g;
        return function(text) {
            text = text || '';
            text = text.replace(regExp, function($0, $1) {
                var imgUrl = allFaces[$1];
                if (imgUrl) {
                    imgUrl = allFacesBase + imgUrl + '.gif';
                }
                return !imgUrl ? $1 : '<img class="face" title="' + $1 + '" alt="' + $1 + '" src="' + imgUrl + '" />';
            });
            return text;
        };
    })();
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
    var cmntEncodeHtml = function(str){
        return encodeHTML(decodeHTML(str));
    };
    var post = function(url,param,cb,timeoutCb,time){

        var cbName = 'iJax' + Date.parse(new Date());
        try {
            doc.domain = 'sina.com.cn';
        } catch (e) {

        }

        param.callback = cbName;

        var TIMEOUT_NAME = 'TD_'+ (new Date()).getTime();
        timeoutHandle(TIMEOUT_NAME, function(handle) {
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
            ijax.request(url, {
                POST: param
            });
        }, time || 5e3);
    };
    var byteLength = function(str) {
        if (typeof str == UNDEFINED) {
            return 0;
        }
        var aMatch = str.match(/[^\x00-\x80]/g);
        return (str.length + (!aMatch ? 0 : aMatch.length));
    };
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

    // 获取评论信息
    var getMsg = function(mid,dom){
        if(!mid){
            dom.msg.innerHTML = '<p class="tip tip-error">请指定举报内容mid!</p>';
            return;
        }
        var getWBName = function(data) {
            if (typeof data.config == UNDEFINED) {
                return '';
            }
            var temp = data.config.match(/wb_screen_name=([^&]*)/i);
            return temp ? temp[1] : '';
        };
        var getWBV = function(data) {
            if (typeof data.config == UNDEFINED) {
                return '';
            }
            var v = '';
            var config = queryToJson(data.config);
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
        var getUserLnk = function(data) {
            var vImg = '';
            var vType = getWBV(data);
            var vTit = '新浪个人认证';
            var wrapPrefix = '<span class="name">';
            var wrapSuffix = '</span>';
            if (vType) {
                if (vType == 'b') {
                    vTit = '新浪机构认证';
                }
                vImg = '<img src="http://www.sinaimg.cn/dy/deco/2013/0608/v' + vType + '.png" title="' + vTit + '" style="vertical-align: middle;" />';
            }
            var wbName = getWBName(data);
            //如果wb_screen_name为空的话，说明不是用微博名来评论的
            var userLnk = 'http://comment5.news.sina.com.cn/comment/skin/default.html?info_type=1&style=1&user_uid=';
            var result = '';
            if (!wbName) {
                if (data.uid && data.uid != '0') {
                    result = '<a target="_blank" href="' + userLnk + data.uid + '" title="'+data.nick+'">' +data.nick +'</a>';
                } else {
                    result = data.nick;
                }
            } else {
                // 之前链接到用户的评论中心 @王图勇 @高蕾 链接到微博 20140828114356
                result = '<a target="_blank" href="http://weibo.com/u/' + data.uid + '" title="'+wbName+'">'+ wbName + vImg+'</a>';
            }
            return wrapPrefix+result+wrapSuffix;
        };
        var getUserFace = function(data) {
            var WBUURL = 'http://weibo.com/u/';
            var config = data.config || '';
            var face = queryToJson(config, true).wb_profile_img || 'http://www.sinaimg.cn/dy/deco/2012/1018/sina_comment_defaultface.png';
            var wbName = getWBName(data);
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
        var renderItem = function(item){
            if(!item.content){
                dom.msg.innerHTML = '<p class="tip tip-error">没有举报内容!</p>';
                return;
            }
            var userFace = getUserFace(item);
            var userLnk = getUserLnk(item);
            var cont = faceFilter(cmntEncodeHtml(item.content));
            var area = (item.area ? '[' + item.area + ']' : '&nbsp;');
            var newsLnk = item.news_info?'<p class="lnk"><a target="_blank" href="' + item.news_info.url + '" title="' + item.news_info.title + '">《' + item.news_info.title + '》</a></p>':'';
            var clz = ' class=';
            var html = [
                            '<!-- 头像 start -->',
                            '<div' + clz + '"head">' + userFace + '</div>',
                            '<!-- 头像 end -->',
                            '<!-- 内容 start -->',
                            '<div' + clz + '"cont">',
                            '<div' + clz + '"info">',
                            userLnk,
                            '</span>',
                            '<span' + clz + '"area">' + area + '</span>',
                            newsLnk,
                            '</div>',
                            '<div' + clz + '"txt">',
                                cont,
                            '</div>',
                            '</div>',
                            '<!-- 内容 end -->'
                        ].join('');
            dom.msg.innerHTML = '<div class="item clearfix">' + html + '</div>';
            dom.msg.setAttribute('hasContent','1');
        };
        var time = 5e3;
        var TIMEOUT_NAME = 'TD_'+ (new Date()).getTime();
        var url = 'http://comment5.news.sina.com.cn/cmnt/info?format=js&compress=1&ie=gbk&oe=gbk&mid='+mid+'&jsvar='+TIMEOUT_NAME;
        timeoutHandle(TIMEOUT_NAME, function(handle) {
            handle.timeout(TIMEOUT_NAME, function() {
                // 超时处理
                // alert(time/1e3+'超时');
            });

            jsLoad(url, function() {
                var item,data,error;
                // 成功通知
                handle.success(TIMEOUT_NAME);
                // 信息处理
                var msg = exports[TIMEOUT_NAME];
                if (typeof msg == UNDEFINED) {
                    return;
                }
                // 有时出错时code也为0，但存在error字段
                if (msg.result.status.code === 0 && typeof msg.result.error == UNDEFINED) {
                    data = msg.result;
                    item = data.cmntlist[mid];
                    renderItem(item);
                } else {
                    error = msg.result.status.msg;
                    throw new Error('数据加载出错：' + error + ';URL:' + url);
                }
            });
        }, time);
    };
    var postTip = (function(){
        var timer = null;
        return {
            show: function(type, txt, time) {
                var self = this;
                clearTimeout(timer);
                dom.postTip.innerHTML = '<p class="post-tip post-tip-' + type + '">' + txt + '</p>';
                dom.postTip.style.visibility = 'visible';
                if (time) {
                    setTimeout(function() {
                        self.hide();
                    }, time);
                }
            },
            hide: function() {
                dom.postTip.style.visibility = 'hidden';
            }
        };
    })();
    var report = (function(){
        var reported = false;
        return function(content){
            if(reported){
                postTip.show('error', '此内容您已经举报过，谢谢！',5e3);
                return;
            }
            var api = 'http://comment5.news.sina.com.cn/cmnt/submit';
            var param = {
                channel: 'feedback',
                newsid: '1',
                parent: '',
                content: content,
                format: 'json',
                ie: 'gbk',
                oe: 'gbk',
                ispost: 0,
                share_url: '',
                video_url: '',
                img_url: '',
                iframe:1
            };
            post(api,param,function(m){
                // 成功
                postTip.show('success','提交成功，我们会及时处理您的举报，谢谢！',5e3);
                reported = true;
            },function(){
                // 超时
                postTip.show('error','提交超时，请稍候再试！',5e3);
            });
        };
    })();
    var bind = function(mid,dom){
        addEvent(dom.submit, 'click', function(){
            var hasContent = dom.msg.getAttribute('hasContent');
            if(!mid||!hasContent){
                postTip.show('error', '没有需要举报的内容！',5e3);
                return;
            }

            var UserPanel = exports.SINA_USER_PANEL;
            var loginLayer = exports.SINA_OUTLOGIN_LAYER;
            if(loginLayer.isLogin()){
                // 提交数据
                // var types = document.reportType;
                var types = document.getElementsByName('reportType');
                var type = 0;
                for (var i = 0, len = types.length; i < len; i++) {
                    var item = types[i];
                    if(item.checked){
                        type = item.value;
                    }
                }
                var textArea = dom.cont;
                var tip = textArea.getAttribute('placeholder');
                if (!tip) {
                    //ie10 下的ie7 无法用textArea.getAttribute('placeholder')取到placeholder值，奇怪！
                    if (textArea.attributes && textArea.attributes.placeholder) {
                        tip = textArea.attributes.placeholder.value;
                    }
                }
                var cont = trim(textArea.value);
                if(cont===tip){
                    cont = '';
                }
                cont = 'mid='+mid+'&type='+type+'&content='+cont;
                if(byteLength(cont)>6000){
                    postTip.show('error', '您提交的内容太多了，已经超过6000字啦！',5e3);
                    return;
                }
                report(cont);

            }else{
                // 提示登录
                UserPanel.setOutLoginMiddle(true);
                UserPanel.getOutLogin().show();
            }
        });
        addEvent(dom.cancel, 'click', function(){
            window.close();
        });
        placeholder([dom.cont]);
    };
    // 评论内容的mid
    // 5452FDC1-7F000001-DA6467C7-85D-8D8
    var mid = getParam('mid');
    // 容器
    var wrap = byId('SI_Wrap');
    // 节点
    var dom = builder(wrap, 'bbs-node-type').ids;
    // 获取评论内容
    getMsg(mid,dom);
    // 绑定提交等事件
    bind(mid,dom);
})(window);
