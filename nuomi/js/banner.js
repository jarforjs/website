(function () {
    var outer = document.getElementById('outer');
    var inner = document.getElementById('inner1');
    var imgList=inner.getElementsByTagName('img');
    //var tips = document.getElementById('tips');
    //var oLis = tips.getElementsByTagName('li');
    var leftBtn = document.getElementById('leftBtn');
    var rightBtn = document.getElementById('rightBtn');
    var count = null;
    var jsonData = null;

    //1、Ajax请求数据
    ~function () {
        var xhr = new XMLHttpRequest;
        xhr.open('get', 'banner.txt', false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                jsonData = utils.formatJSON(xhr.responseText);
            }
        };
        xhr.send();
    }();

    //2、按照字符串拼接的方式绑定数据
    ~function () {
        //1)绑定的是轮播图区域的数据
        var str = "";
        for (var i = 0; i < jsonData.length; i++) {
            var cur = jsonData[i];
            str += '<div><img src="" trueImg="' + cur.img + '"/></div>';
        }
        //->为了实现无缝滚动我们需要把第一张图片克隆一份一模一样的放在末尾
        str += '<div><img src="" trueImg="' + jsonData[0].img + '"/></div>';
        inner.innerHTML = str;
        count = jsonData.length + 1;
        animate.setCss(inner, 'width', count * 738);

        //2)绑定的是焦点区域的数据
        /*var str = "";
        for (var j = 0; j < jsonData.length; j++) {
            if (j === 0) {
                str += '<li class="select"></li>';
            } else {
                str += '<li></li>';
            }
        }
        tips.innerHTML = str;*/
    }();

    //3、实现图片的延迟加载
    window.setTimeout(lazyImg, 500);
    function lazyImg() {
        for (var i = 0, len = imgList.length; i < len; i++) {
            ~function (i) {
                var curImg = imgList[i];
                var oImg = new Image;
                oImg.src = curImg.getAttribute("trueImg");
                oImg.onload = function () {
                    curImg.src = this.src;
                    curImg.style.display = "block";
                    oImg = null;
                    animate(curImg, {opacity: 1}, 300);
                }
            }(i);
        }
    }

    //4、实现自动轮播
    //->记录的是步长(当前是哪一张图片,零是第一张图片)
    var autoTimer = null;
    var step = 0;
    autoTimer = window.setInterval(autoMove, 2000);
    function autoMove() {
        if (step == count - 1) {
            step = 0;
            animate.setCss(inner, 'left', 0);
        }
        step++;
        animate(inner, {left: -step * 738}, 500);
        //changeTip();
    }

    //5、实现焦点对齐
    /*function changeTip() {
        //var tempSt = step > oLis.length - 1 ? 0 : step;
        var tempSt = step >= oLis.length ? 0 : step;
        for (var i = 0; i < oLis.length; i++) {
            var cur = oLis[i];
            i === tempSt ? cur.className = 'select' : cur.className = '';
        }
    }*/

    //->6、停止和开启自动轮播
    outer.onmouseover = function () {
        clearInterval(autoTimer);
        leftBtn.style.display = rightBtn.style.display = "block";
    };
    outer.onmouseout = function () {
        autoTimer = setInterval(autoMove, 2000);
        leftBtn.style.display = rightBtn.style.display = "none";
    };


    //->7、单击焦点实现轮播图的切换
    // ~function () {
    //     for (var i = 0; i < oLis.length; i++) {
    //         var cur = oLis[i];
    //         cur.index = i;
    //         cur.onclick = function () {
    //             //changeTip();
    //             step = this.index;
    //             animate(inner, {left: -step * 738}, 500);
    //         }
    //     }
    // }();

    //8、实现左右切换
    rightBtn.onclick = autoMove;
    leftBtn.onclick = function () {
        if (step <= 0) {
            step = count - 1;
            animate.setCss(inner, 'left', -step * 738);
        }
        step--;
        animate(inner, {left: -step * 738}, 500);
        //changeTip();
    }
})();
/*
1.window.onload:当页面中的HTML结构、图片、文字、音视频等所有资源加载完成才会触发这个事件，并且在同一个页面中只能使用一次
因为是DOM0绑定，所以只能使用一次

2.
采用DOM2事件绑定，监听的是DOMContentLoaded这个事件行为（在IE6~8下使用的是onreadystatechange这个事件行为）
*/