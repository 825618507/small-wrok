function MineSweeping($oEle, rowCount, colCount, minLandMineCount, maxLandMineCount){
    this.$oEle = $oEle;                                 //元素
    this.rowCount = rowCount ||10;                      //行数
    this.colCount = colCount ||10;                      //列数
    this.count = this.rowCount * this.colCount;         //格子数
    this.landMineCount= 0;                              //地雷个数
    this.minLandMineCount = minLandMineCount ||10;      //最小地雷
    this.maxLandMineCount = maxLandMineCount ||20;      //最大地雷
    this.arrs = [];
    this.doc = document;
    this.doc.oncontextmenu = function(){
        return false;
    };
    this.playBool = false;

    this.render();
};

MineSweeping.prototype = {
    //作图
    drawGame: function(){
        var $tr, td, i=0, k=0;
        for(i=0; i<this.rowCount; i++){
            $tr = $('<tr></tr>');
            td = null;
            for(k=0; k<this.colCount; k++){
                td +='<td ></td>';
            }
            $tr.append(td);
            this.$oEle.append($tr);
        }
    },
    //初始化
    init: function(){
        var i = 0, k = 0, boom = 0,
            randomRow = 0, randomCol = 0;

        for(i=0; i<this.rowCount; i++){
            this.arrs[i] = [];
            for(k=0; k<this.colCount; k++){
                this.arrs[i][k] = 0;
            }
        }
        //炸弹个数
        this.landMineCount =this.range(this.minLandMineCount, this.maxLandMineCount);

        //设置数组，随机设置炸弹位置,把炸弹设置为 "boom"  
        while(boom < this.landMineCount){
            randomRow = this.range(0, this.rowCount-1);
            randomCol = this.range(0, this.colCount-1);
            if(this.arrs[randomRow][randomCol]!='boom'){
                this.arrs[randomRow][randomCol] = 'boom';
                boom++;
            }
        }
        this.calculateNumber();
    },
    //绑定鼠标左右键
    bindCells: function(){
        var self = this;
        this.$oEle.find('td').on('mousedown',function(event){
            //把数字或炸弹放入
            if(event.button == 0){
                var row = $(this).parent('tr').index();
                var col = $(this).index();
                if(self.arrs[row][col] == 'boom'){
                    if(!$(this).hasClass('flag')){
                        self.end('GAME OVER!')
                    }
                }else{
                    self.showNoLandMine(row, col);
                }
            }else if(event.button == 2){
                if(!$(this).hasClass('show')){
                    $(this).toggleClass('flag');
                }
            } 
        });
    },
    //显示非炸弹 和 无雷展开     (刚开始出现了无限循环的错误导致不成功)
    showNoLandMine: function(x, y){
        var $td = this.$oEle.find('tr').eq(x).find('td').eq(y);
        if( !$td.hasClass('show') && !$td.hasClass('flag') ){    //解决无线循环
            
            this.count--;
            console.log(this.count - this.landMineCount);
            if(this.count - this.landMineCount == 0){
                this.end("Congratulation！");
            }
            if(this.arrs[x][y] == 0){
                $td.addClass('show');
                for(var i=x-1; i<=x+1; i++){
                    //i 可能小于0大于行数，排除
                    if(i >= 0 && i < this.colCount){
                        for(var k=y-1; k<=y+1; k++){
                            //k 可能小于0大于列数，排除
                            if(k >= 0 && k < this.colCount){
                                if(!(i == x && k == y)){
                                    this.showNoLandMine(i, k);  
                                }
                            }
                        }
                    }
                }
            }else{
                $td.addClass('show').text(this.arrs[x][y]);
            }       
        }
    },
    //显示全部  GAME OVER!  和  胜利
    showAll: function(){
        for(var i=0; i<this.rowCount; i++){
            for(var k=0; k<this.colCount; k++){
                var $td = this.$oEle.find('tr').eq(i).find('td').eq(k).addClass('show').removeClass('flag');
                if(this.arrs[i][k] == 'boom'){
                    $td.addClass('boom');
                }else if(this.arrs[i][k] != 0){
                    $td.text(this.arrs[i][k]);
                }
            }
        }
    },
    //计算炸弹附近的数字
    calculateNumber: function(){
        var i=0;k=0;
        for(i=0;i<this.rowCount;i++){
            for(k=0;k<this.colCount;k++){
                //如果是炸弹
                if(this.arrs[i][k]=='boom'){
                    continue;
                }
                //如果左上方有炸弹，则数字加一
                if(i > 0 && k > 0){
                    if(this.arrs[i-1][k-1]=='boom'){
                        this.arrs[i][k]++;
                    }
                }
                //正上方
                if(i > 0 ){
                    if(this.arrs[i-1][k]=='boom'){
                        this.arrs[i][k]++;
                    }
                }
                //右上方
                if(i > 0 && k < this.colCount-1){
                    if(this.arrs[i-1][k+1]=='boom'){
                        this.arrs[i][k]++;
                    }
                }
                //正左方
                if(k > 0){
                    if(this.arrs[i][k-1]=='boom'){
                        this.arrs[i][k]++;
                    }
                }
                //正右方
                if(k < this.colCount-1){
                    if(this.arrs[i][k+1]=='boom'){
                        this.arrs[i][k]++;
                    }
                }
                //左下方
                if(i < this.rowCount-1 && k > 0){
                    if(this.arrs[i+1][k-1]=='boom'){
                        this.arrs[i][k]++;
                    }
                }
                //正下方
                if(i < this.rowCount-1){
                    if(this.arrs[i+1][k]=='boom'){
                        this.arrs[i][k]++;
                    }
                }
                //右下方
                if(i < this.rowCount-1 && k < this.colCount-1){
                    if(this.arrs[i+1][k+1]=='boom'){
                        this.arrs[i][k]++;
                    }
                }
            }
        }
    },
    //2个数之间的随机整数
    range: function(min,max){
        return Math.floor( Math.random() * (max-min+1) + min );
    },
    //渲染
    render:function(){
        this.init();
        this.drawGame();
    },
    //开始游戏
    play: function(){
        this.playBool = true;
        this.bindCells();
    },
    end: function(text){
        alert(text);
        this.playBool = false;
        this.showAll();
        this.$oEle.find('td').off('mousedown');
    }
};


