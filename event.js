/**
 * Created by Jeawon on 2016/5/17.
 */
Function.prototype.myBind=function myBind(context) {
    var _this=this;
    //从第二项开始
    var outerArr=[].slice(arguments,1);
    if("bind" in Function.prototype){
        outerArr.unshift(context);
        return _this.bind.apply(_this,outerArr);
    }
    return function () {
        var innerArr=[].slice.call(arguments,0);
        _this.apply(context,outerArr.concat(innerArr));
    }
};


function bind(curEle,type,fn) {
    if(document.addEventListener){
        curEle.addEventListener(type,fn,false);
        return;
    }
    !curEle["myBind"+type]?curEle["myBind"+type]=[]:null;
    var arr=curEle["myBind"+type];
    for(var i=0;i<arr.length;i++){
        if(arr[i].photo===fn){
            //去重
            return;
        }
    }
    //3变装
    var tempFn=fn.myBind(curEle);
    tempFn.photo=fn;
    arr.push(tempFn);
    //2在ie6~8fn的this是window
    curEle.attachEvent("on"+type,tempFn);
}

function unbind(curEle,type,fn) {
    if(document.removeEventListener){
        curEle.removeEventListener(type,fn,false);
        return;
    }
    var arr=curEle["myBind"+type];
    if(arr){
        for(var i=0;i<arr.length;i++){
            if(arr[i].photo===fn){
                curEle.detachEvent("on"+type,arr[i]);
                arr.splice(i,1);
                return;
            }
        }
    }
}

//解决顺序问题
function run(e) {
    e=e||window.event;
    if(window.event){
        e.target=e.srcElement;
        e.pageX=e.clientX+(document.documentElement.scrollLeft||document.body.scrollLeft);
        e.pageY=e.clientY+(document.documentElement.scrollTop||document.body.scrollTop);
        e.preventDefault=function () {
            e.returnValue=false;
        }
        e.stopPropagation=function () {
            e.cancelBubble=true;
        }
    }
    var arr=this["myEvent"+e.type];
    if(arr){
        for(var i=0;i<arr.length;i++){
            var curFn=arr[i];
            typeof curFn==="function"?curFn.call(this,e):(arr.splice(i,1),i--);
        }
    }
}

function on(curEle,type,fn) {
    !curEle["myEvent"+type]?curEle["myEvent"+type]=[]:null;
    var arr=curEle["myEvent"+type];
    for(var i=0;i<arr.length;i++){
        if(arr[i]===fn){
            return;
        }
    }
    arr.push(fn);
    bind(curEle,type,run);
}


function off(curEle,type,fn) {
    var arr=curEle["myEvent"+type];
        if(arr){
            for(var i =0;i<arr.length;i++){
                if(arr[i]===fn){
                    arr[i]=null;
                    return;
                }
            }
        }
    }