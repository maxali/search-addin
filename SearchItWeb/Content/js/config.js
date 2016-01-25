//config file
var app = app || {};
app.config = app.config || {};
(function (config) {
    "use strict";

    // constants
    var SEARCH_ENDPOINT = "http://api.eniro.com/cs/search/basic";
    var SEARCH_ACCOUNT = "profile=maxali";
    var SEARCH_KEY = "key=5167130060251630243";

    // public properties
    config.searchAPI = SEARCH_ENDPOINT + "?" + SEARCH_ACCOUNT + "&" + SEARCH_KEY + "&country=no&version=1.1.3&";

})(app.config);