// Copyright 2016 Malah
// This is free and unencumbered software released into the public domain.

var ajax = {
    supportedAPI: function() {
        return {
            'github': ['https://api.github.com/users/malahx', [github_repos, 'public_repos'], [github_followers, 'followers']]
        };
        //'github-repos': ['https://api.github.com/users/malahx/repos', [github_activeRepos, ]]
    },
    Update: function() {
        apis = ajax.supportedAPI();
        var keys = Object.keys(apis);
        for (api of keys) {
            ajax.Connect(api, apis[api][0]);
        }
    },
    Connect: function(api, url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function(e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var parse = JSON.parse(xhr.responseText);
                    var apis = ajax.supportedAPI();
                    var datas = apis[api];
                    for (var i = datas.length -1; i>0; i--) {
                        var data = datas[i];
                        data[0].innerHTML = parse[data[1]];
                    }
                } else {
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.onerror = function(e) {
            console.error(xhr.statusText);
        };
        xhr.send(null);
    }
}
