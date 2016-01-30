//search file
var app = app || {};
app.search = app.search || {};
(function () {
    "use strict";
    var self = this;
    //declarations
   
    app.search.crossDomainAjaxCall = _crossDomainAjaxCall;
    app.search.getCompanyById = _getCompany;
    app.search.setInHtml = _setInHtml;

    // functions

    function _crossDomainAjaxCall(search) {
        // target tab fetched from selected tab
        var targetTab = $('.tab.selected > .data');
        targetTab.html("");
        var search_word = ((app.currentTab != "images") ? "search_word=" : "searchType=image&q=") + search;
        
        var searchAction = app.currentTab;
        var apiUrl = app.config.getEndpointBySerive(searchAction) + search_word;
        $.ajax({
            url: apiUrl,
            type: 'GET',
            async: false,
        }).success(function (response) {
            var responseData = response.items || response.adverts;

            if (responseData.length > 0) {
                app.hideNotification();

                $(targetTab).html(unescape(_buildSearchDataUI(responseData)));
                $('.ms-ListItem').click(function (e) {
                    _setInHtml($(this).attr('data-to-paste'));
                })
                $('.img-wrap img').click(function (e) {
                    var img = $(this).parent().html().replace("<img", "<img  width=\"50%\" height=\"50%\"  ");
                    Office.context.document.setSelectedDataAsync(img, { coercionType: Office.CoercionType.Html }, function (res) {
                        if (res.status == "failed") {
                            app.showNotification("Error", res.error.message);
                        }
                    });
                });
            }
            else
                app.showNotification("Not found!", "No data found! Try searching again.");

        }).error(function (response) {
            app.showNotification("Error", response.statusText);
        });
    }

    function _buildSearchDataUI(data) {

        switch (app.currentTab) {
            case "images":
                return _buildImagesUI(data);
                break;
            case "companies":
                return _buildCompanyInfoUI(data);
                break;
        }

    }

    function _buildImagesUI(data) {
        var searchData = "<div class='image-list'>";

        $.each(data, function (i, item) {
            searchData += "<div class='img-wrap'><img src='" + this.link + "'/></div>" //image.thumbnailLink

        });
        searchData += "</div>"
        return searchData;

    }

    function _getCompany(id) {
        $.support.cors = true;

        $.ajax({
            crossDomain: true,
            url: app.config.searchAPI + "&eniro_id=" + id,
            type: 'GET',
            dataType: 'json',
            async: false,
            cache: false
        }).success(function (response) {
            return response.adverts;
        }).error(function (response) {
            app.showNotification("Error", response);
        });
    }

    function _setInHtml(data) {

        Office.context.document.setSelectedDataAsync(data, { coercionType: Office.CoercionType.Html }, function (res) {
            if (res.status == "failed") {
                app.showNotification("Error", res.error.message);
            }
        });

    }

    function _buildCompanyInfoUI(data) {
        var searchData = "";

        $.each(data, function () {
            if (this.companyInfo.companyName != 'undefined') {
                var dataToPaste = "";
                dataToPaste += this.companyInfo.companyName + "<br>";
                dataToPaste += this.address.streetName + ", <br>" + this.address.postCode + " " + this.address.postArea + "<br>";
                if (this.phoneNumbers.length > 0)
                    dataToPaste += "Tel:  " + this.phoneNumbers[0].phoneNumber;

                searchData += "<div class='ms-ListItem' data-to-paste=\"" + escape(dataToPaste) + "\" style='padding-left:0px; border-left: 0;' data-id=" + this.eniroId + "> ";
                searchData += "<span class='ms-ListItem-primaryText'>" + this.companyInfo.companyName;
                searchData += "</span> <span class='ms-ListItem-secondaryText'>" + this.address.postArea;
                searchData += "</span> <span class='ms-ListItem-tertiaryText'>";
                searchData += this.address.streetName + ", " + this.address.postCode + " " + this.address.postArea;
                if (this.phoneNumbers.length > 0)
                    searchData += "<br>Tel: " + this.phoneNumbers[0].phoneNumber;

                searchData += "</span> <span class='ms-ListItem-metaText'></span> ";
                searchData += "<div class='ms-ListItem-actions'> ";
                searchData += "<div class='ms-ListItem-action'></div> ";
                searchData += "<div class='ms-ListItem-action'></div> ";
                searchData += "<div class='ms-ListItem-action'></div> ";
                searchData += "<div class='ms-ListItem-action'></div> ";
                searchData += "</div> ";
                searchData += "</div> ";

            }
        });
        searchData += "<div st></div>"
        
        return searchData;
    }
})();