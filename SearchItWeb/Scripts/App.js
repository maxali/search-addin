/* Common app functionality */

var app = (function () {
    "use strict";

    var app = window.app || {};

    // Common initialization function (to be called from each page)
    app.initialize = function () {
        app.spServer = app.spServer || "";
        app.spUsername = app.spUsername || "";
        app.spRequestDigest = app.spRequestDigest || "";

        $.support.cors = true;
        $.ajaxSetup({
            crossDomain: true,
            dataType: 'json'
        });

        if ($.fn.Pivot) { $('.ms-Pivot').Pivot(); }
        if ($.fn.SearchBox) { $('.ms-SearchBox-field').SearchBox(); }
        if ($.fn.TextField) { $('.ms-TextField').TextField(); }
        if ($.fn.Dropdown) { $('.ms-Dropdown').Dropdown(); }
        
        buildNotification();
    };

    app.getSelectedData = _getDataFromSelection;
    app.setBinding = _setBindings;
    app.addBinding = _addBinding;

    function _addBinding(bindingId) {
        Office.context.document.bindings.addFromSelectionAsync(Office.BindingType.Text, { id: bindingId }, function (result) {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                app.showNotification("Binding!", "Binding added successfully");
            } else {
                app.showNotification("Error", result.error.message);
            }
        });
    }

    function _setBindings(id, val, _coercionType) {
        var coercionType = _coercionType || Office.CoercionType.Text;
        Office.select("bindings#" + id, function () {
            console.error("Binding " + id + " not found!");
        }).setDataAsync(
          val,
          { coercionType: coercionType },
          function (asyncResult) {
              if (asyncResult.status == "failed") {
                  console.error("Action failed with error: " + asyncResult.error.message);
              } else {
                  console.log("Updated with " + val);
              }
          }
        );
    }

    function _getDataFromSelection() {
        Office.context.document.getSelectedDataAsync(Office.CoercionType.Text,
            function (result) {
                if (result.status === Office.AsyncResultStatus.Succeeded) {
                    return result.value || "";
                } else {
                    return null; //result.error.message;
                }
            }
        );
    }

    function buildNotification() {
        $('body').append(
            '<div id="notification-message">' +
                '<div class="padding">' +
                    '<div id="notification-message-close"></div>' +
                    '<div id="notification-message-header"></div>' +
                    '<div id="notification-message-body"></div>' +
                '</div>' +
            '</div>');

        
        $('#notification-message-close').click(app.hideNotification);


        // After initialization, expose a common notification function
        app.showNotification = function (header, text) {
            $('#notification-message-header').text(header);
            $('#notification-message-body').text(text);
            $('#notification-message').slideDown('fast');
        };

        app.hideNotification = function () {
            $('#notification-message').hide();
        };
    }

    return app;
})();

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}