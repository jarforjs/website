~function () {
    //AJAX兼容处理
    //getXHR:创建AJAX对象(使用惰性思想进行封装,兼容所有浏览器的)
    var getXHR = function () {
        var flag = false, xhr = null, arr = [function () {
            return new XMLHttpRequest;
        }, function () {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }, function () {
            return new ActiveXObject("Msxml2.XMLHTTP");
        }, function () {
            return new ActiveXObject("Msxml3.XMLHTTP");
        }];
        for (var i = 0, len = arr.length; i < len; i++) {
            var temp = arr[i];
            try {
                xhr = temp();
                getXHR = temp;
                flag = true;
                break;
            } catch (e) {
            }
        }
        if (!flag) {
            throw new Error("YOUR BROWSER IS NOT SUPPORT AJAX~~~");
        }
        return xhr;
    };

    //sendAJAX:发送一个AJAX请求的方法
    //options:它是一个对象数据类型的值,把需要的参数和值都以键值对的方式传递进来
    var sendAJAX = function (options) {
        //参数初始化
        var _default = {
            url: "",
            type: "get",
            async: true,
            data: null,
            success: null
        };
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                _default[key] = options[key];
            }
        }

        //发送请求
        var xhr = getXHR();
        if (_default["type"].toLowerCase() === "get") {
            //GET请求还需要在URL的末尾追加随机数
            var suffix = _default["url"].indexOf("?") > -1 ? "&" : "?";
            _default["url"] += suffix + "_=" + Math.random();
        }

        xhr.open(_default["type"], _default["url"], _default["async"]);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
                var data = "JSON" in window ? JSON.parse(xhr.responseText) : eval("(" + xhr.responseText + ")");
                _default["success"] && _default["success"](data);
                /*
                 sendAJAX({
                 url: "data.txt",
                 success: function (data) {
                 console.log(data);
                 }
                 });
                 */
            }
        };
        xhr.send(_default["data"]);
    };

    window.sendAJAX = sendAJAX;
}();