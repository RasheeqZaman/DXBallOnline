
var myGamePiece;
var theBall;
var borders = [];
var gameBlocks = [];
var GBUnit;

function startGame() {

    myGameArea.start();
    myGamePiece = new component(150, 20, "rgb(46,204,113)", 10, 550, 0, 0);
    theBall = new component(20, 20, "white", 100, 200, 5, 5);
    borders[0] = new component(1280, 5, "rgb(46,204,113)", 0, -5, 0, 0);
    borders[1] = new component(1280, 5, "rgb(46,204,113)", 0, 620, 0, 0);
    borders[2] = new component(5, 600, "rgb(46,204,113)", -5, 0, 0, 0);
    borders[3] = new component(5, 600, "rgb(46,204,113)", 1280, 0, 0, 0);
    createGameBlocks();
}

function createGameBlocks(){
    GBUnit = 20;
    var x = rand(1, 1200/GBUnit);
    var y = rand(1, 300/GBUnit);
    var width = rand(1, 100/GBUnit);
    var height = rand(1, 100/GBUnit);
    var firstGB = new component(width, height, "yellow", x, y, 0, 0);
    //alert("x="+x+" y="+y+" width="+width+" height="+height);
    gameBlocks.push(firstGB);
}

function rand(from, to){
    return Math.floor((Math.random() * to) + from)*GBUnit;
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1280;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        this.canvas.style.cursor = "none";
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('mousemove', function (e) {
            myGameArea.x = e.pageX;
        })
    },

    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    stop : function() {
        clearInterval(this.interval);
        this.canvas.style.cursor = "default";
    }
}

function component(width, height, color, x, y, speedX, speedY) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) {
           crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    if(theBall.crashWith(borders[1])){
        myGameArea.stop();
    }else{
        myGameArea.clear();
        if (myGameArea.x) {
            myGamePiece.x = myGameArea.x;
        }

        if(theBall.crashWith(myGamePiece) || theBall.crashWith(borders[0])){
            theBall.speedY*=(-1);
        }
        if(theBall.crashWith(borders[2]) || theBall.crashWith(borders[3])){
            theBall.speedX*=(-1);
        }


        theBall.newPos();

        for(var i=0; i<borders.length; i++){
            borders[i].update();
        }
        for(var i=0; i<gameBlocks.length; i++){
            gameBlocks[i].update();
        }
        theBall.update();
        myGamePiece.update();
    }
}
