// Copyright 2016 Malah
// This is free and unencumbered software released into the public domain.

var ajax = {

    // Données stocker pour une sauvegarde de session.
    dataStored: {},

    // Référenes de toutes les API supportées
    supportedAPI: function() {
        return {
            'github': ['https://api.github.com/users/malahx', [github_repos, 'public_repos'], [github_followers, 'followers']],
            'github-repos': ['https://api.github.com/users/malahx/repos', [github_activeRepos, 'foreach', '', 'updated_at', 'date']]
        };
        //'spacedock': ['https://spacedock.info/api/user/malah', [spacedock_mods, 'count', 'mods'], [spacedock_followers, 'foreach', 'mods', 'followers'], [spacedock_downloads, 'foreach', 'mods', 'downloads']]
    },

    // Connection aux différents API supportés
    Update: function() {
        document.body.style = "cursor: wait;"
        apis = ajax.supportedAPI();
        var keys = Object.keys(apis);
        for (api of keys) {
            ajax.Connect(api, apis[api][0]);
        }
    },

    // Connection et traitement des données en fonction de l'API
    Connect: function(api, url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.setRequestHeader('Accept', '*/*');
        xhr.onload = function(e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var parse = JSON.parse(xhr.responseText);
                    var apis = ajax.supportedAPI();
                    var datas = apis[api];

                    // Traitement de la mise à jour des élements du dom
                    for (var i = datas.length -1; i>0; i--) {
                        var data = datas[i];

                        // Traitement des JSON simple
                        if (data.length == 2) {
                            ajax.dataStored[data[0].id] = parse[data[1]];
                            data[0].innerHTML = parse[data[1]];
                            continue;
                        }

                        // Traitement des JSON complexe
                        switch (data[1]) {
                            // Comptage du nombre d'élément
                            case 'count':
                                ajax.dataStored[data[0].id] = parse[data[2]].length;
                                data[0].innerHTML = parse[data[2]].length;
                            break;
                            // Boucle pour test de date ou comptage de JSON
                            case 'foreach':
                                var j = 0;
                                var array = (data[2] == '' ? parse : parse[data[2]]);
                                for (var each of array) {
                                    if (data[4] === 'date') {
                                        var date = new Date(each[data[3]]);
                                        var year = 365.25*24*60*60*1000;
                                        var current = new Date();
                                        if ((current.getTime() - date.getTime())/year<1) {
                                            j++;
                                        }
                                    } else {
                                        j += each[data[3]];
                                    }
                                }
                                ajax.dataStored[data[0].id] = j;
                                data[0].innerHTML = j;
                            break;
                        }
                    }
                    // Sauvegarde de la session pour un rechargement ultérieur rapide
                    sessionStorage.setItem("dataStored",JSON.stringify(ajax.dataStored));
                } else {
                    console.error(xhr.statusText);
                }
            }
            document.body.style = "cursor: default;"
        };
        xhr.onerror = function(e) {
            console.error(xhr.statusText);
        };
        xhr.send(null);
    }
}
// Initialisation des variables globales et des évenements
window.addEventListener("load", function() {
    projectBtn.addEventListener("click", function() {
        // Récupération des données de session
        var datas = sessionStorage.getItem("dataStored");
        if (datas != null) {
            ajax.dataStored = JSON.parse(datas);
            var keys = Object.keys(ajax.dataStored);
            for (var key of keys) {
                document.getElementById(key).innerHTML = ajax.dataStored[key];
            }
            return;
        }
        // Lancement des divers connexion et mise à jour du dom
        ajax.Update();
    });
});
