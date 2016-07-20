/**
 * Created by Jeawon on 2016/4/19.
 */
var utils = (function () { //这个作用域不销毁
    //使用惰性思想（JS高阶编程技巧之一）来封装我的常用方法库：第一次再给utils赋值的时候我们就已经把兼容处理好了，把最后的结果放在flag变量中，以后再每一个方法中，只要是IE6~8不兼容的，我们不需要重新的检测，只需要使用flag的值即可
    var flag = "getComputedStyle" in window;
    //flag这个变量不销毁，存储的是判断当前的游览器是否兼容getComputedStyle，兼容的话是标准浏览器，但是回flag=false说明当前浏览器是ie6~8
    //->addClass:给元素增加样式类名
    function addClass(ele, className) {
        var arr = className.replace(/^ +| +$/, "").split(/\s+/);
        for (var i = 0; i < arr.length; i++) {
            var cur = arr[i];
            if (!this.hasClass(ele, cur)) {
                ele.className += ' ' + cur;
            }
        }
    }

    /**
     *
     * @param ele 要操作的元素
     * @param container 要放到的盒子里
     */
    //->append:向指定容器的末尾追加元素
    function append(newEle, container) {
        return container.appendChild(newEle);//不写return返回值是undefined，但是会有输出
    }

    //->children:获取ele下所有的元素子节点，如果传递了他tagName，可以在获取的集合中进行二次筛选，把指定的标签名获取到
    function children(ele, tagName) {
        var arr = [];
        //flag=/*navigator.userAgent.indexOf("MSIE 8.0")*/!(/MSIE (6|7|8)/.test(navigator.userAgent))
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
                //当前的标签名是否等于我们需要的那一个
                if (cur.nodeName === tagName.toUpperCase()) {
                    newArr.push(cur);
                }
            }
            //return arr=newArr;
            return newArr;
        }
        return arr;
    }

    //->assertElement:用来判断一个对象是不是DOM元素或document的方法。
    //利用的是try catch的技巧
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

    //->css:此方法实现了获取、单独设置、批量设置元素的样式值
    function css(curEle) {
        var argTwo = arguments[1], arr = Array.prototype.slice.call(arguments, 1);
        if (typeof argTwo === "string") {
            //第一个参数值是一个字符串，这样的话很有可能是在获取样式；为什么说是很有可能呢？因为还需要判断是否存在第三个参数，如果第三个参数存在的话，不是获取了，而是在单独的设置样式的属性值。
            if (typeof arguments[2] === "undefined") {
                //if(!arguments[2])第三个参数不存在
                return this.getCss.apply(this, arr);
            }
            //第三个参数存在则为单位设置
            this.setCss.apply(this, arr);
        }
        argTwo = argTwo || 0;
        if (argTwo.toString() === "[object Object]") {
            //批量设置样式属性值
            this.setGroupCss.apply(this, arr);
        }
    }

    //->firstChild:获取第一个元素子节点
    function firstChild(container) {
        if (flag) {
            return container.firstElementChild;
        }
        //拿到所有儿子节点，看看他有没有儿子？如果有取出儿子中的第一个
        return this.children(container).length ? this.children(container)[0] : null;
        /*var chs = this.children(container);
         return chs.length > 0 ? chs[0] : null;*/
    }

    //->formatJSON:把JSON格式字符串转换为JSON格式对象
    function formatJSON(jsonStr) {
        return 'JSON' in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
    }

    //->getElementsByClass:通过元素的样式类名获取一组元素集合
    function getElementsByClass(strClass, context) {
        //如果没有传就走document
        context = context || document;
        //不是低版本ie下我们直接可以调用原生的
        if (flag) {
            return this.listToArray(context.getElementsByClassName(strClass));
        }
        var strList = strClass.replace(/^ +| +$/g, "").split(/\s+/);
        //console.log("("+strClass.replace(/^ +| +$/,"")+")");//加不加g
        //console.log(classList);
        //先用replace把传递进来的样式类名首尾空格先去掉，然后再按中间的空格把里面的每一项拆分成数组
        var arr = [];
        var nodeList = context.getElementsByTagName("*");
        //拿到context下的所有标签，再一一匹配看是否能匹配到带有样式的，如果匹配了就放入数组里。
        //->判断curNode.className是否即包含"w3"也包含"w1",如果两个都包含的话,curNode就是我想要的,否则就不是我想要的
        //->在循环["w3", "w1"]
        //遍历每一个标签
        //去掉前后空格
        for (var i = 0; i < nodeList.length; i++) {
            var curNode = nodeList[i];
            //得到的是第一个div标签
            //拿到一个标签和任意一个class名字匹配，如果有一个不一样说明就不是我们想要的那一个
            var _flag = true;//我们假设curNode中包含了所有样式
            for (var j = 0; j < strList.length; j++) {
                var reg = new RegExp("(^| +)" + strList[j] + "( +|$)");
                if (!reg.test(curNode.className)) {
                    _flag = false;//匹配不成功，设置为不是
                    break;
                }
            }
            if (_flag) {//拿每一个标签分别和所有的样式名比较后，如果结果还是true的话，说明当前元素标签包含所有的样式，也是我们想要的，放入数组arr
                arr.push(curNode);
            }
        }
        return arr;
    }

    //->win:操作浏览器的盒子模型信息:读取dom元素，有第二个参数就赋值（js盒子模型只有scrollTop和scrollLeft是可读写的）
    function getWin(attr, val) { //一个参数的时候是读取，两个参数可以赋值
        //if(typeof val !=='undefined')
        if (val !== undefined) {
            document.documentElement[attr] = val;
            document.body[attr] = val;
        }
        return document.documentElement[attr] || document.body[attr];
    }

    //->getCss:获取通过浏览器计算过后元素的样式值
    function getCss(curEle, attr) {
        //处理带单位的问题
        var reg = /^(-?\d+(\.\d+)?)(?:px|em|pt|deg|rem)$/;
        var val = null;
        if (!flag) {
            ///MSIE (?:6|7|8)/.test(window.navigator.userAgent)
            //标准：opacity: .4;
            //非标准：filter: alpha(opacity=40);
            if (attr === 'opacity') {
                val = curEle.currentStyle['filter'];
                var reg1 = /^alpha\(opacity=(\d+(\.\d+)?)\)$/;
                return reg1.test(val) ? RegExp.$1 / 100 : 1;
            } else {
                val = curEle.currentStyle[attr];
            }

        } else {
            val = (attr == 'opacity' ? window.getComputedStyle(curEle, null)[attr] / 1 : window.getComputedStyle(curEle, null)[attr]);
        }
        return reg.test(val) ? parseFloat(val) : val; //如果正则验证通过，寿命返回值是带单位的，那么我们就要人为去掉这个单位。否则不变
    }

    //->hasClass:验证当前元素中是否包含className这个样式类名
    function hasClass(ele, name) {
        var reg = new RegExp("(?:^| +)" + name + "(?: +|$)");
        return reg.test(ele.className);
    }

    //->index:获取当前元素的索引
    function index(curEle) {
        return this.prevAll(curEle).length;
    }

    /**
     *
     * @param newEle 新的元素插入到oldEle前面
     * @param oldEle 旧的元素
     */
    //->insertBefore:把新元素(newEle)追加到指定元素(oldEle)的前面
    function insertBefore(newEle, oldEle) {
        return oldEle.parentNode.insertBefore(newEle, oldEle);
    }

    //把某个元素查到某个元素的后面
    //->insertAfter:把新元素(newEle)追加到指定元素(oldEle)的后面
    //->相当于追加到oldEle弟弟元素的前面,如果弟弟不存在,也就是当前元素已经是最后一个了,我们把新的元素放在最末尾即可,要知道原理！！！
    function insertAfter(newEle, oldEle) {
        var oN = this.next(oldEle);
        if (oN) {
            return oldEle.parentNode.insertBefore(newEle, oN);
        }
        oldEle.parentNode.appendChild(newEle);
    }

    //->lastChild:获取最后一个元素子节点
    function lastChild(container) {
        if (flag) {
            return container.lastElementChild;
        }
        //拿到所有儿子节点，看看他有没有儿子？如果有取出儿子中的第一个
        return this.children(container).length ? this.children(container)[this.children(container).length - 1] : null;
        /*var chs = this.children(container);
         return chs.length > 0 ? chs[chs.length-1] : null;*/
    }

    //->listToArray:把类数组集合转换为数组
    function listToArray(similarArray) {
        /*
         *   try catch js中容错
         * */
        if (flag) {
            return Array.prototype.slice.call(similarArray);
        }
        arr = [];
        for (var i = 0; i < similarArray.length; i++) {
            arr[arr.length] = similarArray[i];
        }
        /*var arr = [];
         try {
         arr = Array.prototype.slice.call(similarArray); //根本就不支持ie7和ie8
         } catch (e) {
         //alert(); //ie7 和 ie8 弹出，
         arr = [];
         for (var i = 0; i < similarArray.length; i++) {
         arr[arr.length] = similarArray[i];
         }
         }*/
        return arr;
    }

    //->next:获取下一个弟弟元素节点
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

    //->nextAll:获取所有的弟弟元素节点
    function nextAll(curEle) {
        var arr = [];//可能返回空数组
        var nex = this.next(curEle);
        while (nex) {
            arr.push(nex);
            nex = this.next(nex);
        }
        return arr;
    }

    //->offset:获取页面中任意元素距离BODY的偏移
    function offset(ele) {
        var left = ele.offsetLeft;
        var top = ele.offsetTop;
        var eleParent = ele.offsetParent;
        while (eleParent) {
            /*
             *  ps:在IE8中就不要加父级的边框了，IE8自己已经加过了。所以我们要判断当前浏览器是不是IE8:
             *      1、可以用正则：/MSIE (?:6|7|8)/.test(window.navigator.userAgent)
             *      2、用字符串的方法：window.navigator.userAgent.indexOf('MSIE 8.0') !== -1
             * */
            if (window.navigator.userAgent.indexOf('MSIE 8.0') !== -1) { //在ie8浏览器中,我们使用offsetLeft/offsetTop其实已经把腹肌参照物的边框已经算在内了
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

    //->prev:获取上一个哥哥元素节点
    //->首先获取当前元素的上一个哥哥节点,判断是否为元素节点,不是的话基于当前的继续找上面的哥哥节点...一直到找到哥哥元素节点为止,如果没有哥哥元素节点,返回null即可
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

    /**
     *
     * @param ele 要插入的元素
     * @param container 把元素放到哪个容器里
     */
    //->prepend:向指定容器的开头追加元素
    //->把新的元素添加到容器中第一个子元素节点的前面,如果一个元素子节点都没有,就放在末尾即可,要知道原理！！！
    function prepend(newEle, container) {
        //先找到第一个儿子，把他插进去
        var oF = this.firstChild(container);
        if (oF) {
            return container.insertBefore(newEle, oF);//不写return返回值是undefined，但是会有输出
            //木有儿子会自动把他append进去
        }
        container.appendChild(newEle);

    }

    //->prevAll:获取所有的哥哥元素节点
    function prevAll(curEle) {
        var arr = [];
        var pre = this.prev(curEle);
        while (pre) {
            arr.unshift(pre);
            pre = this.prev(pre);
        }
        return arr;
    }

    //->removeClass:给元素移除样式类名
    function removeClass(ele, className) {
        if (this.hasClass(ele, className)) {
            ele.className = ele.className.replace(className, '');
        }
    }

    //->setCss:给当前元素的某一个样式属性设置值(增加在行内样式上的)
    function setCss(curEle, attr, val) {
        if (attr === 'opacity') {//处理透明度
            curEle.style['filter'] = 'alpha(opacity=' + val * 100 + ')';
            curEle.style.opacity = val;
            return;
        }
        //float的问题也需要处理??
        if (attr === 'float') {
            curEle.style['cssFloat'] = val;
            curEle.style['styleFloat'] = val;
            return;
        }
        if (attr === 'border') {
            this.style.border = val;
        }
        var reg = /^(width|height|left|top|right|bottom|((margin|padding)(Top|Bottom|Left|Right)?))$/;
        //判断你传进来的这个value是否带单位，如果带单位了我就不加了
        if (reg.test(attr)) {//验证通过，就证明是上面这一串
            if (!isNaN(val)) {//不带单位的我就加单位
                val += 'px';
            }
        }
        curEle.style[attr] = val;
    }

    //->setGroupCss:给当前元素批量的设置样式属性值
    function setGroupCss(curEle, options) {
        //因为是一组样式，我们传一个对象参数（对象可以包含多组属性和属性值）。
        //通过检测options的数据类型，如果不是一个对象，则不能进行批量的设置
        /*if(Object.prototype.toString.call(obj)==='[object Object]'){
         return;
         }*/
        options = options || '0';
        if (options.toString() !== '[object Object]') {
            //任何一个数据类型的值都有toString方法，每一个都调用自己原型上的toString方法。除了对象以外其他的数据类型调用自己原型上的toString方法（作用：转换字符串）
            return;
        }
        //遍历对象中的每一项，调取setCss方法一个个进行设置
        for (var key in options) {//循环设置obj的每一组属性样式，key就是属性名，options就是属性值
            if (options.hasOwnProperty(key)) {
                //key是他的私有属性，我才调取setCss方法来实现，否则不调取（哪些属性可枚举，哪些属性不可枚举，如何遍历的时候进行优化）
                //curEle.style[key]=obj[key];
                this.setCss(curEle, key, options[key]);
            }
        }
    }

    //->sibling:获取相邻的两个元素节点
    function sibling(curEle) {
        var pre = this.prev(curEle);
        var nex = this.next(curEle);
        var arr = [];
        pre ? arr.push(pre) : null;
        nex ? arr.push(nex) : null;
        return arr;
    }

    //->siblings:获取所有的兄弟元素节点
    function siblings(curEle) {
        //没有就返回空数组
        return this.prevAll(curEle).concat(this.nextAll(curEle));
    }

    //->把外界需要使用的方法暴露给utils
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
        getCss: getCss,
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
        setCss: setCss,
        setGroupCss: setGroupCss,
        sibling: sibling,
        siblings: siblings
    }
})();
/*
 //回调函数
 function a(callback){
 //烧水
 //烧开了
 if(typeof callback === 'function'){
 callback();
 }

 }
 */



