// Copyright 2016 Malah
// This is free and unencumbered software released into the public domain.

var ajax = {
    supportedAPI: function() {
        return {
            'github': ['https://api.github.com/users/malahx', [github_repos, 'public_repos'], [github_followers, 'followers']],
            'github-repos': ['https://api.github.com/users/malahx/repos', [github_activeRepos, 'foreach', '', 'updated_at', 'date']]
        };
        //'spacedock': ['https://spacedock.info/api/user/malah', [spacedock_mods, 'count', 'mods'], [spacedock_followers, 'foreach', 'mods', 'followers'], [spacedock_downloads, 'foreach', 'mods', 'downloads']]
    },
    Update: function() {
        document.body.style = "cursor: wait;"
        apis = ajax.supportedAPI();
        var keys = Object.keys(apis);
        for (api of keys) {
            ajax.Connect(api, apis[api][0]);
        }
    },
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
                    for (var i = datas.length -1; i>0; i--) {
                        var data = datas[i];
                        if (data.length == 2) {
                            data[0].innerHTML = parse[data[1]];
                            continue;
                        }
                        switch (data[1]) {
                            case 'count':
                                data[0].innerHTML = parse[data[2]].length;
                            break;
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
                                data[0].innerHTML = j;
                            break;
                        }
                    }
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
window.addEventListener("load", function() {
    projectBtn.addEventListener("click", function() {
        ajax.Update();
    });
});
