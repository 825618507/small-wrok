function CreateList(){
    this.oWrap=document.createElement("div");
    this.copyright=document.createElement("div");
    this.initialize.apply(this,arguments);
    this.click.apply(this);
}
CreateList.prototype = {
    initialize: function(aData) {       
        var oDl, oElem, project, i, a;
        while(aData[0]) {
            oDl = document.createElement("dl");
            project = aData[0].project; 
            for(i = 0; i < project.length; i++) {
                if(project[i].href) {
                    a = document.createElement('a');
                    a.href = project[i].href;
                    a.setAttribute("target","_blank");
                    oElem = document.createElement("dd");
                    oElem.innerHTML = project[i].text;
                    a.appendChild(oElem);
                    oDl.appendChild(a);
                }
                else {
                    oElem = document.createElement("dt");
                    oElem.innerHTML = project[i].text + " (" + (project.length - 1) + ")"   ;
                    oDl.appendChild(oElem);
                }
                oDl.style.height = "40px";
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
                for(i = 0;i < oParent.children.length; i++){
                     iHeight += oParent.children[i].offsetHeight;
                }
                return iHeight;
            }();
            if(oTarget.tagName.toUpperCase() == "DT") {
                var aSiblings = that.siblings(oParent), count, i;   //aSibings是其它的dl;  
                for(count = i = 0; i < aSiblings.length; i++) {     
                    that.startMove(aSiblings[i], oTarget.offsetHeight, "buffer", function() {  
                        this.children[0].className = "";
                        if(++count == aSiblings.length) {  
                            if(oParent.offsetHeight == oTarget.offsetHeight) {
                                oTarget.className = "current";
                                that.startMove(oParent, oParent.height, "flex");
                            }
                            else {
                                that.startMove(oParent, oTarget.offsetHeight, "buffer", function() {
                                    oTarget.className = "" ; 
                                })
                            }                               
                        }    //这个if可以放在外面；不必放在这个function里
                    })
                }
            }
        }
    },
    //定时器执行buff或flex
    startMove: function(obj, iTarget, type, callback) {
        var that = this;
        clearInterval(obj.timer);
        obj.iSpeed = 0;
        obj.timer = setInterval(function() {
            that[type](obj, iTarget, callback); //that来使用that[type];
        }, 30)
    },
    //缩回
    buffer: function(obj, iTarget, callback) {
        obj.iSpeed = (iTarget - obj.offsetHeight) / 5;
        obj.iSpeed = obj.iSpeed > 0 ? Math.ceil(obj.iSpeed) : Math.floor(obj.iSpeed);
        obj.offsetHeight == iTarget ? (clearInterval(obj.timer),callback && callback.call(obj)) : obj.style.height = obj.offsetHeight + obj.iSpeed + "px";
    },//callback && callback.call(obj) 表示有callback才执行callback.call(obj)
    //弹性函数
    flex: function(obj, iTarget, callback) {
        obj.iSpeed += (iTarget - obj.offsetHeight) / 6;
        obj.iSpeed *= 0.75;
        if(Math.abs(iTarget - obj.offsetHeight) <= 1 && Math.abs(obj.iSpeed) <= 1) {
            clearInterval(obj.timer);
            obj.style.height = iTarget + "px";
            callback && callback.call(obj);
        }
        else {
            obj.style.height = obj.offsetHeight + obj.iSpeed + "px";
        }
    },
    //返回父级不包括自身的子元素数组
    siblings: function(element) {
        var aTmp = [], oParent = element.parentElement || element.parentNode, i;
        for(i = 0; i < oParent.children.length; i++) element != oParent.children[i] && aTmp.push(oParent.children[i]);
        return aTmp;
    }
};