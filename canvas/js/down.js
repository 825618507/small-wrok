var WINDOW_WIDTH = document.documentElement.clientWidth;
var WINDOW_HEIGHT = 500;
var RADIUS=8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;
var balls = [];
var endDate=new Date(2016,8,15);
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload=function(){
    var canvas=document.getElementById('canvas');
    var context=canvas.getContext('2d');
    var timer=null;

    var curShowTimeSeconds=getCurrentShowTimeSeconds();

    canvas.width=WINDOW_WIDTH;
    canvas.height=WINDOW_HEIGHT;

    timer=setInterval(function(){
        context.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
        render(context);
        update();
    },50);
    render(context);
    
    function getCurrentShowTimeSeconds() {
        var curTime = new Date();
        var ret = endDate.getTime() - curTime.getTime();
        ret = Math.round( ret/1000 )

        return ret >= 0 ? ret : 0;
    }

    function update(){
        var nextShowTimeSeconds = getCurrentShowTimeSeconds();
        var nextDays= parseInt(nextShowTimeSeconds/3600/12);

        var nextLeave1=nextShowTimeSeconds%(24*3600);  
        var nextHours = parseInt( nextLeave1 / 3600);

        var nextLeave2=nextLeave1%3600; 
        var nextMinutes = parseInt( nextLeave2/60 );

        var nextSeconds = nextLeave2 % 60 ;


        var curDays= parseInt( curShowTimeSeconds/3600/12 ); 

        var curLeave1=curShowTimeSeconds%(24*3600);  
        var curHours = parseInt( curLeave1 / 3600);

        var curLeave2=curLeave1%3600
        var curMinutes = parseInt( curLeave2 / 60 );
        var curSeconds = curLeave2 % 60 ;

        if( nextSeconds != curSeconds ){
            if( parseInt(nextDays/10) != parseInt(curDays/10) ){
                addBalls( MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(curDays/10) )
            }
            if( parseInt(nextDays%10) != parseInt(curDays%10) ){
                addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curDays%10) )
            }
            if( parseInt(curHours/10) != parseInt(nextHours/10) ){
                addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10) );
            }
            if( parseInt(curHours%10) != parseInt(nextHours%10) ){
                addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curHours%10) );
            }

            if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){
                addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) );
            }
            if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
                addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10) );
            }

            if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
                addBalls( MARGIN_LEFT + 117*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) );
            }
            if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
                addBalls( MARGIN_LEFT + 132*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
            }

            curShowTimeSeconds = nextShowTimeSeconds;
        }
        updateBalls();
    }

    function addBalls(x,y,num){

        for(var i=0;i<digit[num].length;i++){
            for(var j=0;j<digit[num][i].length;j++){
                if(digit[num][i][j]==1){
                    var aBall={
                        x:x+j*2*(RADIUS+1)+(RADIUS+1),
                        y:y+i*2*(RADIUS+1)+(RADIUS+1),
                        g:1+Math.random(),
                        vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 6,
                        vy:-5,
                        color: colors[ Math.floor( Math.random()*colors.length ) ]
                    };
                    balls.push(aBall);
                }
            }
        }
    }

    function updateBalls(){
        for(var i=0;i<balls.length;i++){
            balls[i].x += balls[i].vx;
            balls[i].y += balls[i].vy;
            balls[i].vy+= balls[i].g;

            if(balls[i].y>=WINDOW_HEIGHT-RADIUS){
                balls[i].vy *=-0.75;
                balls[i].y=WINDOW_HEIGHT-RADIUS;
            }
        }
        // 优化
        var cut=0;
        for(var i=0,len=balls.length;i<len;i++){
            if(balls[i].x+RADIUS>0 && balls[i].x-RADIUS<canvas.width){
                balls[cut++]=balls[i];
            }
        }

        while( balls.length > Math.min(300,cut)){
            balls.pop();
        }
    }

    function render(context){
        var days=parseInt( curShowTimeSeconds/3600/24);
        var leave1=curShowTimeSeconds%(24*3600);  
        var hours = parseInt( leave1 / 3600);

        var leave2=leave1%(3600); 
        var minutes = parseInt( leave2 / 60 );

        var leave3=leave2%(60);
        var seconds = leave3 ;

        renderDigit( MARGIN_LEFT ,MARGIN_TOP , parseInt(days/10),context);
        renderDigit( MARGIN_LEFT + 15*(RADIUS+1) ,MARGIN_TOP , parseInt(days%10),context);
        renderDigit( MARGIN_LEFT + 30*(RADIUS+1) , MARGIN_TOP , 10 , context );

        renderDigit( MARGIN_LEFT + 39*(RADIUS+1),MARGIN_TOP , parseInt(hours/10),context);
        renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(hours%10) , context );
        renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , context );

        renderDigit( MARGIN_LEFT + 78*(RADIUS+1) ,MARGIN_TOP , parseInt(minutes/10),context);
        renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , context );
        renderDigit( MARGIN_LEFT + 108*(RADIUS+1) , MARGIN_TOP , 10 , context );

        renderDigit( MARGIN_LEFT + 117*(RADIUS+1) ,MARGIN_TOP , parseInt(seconds/10),context);
        renderDigit( MARGIN_LEFT + 132*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , context );

        for(var i=0;i<balls.length;i++){
            context.fillStyle=balls[i].color;
            context.beginPath();
            context.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI);
            context.closePath();

            context.fill();
        }

    }

    
}
function renderDigit(x,y,num,context){
    context.fillStyle= "rgb(0,102,153)";
    for(var i=0;i<digit[num].length;i++){
        for(var j=0;j<digit[num][i].length;j++){
            if(digit[num][i][j]==1){
                context.beginPath();
                context.arc( x+(RADIUS+1)+j*2*(RADIUS+1), y+(RADIUS+1)+i*2*(RADIUS+1), RADIUS , 0 , 2*Math.PI);
                context.closePath();
                context.fill();
            }
        }
    }
}
