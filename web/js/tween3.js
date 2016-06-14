var zhufengEffect={
    linear:function (t,b,c,d) {
        return t/d*c+b;
    },
    jsonParse:function (jsonStr) {
        return 'JSON' in window?JSON.parse(jsonStr):eval("("+jsonStr+")");
    }
};
function animate(ele,obj,duration,effect,callback) {
    var fnEffect=zhufengEffect.linear;
    var oBegin={};
    var oChange={};
    var flg=0;
    for(var attr in obj){
        var target=obj[attr];
        var begin=animate.getCss(ele,attr);
        var change=target-begin;
        if(change){
            oBegin[attr]=begin;
            oChange[attr]=change;
            flg++;
        }
    }if(!flg)return;
    var interval=15;
    var times=0;
    clearInterval(ele.timer);
    function step() {
        times+=interval;
        if(times<duration){
            for (var attr in oChange){
                var begin=oBegin[attr];
                var change=oChange[attr];
                var val=fnEffect(times,begin,change,duration);
                animate.setCss(ele,attr,val);
            }
        }else {
            for (var attr in oChange){
                var target=obj[attr];
                animate.setCss(ele,attr,target);
                clearInterval(ele.timer);
                ele.timer=null;
            }
        }
    }
    ele.timer=window.setInterval(step,interval);
}
animate.getCss=function (ele,attr) {
    if(window.getComputedStyle){
        return parseFloat(window.getComputedStyle(ele,null)[attr]);
    }else {
        if(attr=="opacity"){
            var val=ele.currentStyle['filter'];
            var reg=/alpha\(opacity=(\d+(?:\.\d+)?)\)/;
            return reg.test(val)?RegExp.$1/100:1;
        }else {
            return parseFloat(ele.currentStyle[attr]);
        }
    }
};
animate.setCss=function (ele,attr,val) {
    if(attr=='opacity'){
        ele.style.opacity=val;
        ele.style.filter='alpha(opacity='+val*100+')';
    }else {
        ele.style[attr]=val+'px';
    }
};
