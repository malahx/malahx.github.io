// Liste des tâches
var tasksList = {};

// Index pour l'id des élements
var indexId = -1;

// key
var keyAdd = 13;
var keyEscape = 27;

// Objet de création des balises
var Tag = function(balise, parent = null, allClass = null, inner = null, attributes = null) {
    this.node = document.createElement(balise);
    if (!parent)    parent = document.body;
    if (allClass)   this.node.className = allClass;
    if (inner)      this.node.innerHTML = inner;
    if (attributes != null) {
        var keys = Object.keys(attributes);
        for (var key of keys) {
            this.node.setAttribute(key, attributes[key]);
        }
    }
    parent.appendChild(this.node);
    console.log("new element: " + balise);
}

// Objet de création des tâches
var ToDo = function(task, strike = false, id = null) {
    var fetch = this;
    var lst = document.getElementById('lst');
    var icoAttr = { "aria-hidden": true };
    var inputAttr = { "type": "text" };

    indexId++;
    this.id = (id ? id : "toDo" + indexId);
    tasksList[this.id] = { "task": task, "strike": strike };
    this.task = task;
    this.strike = strike;

    this.toDo = new Tag('li', lst, null, null, { "id": this.id });
    this.valid = new Tag('a', this.toDo.node);
    this.validIco = new Tag('i', this.valid.node, "fa fa-check-square-o", null, icoAttr);
    this.txt = new Tag('span', this.toDo.node, "show", task);
    this.edit = new Tag('input', this.toDo.node, "hide", task, inputAttr);
    this.del = new Tag('i', this.toDo.node, "fa fa-trash", null, icoAttr);

    this.ToggleValidate = function(evt = null) {
        ToggleClass(fetch.validIco.node, ["fa-check-square-o", "fa-square-o"]);
        ToggleClass(fetch.toDo.node, ["strike", "grey"]);
        if (evt != null) {
            fetch.strike = !fetch.strike;
            tasksList[fetch.id]["strike"] = fetch.strike;
            console.log("ToggleValidate: " + fetch.id);
            SaveTasks();
        }
    };
    this.ToggleDelete = function(evt) {
        this.parentNode.remove();
        delete tasksList[fetch.id];
        console.log("ToggleDelete: " + fetch.id);
        SaveTasks();
    };
    this.SaveEdit = function(evt) {
        this.previousSibling.innerHTML = this.value;
        tasksList[fetch.id]["task"] = this.value;
        SaveTasks();
    };
    this.ToggleEdit = function(evt) {
        if (evt.type == 'keydown') {
            var keyName = evt.keyCode;
            if (keyName != keyAdd && keyName != keyEscape) {
                return;
            }
        }
        var txt, edit, del;
        if (this.tagName === "SPAN") {
            txt = this;
            edit = this.nextSibling;
        } else {
            txt = this.previousSibling;
            edit = this;
        }
        del = this.parentNode.lastChild;
        edit.classList.toggle("hide");
        ToggleClass(txt,["hide","show"])
        ToggleClass(del,["fa-trash","fa-check"]);
        edit.value = txt.innerHTML;
        edit.focus();
        console.log("ToggleEdit: " + fetch.id);
    }
    this.toDo.node.addEventListener('drop');
    this.txt.node.addEventListener('click', this.ToggleEdit);
    this.edit.node.addEventListener('input', this.SaveEdit);
    this.edit.node.addEventListener('blur', this.ToggleEdit);
    this.edit.node.addEventListener('keydown', this.ToggleEdit);
    this.valid.node.addEventListener('click', this.ToggleValidate);
    this.del.node.addEventListener('dblclick', this.ToggleDelete);
    if (strike) {
        this.ToggleValidate();
    }
    console.log("new toDo: " + task);
}

// Sauvegarder les tâches
function SaveTasks() {
    localStorage.setItem("tasksList", JSON.stringify(tasksList));
    console.log("SaveTasks: " + JSON.stringify(tasksList));
}

// Charger les tâches
function LoadTasks() {
    var localTasks = localStorage.getItem("tasksList");
    if (localTasks != null) {
        tasksList = JSON.parse(localTasks);
        var keys = Object.keys(tasksList);
        for (var key of keys) {
            var task = tasksList[key];
            console.log(key + " " + task);
            var toDo = new ToDo(task["task"], task["strike"], task["id"]);
        }
        console.log("LoadTasks: " + tasksList);
        return;
    }
    console.log("No task stored");
}

// Fonction d'activation/désativation de classes CSS
function ToggleClass(element, tglClass) {
    for (var currentClass of tglClass) {
        element.classList.toggle(currentClass);
    }
    console.log("ToggleClass: " + element);
}

// Fonction de test pour vérifier qu'une tâche n'est pas dans la liste
function ToDoContain(text) {
    var tasks = document.querySelectorAll("#toDo #tasks #lst li");
    for (var task of tasks) {
        var txt = task.childNodes[1];
        if (txt.innerHTML === text) {
            return true;
        }
    }
    return false;
}

// Fonction pour ajouter une tâche
function AddToDo() {
    var txt = document.getElementById('txt');
    if (!txt.value) {
        var info = document.getElementById('info');
        info.innerHTML = "You need to enter a task.";
        console.log("No value");
        return;
    }
    if (ToDoContain(txt.value)) {
        var info = document.getElementById('info');
        info.innerHTML = "This task is already planned.";
        console.log("Value exists");
        return;
    }
    var toDo = new ToDo(txt.value);
    SaveTasks();
    console.log("AddToDo");
}

// Effacer les infos
function ClearInfo() {
    var info = document.getElementById('info');
    info.innerHTML = "";
}

// Effacer le texte
function ClearTxt() {
    document.getElementById('txt').value = "";
}

// Gestion des key;
function keyDown(evnt) {
    var keyName = evnt.keyCode;
    if (keyName == keyAdd) {
        AddToDo();
    }
}

// Evènement pour ajouter une tâche
document.getElementById('btn').addEventListener('click', AddToDo);

// Evènement pour effacer le champ d'information
document.getElementById('txt').addEventListener('input', ClearInfo);

// Evènement pour effacer le champ de tâche
document.getElementById('clear').addEventListener('click', ClearTxt);

// Evènement pour des touches
document.getElementById('txt').addEventListener('keydown', keyDown);

// Initialisation des toDo
LoadTasks();
