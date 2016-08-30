(function(){
    var canvas = document.getElementsByTagName('canvas')[0];
    var ctx = canvas.getContext("2d");

    canvas.width = 512;
    canvas.height = 480;

    // 背景图片
    var bgReady = false;
    var bgImage = new Image();
    
    bgImage.onload = function(){
        bgReady = true;
    };
    bgImage.src = 'images/background.png';
    

    //人物图片
    var heroReady = false;
    var heroImage = new Image();
    heroImage.src = 'images/hero.png';
    heroImage.onload = function(){
        heroReady = true;
    };

    //怪物图片
    var monsterReady = false;
    var monsterImage = new Image();
    monsterImage.src = 'images/monster.png';
    monsterImage.onload = function(){
        monsterReady = true;
    };

    //基础属性
    var hero = {
        speed : 1
    };
    var monster = {};
    var monstersCaught = 0;

    var reset = function(){
        hero.x = canvas.width / 2;
        hero.y=canvas.height / 2;

        monster.x = 32 + ( Math.random() * ( canvas.width - 64 ) );
        monster.y = 32 + ( Math.random() * ( canvas.height - 64 ) );

    };
    // 按键
    var keysDown = {};
    addEventListener('keydown', function(event){
        keysDown[event.keyCode] = true;
    }, false);

    addEventListener('keyup', function(event){
        delete keysDown[event.keyCode];
    }, false);

    var update = function(){
        //按键控制
        if (38 in keysDown) { // Player holding up
            hero.y -= hero.speed;
        }
        if (40 in keysDown) { // Player holding down
            hero.y += hero.speed;
        }
        if (37 in keysDown) { // Player holding left
            hero.x -= hero.speed;
        }
        if (39 in keysDown) { // Player holding right
            hero.x += hero.speed;
        }

        //阻止人物出去
        if(hero.x < 32){
            hero.x = 32;
        }
        if(hero.x > canvas.width - 64){
            hero.x = canvas.width - 64;
        }
        if(hero.y <32){
            hero.y = 32;
        }
        if(hero.y > canvas.height - 64){
            hero.y = canvas.height - 64;
        }

        //是否触碰怪物
        if(  distance(hero.x,hero.y,monster.x,monster.y) < 44){   //45是自己计算出2个模型的碰撞距离
            monstersCaught++;
            if(hero.speed < 7){
                hero.speed++;
            }
            
            reset();
        }
        
        function distance(x1,y1,x2,y2){
            return Math.sqrt( (x1-x2)*(x1-x2) +(y1-y2)*(y1-y2) );
        }
    };

    //渲染
    var render = function(){
        ctx.beginPath();
        if( bgReady && heroReady && monsterReady)
        {
            ctx.drawImage(bgImage, 0, 0);
            ctx.drawImage(heroImage, hero.x, hero.y);
            ctx.drawImage(monsterImage, monster.x, monster.y);

            ctx.fill();
            
        }
        ctx.font = '24px solid';
        ctx.fillText('Goblins caught: '+ monstersCaught, 32, 64);
    };

    var main = function () {
        update();
        render();
        // Request to do this again ASAP
        requestAnimationFrame(main);
    };
    requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;

    // 开始游戏
    reset();
    main();
})();
