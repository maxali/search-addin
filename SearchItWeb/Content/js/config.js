//config file
window.app = window.app || {};
app.config = app.config || {};
(function (config) {
    "use strict";

    // constants
    var SEARCH_ENDPOINT = location.protocol + "//api.eniro.com/cs/search/basic";
    var SEARCH_ACCOUNT = "profile=maxali";
    var SEARCH_KEY = "key=5167130060251630243";

    var GOOGLE_SEARCH_ENDPOINT = "https://www.googleapis.com/customsearch/v1";
    var GOOGLE_SEARCH_ENGINE_ID = "cx=008416362366509820322:h8z60rokcve";
    var GOOGLE_SEARCH_KEY = "key=AIzaSyAFkTFovP1f5BQHu6Kr3NaaJfl-DId3T7A";

    app.searchCountry = localStorage["searchCountry"] || "no"; 
    app.imageType = localStorage["imageType"] || undefined;

    // public properties
    config.searchAPI = SEARCH_ENDPOINT + "?" + SEARCH_ACCOUNT + "&" + SEARCH_KEY + "&country=" + app.searchCountry + "&version=1.1.3&";

    config.getEndpointBySerive = function (service) {
        switch (service) {
            case "companies":
                return app.config.searchAPI;
                break;
            case "images":
                return GOOGLE_SEARCH_ENDPOINT + "?" + GOOGLE_SEARCH_ENGINE_ID + "&" + GOOGLE_SEARCH_KEY + "&country=se&version=1.1.3&";
                break;
            default:
                return "";
        }

    }


})(app.config);


/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD (Register as an anonymous module)
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch (e) { }
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (arguments.length > 1 && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
            }

            return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {},
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling $.cookie().
			cookies = document.cookie ? document.cookie.split('; ') : [],
			i = 0,
			l = cookies.length;

        for (; i < l; i++) {
            var parts = cookies[i].split('='),
				name = decode(parts.shift()),
				cookie = parts.join('=');

            if (key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };

}));
