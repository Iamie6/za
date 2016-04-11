/*!
* comment
* v 3.0.0
* svn ../ui/project/comment3/
* 2015-08-12 11:47
* [${p_id},${t_id},${d_id}] published at ${publishdate} ${publishtime}
*/
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
            throw new Error('addEvent \u627E\u4E0D\u5230\u5BF9\u8C61\uFF1A' + elm);
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
            throw ('removeEvent \u627E\u4E0D\u5230\u5BF9\u8C61\uFF1A' + oElement);
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
    var trim = function(str) {
        //return str.replace(/(^\s*)|(\s*$)/g, "");
        //\u5305\u62EC\u5168\u89D2\u7A7A\u683C
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
    var faceFilter = (function() {
        var allFacesBase = 'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/';
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

    // \u83B7\u53D6\u8BC4\u8BBA\u4FE1\u606F
    var getMsg = function(mid,dom){
        if(!mid){
            dom.msg.innerHTML = '<p class="tip tip-error">\u8BF7\u6307\u5B9A\u4E3E\u62A5\u5185\u5BB9mid!</p>';
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
                    //\u9EC4
                    v = 'y';
                } else {
                    //\u84DD
                    v = 'b';
                }
            }
            return v;
        };
        var getUserLnk = function(data) {
            var vImg = '';
            var vType = getWBV(data);
            var vTit = '\u65B0\u6D6A\u4E2A\u4EBA\u8BA4\u8BC1';
            var wrapPrefix = '<span class="name">';
            var wrapSuffix = '</span>';
            if (vType) {
                if (vType == 'b') {
                    vTit = '\u65B0\u6D6A\u673A\u6784\u8BA4\u8BC1';
                }
                vImg = '<img src="http://www.sinaimg.cn/dy/deco/2013/0608/v' + vType + '.png" title="' + vTit + '" style="vertical-align: middle;" />';
            }
            var wbName = getWBName(data);
            //\u5982\u679Cwb_screen_name\u4E3A\u7A7A\u7684\u8BDD\uFF0C\u8BF4\u660E\u4E0D\u662F\u7528\u5FAE\u535A\u540D\u6765\u8BC4\u8BBA\u7684
            var userLnk = 'http://comment5.news.sina.com.cn/comment/skin/default.html?info_type=1&style=1&user_uid=';
            var result = '';
            if (!wbName) {
                if (data.uid && data.uid != '0') {
                    result = '<a target="_blank" href="' + userLnk + data.uid + '" title="'+data.nick+'">' +data.nick +'</a>';
                } else {
                    result = data.nick;
                }
            } else {
                // \u4E4B\u524D\u94FE\u63A5\u5230\u7528\u6237\u7684\u8BC4\u8BBA\u4E2D\u5FC3 @\u738B\u56FE\u52C7 @\u9AD8\u857E \u94FE\u63A5\u5230\u5FAE\u535A 20140828114356
                result = '<a target="_blank" href="http://weibo.com/u/' + data.uid + '" title="'+wbName+'">'+ wbName + vImg+'</a>';
            }
            return wrapPrefix+result+wrapSuffix;
        };
        var getUserFace = function(data) {
            var WBUURL = 'http://weibo.com/u/';
            var config = data.config || '';
            var face = queryToJson(config, true).wb_profile_img || 'http://www.sinaimg.cn/dy/deco/2012/1018/sina_comment_defaultface.png';
            var wbName = getWBName(data);
            //\u5982\u679Cwb_screen_name\u4E3A\u7A7A\u7684\u8BDD\uFF0C\u8BF4\u660E\u4E0D\u662F\u7528\u5FAE\u535A\u540D\u6765\u8BC4\u8BBA\u7684
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
                dom.msg.innerHTML = '<p class="tip tip-error">\u6CA1\u6709\u4E3E\u62A5\u5185\u5BB9!</p>';
                return;
            }
            var userFace = getUserFace(item);
            var userLnk = getUserLnk(item);
            var cont = faceFilter(cmntEncodeHtml(item.content));
            var area = (item.area ? '[' + item.area + ']' : '&nbsp;');
            var newsLnk = item.news_info?'<p class="lnk"><a target="_blank" href="' + item.news_info.url + '" title="' + item.news_info.title + '">\u300A' + item.news_info.title + '\u300B</a></p>':'';
            var clz = ' class=';
            var html = [
                            '<!-- \u5934\u50CF start -->',
                            '<div' + clz + '"head">' + userFace + '</div>',
                            '<!-- \u5934\u50CF end -->',
                            '<!-- \u5185\u5BB9 start -->',
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
                            '<!-- \u5185\u5BB9 end -->'
                        ].join('');
            dom.msg.innerHTML = '<div class="item clearfix">' + html + '</div>';
            dom.msg.setAttribute('hasContent','1');
        };
        var time = 5e3;
        var TIMEOUT_NAME = 'TD_'+ (new Date()).getTime();
        var url = 'http://comment5.news.sina.com.cn/cmnt/info?format=js&compress=1&ie=gbk&oe=gbk&mid='+mid+'&jsvar='+TIMEOUT_NAME;
        timeoutHandle(TIMEOUT_NAME, function(handle) {
            handle.timeout(TIMEOUT_NAME, function() {
                // \u8D85\u65F6\u5904\u7406
                // alert(time/1e3+'\u8D85\u65F6');
            });

            jsLoad(url, function() {
                var item,data,error;
                // \u6210\u529F\u901A\u77E5
                handle.success(TIMEOUT_NAME);
                // \u4FE1\u606F\u5904\u7406
                var msg = exports[TIMEOUT_NAME];
                if (typeof msg == UNDEFINED) {
                    return;
                }
                // \u6709\u65F6\u51FA\u9519\u65F6code\u4E5F\u4E3A0\uFF0C\u4F46\u5B58\u5728error\u5B57\u6BB5
                if (msg.result.status.code === 0 && typeof msg.result.error == UNDEFINED) {
                    data = msg.result;
                    item = data.cmntlist[mid];
                    renderItem(item);
                } else {
                    error = msg.result.status.msg;
                    throw new Error('\u6570\u636E\u52A0\u8F7D\u51FA\u9519\uFF1A' + error + ';URL:' + url);
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
                postTip.show('error', '\u6B64\u5185\u5BB9\u60A8\u5DF2\u7ECF\u4E3E\u62A5\u8FC7\uFF0C\u8C22\u8C22\uFF01',5e3);
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
                // \u6210\u529F
                postTip.show('success','\u63D0\u4EA4\u6210\u529F\uFF0C\u6211\u4EEC\u4F1A\u53CA\u65F6\u5904\u7406\u60A8\u7684\u4E3E\u62A5\uFF0C\u8C22\u8C22\uFF01',5e3);
                reported = true;
            },function(){
                // \u8D85\u65F6
                postTip.show('error','\u63D0\u4EA4\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u5019\u518D\u8BD5\uFF01',5e3);
            });
        };
    })();
    var bind = function(mid,dom){
        addEvent(dom.submit, 'click', function(){
            var hasContent = dom.msg.getAttribute('hasContent');
            if(!mid||!hasContent){
                postTip.show('error', '\u6CA1\u6709\u9700\u8981\u4E3E\u62A5\u7684\u5185\u5BB9\uFF01',5e3);
                return;
            }

            var UserPanel = exports.SINA_USER_PANEL;
            var loginLayer = exports.SINA_OUTLOGIN_LAYER;
            if(loginLayer.isLogin()){
                // \u63D0\u4EA4\u6570\u636E
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
                    //ie10 \u4E0B\u7684ie7 \u65E0\u6CD5\u7528textArea.getAttribute('placeholder')\u53D6\u5230placeholder\u503C\uFF0C\u5947\u602A\uFF01
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
                    postTip.show('error', '\u60A8\u63D0\u4EA4\u7684\u5185\u5BB9\u592A\u591A\u4E86\uFF0C\u5DF2\u7ECF\u8D85\u8FC76000\u5B57\u5566\uFF01',5e3);
                    return;
                }
                report(cont);

            }else{
                // \u63D0\u793A\u767B\u5F55
                UserPanel.setOutLoginMiddle(true);
                UserPanel.getOutLogin().show();
            }
        });
        addEvent(dom.cancel, 'click', function(){
            window.close();
        });
        placeholder([dom.cont]);
    };
    // \u8BC4\u8BBA\u5185\u5BB9\u7684mid
    // 5452FDC1-7F000001-DA6467C7-85D-8D8
    var mid = getParam('mid');
    // \u5BB9\u5668
    var wrap = byId('SI_Wrap');
    // \u8282\u70B9
    var dom = builder(wrap, 'bbs-node-type').ids;
    // \u83B7\u53D6\u8BC4\u8BBA\u5185\u5BB9
    getMsg(mid,dom);
    // \u7ED1\u5B9A\u63D0\u4EA4\u7B49\u4E8B\u4EF6
    bind(mid,dom);
})(window);
