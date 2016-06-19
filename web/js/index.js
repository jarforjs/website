/*
 for(var i=0;i<navDrop.length;i++){
 navDrop[i].index=i;
 navDrop[i].onmouseover=function () {
 dropMenu[this.index].style.display="block";
 }
 navDrop[i].onmouseout=function () {
 dropMenu[this.index].style.display="none";
 }
 }
 */
/*一屏的弹出菜单*/
(function () {
    var navDrop = document.getElementsByClassName("nav_drop");
    var dropMenu = document.getElementsByClassName("dropMenu");
    var first = document.getElementsByClassName("first");
    var second = document.getElementsByClassName("second");

    tab(navDrop,dropMenu);
    tab(first,second);
    function tab(menu1, menu2) {
        for (var i = 0; i < menu1.length; i++) {
            (function (i) {
                menu1[i].onmouseover = function () {
                    menu2[i].style.display = "block";
                };
                menu1[i].onmouseout = function () {
                    menu2[i].style.display = "none";
                }
            })(i);
        }
    }
})();


/*切换城市*/
(function () {
    var cityUl=document.getElementById("cityUl");
    //console.log(cityUl);
    var citys=cityUl.getElementsByTagName("li");
    var city=document.getElementById("city");
    for(var i=0;i<citys.length;i++){
        ~function (i) {
            citys[i].onclick=function () {
                city.innerHTML=citys[i].innerHTML+'<span class="lines"></span>';
            }
        }(i)
    }
})();


//选项卡封装
//var panelBox=document.getElementById("panelBox");
var panel1 = new TabChange("panelBox", 0);
//var box = document.getElementById("box");
var box1 = new TabChange("box", 0);


//var ads=document.getElementById("ads");
//opacity轮播图封装
var ads1 = new AutoBanner("ads", "ads.txt", 3000);
var ads2 = new AutoBanner("ad", "ad.txt", 3000);


//回到顶部
~function () {
    var goTop = document.getElementById("j-go-top");
    var goTopBtn = document.getElementsByClassName("go-top-2")[0];
    var topSearch = document.getElementsByClassName("w-top-search-box")[0];
    //var sidecate=document.getElementById("sidecate");
    goTopBtn.onclick = function () {
        window.onscroll = null;
        goTop.style.display = "none";

        var duration = 500;
        var distance = utils.getWin("scrollTop");
        var interval = 10;
        var step = distance / duration * interval;
        var timer = window.setInterval(function () {
            if (utils.getWin("scrollTop") <= 0) {
                window.clearInterval(timer);
                window.onscroll = showBtn;
                return;
            }
            var scrollTop = utils.getWin('scrollTop');
            scrollTop -= step;
            utils.getWin('scrollTop', scrollTop);
        }, interval);
    };
    window.addEventListener('scroll',showBtn,false);
    //window.onscroll = showBtn;
    function showBtn() {
        var winScrollTop = utils.getWin('scrollTop');
        var screenHeight = utils.getWin('clientHeight');
        goTop.style.display = winScrollTop - screenHeight > 0 ? "block" : "none";
        topSearch.style.display = winScrollTop > 666 ? "block" : "none";
        //sidecate.style.position=winScrollTop > 840 ? "fixed" : "absolute";
        //sidecate.style.top=winScrollTop > 840 ? "170px" : "1074px";
        /*var stickyPanel=document.getElementById("sticky-panel");
         var stickyPanelList=stickyPanel.getElementsByTagName("li");
         winScrollTop > 1300 ? utils.addClass(stickyPanelList[0],"active"): null;*/
    }
}();


