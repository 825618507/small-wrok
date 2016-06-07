function CreateList(){
    this.oWrap=document.createElement("div"),
    this.copyright=document.createElement("div"),
    this.initialize.apply(this,arguments),
    this.click.apply(this)
}
CreateList.prototype = {
    initialize: function(aData) {       
        var oDl, oElem, project, i;
        while(aData[0]) {
            oDl = document.createElement("dl");
            project = aData[0].project; 
            for(i = 0; i < project.length; i++) {
                if(project[i].href) {
                    oElem = document.createElement("dd");
                    oElem.innerHTML = i + ") <a href=\"" + project[i].href + "\" target=\"_blank\">" + project[i].text + "</a>"
                }
                else {
                    oElem = document.createElement("dt");
                    oElem.innerHTML = project[i].text + " (" + (project.length - 1) + ")"   
                }
                oDl.appendChild(oElem);
                oDl.style.height = "31px"
            }
            this.oWrap.appendChild(oDl);
            aData.shift();
        }
        this.oWrap.id = "wrap";
        document.body.appendChild(this.oWrap);
    },
    click: function() {
        var that = this;
        this.oWrap.onclick = function(event) {
            var oEv, oTarget, oParent, i;
            oEv = event || window.event;
            oTarget = oEv.target || oEv.srcElement;   //target 'dt' 事件属性可返回事件的目标节点（触发该事件的节点），如生成事件的元素、文档或窗口。  srcElement兼容ie低版本
            oParent = oTarget.parentElement || oTarget.parentNode;  //'dl'
            oParent.height = function() {
                var iHeight = 0;
                for(i = 0;i < oParent.children.length; i++) iHeight += oParent.children[i].offsetHeight;
                return iHeight
            }();
            if(oTarget.tagName.toUpperCase() == "DT") {
                var aSiblings = that.siblings(oParent), count, i;   //aSibings是其它的dl;  
                console.log('aSiblings.lenght='+aSiblings.length)
                for(count = i = 0; i < aSiblings.length; i++) {     //aSibilings.lenght=12;
                    console.log('i1='+i);
                    console.log('count1='+count)
                    console.log('aSiblings[i] 1='+aSiblings[i].children[0].innerHTML)
                    that.startMove(aSiblings[i], oTarget.offsetHeight, "buffer", function() {  
                    //for循环结束count=i=12时才运行function
                        console.log('i2='+i);
                        console.log('count2='+count);
                        this.children[0].className = "";  //this指obj（在buffer中有call(obj)),在这即是aSiblings[i]
                        if(++count == aSiblings.length) {  //全部startMove结束
                            console.log('i3='+i)
                            console.log('count3='+count);
                            if(oParent.offsetHeight == oTarget.offsetHeight) {
                                oTarget.className = "current";
                                that.startMove(oParent, oParent.height, "flex")
                            }
                            else {
                                console.log('自己收缩')
                                that.startMove(oParent, oTarget.offsetHeight, "buffer", function() {
                                    oTarget.className = ""  
                                })
                            }                               
                        }    //这个if可以放在外面；不必放在这个function里
                    })
                }
                console.log('循环结束')
            }
        }
    },
    //定时器执行buff或flex
    startMove: function(obj, iTarget, type, callback) {
        console.log('startMove')
        var that = this;
        clearInterval(obj.timer);
        obj.iSpeed = 0;
        obj.timer = setInterval(function() {
            console.log('startMove')
            that[type](obj, iTarget, callback); //that来使用that[type];
        }, 30)
    },
    //缩回
    buffer: function(obj, iTarget, callback) {
        console.log('buffer')
        console.log(obj)
        obj.iSpeed = (iTarget - obj.offsetHeight) / 5;
        obj.iSpeed = obj.iSpeed > 0 ? Math.ceil(obj.iSpeed) : Math.floor(obj.iSpeed);
        obj.offsetHeight == iTarget ? (clearInterval(obj.timer),console.log('bufffer结束'),callback && callback.call(obj)) : obj.style.height = obj.offsetHeight + obj.iSpeed + "px"
    },//callback && callback.call(obj) 表示有callback才执行callback.call(obj)
    //弹性函数
    flex: function(obj, iTarget, callback) {
        console.log('flex')
        obj.iSpeed += (iTarget - obj.offsetHeight) / 6;
        obj.iSpeed *= 0.75;
        if(Math.abs(iTarget - obj.offsetHeight) <= 1 && Math.abs(obj.iSpeed) <= 1) {
            clearInterval(obj.timer);
            console.log('flex结束')
            obj.style.height = iTarget + "px";
            callback && callback.call(obj)
        }
        else {
            obj.style.height = obj.offsetHeight + obj.iSpeed + "px"
        }
    },
    //返回父级不包括自身的子元素数组
    siblings: function(element) {
        var aTmp = [], oParent = element.parentElement || element.parentNode, i;
        for(i = 0; i < oParent.children.length; i++) element != oParent.children[i] && aTmp.push(oParent.children[i]);
        return aTmp
    }
};