//import SessionStorage Shim

class Prep {

    constructor() {
        this.sessionStorageSetup();
        this.getSessionParams();
    }

    getSessionParams () {
        let sessionParams = {};
        // Prepend existing parameters from other pages, and parse in
        // order. New values from current page will override the old.
        var url = window.location.href.split('#')[0],
            getStart = url.indexOf('?'),
            paramStrings = getStart >= 0 ? url.slice(getStart + 1).split('&') : [],
            sessionParamString = window.sessionStorage.getItem('crm.session_params'),
            arr = [];
        if (sessionParamString !== null && sessionParamString.length) {
            paramStrings = sessionParamString.split('&').concat(paramStrings);
        }
        // Construct an array of key, value params.
        for (var i = 0; i < paramStrings.length; i++) {
            arr = paramStrings[i].split('=');
            // If a null value is passed, it will unset by the key
            // intentionally and will be excluded from params.
            if (typeof arr[0] !== 'undefined') {
                if (arr[0].length) {
                    if (typeof arr[1] !== 'undefined' && arr[1].length) {
                        sessionParams[decodeURIComponent(arr[0])] = decodeURIComponent(arr[1].replace('+', ' '));
                    }
                }
            }
        }
        // We now have an array of updated parameters, and can merge
        // them to a new string.
        paramStrings = [];
        for (var k in sessionParams) {
            if (sessionParams.hasOwnProperty(k)) {
                paramStrings.push(k + '=' + sessionParams[k]);
            }
        }
        // Saving the value for next page load.
        sessionParamString = paramStrings.join('&');
        window.sessionStorage.setItem('crm.session_params', sessionParamString);

        return sessionParams;
    }

    /**
     * sessionStorage polyfill
     * Modified from https://gist.github.com/m9dfukc/4187857
     */
    sessionStorageSetup() {
        if (typeof window == 'object' && typeof window.sessionStorage == 'undefined') {
            window.sessionStorage = {
                length: 0,
                setItem: function (key, value) {
                    document.cookie = key + '=' + value + '; path=/';
                    this.length++;
                },
                getItem: function (key) {
                    var keyEQ = key + '=';
                    var ca = document.cookie.split(';');
                    for (var i = 0, len = ca.length; i < len; i++) {
                        var c = ca[i];
                        while (c.charAt(0) === ' ') {
                            c = c.substring(1, c.length);
                        }
                        if (c.indexOf(keyEQ) === 0) {
                            return c.substring(keyEQ.length, c.length);
                        }
                    }
                    return null;
                },
                removeItem: function (key) {
                    this.setItem(key, '', -1);
                    this.length--;
                },
                clear: function () {
                    // Caution: will clear all persistent cookies as well
                    var ca = document.cookie.split(';');
                    for (var i = 0, len = ca.length; i < len; i++) {
                        var c = ca[i];
                        while (c.charAt(0) === ' ') {
                            c = c.substring(1, c.length);
                        }
                        var key = c.substring(0, c.indexOf('='));
                        this.removeItem(key);
                    }
                    this.length = 0;
                },
                key: function (n) {
                    var ca = document.cookie.split(';');
                    if (n >= ca.length || isNaN(parseFloat(n)) || !isFinite(n)) {
                        return null;
                    }
                    var c = ca[n];
                    while (c.charAt(0) === ' ') {
                        c = c.substring(1, c.length);
                    }
                    return c.substring(0, c.indexOf('='));
                }
            };
        }
    }
}

export default Prep;
