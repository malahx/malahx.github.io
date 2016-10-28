// RocketJS
// Copyright 2016 Malah
// This is free and unencumbered software released into the public domain.

// Variable de dom
var rocketjs;

// Fonction autoappelante permettant de conserver des variables et objets privés
(function() {
    // Partie en cours
    var currentGame = null;
    // Objet définissant un vecteur
    var vector2 = function(x, y) {
        this.x = x;
        this.y = y;
        this.Add = function(vect, max = null) {
            this.x += vect.x;
            this.y += vect.y;
            if (max != null) {
                //trigo
            }
        };
        this.Sub = function(vect, max = null) {
            this.x -= vect.x;
            this.y -= vect.y;
            if (max != null) {
                //trigo
            }
        };
    };
    // Objet définissant les dimensions d'un dom
    var Dimensions = function(dom, factor) {
        this.dom = dom;
        this.factor = factor;
        this.vect = new vector2(this.dom.width * factor, this.dom.height * factor);
        this.x = this.vect.x;
        this.y = this.vect.y;
        this.dom.setAttribute("width", this.vect.x + "px;");
    };
    // Objet définissant la position d'un dom
    var Positions = function(dim) {
        this.dim = dim;
        this.vect = new vector2((window.innerWidth - this.dim.x) / 2, window.innerHeight - this.dim.y);
        this.Add = function(vect) {
            this.vect.Add(vect)
            this.Set();
        };
        this.Set = function() {
            this.dim.dom.style = "left: " + this.vect.x + "px;";
            this.dim.dom.style = "top: " + this.vect.y + "px;";
        };
        this.up = function() {
            return this.vect.y;
        };
        this.down = function() {
            return this.vect.y + this.dim.y;
        };
        this.left = function() {
            return this.vect.x;
        }
        this.right = function() {
            return this.vect.x + this.dim.x;
        }
        this.Set();
    };
    var Rotation = function() {
        this.angle = 0;
    }
    var Movement = function(pos) {
        this.pos = pos;
        this.rot = new Rotation();
        this.burn = false;
        this.speed = new vector2(0, 0);
        this.gravity = new vector2(0, 0.1);
        this.maxAcceleration = new vector2(0, 0.5);
        this.curAcceleration = new vector2(0, 0);
        this.thrust = new vector2(0, 0.5);
        this.GravityApply = function() {
            this.curAcceleration.Add(this.gravity);
        };
        this.BurnApply = function() {
            if (!this.burn) {
                return;
            }
            this.curAcceleration.Sub(this.thrust, this.maxAcceleration);
        };
        this.Speed = function() {
            this.speed.Add(this.curAcceleration);
        };
        this.Apply = function() {
            this.GravityApply();
            this.BurnApply();
            this.Speed();
            pos.Add(this.speed);
        };
    };
    // Objet de création d'un partie
    var Game = function() {
        // Génération du dom de la fusée
        this.rocket = document.createElement("img");
        this.fire = document.createElement("img");
        this.rocket.src = "img/fusee.png";
        this.rocket.setAttribute("id", "rocket");
        this.rocket.setAttribute("position", "fixed");
        this.fire.src = "img/fire.png";
        this.fire.setAttribute("id", "fire");
        this.fire.setAttribute("position", "fixed");
        game.appendChild(this.rocket);

        // Création des données de la fusée
        this.rocketDim = new Dimensions(this.rocket, 0.5);
        this.position = new Positions(this.rocketDim);
        this.movement = new Movement(this.position);
        /*this.speed = 0;
        this.accelerate = 0;
        this.burn = false;*/

        // Méthode d'actualisation d'une partie
        this.Update = function() {
            currentGame.movement.Apply();
            /*if (currentGame.burn) {
                currentGame.accelerate -= 0.5;
            }
            currentGame.accelerate += 0.1;
            if (currentGame.accelerate < -0.5) {
                currentGame.accelerate = -0.5;
            }
            currentGame.speed += currentGame.accelerate;
            if (currentGame.position.down() > window.innerHeight) {
                currentGame.position.setHeight(window.innerHeight - currentGame.rocketDim.y)
                currentGame.accelerate = 0;
                currentGame.speed = 0;
            } else {
                currentGame.position.height(currentGame.speed);
            }*/
        };

        // Ajout des évènements
        document.addEventListener("keydown", controlKeyPressDown);
        document.addEventListener("keyup", controlKeyPressUp);
        setInterval(this.Update, 50);
    };

    // Evènement de pression d'une touche
    var controlKeyPressDown = function(evnt) {
        var keyName = evnt.keyCode;
        if (keyName == 38) {
            currentGame.movement.burn = true;
        }
    };

    // Evènement de relache d'une touche
    var controlKeyPressUp = function(evnt) {
        var keyName = evnt.keyCode;
        if (keyName == 38) {
            currentGame.movement.burn = false;
        }
    };

    // Initialisation des variables globales et des évenements
    window.addEventListener("load", function() {
        rocketjs = document.getElementById('rocketjs');
        rocketjs.addEventListener("click", function() {
            rocketjs.classList.add("hide");
            currentGame = new Game();
        });
    });
})();
