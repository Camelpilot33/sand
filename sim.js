Number.prototype.mod = function (n) { return ((this % n) + n) % n; };
var canvas = document.getElementById("sandbox")
var ctx = canvas.getContext("2d")
const zoom = 10
function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}
function set(x, y, rgb = [0, 0, 0]) {
    // console.log(rgb)
    rgb = rgb.map(e => e * 0xFF)
    ctx.fillStyle = `rgb(${rgb.toString()})`
    ctx.fillRect(x * zoom, y * zoom, zoom, zoom)
}
function draw() {
    clear()
    for (x = 0; x <= canvas.width / zoom - 1; x++) for (y = 0; y <= canvas.height / zoom - 1; y++) {
        set(x, canvas.height / zoom - y - 1, world[x][y].color)
        // set(x, y, [Math.random(),Math.random(),Math.random()])
    }

}
class Cell {
    constructor(state = "air") {
        this.state = state
        this.color = [1, 0, 1]
        switch (state) {
            case "air":
                this.color = [0, 0, 0]
                break
            case "rock":
                let offset = Math.random() / 10 
                this.color = [0.5, 0.5, 0.5].map(e => e - offset)
                break
            case "sand":
                // console.log(document.getElementById("sandcolor").value)
                this.color = document.getElementById("sandcolor").value.slice(1,7).match(/.{1,2}/g).map(e=>parseInt(e,16)/255).map(e => e + Math.random() / 10 - 0.1)
                break
        }
    }
    attempt(ox, oy, x, y) {
        if (x < 0 || x > canvas.width / zoom - 1 || y < 0 || y > canvas.height / zoom - 1) return false
        if (world[x][y].state == "air") {
            world[x][y] = this
            world[ox][oy] = new Cell("air")
            return true
        }
        return false
    }
}
function frame() {//q
    for (y = 0; y <= canvas.height / zoom - 1; y++) for (x = 0; x <= canvas.width / zoom - 1; x++) {
        if (world[x][y].state == "sand") {
            if (!world[x][y].attempt(x, y, x, y - 1))
            if (!world[x][y].attempt(x, y, x - 1, y - 1))
            if (!world[x][y].attempt(x, y, x + 1, y - 1)) { }
        }
    }
    draw()
}


//INIT
// var sandcolor = [1, 0.75, 0.57]
let world = new Array(canvas.width / zoom)
    .fill(0).map(e => new Array(canvas.height / zoom)
        .fill(0).map(w => new Cell("air")))
setInterval(frame, 1000 / 60)
// setInterval(function () { world[10][15] = new Cell("sand") }, 1000 / 60)
frame()


//MOUSE
function gaussianRandom(mean=0, stdev=0.1) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    return z * stdev + mean;
}
function getCursorPosition(c, event) {
    const rect = c.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    type = document.getElementById("type").value
    // console.log(Math.floor(x / zoom), Math.floor((canvas.height - y) / zoom))
    let [ax, ay] = [Math.floor(x / zoom), Math.floor((canvas.height - y) / zoom)]
    world[ax][ay] = new Cell(type)
    let stdev = document.getElementById("stdev").value/10
    let dense = Number(document.getElementById("dense").value)
    for (i = 0; i < dense; i++) {
        rx = (ax + Math.floor(gaussianRandom(0,stdev)*5))
        ry = (ay + Math.floor(gaussianRandom(0,stdev)*5))
        if(rx<0||ry<0||rx>canvas.width/zoom-1||ry>canvas.height/zoom-1) continue
        world[rx][ry] = new Cell(type)
    }
    // if (ax > 0) world[ax - 1][ay] = new Cell("sand")
    // if (ay > 0) world[ax][ay - 1] = new Cell("sand")
    // if (ax < canvas.width / zoom - 1) world[ax + 1][ay] = new Cell("sand")
    // if (ay < canvas.height / zoom - 1) world[ax][ay + 1] = new Cell("sand")
}
function clickdelay() {
    var interval = setInterval(function () {
        if (!holding) clearInterval(interval);
        getCursorPosition(canvas, mousePosition);
    }, 0); //set your wait time between consoles in milliseconds here
}
var holding,mousePosition=[0,0];
canvas.addEventListener('mousedown', function () { holding = true; clickdelay() })
canvas.addEventListener('mouseup', function () { holding = false; clickdelay() })
canvas.addEventListener('mouseleave', function () { holding = false })
canvas.addEventListener('mousemove', function (e) { mousePosition = e })