// /*
//  数组去重方法是面试最常见的题,写在这里，供大家学习
//  给数组扩展一个去除数组中的重复项的方法，要写在Array类的原型上
//  下面给出了两种方案，一个是双循环的，一个是对象属性转换的方式
//
//  第一种方式用了双循环，时间复杂高，没有BUG,理解起来比较容易。
//
//  */
// Array.prototype.distinct1=function (){
//     var a=this;
//     for(var nIndex=0;nIndex<a.length-1;nIndex++){
//         for(var i=nIndex+1;i<a.length;){
//             if(a[nIndex]==a[i]){
//                 a.splice(i,1);
//             }else{
//                 i++;
//             }
//         }
//     }
//     return a;
//
// }
// /*
//  数组去重复的第二种方法:减少一个循环，多定义一个对象，利于空间换时间。理解难度增加不少，需要对对象的自定义属性理解的比较好。
//  但这种算法BUG很明显，就是只能处理值类型的数组项，对于数组里是对象类型的数据的时候，就会出问题了。
//  即使是值类型，也必须是同一样值类型才行，不能在数组里既有数字，又有字符串，否则也会出问题。
//  */
// Array.prototype.distinct2=function (){
//     var a=this;
//     for(var j=0;j<a.length-1;j++){
//         var item=a[j];
//         for(var i=j+1;i<a.length;){
//             if(item===a[i]){
//                 a.splice(i,1);
//             }else{
//                 i++;
//             }
//         }
//     }
// }
//
// //字符串扩展方法：去除字符串首尾的空格
// String.prototype.trim=function(){
//     var reg=/^\s+|\s+$/g;
//     return this.replace(reg,'');
// }


