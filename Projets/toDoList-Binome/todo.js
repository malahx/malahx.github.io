// Variables globales
var modal = document.getElementById('monModal');
var element;
var Id = -1;
// Tableau des tâches
var taches = [];

// Fonction permettant d'ajotuer un élement en fonction d'un évènement
// ou d'une initialisation
function ajouterUnElement(evt, nomDeLaTache = "", fait = false, priority = 1) {
    var tache = document.getElementById('tache');
    if (nomDeLaTache == "" && tache.value == "") {
        return;
    }

    Id++;
    if (nomDeLaTache == "") {
        // En cas d'un évènement
        nomDeLaTache = tache.value;
    }
    tache.value = "";
    // Création des élements
    var parent = document.getElementById('todoList');
    var enfant = document.createElement('li');
    var barrer = document.createElement('span');
    var texte = document.createElement('span');
    var supprimer = document.createElement('span');
    // Ajout des élements à la page
    enfant.appendChild(barrer);
    enfant.appendChild(texte);
    enfant.appendChild(supprimer);
    parent.appendChild(enfant);
    // Ajout de textes et de paramètres aux éléments
    supprimer.innerHTML = "<i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i>";
    texte.innerHTML = nomDeLaTache;
    barrer.innerHTML = "<i class=\"fa fa-check-square-o\" aria-hidden=\"true\"></i>&nbsp;";
    enfant.id = Id;
    // Ajout d'événements
    barrer.addEventListener("click", barrerTexte);
    supprimer.addEventListener("click", supprimerTexte);
    texte.addEventListener("click", afficherModal);
    // initialisation des paramètres
    if (fait) {
        enfant.classList.add("fait");
        barrer.firstChild.classList.toggle("fa-square-o");
        barrer.firstChild.classList.toggle("fa-check-square-o");
    }
    if (priority === 0) {
        enfant.classList.add("bleu");
    }
    if (priority === 2) {
        enfant.classList.add("violet");
    }
    // Ajout des tâches au tableau
    if (evt) {
        taches.push(
            {
                "id": Id,
                "nom": nomDeLaTache,
                "fait": fait,
                "priority": priority
            }
        );
        Save();
    }
    console.log("ajouterUnElement");
}

// Récupérer l'index d'une tâche en fonction de son Id
function retounerIndex(id) {
    for(var i=0;i<taches.length;i++) {
        var tache = taches[i];
        if (tache['id'] === Number(id)) {
            return i;
        }
    }
    return -1;
}

// Pour barrer et débarrer le parent
function barrerTexte() {
    var i = retounerIndex(this.parentNode.id);
    var tache = taches[i];
    tache['fait']=!tache['fait'];
    this.firstChild.classList.toggle("fa-check-square-o");
    this.firstChild.classList.toggle("fa-square-o");
    this.parentNode.classList.toggle("fait");
    Save();
    console.log("barrerTexte");
}
// Pour supprimer le parent
function supprimerTexte() {
    var i = retounerIndex(this.parentNode.id);
    taches.splice(i,1);
    this.parentNode.remove();
    Save();
    console.log("supprimerTexte");
}
// Pour afficher un modal
function afficherModal() {
    modal.style.display = "block";
    element = this;
    document.getElementById('champTxt').value = this.innerHTML;
    var i = retounerIndex(this.parentNode.id);
    var tache = taches[i];
    //document.getElementById('priorite').options[tache["priority"]].selected = true;
    document.getElementById('priorite').selectedIndex = tache["priority"];
    console.log("afficherModal");
}
// Sauvegarder en localstorage
function Save() {
    if (taches != null) {
        var jsonString = JSON.stringify(taches);
        localStorage.setItem("todo", jsonString);
        console.log("Save");
    }
}
function Key(evt) {
    var keyName = evt.keyCode;
    //console.log(keyName)
    if (keyName === 13) {
        ajouterUnElement(evt);
        console.log("Key");
    }
}
// Pour initialiser le ul à partir du tableau
function init() {
    var jsonString = localStorage.getItem("todo");
    if (jsonString != null) {
        taches = JSON.parse(jsonString);
        for(var tache of taches) {
            ajouterUnElement(null, tache["nom"], tache["fait"], tache["priority"]);
        }
    }
    console.log("init");
}
function annuler() {
     modal.style.display = "none";
     console.log("annulerModal");
}
function valider() {
    var nouveauNom = document.getElementById('champTxt').value;
    var i = retounerIndex(element.parentNode.id);
    var tache = taches[i];
    tache['nom']=nouveauNom;
    element.innerHTML = nouveauNom;
    tache["priority"] = document.getElementById('priorite').selectedIndex;
    switch (tache["priority"]) {
        case 0:
            element.parentNode.classList.add("bleu");
            element.parentNode.classList.remove("violet");
        break;
        case 1:
            element.parentNode.classList.remove("bleu");
            element.parentNode.classList.remove("violet");
        break;
        case 2:
            element.parentNode.classList.remove("bleu");
            element.parentNode.classList.add("violet");
        break;
    }
    Save();
    modal.style.display = "none";
    console.log("validerModal");
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        console.log("onclickModal");
    }
}
init();
document.getElementById('btnAnnuler').addEventListener("click", annuler);
document.getElementById('btnFermer').addEventListener("click", annuler);
document.getElementById('btnValider').addEventListener("click", valider);
document.getElementById('boutonAjout').addEventListener("click", ajouterUnElement);
document.getElementById('tache').addEventListener("keydown", Key);
