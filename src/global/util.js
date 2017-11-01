let util = {};
export class Chain{
  constructor(fn){
    this.fn=fn;
    this.successor=null;
  }
  setNextSuccessor(successor){
    return this.successor=successor;
  }
  passRequest(){
    let ret=this.fn.apply(this,arguments);
    if(ret==='nextSuccessor'){
      return this.successor&&this.successor.passRequest.apply(this.successor,arguments);
    }
    return ret;
  }
  next(){
    return this.successor&&this.successor.passRequest.apply(this.successor,arguments);
  }
}

util.getBytesLength = function(str) {
    let totalLength = 0;
    let charCode;
    str = str || '';

    for (let i = 0; i < str.length; i++) {
        charCode = str.charCodeAt(i);

        if (charCode < 0x007f)  {
            totalLength++;
        } else {
            totalLength += 2;
        }
    }
    return totalLength;
}


util.getQuery = function () {
    let href = window.location.href;
    let search = href.substring(href.indexOf('?') + 1);
    let query = {};
    if (search) {
        _.each(search.split('&'), function (item) {
            let parts = item.replace(/\+/g, ' ').split('=');
            if (parts[1]) {
                query[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
            } else {
                query[decodeURIComponent(parts[0])] = '';
            }
        });
    }
    return query;
}

util.makeZero = function (len) {
    let ret = '';
    for(let i = 0; i < len; i++) {
        ret += '0';
    }
    return ret;
}

util.paddingZero = function  (str, len) {
    str = str + '';
    let ret = str.split('.');
    let pre = ret[0];
    let sym = pre[0] == '-' ? '-' : '';

    if (sym) {
        pre = pre.substring(1);
    }
    if (pre.length > len) {
        len = pre.length - len;
        return sym + pre.substring(0, len) + '.' + pre.substring(len) + ret[1];
    } else {
        return sym + '0.' + util.makeZero(len - pre.length) + pre + ret[1];
    }
}

util.addFloat = function (a, b) {
    let sa, sb, len, ret;

    a = parseFloat(a);
    b = parseFloat(b);

    if (a < 0 && b < 0) {
        return -util.addFloat(-a, -b);
    }

    sa = (a + '').split('.');
    sb = (b + '').split('.');

    if (sa[1] && sb[1]) {
        len = sa[1].length <= sb[1].length ? sa[1].length : sb[1].length;
        ret = util.addFloat(sa[0] + sa[1].substring(0,len) + '.' + sa[1].substring(len), sb[0] + sb[1].substring(0, len) + '.' + sb[1].substring(len)) + '';
        ret = util.paddingZero(ret, len);
        return parseFloat(ret);
    } else if (sa[1] || sb[1]) {
        if (sa[1]) {
            ret = util.addFloat(sa[0] + sa[1], sb[0] + util.makeZero(sa[1].length));
            ret = util.paddingZero(ret, sa[1].length);
        } else {
            ret = util.addFloat(sb[0] + sb[1], sa[0] + util.makeZero(sb[1].length));
            ret = util.paddingZero(ret, sb[1].length);
        }
        return parseFloat(ret);
    } else {
        return a + b;
    }
}


util.compareTime = function (t1, t2) {
    if (!t1 || !t2)  {
        return false;
    } else {
        if (t1[1] == '-' && t2[1] == '-' && t1.split(' ')[0] != t2.split(' ')[0]) {
            return t1 < t2;
        } else {
            return t1 > t2
        }
    }
}

util.lowVersionIE = function () {
    return document.all && !!(window.ActiveXObject || "ActiveXObject" in window);
}
util.makeIEWarn = function () {
    return <div className="alert-ie">
            <div className="alert-ie-tip">
                <i className="kuma-icon kuma-icon-caution"></i>
                <span className="alert-ie-text">您的浏览器版本太低, 请使用Chrome、Firefox或IE11+等最新浏览器!</span>
            </div>
        </div>
}


util.computeConsuming = function (data) {
    if (data.currentStartCode && data.currentStartHour && data.currentStartMinute
        && data.currentEndCode && data.currentEndHour && data.currentEndMinute) {
        let code = data.currentEndCode - data.currentStartCode;
        code = data.currentEndCode > 0 && data.currentStartCode < 0 ? code - 1 : code;
        let hour = data.currentEndHour - data.currentStartHour;
        if (hour < 0) {
            code--;
            hour += 24;
        }
        let minute = data.currentEndMinute - data.currentStartMinute;

        if (minute < 0) {
            hour--;
            minute += 60;
        }

        return code * 24 * 60 + hour * 60 + minute;
    } else {
        return 0;
    }
}

util.toHour =  function (millisecond) {

    if(typeof(millisecond) == 'undefined' || isNaN(millisecond)){
        return null
    }

    let hourUnit = 60 * 60 * 1000;
    let hour = millisecond / hourUnit;
    let minute = millisecond % hourUnit;
    minute = minute / (60 * 1000);

    return {
        hour : Math.floor(hour),
        minute: Math.floor(minute)
    }
}

export {util,Chain};
