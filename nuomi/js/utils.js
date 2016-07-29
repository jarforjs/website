var utils = (function () {
    var flag = "getComputedStyle" in window;

    function addClass(ele, className) {
        var arr = className.replace(/^ +| +$/, "").split(/\s+/);
        for (var i = 0; i < arr.length; i++) {
            var cur = arr[i];
            if (!this.hasClass(ele, cur)) {
                ele.className += ' ' + cur;
            }
        }
    }

    function append(newEle, container) {
        return container.appendChild(newEle);
    }

    function children(ele, tagName) {
        var arr = [];
        if (flag) {
            arr = this.listToArray(ele.children);
        } else {
            for (var i = 0; i < ele.childNodes.length; i++) {
                var cur = ele.childNodes[i];
                if (cur.nodeType === 1) {
                    arr[arr.length] = cur;
                }
            }
        }
        if (typeof tagName === "string") {
            var newArr = [];
            for (var i = 0; i < arr.length; i++) {
                var cur = arr[i];
                if (cur.nodeName == tagName.toUpperCase()) {
                    newArr.push(cur);
                }
            }
            return newArr;
        }
        return arr;
    }

    function assertElement(ele) {
        try {
            ele.cloneNode(true);
            if (ele.nodeType !== 1 && ele.nodeType !== 9) {
                throw new Error("");
            }
        } catch (e) {
            throw new Error("ele参数不合法");
        }
    }

    function css(curEle) {
        var argTwo = arguments[1], arr = Array.prototype.slice.call(arguments, 1);
        if (typeof argTwo === "string") {
            if (typeof arguments[2] === "undefined") {
                return getCss.apply(curEle, arr);
            }
            setCss.apply(curEle, arr);
        }
        argTwo = argTwo || 0;
        if (argTwo.toString() === "[object Object]") {
            setGroupCss.apply(curEle, arr);
        }
    }

    function firstChild(container) {
        if (flag) {
            return container.firstElementChild;
        }
        return this.children(container).length ? this.children(container)[0] : null;
    }

    function formatJSON(jsonStr) {
        return 'JSON' in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
    }

    function getElementsByClass(strClass, context) {
        context = context || document;
        if (flag) {
            return this.listToArray(context.getElementsByClassName(strClass));
        }
        var strList = strClass.replace(/^ +| +$/g, "").split(/\s+/);
        var arr = [];
        var nodeList = context.getElementsByTagName("*");
        for (var i = 0; i < nodeList.length; i++) {
            var curNode = nodeList[i];
            var _flag = true;
            for (var j = 0; j < strList.length; j++) {
                var reg = new RegExp("(^| +)" + strList[j] + "( +|$)");
                if (!reg.test(curNode.className)) {
                    _flag = false;
                    break;
                }
            }
            if (_flag) {
                arr.push(curNode);
            }
        }
        return arr;
    }

    function getWin(attr, val) {
        if (val !== undefined) {
            document.documentElement[attr] = val;
            document.body[attr] = val;
        }
        return document.documentElement[attr] || document.body[attr];
    }

    function getCss(attr) {
        var reg = /^(-?\d+(\.\d+)?)(?:px|em|pt|deg|rem)$/;
        var val = null;
        if (!flag) {
            if (attr === 'opacity') {
                val = this.currentStyle['filter'];
                var reg1 = /^alpha\(opacity=(\d+(\.\d+)?)\)$/;
                return reg1.test(val) ? RegExp.$1 / 100 : 1;
            } else {
                val = this.currentStyle[attr];
            }
        } else {
            val = (attr == 'opacity' ? window.getComputedStyle(this, null)[attr] / 1 : window.getComputedStyle(this, null)[attr]);
        }
        return reg.test(val) ? parseFloat(val) : val;
    }

    function hasClass(ele, name) {
        var reg = new RegExp("(?:^| +)" + name + "(?: +|$)");
        return reg.test(ele.className);
    }

    function index(curEle) {
        return this.prevAll(curEle).length;
    }

    function insertBefore(newEle, oldEle) {
        return oldEle.parentNode.insertBefore(newEle, oldEle);
    }

    function insertAfter(newEle, oldEle) {
        var oN = this.next(oldEle);
        if (oN) {
            return oldEle.parentNode.insertBefore(newEle, oN);
        }
        oldEle.parentNode.appendChild(newEle);
    }

    function lastChild(container) {
        if (flag) {
            return container.lastElementChild;
        }
        return this.children(container).length ? this.children(container)[this.children(container).length - 1] : null;
    }

    function listToArray(similarArray) {
        if (flag) {
            return Array.prototype.slice.call(similarArray);
        }
        arr = [];
        for (var i = 0; i < similarArray.length; i++) {
            arr[arr.length] = similarArray[i];
        }
        return arr;
    }

    function next(curEle) {
        if (flag) {
            return curEle.nextElementSibling;
        }
        var nex = curEle.nextElementSibling;
        while (nex && nex.nodeType !== 1) {
            nex = nex.nextElementSibling;
        }
        return nex;
    }

    function nextAll(curEle) {
        var arr = [];
        var nex = this.next(curEle);
        while (nex) {
            arr.push(nex);
            nex = this.next(nex);
        }
        return arr;
    }

    function offset(ele) {
        var eleLeft = ele.offsetLeft;
        var eleTop = ele.offsetTop;
        var eleParent = ele.offsetParent;
        var left = null;
        var top = null;
        left += eleLeft;
        top += eleTop;
        while (eleParent) {
            if (window.navigator.userAgent.indexOf('MSIE 8.0') !== -1) {
                left += eleParent.offsetLeft;
                top += eleParent.offsetTop;
            } else {
                left += eleParent.clientLeft + eleParent.offsetLeft;
                top += eleParent.clientTop + eleParent.offsetTop;
            }
            eleParent = eleParent.offsetParent;
        }
        return {left: left, top: top};
    }

    function prev(curEle) {
        if (flag) {
            return curEle.previousElementSibling;
        }
        var pre = curEle.previousElementSibling;
        while (pre && pre.nodeType !== 1) {
            pre = pre.previousElementSibling;
        }
        return pre;
    }

    function prepend(newEle, container) {
        var oF = this.firstChild(container);
        if (oF) {
            return container.insertBefore(newEle, oF);
        }
        container.appendChild(newEle);
    }

    function prevAll(curEle) {
        var arr = [];
        var pre = this.prev(curEle);
        while (pre) {
            arr.unshift(pre);
            pre = this.prev(pre);
        }
        return arr;
    }

    function removeClass(ele, className) {
        if (this.hasClass(ele, className)) {
            ele.className = ele.className.replace(className, '');
        }
    }

    function setCss(attr, val) {
        if (attr === 'opacity') {
            this.style['filter'] = 'alpha(opacity=' + val * 100 + ')';
            this.style.opacity = val;
            return;
        }
        if (attr === 'float') {
            this.style['cssFloat'] = val;
            this.style['styleFloat'] = val;
            return;
        }
        if(attr === 'border'){
            this.style.border = val;
        }
        var reg = /^(width|height|left|top|right|bottom|((margin|padding)(Top|Bottom|Left|Right)?))$/;
        if (reg.test(attr)) {
            if (!isNaN(val)) {
                val += 'px';
            }
        }
        this.style[attr] = val;
    }

    function setGroupCss(options) {
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                setCss.call(this, key, options[key]);
            }
        }
    }

    function sibling(curEle) {
        var pre = this.prev(curEle);
        var nex = this.next(curEle);
        var arr = [];
        pre ? arr.push(pre) : null;
        nex ? arr.push(nex) : null;
        return arr;
    }

    function siblings(curEle) {
        return this.prevAll(curEle).concat(this.nextAll(curEle));
    }

    return {
        addClass: addClass,
        append: append,
        children: children,
        assertElement: assertElement,
        css: css,
        firstChild: firstChild,
        formatJSON: formatJSON,
        getElementsByClass: getElementsByClass,
        getWin: getWin,
        hasClass: hasClass,
        index: index,
        insertBefore: insertBefore,
        insertAfter: insertAfter,
        lastChild: lastChild,
        listToArray: listToArray,
        next: next,
        nextAll: nextAll,
        offset: offset,
        prev: prev,
        prepend: prepend,
        prevAll: prevAll,
        removeClass: removeClass,
        sibling: sibling,
        siblings: siblings
    }
})();
// //字符串扩展方法：去除字符串首尾的空格
// String.prototype.trim=function(){
//     var reg=/^\s+|\s+$/g;
//     return this.replace(reg,'');
// }
var BOM = {
    parseQueryStr: function (str) {
        var temp = null;
        var reg = /([^=?&]+)=([^=?&]+)/g;
        var obj = {};
        while (temp = reg.exec(str)) {
            obj[temp[1]] = temp[2];
        }
        return obj;
    },
    getWBox: function () {
        var box = {};
        box.h = document.documentElement.clientHeight || document.body.clientHeight;
        box.w = document.documentElement.clientWidth || document.body.clientWidth;
        box.scrollT = (document.documentElement.scrollTop || document.body.scrollTop);
        box.scrollL = (document.documentElement.scrollLeft || document.body.scrollLeft);
        box.centerL = box.w / 2 + box.scrollL;
        box.centerT = box.h / 2 + box.scrollL;
        return box;
    },
    getBrowser: function () {
        var ua = navigator.userAgent;
        var b;
        if (b = ua.match(/msie ([\d.]+)/i)) {
            return "Internet Explorer " + b[1];
        } else if (b = ua.match(/firefox\/([\d.]+)/i)) {
            return "Firefox " + b[1];
        } else if (b = ua.match(/version\/([\d.]+).*safari/i)) {
            return "Safari " + b[1];
        } else if (b = ua.match(/opera.([\d.]+)/i)) {
            return "Opera " + b[1];
        } else if (b = ua.match(/chrome\/([\d.]+)/i)) {
            return "Chrome " + b[1];
        }
    },
    isIE: false,
    isIE6: false,
    isIE7: false,
    isIE8: false,
    isIE9: false,
    isIE10: false,
    isChrome: false,
    isOpera: false,
    isFirefox: false,
    isSafari: false
};
~(function () {
    var ua = navigator.userAgent;
    var b;
    if (b = ua.match(/msie ([\d.]+)/i)) {
        BOM.isIE = true;
        BOM['isIE' + Number(b[1])] = true;
    } else if (b = ua.match(/firefox\/([\d.]+)/i)) {
        BOM.isFirefox = true;
    } else if (b = ua.match(/version\/([\d.]+).*safari/i)) {
        BOM.isSafri = true;
    } else if (b = ua.match(/opera.([\d.]+)/i)) {
        BOM.isOpera = true;
    } else if (b = ua.match(/chrome\/([\d.]+)/i)) {
        BOM.isChrome = true;
    }
})();