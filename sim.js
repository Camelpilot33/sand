var canvas = document.getElementById("sandbox")
var ctx = canvas.getContext("2d")
const zoom = 30
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
            case "sand":
                this.color = [1, 0.85, 0.69]
                break
        }
    }
    attempt(ox,oy,x, y) {
        if (x < 0 || x > canvas.width / zoom - 1 || y < 0 || y > canvas.height / zoom - 1) return false
        if (world[x][y].state == "air") {
            world[x][y] = this
            world[ox][oy] = new Cell("air")
            return true
        }
        return false
    }
}
function frame() {
    for (x = 0; x <= canvas.width / zoom - 1; x++) for (y = 0; y <= canvas.height / zoom - 1; y++) {
        if (world[x][y].state == "sand") {
           (world[x][y].attempt(x,y,x, y - 1) )
        }
    }
    draw()
}

let world = new Array(canvas.width / zoom)
    .fill(0).map(e => new Array(canvas.height / zoom)
        .fill(0).map(w => new Cell("air")))
world[1][3] = new Cell("sand")
setInterval(frame, 1000 / 5)
setInterval(function(){world[1][9] = new Cell("sand")}, 1000)
// frame()