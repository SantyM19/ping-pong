//Este es el MODELO (MVC)

class Board{
    //Se asigna a variables de la clase (Constructor)
    constructor(width, height){
        //Ancho
        this.width = width
        //Alto
        this.height = height
        //Si esta jugando
        this.playing = false
        //Finalizo el juego
        this.game_over = false
        //Las barras
        this.bars = [];
        //La pelota
        this.ball = null

        this.start = false
    }

    get elements() {
        var elements = this.bars.map(function(bar) { return bar; });
        //Se agrega una pelota
        elements.push(this.ball);
        return elements;
    }
}


//Se generara una nueva clase (Dibuja las barras)
class Bar{
    constructor(x, y, width, height, board) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;

        //Accedo al vector(arreglo) que iniciamos arriba y le mandamos el objeto total osea la barra 
        this.board.bars.push(this);
        //Este es para decirle que elemento es para que canvas sepa como dibujarlo
        this.kind = "rectangle";
        this.speed = 10;
    }

    down() {
        //this.y += this.speed;
        this.y = (this.y == 300) ? this.y : this.y + this.speed;
    }
    up() {
        this.y = (this.y == 0) ? this.y : this.y - this.speed;
    }
    toString() {
        return "x:" + this.x + "y:" + this.y;
    }

}

//Esta es la vista en el modelo (MVC)
class BoardView{
    constructor(canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        //Con este dibujaremos
        this.ctx = canvas.getContext("2d");
    }

    clean() {
        this.ctx.clearRect(0, 0, this.board.width, this.board.height);
    }
    drawing() {
        for (var i = this.board.elements.length - 1; i >= 0; i--) {
            var el = this.board.elements[i];
            this.draw(this.ctx, el);
        }
    }
    check_collisions() {
        for (var i = this.board.bars.length - 1; i >= 0; i--) {
            var bar = this.board.bars[i];
            if (this.hit(bar, this.board.ball)) {
                this.board.ball.collision(bar);
            }
        }
    }
    play() {
        if (this.board.playing) {
            this.clean();
            this.drawing();
            this.check_collisions();
            this.board.ball.move();
        }

    }

    //////////////////////////////

    hit(a, b) {
        //Revisa si a colisiona con b
        var hit = false;
        //Colisiones horizontales
        if (b.x + b.width >= a.x && b.x < a.x + a.width) {
            //Colisiones verticales
            if (b.y + b.height >= a.y && b.y < a.y + a.height)
                hit = true;
        }
        //Colisiones de a con b
        if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
            if (b.y <= a.y && b.y + b.height >= a.y + a.height)
                hit = true;
        }
        //Colisiones de b con a
        if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
            if (a.y <= b.y && a.y + a.height >= b.y + b.height)
                hit = true;
        }
        return hit;

    }

    //Aca implementaremos unas funciones las cuales no son de un objeto, pero que nos ayudan a realizar ciertas cosas
    //Este dibujara los elementos
    draw(ctx, element) {
        //Me dice si el objeto tiene una propiedad kind

        switch (element.kind) {
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
                break;
        }
    }
}

class Ball {
    constructor(x, y, radius, board) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.board = board;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 3;

        board.ball = this;
        this.kind = "circle";
    }

    move (){
        this.speed += 0.005;

        if(this.x > 800 || this.x < 0){
            board.game_over = true
            this.x = 400
            this.y = 200
            this.speed = 3
            document.getElementById("gameOver").style.display = "block"
            board.playing = false
        }
        else{
            this.x += this.speed_x * this.direction
        }

        if (this.y <  10){
            this.y = 390
        }
        else if(this.y >  395){
            this.y = 11
        }
        else{
            this.y += this.speed_y
        }
    }
    get width() {
        return this.radius * 2;
    }
    get height() {
        return this.radius * 2;
    }

    collision(bar) {
        //Reacciona a la colision a la barra que recibe como parametro
        var relative_intersect_y = (bar.y + (bar.height / 2)) - this.y;
        
        var normalized_intersect_y = relative_intersect_y / (bar.height / 2);
        
        this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

        this.speed_y = this.speed * -Math.sin(this.bounce_angle);
        this.speed_x = this.speed * Math.cos(this.bounce_angle);

        if (this.x > (this.board.width / 2)) this.direction = -1;
        else this.direction = 1;

    }

}

//Creo el tablero
var board = new Board(800, 400);
//Creo la barra
var bar = new Bar(20, 150, 30, 100, board);
var bar_2 = new Bar(750, 150, 30, 100, board);
var canvas = document.getElementById('canvas');
var board_view = new BoardView(canvas, board);
var ball = new Ball(400, 200, 10, board);


//Aca esta pendiente del keydown el cual es un evento de teclado sucede cuando se preciona una tecla
document.addEventListener("keydown", function(ev) {
    
    //aca inicializa con las teclas de arriba y la tecla hacia abajo
    if (ev.keyCode === 38) {
        ev.preventDefault();
        bar_2.up();
    } else if (ev.keyCode === 40) {
        ev.preventDefault();
        bar_2.down();
    } else if (ev.keyCode === 87) {
        ev.preventDefault();
        bar.up();
    } else if (ev.keyCode === 83) {
        ev.preventDefault();
        bar.down();
    } else if (ev.keyCode === 32) {
        ev.preventDefault();
        board.playing = !board.playing;
        if(board.playing){
            document.getElementById("stop").style.display = "none"
        }
        else{
            document.getElementById("stop").style.display = "block"
        }
    } else if (ev.keyCode === 13) {
        ev.preventDefault();
        if(board.game_over){
            board.game_over = false
            document.getElementById("gameOver").style.display = "none"
            document.getElementById("start").style.display = "block"
            board.start = false
        }
        if(board.start == false){
            document.getElementById("start").style.display = "none"
            board.start = true
            board.playing = !board.playing;
        }
    }
    //Con esta linea podemos saber la coordenada con la que esta cambiando la barra
    //console.log(bar.toString()) = console.log(""+bar);
});

board_view.drawing()

//Aca esta pendiente de que cargue la pagina cuando carga llama el metodo main
//self.addEventListener("load", main);

window.requestAnimationFrame(controller);
//Este seria el Controlador (MVC)
function controller() {
    board_view.play();
    window.requestAnimationFrame(controller);
}