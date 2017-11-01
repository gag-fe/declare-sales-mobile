import Mock from './Mock';
import StructureValidator from './StructureValidator';
import ajax from './ajax';
import mockConfig from './mockConfig';
var node = null;
var blackList =mockConfig.blackList;
var whiteList = mockConfig.whiteList;

var ROOT =mockConfig.ROOT;
var LOST = "LOST";
var PREFIX = "/mockjs/";
var EMPTY_ARRAY = "EMPTY_ARRAY";
var TYPE_NOT_EQUAL = "TYPE_NOT_EQUAL";

/**
 * mode value range: 0-disabled 1-intercept all requests 2-black list
 * strategy 3-white list strategy
 */
var mode = 3;
var modeStr = mockConfig.modeStr;
if (modeStr != "" && (+modeStr >= 0 && +modeStr <= 3)) {
    mode = +modeStr;
}
var modeList = [0, 1, 2, 3];
var projectId = mockConfig.projectId;
var disableLog = mockConfig.disableLog;

console.log('Current RAP work mode:', mode, "(0-disabled, 1-intercept all requests, 2-black list, 3-white list)");

function wrapAJAX(pId, rootStr) {
    if (pId) {
        projectId = pId;
    }
    if (rootStr) {
        ROOT = rootStr;
    }
    return function() {
        var oOptions = arguments[1];

        function doit(data) {
            data = Mock.mock(data);
            if (data.__root__ != undefined) {
                data = data.__root__;
            }
            if (!disableLog) {
                console.log('请求' + url + '返回的Mock数据:');
                console.dir(data);
            }
            return data
        }

        var url = oOptions.url;
        var routePassed = route(url) && projectId;
        if (routePassed) {
            rapUrlConverterJQuery(oOptions);
            var oldSuccess1 = oOptions.fit;
            oldSuccess1 && (oOptions.fit = function (data) {
                if (PREFIX == '/mockjs/') {
                    arguments[0]=data = doit(data)
                }
                return oldSuccess1.apply(this, arguments);
            });
        } else if (isInWhiteList(url) && !oOptions.RAP_NOT_TRACK) {
            var checkerOptions = {url: oOptions.url};
            rapUrlConverterJQuery(checkerOptions);
            checkerOptions.RAP_NOT_TRACK = true;
            checkerOptions.success = checkerHandler;
            // real data checking
            var oldSuccess2 = oOptions.fit;
            oOptions.fit = function () {
                var realData = arguments[0];
                checkerOptions.context = {
                    data: realData,
                    url: oOptions.url
                };
                // perform real data check
                ajax.apply(ajax, [checkerOptions]);
                return oldSuccess2.apply(this, arguments);
            };
        }
      //  var rv = ajax.apply(this, arguments);
        // if (routePassed) {
        //     console.log('rv.done.toString()',rv.done.toString());
        //     var oldDone = rv.done;
        //     oldDone && (rv.done = function () {
        //
        //         var oldCb = arguments[0];
        //         console.log('oldCb',oldCb);
        //         var args = arguments;
        //         console.log('oldCb',args);
        //         if (oldCb) {
        //             args[0] = function (data) {
        //                 if (PREFIX == '/mockjs/') {
        //                     data = doit(data)
        //                 }
        //                 oldCb.apply(this, arguments);
        //             };
        //         }
        //         oldDone.apply(this, args);
        //         return rv;
        //     });
        //     var oldThen = rv.then;
        //     console.log('oldThen.toString()',oldThen.toString());
        //     oldThen && (rv.then = function () {
        //         var oldCb = arguments[0];
        //         var args = arguments;
        //         if (oldCb) {
        //             args[0] = function (data) {
        //                 if (PREFIX == '/mockjs/') {
        //                     data = doit(data)
        //                 }
        //                 oldCb.apply(this, arguments);
        //             };
        //         }
        //         oldThen.apply(this, args);
        //         return rv;
        //     });
        // }
        //return rv;
    };
}


function checkerHandler(mockData) {
    if (PREFIX == '/mockjs/') {
        mockData = Mock.mock(mockData);
        if (mockData.__root__ != undefined) {
            mockData = mockData.__root__;
        }
    }
    var realData = this.data;
    var validator = new StructureValidator(realData, mockData);
    var result = validator.getResult();
    var realDataResult = result.left;
    var rapDataResult = result.right;
    var i;
    var log = [];
    var error = false;

    if (realDataResult.length === 0 && rapDataResult.length === 0) {
        log.push('接口结构校验完毕，未发现问题。');
    } else {
        error = true;
        if (this.url) {
            log.push('在校验接口' + this.url + '时发现错误:');
        }
        for (i = 0; i < realDataResult.length; i++) {
            log.push(validatorResultLog(realDataResult[i]));
        }
        for (i = 0; i < rapDataResult.length; i++) {
            log.push(validatorResultLog(rapDataResult[i], true));
        }
    }

    console.info(log.join('\n'));
    if (error === true) {
        console.log('真实数据:');
        console.dir(this.data);
    }
}

