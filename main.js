//Este es el MODELO (MVC)
(function() {
    //Se define una variable como clase y en ella se crea un constructor
    self.Board = function(width, height) {
        //Se asigna a variables de la clase (Constructor)
        //Ancho
        this.width = width;
        //Alto
        this.height = height;
        //Si esta jugando
        this.playing = false;
        //Finalizo el juego
        this.game_over = false;
        //Las barras
        this.bars = [];
        //La pelota
        this.ball = null;
    }

    //Se modifica el prototipo de Board
    self.Board.prototype = {
        //Geter(Seran las barras)
        get elements() {
            var elements = this.bars;
            //Se agrega una pelota
            elements.push(this.ball);
            return elements;
        }
    }
})();

//Se generara una nueva clase (Dibuja las barras)
(function() {
    //Aca se le pasara la posicion(x,y) el alto y el ancho y el tablero
    self.Bar = function(x, y, width, height, board) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;

        //Accedo al vector(arreglo) que iniciamos arriba y le mandamos el objeto total osea la barra 
        this.board.bars.push(this);
        //Este es para decirle que elemento es para que canvas sepa como dibujarlo
        this.kind = "rectangle";
    }

    self.Bar.prototype = {
        down: function() {

        },
        up: function() {

        }
    }
})();

//Esta es la vista en el modelo (MVC)
(function() {
    self.BoardView = function(canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        //Con este dibujaremos
        this.ctx = canvas.getContext("2d");
    }

    self.BoardView.prototype = {
        draw: function() {
            for (var i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i];

                draw(this.ctx, el);
            };
        }
    }

    //Aca implementaremos unas funciones las cuales no son de un objeto, pero que nos ayudan a realizar ciertas cosas
    //Este dibujara los elementos
    function draw(ctx, element) {
        //Me dice si el objeto tiene una propiedad kind
        if (element !== null && element.hasOwnProperty('kind')) {
            switch (element.kind) {
                case "rectangle":
                    ctx.fillRect(element.x, element.y, element.width, element.height);
                    break;
            }
        }
    }
})();

window.addEventListener("load", main);

//Este seria el Controlador (MVC)
function main() {
    //Creo el tablero
    var board = new Board(800, 400);
    //Creo la barra
    var bar = new Bar(20, 100, 40, 100, board);
    var bar = new Bar(735, 100, 40, 100, board);
    var canvas = document.getElementById('canvas');
    var board_view = new BoardView(canvas, board);

    board_view.draw();

}