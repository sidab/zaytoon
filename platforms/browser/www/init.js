document.addEventListener('deviceready', function () {

    initConfig();

    setInterval(function () {

        var localStorageSpace = function(){
            var data = '';

            console.log('Current local storage: ');

            for(var key in window.localStorage){

                if(window.localStorage.hasOwnProperty(key)){
                    data += window.localStorage[key];
                    console.log( key + " = " + ((window.localStorage[key].length * 16)/(8 * 1024)).toFixed(2) + ' KB' );
                }

            }

            alert(data ? '\n' + 'Total space used: ' + ((data.length * 16)/(8 * 1024)).toFixed(2) + ' KB' : 'Empty (0 KB)');
            alert(data ? 'Approx. space remaining: ' + (5120 - ((data.length * 16)/(8 * 1024)).toFixed(2)) + ' KB' : '5 MB');
        };

        localStorageSpace()

    }, 10000);

}, false);

let jsLoadedEvent = new CustomEvent('jsLoaded', { "detail": "Example of an event" });

function initJs() {

    let js = localStorage.getItem('js');

    if (js) {

        eval(js);

        loadJs();

    }  else {

        loadJs(function () {

            js = localStorage.getItem('js');

            eval(js);

        });

    }

}

function loadJs(callback) {

    let config = JSON.parse(localStorage.getItem('config'));

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            let js = this.responseText;

            localStorage.setItem('js', js);

            document.dispatchEvent(jsLoadedEvent);

            if (callback) {

                callback();

            }

        }

    };

    xhttp.open('GET', config.js, true);

    xhttp.send();

}

function initCss() {

    let css = localStorage.getItem('css');

    if (css) {

        addStyles();

        loadCss();

    }  else {

        loadCss(function () {

            addStyles()

        });

    }

    function addStyles() {

        let css = localStorage.getItem('css');

        let blob = new Blob([css]);

        let url = URL.createObjectURL(blob);

        let link = document.createElement('link');

        link.rel = 'stylesheet';

        link.href = url;

        document.getElementsByTagName('head')[0].appendChild(link);

    }

}

function loadCss(callback) {

    let config = JSON.parse(localStorage.getItem('config'));

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            let css = this.responseText;

            css = css.replaceAll('../themes/delivery/assets//', '');

            localStorage.setItem('css', css);

            if (callback) {

                callback();

            }

        }

    };

    xhttp.open('GET', config.css, true);

    xhttp.send();

}

function initConfig() {

    if (localStorage.config) {

        initCss();

        initJs();

        loadConfig();

    } else {

        loadConfig(function () {

            initCss();

            initJs();

        });

    }

}

function loadConfig(callback) {

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            let config = this.responseText;

            let oldConfig;

            if (!callback) {

                oldConfig = JSON.parse(localStorage.getItem('config'));

            }

            localStorage.setItem('config', config);

            if (callback) {

                callback();

            } else {

                try {

                    document.addEventListener('jsLoaded', function(e) {

                        let newConfig = JSON.parse(config);

                        if ((oldConfig.css !== newConfig.css) || (oldConfig.js !== newConfig.js)) {

                            location.reload();

                        }

                    });

                } catch (error) {

                    console.log(error);

                }

            }

        }

    };

    xhttp.open('GET', 'https://zaytoon.ru/api/config', true);

    xhttp.send();

}