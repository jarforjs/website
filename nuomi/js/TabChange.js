//选项卡插件封装:只要选项卡结构一样,不管几个实现的思想都是一样的,唯一不一样的就是最外层的容器不一样
~(function () {
    function TabChange(container, defaultIndex) {
        return this.init(container, defaultIndex);
    }

    TabChange.prototype = {
        constructor: TabChange,
        //默认让当前元素按照索引选中的页卡
        defaultIndexEven: function () {
            utils.addClass(this.oLis[this.defaultIndex], "select");
            utils.addClass(this.divList[this.defaultIndex], "select");
        },
        //事件委托实现绑定切换
        entrust:function () {
            var _this=this;
            this.tabFirst.onmouseover = function (e) {
                e = e || window.event;
                e.target = e.target || e.srcElement;
                //说明当前点击的是LI标签
                if (e.target.tagName.toUpperCase() === "A") {
                    _this.concrete(e.target.parentNode);
                }
            }
        },
        concrete:function (curEle) {
            //只要保证this是当前点击的LI
            var index = utils.index(curEle);
            utils.addClass(curEle, "select");

            for (var i = 0; i < this.oLis.length; i++) {
                i === index ? utils.addClass(this.divList[i], "select") : (utils.removeClass(this.oLis[i], "select"), utils.removeClass(this.divList[i], "select"));
            }
        },
        //初始化,也是当前插件的唯一入口
        init: function (container, defaultIndex) {
            if(arguments[0]=="panelBox"){
                this.container = document.getElementById("panelBox") || null;
                this.tabFirst=utils.children(this.container,"ul")[0];
                this.defaultIndex = defaultIndex || 0;
                this.oLis = utils.children(this.tabFirst,"li");
            }else{
                this.container = document.getElementById(container) || null;
                this.tabFirst = utils.firstChild(this.container);
                this.defaultIndex = defaultIndex || 0;
                this.oLis = utils.children(this.tabFirst);
            }
            this.divList = utils.children(this.container, "div");
            this.defaultIndexEven();
            this.entrust();
            return this;
        }
    };
    window.TabChange = TabChange;
})();