/**
 * is in white list
 *
 */
function isInWhiteList(url) {
    var i;
    var o;
    for (i = 0; i < whiteList.length; i++) {
        o = whiteList[i];
        if (typeof o === 'string' && (url.indexOf(o) >= 0 || o.indexOf(url) >= 0)) {
            return true;
        } else if (typeof o === 'object' && o instanceof RegExp && o.test(url)) {
            return true;
        }
    }
    return false;
}


/**
 * router
 *
 * @param {string} url
 * @return {boolean} true if route to RAP MOCK, other wise do nothing.
 */
function route(url, ignoreMode) {
    if (url && url.indexOf('?') !== -1) {
        url = url.substring(0, url.indexOf('?'))
    }
    var i;
    var o;
    var blackMode;
    var list;

    url = convertUrlToRelative(url);

    if (!url || typeof url !== 'string') {
        console.warn("Illegal url:", url);
        return false;
    }

    /**
     * disabled
     */
    if (mode === 0) {
        return false;
    }
    /**
     * intercept all requests
     */
    else if (mode == 1) {
        return true;
    }
    /**
     * black/white list mode
     */
    else if (mode === 2 || mode === 3) {
        blackMode = mode === 2;
        list = blackMode ? blackList : whiteList;
        for (i = 0; i < list.length; i++) {
            o = convertUrlToRelative(list[i]);
            if (typeof o === 'string' && (url.indexOf(o) >= 0 || o.indexOf(url) >= 0)) {
                return !blackMode;
            } else if (typeof o === 'object' && o instanceof RegExp && o.test(url)) {
                return !blackMode;
            }
        }
        return blackMode;
    }

    return false;
}

function validatorResultLog(item, isReverse) {

    var eventName;
    if (item.type === LOST) {
        eventName = isReverse ? '未在接口文档中未定义。' : '缺失';
    } else if (item.type === EMPTY_ARRAY) {
        eventName = '数组为空，无法判断其内部的结构。';
        return; // 暂时忽略此种情况
    } else if (item.type === TYPE_NOT_EQUAL) {
        eventName = '数据类型与接口文档中的定义不符';
    }

    return '参数 ' + item.namespace + "." + item.property + ' ' + eventName;

}

/**
 * convert url from absolute to relative
 */
function convertUrlToRelative(url) {
    if (url instanceof RegExp) {
        return url;
    }
    if (!url) {
        throw Error('Illegal url:' + url);
    }
    if (url.indexOf('http://') > -1) {
        url = url.substring(url.indexOf('/', 7) + 1);
    } else if (url.indexOf('https://') > -1) {
        url = url.substring(url.indexOf('/', 8) + 1);
    }
    if (url.charAt(0) != '/') {
        url = '/' + url;
    }
    return url;
}
/**
 * convert url to rap mock url (jQuery version)
 * example: www.baidu.com/a => {domain}/mock/106/a
 */
function rapUrlConverterJQuery(options) {
    var url = options.url;
    if (!options || typeof options !== 'object') {
        throw Error('illegal option object:' + options);
    }
    options.jsonp = '_c';
    options.dataType = 'jsonp';
    url = convertUrlToRelative(url);
    url = "http://" + ROOT + PREFIX + projectId + url;
    options.url = url;
    return options;
}

var RAP = {
    initList: function (list) {
        var PARAM_REG = /\/:[^\/]*/g;
        var i, n = list.length, item;
        for (i = 0; i < n; i++) {
            item = list[i];
            if (typeof item === 'string') {
                if (PARAM_REG.test(item)) {
                    item = new RegExp(item.replace(PARAM_REG, '/\\d+'));
                    list[i] = item;
                } else if (item.indexOf('reg:') !== -1) {
                    item = item.replace('reg:', '');
                    item = new RegExp(item);
                    list[i] = item;
                }
            }
        }
        return list;
    },
    setBlackList: function (arr) {
        if (arr && arr instanceof Array) {
            blackList = this.initList(arr);
        }
    },
    setWhiteList: function (arr) {
        if (arr && arr instanceof Array) {
            whiteList = this.initList(arr);
        }
    },
    getBlackList: function () {
        return blackList;
    },
    getWhiteList: function () {
        return whiteList;
    },
    getMode: function () {
        return mode;
    },
    setMode: function (m) {
        m = +m;
        if (m in modeList) {
            mode = m;
            console.log('RAP work mode switched to ', m);
        } else {
            console.warn('Illegal mode id. Please check.');
        }
    },
    setHost: function (h) {
        ROOT = h;
    },
    getHost: function () {
        return ROOT;
    },
    setPrefix: function (p) {
        PREFIX = p;
    },
    getPrefix: function (p) {
        return PREFIX;
    },
    setProjectId: function (id) {
        projectId = id;
    },
    getProjectId: function () {
        return projectId;
    },
    router: function (url) {
        return route(url);
    },
    checkerHandler: function () {
        return checkerHandler.apply(this, arguments);
    }
};

RAP.initList(whiteList);
RAP.wrapAJAX = wrapAJAX;
export default RAP
