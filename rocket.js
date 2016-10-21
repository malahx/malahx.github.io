// RocketJS
// Copyright 2016 Malah
// This is free and unencumbered software released into the public domain.

var RocketJS = {
    currentGame: null,
    show: function(toShow, toHide) {
        toShow.classList.remove("hide");
        for (var i = toHide.length -1; i>=0; i--) {
            toHide[i].classList.add("hide");
        }
    },

    vector2: function(x, y) {
        this.x = x;
        this.y = y;
    },

    dim: function(obj, factor) {
        this.obj = obj;
        this.factor = factor;
        this.vect = new RocketJS.vector2(this.obj.width * factor, this.obj.height * factor);
        this.x = this.vect.x;
        this.y = this.vect.y;
        this.obj.setAttribute("width", this.vect.x + "px;");
    },

    position: function(obj) {
        this.obj = obj;
        this.vect = new RocketJS.vector2((window.innerWidth - this.obj.x) / 2, window.innerHeight - this.obj.y);
        this.width = function(speed) {
            this.vect.x += speed;
            this.obj.obj.style = "left: " + this.vect.x + "px;";
        };
        this.height = function(speed) {
            this.vect.y += speed;
            this.obj.obj.style = "top: " + this.vect.y + "px;";
        };
        this.setWidth = function(posX) {
            this.vect.x = posX;
            this.obj.obj.style = "left: " + this.vect.x + "px;";
        };
        this.setHeight = function(posY) {
            this.vect.y = posY;
            this.obj.obj.style = "top: " + this.vect.y + "px;";
        };
        this.up = function() {
            return this.vect.y;
        };
        this.down = function() {
            return this.vect.y + this.obj.y;
        };
        this.left = function() {
            return this.vect.x;
        }
        this.right = function() {
            return this.vect.x + this.obj.x;
        }
        this.setWidth(this.vect.x);
        this.setHeight(this.vect.y);
    },

    Game: function() {
        this.rocket = document.createElement("img");
        this.fire = document.createElement("img");
        this.rocket.src = "img/fusee.png";
        this.rocket.setAttribute("id","rocket");
        this.rocket.setAttribute("position","fixed");
        this.fire.src = "img/fire.png";
        this.fire.setAttribute("id","fire");
        this.fire.setAttribute("position","fixed");
        this.rocketDim = new RocketJS.dim(this.rocket, 0.5);
        this.position = new RocketJS.position(this.rocketDim);
        this.speed = 0;
        this.accelerate = 0;
        this.burn = false;
        game.appendChild(this.rocket);
        this.Update = function() {
            var _cGame = RocketJS.currentGame;
            setTimeout(_cGame.Update, 50);
            if (_cGame.burn) {
                _cGame.accelerate -= 0.5;
            } else {
            }
            _cGame.accelerate += 0.1;
            if (_cGame.accelerate < -0.5) {
                _cGame.accelerate = -0.5;
            }
            _cGame.speed += _cGame.accelerate;
            if (_cGame.position.down() > window.innerHeight) {
                _cGame.position.setHeight(window.innerHeight - _cGame.rocketDim.y)
                _cGame.accelerate = 0;
                _cGame.speed = 0;
                return;
            }
            _cGame.position.height(_cGame.speed);
        }
        document.addEventListener("keydown", RocketJS.controlKeyPressDown);
        document.addEventListener("keyup", RocketJS.controlKeyPressUp);
    },

    controlKeyPressDown: function(evnt) {
        var keyName = evnt.keyCode;
        if (keyName == 38) {
            RocketJS.currentGame.burn = true;
            console.log("Burn!");
        }
    },

    controlKeyPressUp: function(evnt) {
        var keyName = evnt.keyCode;
        if (keyName == 38) {
            RocketJS.currentGame.burn = false;
            console.log("Stop");
        }
    },
};
