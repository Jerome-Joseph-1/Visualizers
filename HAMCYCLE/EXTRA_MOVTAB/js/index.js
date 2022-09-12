var grid = document.getElementById("grid");

var moving = false


var count = 8
var w = 500/(count+1)

function move(e){
    var posx = e.clientX -w/3*2
    var posy = e.clientY -w/3*2 
    grid.style.transform = 'translate('+posx+'px,'+posy+'px)'
}

function addRows(k){
    for(var i = 0; i < k+1; i++){
        var div = document.createElement('div')
        div.className = "row"
        div.style.height = w + 'px'
        grid.appendChild(div) 
    }

}

function addCols(k){
    var rows = document.getElementsByClassName("row")
    for(var i = 0; i < k+1; i++){
        for(var j = 0; j < k+1; j++){
            var div = document.createElement('div')
            div.className = "col"
            if(i == 0 && j!= 0){
                div.innerHTML = j-1
            }
            else if(j == 0 && i != 0){
                div.innerHTML = i-1
            }
            else if(i == 0 && j == 0){
                div.style.cursor = "pointer"
                div.innerHTML = "MOVE"
                div.addEventListener('click', function(){
                    if(!moving){
                        document.addEventListener('mousemove', move)
                        moving = true
                    }
                    else{
                        document.removeEventListener('mousemove', move)
                        moving = false
                    }
                })
            }
            else{
                div.id = (i-1)*k+j-1
                if(i == j){
                    div.style.backgroundColor = "black"   
                }
                else{
                    div.classList.add("grab")
                    div.addEventListener('mousedown', connect)
                }
            }
            div.style.height = w + 'px'
            div.style.width = w + 'px'
            rows[i].appendChild(div)
        }
    }
}



addRows(count)
addCols(count)
var g = Array(count)
for(var i = 0; i < count; i++){
    g[i] = Array(count).fill(0)
}

function connect(){
    var num = this.id - '0'
    var r = Math.floor(num / count)
    var c = num % count
    g[r][c] = 1
    this.style.backgroundColor = "green"

    console.log(g)
}