//获取关于浏览器的一些属性、比如说浏览器的版本，浏览器的高宽、滚动条的位置等等
var BOM = {
    /*
     请编写一个JavaScript函数 parseQueryStr，它的用途是把URL参数解析为一个对象：用法如：var obj = parseQueryString(url);例如： www.zhufengpeixun.cn?course1=js&course=css;  则obj的值为{course1:"js",course:"css"  }
     也就是说这个方法是解析URL字符串的
     */
    parseQueryStr: function (str) {
        var temp = null;//存放临时匹配到的字符串的那个临时数组

        //定义一个取每一对值的正则，把满足要求的内容分别定义成两个分组。匹配到的内容不到包括=?&这三个字符既可
        var reg = /([^=?&]+)=([^=?&]+)/g;
        var obj = {};
        while (temp = reg.exec(str)) {//把exec的返回值赋给这个tempa,如果tempa不是null，则exec会执行多次。
            //tempa是一个数组，这个数组的长度是reg中匹配到的子表达式（分组）的个数加1
            //tempa的第0项是整个正则匹配到的内容，所以从索引1开始
            obj[temp[1]] = temp[2];
        }
        return obj;
    },
    getWBox: function () {
        var box = {};
        box.h = document.documentElement.clientHeight || document.body.clientHeight;//浏览器窗口的高
        box.w = document.documentElement.clientWidth || document.body.clientWidth;//窗口的高
        box.scrollT = (document.documentElement.scrollTop || document.body.scrollTop);//滚动条的位置
        box.scrollL = (document.documentElement.scrollLeft || document.body.scrollLeft);//左边滚动条的位置
        box.centerL = box.w / 2 + box.scrollL;//窗口的中间
        box.centerT = box.h / 2 + box.scrollL;//窗口的中间
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
