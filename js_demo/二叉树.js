
window.onload = function(){
    var aBtn = document.getElementsByTagName('button'),
        root = document.getElementById('root'),
        searchTxt = document.getElementById('search'),
        preBtn = aBtn[0],
        inBtn = aBtn[1],
        postBtn = aBtn[2],
        bfsBtn = aBtn[3],
        dftBtn = aBtn[4],
        binaryTree = new BinaryTree(),
        delay = 300,
        isRender = false,
        timeOut = null;

    preBtn.onclick = postBtn.onclick = inBtn.onclick = function(event){
        if(isRender === false){
            binaryTree.clear();
            var className = event.target.className;

            if( className == 'preBtn'){
                binaryTree.preOrderTraverse(root);
            }else if( className == 'inBtn' ){
                binaryTree.inOrderTraverse(root);
            }else{
                binaryTree.postOrderTraverse(root);
            }
            render(binaryTree.tree);
        }else{
            isRender = !confirm('正在遍历中，是否取消');
            if(!isRender){    //暂停;
                clearTimeout(timeOut);
            }
        }  
    };
    bfsBtn.onclick = function(event){
        var txt = searchTxt.value;
        binaryTree.clear();
        binaryTree.bfsTraverse(root);
        render(binaryTree.tree,txt);
    };
    dftBtn.onclick = function(event){
        var txt = searchTxt.value;
        binaryTree.clear();
        binaryTree.dftTraverse(root);
        render(binaryTree.tree,txt);
    }
    function render(arr,value){
        var i = 0, len = arr.length;
        isRender = true;
        //清空
        for(var j=0; j<arr.length; j++){
            arr[j].style.backgroundColor = '#fff';
        }
        //渲染
        render2(value);

        function render2(value){
            timeOut = setTimeout(function(){
                if( arr[i-1] ){
                    arr[i-1].style.backgroundColor = '#fff';
                }
                arr[i].style.backgroundColor = 'red';
                //search
                if(value && value.toUpperCase() == arr[i].childNodes[0].nodeValue.toUpperCase().trim()){
                    clearTimeout(timeOut);
                    isRender = false;
                }else{
                    i++;
                    if(i < arr.length){
                        render2(value);
                    }else{   //最后一个
                        setTimeout(function(){
                            arr[i-1].style.backgroundColor = '#fff';
                            isRender = false;
                        },delay);
                    }
                }
            },delay);
        }
    }
};
function BinaryTree(){
    this.tree = [];
    this.bfsIndex = 0;   //记录广度遍历的index
}
BinaryTree.prototype = {
    preOrderTraverse: function(element){
        if(element){
            this.tree.push(element);
        }
        if(element.firstElementChild){
            this.preOrderTraverse(element.firstElementChild);
        }
        if(element.lastElementChild){
            this.preOrderTraverse(element.lastElementChild);
        }
    },
    inOrderTraverse: function(element){
        if(element.firstElementChild){
            this.inOrderTraverse(element.firstElementChild);
        }
        if(element){
            this.tree.push(element);
        }
        if(element.lastElementChild){
            this.inOrderTraverse(element.lastElementChild);
        }
    },
    postOrderTraverse: function(element){
        if(element.firstElementChild){
            this.postOrderTraverse(element.firstElementChild);
        }
        if(element.lastElementChild){
            this.postOrderTraverse(element.lastElementChild);
        }
        if(element){
            this.tree.push(element);
        }
    },
    bfsTraverse: function(element){
        if(element){
            this.tree.push(element);
            if(element.nextElementSibling){
                this.bfsTraverse(element.nextElementSibling);
            }
            element = this.tree[this.bfsIndex++];  //倒回该行的第一个
            if(element.firstElementChild){
                this.bfsTraverse(element.firstElementChild);
            }
        }

    },
    dftTraverse: function(element){
        if(element){
            this.tree.push(element);
            if(element.firstElementChild){
                this.dftTraverse(element.firstElementChild);
            }
            if(element.nextElementSibling){
                this.dftTraverse(element.nextElementSibling);
            }
        }
    },
    clear: function(){
        this.tree = [];
        this.bfsIndex = 0;
    }
};