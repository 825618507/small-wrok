$(document).ready(function(){
    var time=0,
    	set_timer,
    	pause=true;
    	digit=new Array(10),  //设置9个空格，忽略第一个
    	digit_direct=[
    		[0],   //忽略第一个，方便理解
    		[2,4],
    		[1,3,5],
    		[2,6],
    		[1,5,7],
    		[2,4,6,8],
    		[3,5,9],
    		[4,8],
    		[5,7,9],
    		[6,8]
    	],
    	digit_position=[
    		[0],
    		[0,0],
    		[150,0],
    		[300,0],
    		[0,150],
    		[150,150],
    		[300,150],
    		[0,300],
    		[150,300],
    		[300,300]
    	];
    $.each(digit,function(i,n){
    	digit[i]=i;
    });
    digit[9]=0; //第9个空格无数字 为空

    $('#game>div').each(function(){
    	$(this).click(function(){
            if(pause){
                alert('还未开始游戏，请按右方的开始键');
            }else{
                move( $(this).html() );
            }
    	});
    });
    $('#switch').click(start);
    $('#reset').click(reset);
    reset();


    function move(num){
    	var i=1,len=digit.length;
    	//寻找num的位置
    	for(i=1;i<len;i++){  //遍历空格
    		if(digit[i] == num ){
    			break;
    		}
    	}
    	var digit_target=0;
    	digit_target=looking(i);  //查看附近是否有空位;
    	if(digit_target){
    		digit[i]=0;  //原本的 变 为 0 ，即是空格
    		digit[digit_target]=num;  //目标则变 为数字
    		$('#d'+num).css({"left":digit_position[digit_target][0],"top":digit_position[digit_target][1]}); //移动原本的数字
    	}

    	var finish_flag=true;
    	for(var k=1;k<len-1;k++){
    		if(digit[k] != k){
    			finish_flag=false;
    		}
    	}
    	if(finish_flag){
    		if(!pause){
    			start();
    			alert('congratulation');
    		}
    		
    	}
    }

    function looking(num){
    	for(var i=0,len=digit_direct[num].length;i<len;i++){
    		if(digit[digit_direct[num][i]] == 0){  // 有空位
    			return digit_direct[num][i];  //返回空位
    		}
    	}
    	return 0;   //否则无空位
    }
    function timer(){
    	time+=1;
    	var minutes=parseInt(time/60);
    	var seconds=time%60;
    	$('#time').html(minutes+"分"+seconds+"秒")
    }
    function start(){
    	if(pause){
    		$('#switch').html('暂停');
    		pause=false;
    		clearInterval(set_timer);   // 防止定时器重复导致加速
    		set_timer=setInterval(timer,1000);
    	}else{
    		$('#switch').html('开始');
    		pause=true;
    		clearInterval(set_timer);
    	}
    }

    function reset(){
    	time=-1;
    	timer();
    	if(!pause){
    		start();
    	}
    	random_digit();
    }
    function random_digit(){
    	for(var i=1,len=digit.length-1;i<len;i++){
    		var random=parseInt(Math.random()*len+1);  // 1-10		

    		$('#d'+digit[i]).css({"left":digit_position[random][0],'top':digit_position[random][1]}); 		
    		$('#d'+digit[random]).css({"left":digit_position[i][0],'top':digit_position[i][1]});	

    		var tem=digit[random];
    		digit[random]=digit[i];
    		digit[i]=tem;
    	}
    }
    
});