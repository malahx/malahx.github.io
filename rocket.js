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

    vector2: function(rocket, x, y) {
        this.x = x;
        this.y = y;
        this.rocket = rocket;
        this.width = function(speed) {
            this.x += speed;
            this.rocket.setAttribute("left", this.x + "px");
        };
        this.height = function(speed) {
            this.y += speed;
            this.rocket.setAttribute("top", this.y + "px");
        };
        this.setWidth = function(posX) {
            this.x = posX;
            this.rocket.setAttribute("left", this.x + "px");
        };
        this.setHeight = function(posY) {
            this.y = posY;
            this.rocket.setAttribute("top", this.y + "px");
        };
        this.up = function() {
            return this.y;
        };
        this.down = function() {
            return this.y + 89;
        };
        this.left = function() {
            return this.x;
        }
        this.right = function() {
            return this.x + 50;
        }
        this.setWidth(x);
        this.setHeight(y);
    },

    Game: function() {
        var x = (window.innerWidth - 50) / 2;
        var y = (window.innerHeight - 89);
        this.rocket = document.createElement("img");
        this.rocket.src = "img/fusee.png";
        this.rocket.setAttribute("id","rocket");
        this.rocket.setAttribute("position","fixed");
        this.position = new RocketJS.vector2(this.rocket, x, y);
        this.speed = 0;
        this.accelerate = 0;
        this.burn = false;
        game.appendChild(this.rocket);
        this.Update = function() {
            if (RocketJS.currentGame.position.down > window.innerHeight) {
              RocketJS.currentGame.position.setHeight(window.innerHeight - 89)
              RocketJS.currentGame.accelerate = 0;
              return;
            }
            if (game.burn) {
              RocketJS.currentGame.accelerate++;
            } else {
              RocketJS.currentGame.accelerate--;
            }
            RocketJS.currentGame.speed += RocketJS.currentGame.accelerate;
            setTimeout(RocketJS.currentGame.Update, 50);
        }
    }
};
