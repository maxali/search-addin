/// <reference path="../App.js" />
/// <reference path="../Content/js/SPLogin/SPTemp.js" />

(function () {
    "use strict";
    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();
            $("#sharepoint-server").val(Office.context.document.settings.get('sharepoint-server'));
            $("#user-name").val(Office.context.document.settings.get('sharepoint-username'));

            app.data = [
                { "ID": 1, "Name": "Mr Hakin Andrin", "Tel": "95330558" },
                { "ID": 2, "Name": "Mr Sharepoint Office", "Tel": "98554855" }
            ];

            /**
            Home.html event handlers
            **/
            var elSearch = $('.ms-SearchBox-field');
            elSearch.keypress(function (e) {
                if (e.which == 13) {
                    app.search.crossDomainAjaxCall($(this).val());
                }
            });

            $('#get-data-from-selection').click(function () {
                app.addBinding(elSearch.val());
            });
            $('#getDigest').click(function () {
                SPTemp.getDigestToken("https://crayonsky.sharepoint.com");
            });
            $('#login').click(function () {
                $(this).attr("value", "Working ...");
                SPTemp.login(
                    $("#user-name").val(),
                    $("#password").val(),
                    $("#sharepoint-server").val(),
                    function () {
                        Office.context.document.settings.set('sharepoint-server', $("#sharepoint-server").val());
                        Office.context.document.settings.set('sharepoint-username', $("#user-name").val());
                        Office.context.document.settings.saveAsync(function (asyncResult) {
                            if (asyncResult.status == Office.AsyncResultStatus.Failed) {
                                console.log('Settings save failed. Error: ' + asyncResult.error.message);
                            } else {
                                console.log('Settings saved.');
                            }
                        });
                        $(this).attr("value", "You are in!");
                        app.showNotification("Success", "Login success");
                    },
                    function () {
                        $(this).attr("Login");
                        app.showNotification("Error", "login fail");
                    })
            });

            $('#checkLogin').click(function () {
                var cookie = getCookie('FedAuth');
                console.log(cookie);
                $(this).html(cookie);
            });

            $('.ms-Pivot-link').click(function () {
                //build tab-ing view
                var targetTab = $('#tab-' + $(this).attr('data-tab-target'));
                $('.pivot-tabs .tab').removeClass('selected');
                targetTab.addClass('selected');

                // bind click to action
                if (!targetTab.hasClass('no-search') && elSearch.val().length > 0)
                    app.search.crossDomainAjaxCall(elSearch.val());
            });

            $('#filldata').click(function () {
                $.each(app.data, function (i, item) {
                    for (var prop in item) {
                        app.setBinding(prop, item[prop]);
                    }
                });
            });


        });
    };
})();