//搜索框 onclick="if(this.value == '请输入...')this.value = '';" onblur="if(this.value == ''){this.value = '请输入...';}"
(function () {
    var searchBox = document.getElementById("searchBox");
    var ss = document.getElementById("ss");
    var searchBtn = document.getElementById("button");
    var searchList = document.getElementById("search-list");
    ss.onclick = function () {
        if (this.value == "请输入...")this.value = "";
    };
    ss.onblur = function () {
        if (this.value == "")this.value = "请输入..."
    };

    document.body.onclick = function () {
        searchList.parentNode.style.display = 'none';
    };




    searchBtn.onclick = function (e) {
        e = e || window.event;
        var target = e.srcElement || e.target;
        //打开一个新页面
        window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(ss.value), '_blank');
    };
    ss.onkeyup=function () {
        if(!ss.value){
            searchList.parentNode.style.display="none";
        }
        core();
    };

    searchList.onclick = function (e) {
        e = e || window.event;
        var target = e.srcElement || e.target;
        //打开一个新页面
        window.open('https://www.baidu.com/s?wd=' + encodeURIComponent(target.innerHTML), '_blank');
    };
    searchList.onmouseover=function (e) {
        e = e || window.event;
        var target = e.srcElement || e.target;
        ss.value=target.innerHTML;
    };

    function core() {
        var val = ss.value;
        if (val) {
            jsonp('http://suggestion.baidu.com/su',
                {wd: val}, 'cb', function (data) {
                    var list = data.s;
                    var fragement = document.createDocumentFragment();
                    for (var i = 0, len = list.length; i < len; i++) {
                        var li = document.createElement('li');
                        li.innerHTML = list[i];
                        fragement.appendChild(li);
                    }
                    searchList.innerHTML = '';
                    searchList.parentNode.style.display = "block";
                    searchList.appendChild(fragement);
                });
        }
    }

    searchBox.onclick = function (e) {
        e.stopPropagation();
        e.cancelBubble = true;
    }
})();

//今日推荐
(function () {
    var width1200 = document.getElementById("width1200");
    var prev = document.getElementById("prev");
    var next = document.getElementById("next");
    var step = 0;

    function move() {
        step++;
        if (step > 2) {
            step = 1/**/;
            width1200.style.left = 0;
        }
        animate(width1200, {left: step * -964}, 300);
    }

    next.onclick = function () {
        move();
    };
    prev.onclick = function () {
        step--;
        if (step < 0) {
            step = 1;
            width1200.style.left = -1928 + "px";
        }
        animate(width1200, {left: -step * 964}, 300);
    };
})();

//楼层导航
~function(){
    var floorAry = [
        {id: "oneFloor"},
        {id: "twoFloor"},
        {id: "threeFloor"},
        {id: "fourFloor"},
        {id: "fiveFloor"},
        {id: "sixFloor"},
        {id: "sevenFloor"},
        {id: "eightFloor"}
    ];

    var floorIndex = document.getElementById("sticky-panel");
    var oLis = utils.children(floorIndex);
    var sidecate=document.getElementById("sidecate");
    ~function () {
        for (var i = 0, len = floorAry.length; i < len; i++) {
            var curFloor = floorAry[i];
            var curFloorEle = document.getElementById(curFloor["id"]);
            curFloor["top"] = utils.offset(curFloorEle).top;
        }
        utils.css(floorIndex, "marginTop", -len * 31 / 2);

    }();

    function showFloor() {
        var curTop = utils.getWin("scrollTop"), curHeight = utils.getWin("clientHeight");

        sidecate.style.display = curTop + curHeight > oLis[0].getAttribute("zhufengTop") ? "block" : "none";
    }
    window.addEventListener('scroll',showFloor,false);
    var timer = null;
    for (var i = 0; i < oLis.length; i++) {
        var curLi = oLis[i];
        curLi.onclick = function () {
            window.onscroll = null;
            var target = this.getAttribute("zhufengTop");
            move(target);
        }
    }
    function move(target) {
        var begin = utils.getWin("scrollTop"), duration = 500;
        var step = Math.abs((target - begin) / duration * 10);
        _move();
        function _move() {
            window.clearTimeout(timer);
            var cur = utils.getWin("scrollTop");
            if (target > begin) {
                if (cur + step >= target) {
                    window.onscroll = showFloor;
                    utils.getWin("scrollTop", target-30);
                    return;
                }
                utils.getWin("scrollTop", cur + step);
            } else if (target < begin) {
                if (cur - step <= target) {
                    window.onscroll = showFloor;
                    utils.getWin("scrollTop", target-30);
                    return;
                }
                utils.getWin("scrollTop", cur - step);
            } else {
                window.onscroll = showFloor;
                return;
            }
            timer = window.setTimeout(_move, 10);
        }
    }
}();

