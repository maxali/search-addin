/// <reference path="../App.js" />
/// <reference path="../../Content/js/SPLogin/SPTemp.js" />

(function () {
    "use strict";
    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();
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

            $('#login').click(function () {
                SPTemp.login("mohamed@crayonsky.onmicrosoft.com",
                    "JaalleDheere10",
                    "http://crayonsky.sharepoint.com",
                    function () {
                        console.log("Login success");
                    },
                    function () {
                        console.log("login fail");
                    })
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