// var colors = ["#ff0000", "#e80f88", "#967e76", "#1c6758", "#e3c770"];
var count = 0

var self;
function move(e){
    var x = e.clientX - 35;
    var y = e.clientY - 35;
    self.style.transform = 'translate('+x+'px,'+y+'px)';
}
function clicked(e){
    self = this;
    if(self.classList.contains('moving')){
        document.removeEventListener('mousemove', move);
        self.classList.remove('moving');
        self.classList.remove('shadow');
    } 
    else{
        self.classList.add('moving');
        self.classList.add('shadow');
        document.addEventListener('mousemove', move);
    }
}

// -------------- //
var container = document.getElementById("contain");
var btn = document.getElementById("add");
btn.addEventListener('click', addsphere);

function addsphere(){
    var div = document.createElement('div');
    div.className = 'node';
    div.id = count;
    div.innerHTML = count++;
    div.style.transform = 'translate(1670px, 300px)';
    div.style.backgroundColor = "#1e1e1e";
    container.appendChild(div);
    div.addEventListener('click', clicked);
}

// ----------------------- //
var sol = document.getElementById("solve");
var res = document.getElementById("reset");
var con = document.getElementById("connect");
var grid = document.getElementById("grid");
var rem = document.getElementById("remove");
sol.addEventListener('click', start);
res.addEventListener('click', reset);
con.addEventListener('click', connect);
rem.addEventListener('click', remove);

function remove(){
    document.querySelectorAll('.line').forEach(e => e.remove());
}

function reset(){
    count = 0;
    dl_cols = document.getElementsByClassName('col');
    for(var i = 1; i < dl_cols.length; i++){
        dl_cols[i].removeEventListener('click', connectNode)
    }
    while(grid.hasChildNodes()){
        grid.removeChild(grid.firstChild);
    }
    while(container.hasChildNodes()){
        container.firstChild.removeEventListener('click', clicked);
        container.removeChild(container.firstChild);
    }
}

var g, h_lines, t;
var moving = false
var table = false

function connect(){
    if(!table){
        table = true
        g = Array(count);
        h_lines = Array(count);
        for(var i = 0; i < count; i++){
            g[i] = Array(count).fill(0)
            h_lines[i] = Array(count).fill(0)
        }
        addRows(count)
        addCols(count)
    }
    else{
        table = false
        while(grid.hasChildNodes()){
            grid.removeChild(grid.firstChild)
        }
        join();
    }

}

function join(){
    for(var i = 0; i < count; i++){
        for(var j = i+1; j < count; j++){
            if(g[i][j] == 1){
                var node1 = document.getElementById(i)
                var node2 = document.getElementById(j)
                var c1 = node1.getBoundingClientRect();
                var c2 = node2.getBoundingClientRect();
                // place from c1 to c2
                var width = Math.sqrt(Math.abs((c1.left-c2.left)*(c1.left-c2.left) + (c1.top-c2.top)*(c1.top-c2.top)))
                var angle = Math.atan((c1.top-c2.top)/(c1.left-c2.left))*180/3.14152
                if(c1.left > c2.left && Math.floor(angle) != 90){
                    angle = 180 - Math.atan((c1.top-c2.top)/(c2.left-c1.left))*180/3.14152
                }
                var line = document.createElement('div')
                line.className = 'line'
                // console.log(c1.left, c1.top, angle)
                line.style.width = width + 'px'
                line.style.transformOrigin = '0% 0%'
                line.style.transform = 'translate('+(c1.left+30)+'px,'+(c1.top+30)+'px) rotate('+angle+'deg)'
                container.appendChild(line)
                h_lines[i][j] = h_lines[j][i] = line
            }
        }
    }
}

function addRows(k){
    var w = 500/(count+1);
    for(var i = 0; i < k+1; i++){
        var div = document.createElement('div')
        div.className = "row"
        div.style.height = w + 'px'
        grid.appendChild(div) 
    }
}

function addCols(k){
    var w = 500/(count+1);

    function movel(e){
        var x = e.clientX - w*2/3;
        var y = e.clientY - w*2/3;
        grid.style.transform = 'translate('+x+'px,'+y+'px)';
    }

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
                div.style.fontSize = '16px'
                div.addEventListener('click', function(){
                    if(!moving){
                        self = grid
                        document.addEventListener('mousemove', movel)
                        moving = true
                    }
                    else{
                        document.removeEventListener('mousemove', movel)
                        moving = false
                    }
                })
            }
            else{
                div.id = (i-1)*k+j-1
                if(i >= j){
                    div.style.backgroundColor = "black"   
                }
                else{
                    div.classList.add("grab")
                    div.addEventListener('click', connectNode)
                }
            }
            div.style.height = w + 'px'
            div.style.width = w + 'px'
            rows[i].appendChild(div)
        }
    }
}

function connectNode(){
    var num = this.id - '0'
    var r = Math.floor(num / count)
    var c = num % count
    g[r][c] = g[c][r] =  1
    this.style.backgroundColor = "green"
}

var flag = true, pathCount = 0
var path = Array(count).fill(0)
var v;
var time = 500

function start(){
    console.log(g)
    console.log(count)
    v = Array(count).fill(0)
    time = 1000
    flag = true
    pathCount = 0
    solve(0)
    if(flag) console.log("PATH NOT FOUND");
    else console.log("PATH FOUND");
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function changeColor(fromNodeID, ToNodeID, change){
    if(fromNodeID >= count || ToNodeID >= 8) return;
    console.log(fromNodeID, ToNodeID)

    var n = document.getElementById(ToNodeID)
    if(change){
        n.style.backgroundColor = 'red'
    } else{
        n.style.backgroundColor = '#1e1e1e'
    }
    if(fromNodeID != ToNodeID && change){
        h_lines[fromNodeID][ToNodeID].style.backgroundColor = 'red'
        h_lines[fromNodeID][ToNodeID].style.height = '10px'
    }
    else if(fromNodeID != ToNodeID && !change){
        h_lines[fromNodeID][ToNodeID].style.backgroundColor = 'black'
        h_lines[fromNodeID][ToNodeID].style.height = '1px'

    }
}


function solve(index){
    if(pathCount == count-1 && g[index][0] == 1){
        flag = false;
        console.log(path)
        sleep(time).then(() => {changeColor(index, 0, true)})    
        return;
    }
    if(pathCount == count) return;
    else{
        if(!flag) return // to stop after finding one path
        v[index] = 1;
        // changeColor(index, index, true)
        for(var i = 0; i < count; i++){
            if(g[index][i] == 1 && v[i] == 0){
                v[i] = 1; 
                sleep(time).then(() => {changeColor(index, i, true)})    
                time += 100
                path[pathCount] = i;
                pathCount++;
                solve(i);
                if(!flag) break
                sleep(time).then(() => {changeColor(index, i, false)})    
                time += 100
                pathCount--;
                v[i] = 0;
            }
        }
    }
}