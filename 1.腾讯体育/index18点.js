~function (pro) {
    //myTrim:Remove the string and space
    pro.myTrim = function myTrim() {
        return this.replace(/(^ +| +$)/g, "");
    };

    //mySub:Intercept string, this method is distinguished in English
    pro.mySub = function mySub() {
        var len = arguments[0] || 10, isD = arguments[1] || false, str = "", n = 0;
        for (var i = 0; i < this.length; i++) {
            var s = this.charAt(i);
            /[\u4e00-\u9fa5]/.test(s) ? n += 2 : n++;
            if (n > len) {
                isD ? str += "..." : void 0;
                break;
            }
            str += s;
        }
        return str;
    };

    //myFormatTime:Format time
    pro.myFormatTime = function myFormatTime() {
        var reg = /^(\d{4})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?: +)?(\d{1,2})?(?:-|\/|\.|:)?(\d{1,2})?(?:-|\/|\.|:)?(\d{1,2})?$/g, ary = [];
        this.replace(reg, function () {
            ary = ([].slice.call(arguments)).slice(1, 7);
        });
        var format = arguments[0] || "{0}年{1}月{2}日{3}:{4}:{5}";
        return format.replace(/{(\d+)}/g, function () {
            var val = ary[arguments[1]];
            return val.length === 1 ? "0" + val : val;
        });
    };

    //queryURLParameter:Gets the parameters in the URL address bar
    pro.queryURLParameter = function queryURLParameter() {
        var reg = /([^?&=]+)=([^?&=]+)/g, obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    };
}(String.prototype);

//实现match区域的局部滚动:match区域下需要有一个总的div,IScroll是给#match下第一个元素中的内容做局部滚动设置的,想让滚动条有在match区域显示的话需要给match增加position:relative属性
var $myScroll=new IScroll("#match",{
    mouseWheel:true,//是否支持鼠标滚轮滚动,默认是false
    scrollbars:true,//是否显示滚动条,默认是false
    bounce:false,//是否支持到达边界缓冲,默认是true
    momentum:false//关闭势能动画
});
//计算match区域的高度&&当屏幕窗口的尺寸发生改变的时候:让$match区域的高度也随之变化
var $match=$(".match");
var winH=null;
//var winH=$(document).innerHeight();
//$(window).innerHeight();
// $("html").innerHeight();
// $("body").innerHeight();
// console.log($(document).innerHeight());
// $match.css("height",winH-40-82);

//页面加载,resize窗口发生变化时一起发生变化
$(window).on("load resize",function () {
    var winH=$(document).innerHeight();
    $match.css("height",winH-40-82);
    //当match区域的高度发生改变,我们需要让设置的局部滚动进行刷新
    $myScroll.refresh();
});


//进行calendar区域的数据请求,我们在请求成功数据后需要做的事情比较多,我们可以使用"发布订阅模式"进行回调函数的订阅
var $calendarCallBackList=$.Callbacks();//创建回调队列列表
function calendarBind(jsonData) {
    //异步请求,$.ajax后面的代码在请求的时候该干嘛干嘛
    if(jsonData&&jsonData["data"]){
        var today=jsonData["data"]["today"];
        var data=jsonData["data"]["data"];
        $calendarCallBackList.fire(today,data);//触发列表中的事件
    }
    //1.得到数据
        //绑定数据->定位当比赛这天,没有这天定位到接近这天
}
$.ajax({
    url:"http://matchweb.sports.qq.com/kbs/calendar?columnId=100000",
    type:"get",
    dataType:"jsonp",
    //calendarBind();
    jsonpCallback:"calendarBind"
});
//http://matchweb.sports.qq.com/kbs/calendar?columnId=100000


//开始calendar区域的数据绑定
var $calendarList=$(".calList>ul");
var minL=0;
var maxL=0;
$calendarCallBackList.add(function (today, data) {
    var str="";
    $.each(data,function (index, curData) {
        str+="<li>";
        str+="<span class='week'>"+curData["weekday"]+"</span>";
        str+="<span class='date'>"+curData["date"].myFormatTime("{1}-{2}")+"</span>";
        str+="</li>";
    });
    $calendarList.html(str).css("width",data.length*105);
    //计算最小的left的值
    minL=-(data.length-7)*105;
})
//开始calendar区域的日期定为:开始的时候定为当当前的日期
$calendarCallBackList.add(function (today, data) {
    
})