$(document).ready(function(){
    var $oBeginGame = $('#beginGame').eq(0);    //开始按钮
    var $oTable = $('table.game').eq(0);     //表格
    var $levelContorl = $('input[name="level"]');
    var timer = null;
    var boomNum = 0;
    //刚打开页面
    var mineSweeping = new MineSweeping($oTable);
    //更改选项
    $levelContorl.change(function(){
        if(mineSweeping.playBool){
            var bool = confirm('要结束当前游戏吗');
            if(bool){
                render();
                bool = false;
            }
        }else{
            render();
        }
    });

    $oBeginGame.on('click',function(){
        render();
        mineSweeping.play();
        var timeShow = 0;
        var self = this;
        clearInterval(timer);
        this.disabled = true;

        $('#boomNum').text(mineSweeping.landMineCount);
        timer = setInterval(function(){
            if(!mineSweeping.playBool){
                self.disabled = false;
                clearInterval(timer);
            }else{
                $('#timeShow').text(timeShow++);
            }
        },1000);
    });

    var render = function(){
        var $level = $('input[name="level"]:checked');
        var rowCount = $level.val();
        var colCount = rowCount;
        var width = 600;
        switch($level.attr("id")){
            case 'level1':var minLandMineCount = $level.val()*1,
                              maxLandMineCount = $level.val()*2;
                              break;
            case 'level2':var minLandMineCount = $level.val()*2,
                              maxLandMineCount = $level.val()*3;
                              width = 800;
                              break;
            case 'level3':var minLandMineCount = $level.val()*3,
                              maxLandMineCount = $level.val()*4;
                              width = 1000;
                              break;
        };
        $oTable.html('');
        mineSweeping = new MineSweeping($oTable, rowCount, colCount, minLandMineCount, maxLandMineCount);
        $('#main').width( width );
    }
});