function CreateList(){
    this.oWrap=document.createElement('div'),
    this.oWrap.id='wrap',
    this.render.apply(this,arguments),
    this.click.apply(this);
}

CreateList.prototype={
    //渲染
    render:function(aData){
        var project,oEle,oDl;
        while(aData[0]){
            project=aData[0].project;
            oDl=document.createElement('dl');
            for(var i=0;i<project.length;i++){
                if(project[i].href){
                    oEle=document.createElement('dd');
                    oEle.innerHTML=i+")<a target=_blank href='"+project[i].href+" '>"+project[i].text+"</a>"
                }else{
                    oEle=document.createElement('dt');
                    oEle.innerHTML=project[i].text+'('+(project.length-1)+')';
                }
                oDl.appendChild(oEle);
            }
            this.oWrap.appendChild(oDl);
            aData.shift();
        }
        document.documentElement.appendChild(this.oWrap);
    },
    click:function(){
        var _this=this;
        this.oWrap.onclick=function(event){
            event=event||window.event;
            var oParent;
            if(event.target.tagName.toUpperCase()==='DT'){
                oParent=event.target.parentNode;
                oParent.height=function(){
                    var iHeight=0;
                    for(var i=0;i<oParent.children.length;i++){
                        iHeight+=oParent.children[i].offsetHeight;
                    }
                    return iHeight;
                }(); 
                if(oParent.offsetHeight===event.target.offsetHeight){
                    _this.elasticMove(oParent,oParent.height);
                }else{
                    _this.elasticMove(oParent,event.target.offsetHeight);
                }
            }
        }
    },
    //弹性运动(竖直)
    elasticMove:function(obj,iTarget,callback){
        obj.speed=0;
        clearInterval(obj.timer);
        obj.timer=setInterval(function(){
            obj.speed+=(iTarget-obj.offsetHeight)/10;
            obj.speed*=0.82;
            if(Math.abs(obj.speed)<1 && Math.abs(iTarget-obj.offsetHeight)<1){
                clearInterval(obj.timer);
                obj.style.height=iTarget+'px';
            }else{
                obj.style.height=obj.offsetHeight+obj.speed+'px';
            }
        },30)
    }
}