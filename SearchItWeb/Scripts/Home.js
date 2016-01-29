/// <reference path="../Content/js/SPLogin/SPTemp.js" />
/// <reference path="App.js" />

(function () {
    "use strict";
    
    app.addinHome = app.addinHome || {};
    var self = app.addinHome;

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();
            app.addinHome.init();
        });
    }

    app.addinHome.init = function () {
        /**
        Home.html event handlers
        **/
        $('.ms-SearchBox-field').keypress(self.searchOnEnter);
        $('#login').click(self.SPLogin);
        $('.ms-Pivot-link').click(self.changePivotTab);
        $('#filldata').click(self.fillAllBindings);
        $('#getList').click(self.getList);

        $("#sharepoint-server").val(Office.context.document.settings.get('sharepoint-server'));
        $("#user-name").val(Office.context.document.settings.get('sharepoint-username'));

        self.data = [
            { "ID": 1, "Name": "Mr Hakin Andrin", "Tel": "95330558" },
            { "ID": 2, "Name": "Mr Sharepoint Office", "Tel": "98554855" }
        ];

    };

    (function () {

        var _searchOnEnter = function (e) {
            if (e.which == 13) {
                app.search.crossDomainAjaxCall($(this).val());
            }
        };

        var _SPLogin = function (e) {
            e.preventDefault();
            e.stopPropagation();
            var loginBtn = $(this);

            $(loginBtn).addClass('sending');

            app.spServer = $("#sharepoint-server").val();
            app.spUsername = $("#user-name").val();

            SPTemp.login(
                app.spUsername,
                $("#password").val(),
                app.spServer,
                function (result) {
                    app.spRequestDigest = result.requestDigest;
                    $(loginBtn).removeClass('sending').addClass("success");
                    $('#sharepoint-login').hide();
                    $('#sharepoint-workspace').show();


                },
                function (e) {
                    console.log(e);
                    $(loginBtn).removeClass('success').removeClass('sending');
                }
            );
        };

        var _fillAllBindings = function () {
            $.each(app.data, function (i, item) {
                for (var prop in item) {
                    app.setBinding(prop, item[prop]);
                }
            });
        };

        var _changePivotTab = function () {
            //build tab-ing view
            var targetTab = $('#tab-' + $(this).attr('data-tab-target'));
            $('.pivot-tabs .tab').removeClass('selected');
            targetTab.addClass('selected');

            // bind click to action
            if (!targetTab.hasClass('no-search') && $('.ms-SearchBox-field').val().length > 0)
                app.search.crossDomainAjaxCall($('.ms-SearchBox-field').val());
        };

        var _getList = function (e) {
            
            e.preventDefault();
            e.stopPropagation();
            //launch the popup
            var url = "https://skydata.sharepoint.com";
            if (url.charAt(url.length) != '/')
                url += '/';
            $.cookie("mySignalId", "SIGNAL21908", { expires: 30 });
            //build a redirect URI
            var clientId = "883c9455-9332-4934-a3f5-b11ecbf9827f";
            var redirect = encodeURI("https://localhost:44300/auth/code");
            //url += "_layouts/15/OAuthAuthorize.aspx?IsDlg=1&client_id=883c9455-9332-4934-a3f5-b11ecbf9827f&scope=list.read&response_type=code&redirect_uri=";
            //url += redirect;
            window.open(
                url +
                "/_layouts/15/oauthauthorize.aspx?IsDlg=1&signalme=maxali&client_id=" + clientId +
                "&scope=List.Read&response_type=code&redirect_uri=" + redirect, "", "width=720, height=300, scrollbars=0, toolbar=0, menubar=0, status=0, titlebar=0");

            //showModal()
            /*
            $.ajax({
                url: "/sp/getListByTitle",
                type: 'POST',
                data: {
                    title: $('#list-title').val(),
                    url: app.spServer,
                    requestDigest: app.spRequestDigest
                },
                headers: {
                    Accept: "application/json; charset=utf-8"
                },
                success: function (result, textStatus, jqXHR) {

                    console.log(result);

                },
                error: function (xhrError) {
                    console.log(xhrError);
                }

            });*/

        }

        self.changePivotTab = _changePivotTab;
        self.fillAllBindings = _fillAllBindings;
        self.SPLogin = _SPLogin;
        self.searchOnEnter = _searchOnEnter;
        self.getList = _getList;
    })();

})();