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
    winH=$(document).innerHeight();
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
        str+="<li time='"+curData["date"]+"'>";
        str+="<span class='week'>"+curData["weekday"]+"</span>";
        str+="<span class='date'>"+curData["date"].myFormatTime("{1}-{2}")+"</span>";
        str+="</li>";
    });
    $calendarList.html(str).css("width",data.length*105);
    //计算最小的left的值
    minL=-(data.length-7)*105;
});

//开始calendar区域的日期定为:开始的时候定位到当前的日期
var $calendarLis=null;
$calendarCallBackList.add(function (today, data) {
    $calendarLis=$calendarList.children("li");
    //1.根据当前日期today获取到具体的li
    //today="2016-05-09";
    var $curTime=$calendarLis.filter("[time='"+today+"']");
    //console.log($curTime);
    //2.如果当前日期在li中并不存在,我们找到其后面最靠近的一个:从第一个li开始查找,直到遇到一个li存储的日期比我们当前日期大的结束查找
    if($curTime.length===0){
        for(var i=0;i<$calendarLis.length;i++){
            var $curLi=$calendarLis.eq(i);//eq的到的还是原生对象跟get不一样
            //var $curLi=$calendarLis[i];
            //$curLi.attr("time").replace(/\-/g,"/");
            var n=new Date($curLi.attr("time").replace(/-/g,"/"));
            //每一次循环找到的里中的日期
            var m=new Date(today.replace(/-/g,"/"));
            if((n-m)>0){
                $curTime=$curLi;
                break;
            }
        }
    }
    //如果找了一圈还没有我们则显示最后一个即可
    if($curTime.length===0){
        $curTime=$calendarLis.filter(":last");
    }

    //定位到当前$curTime这个位置,这个位置处于7个li中间的位置:但是到达边界还需要做一个边界判断
    var curL=-($curTime.index()*105)+(3*105);
    curL=curL<minL?minL:(curL>maxL?maxL:curL);
    $curTime.addClass("bg");
    $calendarList.css("left",curL);
    //-$curTime.index()*105+3*105
});