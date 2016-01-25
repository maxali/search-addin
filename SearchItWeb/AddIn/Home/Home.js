/// <reference path="../App.js" />

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
            if ($.fn.Pivot) {
                $('.ms-Pivot').Pivot();
            }
            $('.ms-SearchBox-field').keypress(startSearch);
            $('#get-data-from-selection').click(function () {
                //addBinding("ID");
                //addBinding("Name");
                //addBinding("Tel");
                addBinding($('.ms-SearchBox-field').val());
            });

            $('#filldata').click(function () {
                $.each(app.data, function (i, item) {
                    for (var prop in item) {
                        console.log(prop);
                        setBindings(prop, item[prop]);
                    }
                });

            });
        });
    };

    function startSearch(e) {
        if (e.which == 13) {
            crossDomanAjaxCall($(this).val());
        }
    }

    // Reads data from current document selection and displays a notification
    function getDataFromSelection() {
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
  
    function crossDomanAjaxCall(search) {
        $.ajax({
            url: app.config.searchAPI + "search_word="+search,
            type: 'GET',
            async: false,
        }).success(function (response) {

            fillSearchData(response.adverts, '#search-data');

        }).error(function (response) {
            app.showNotification("Error", response.statusText);
        });
    }

    function getCompany(id) {
        $.support.cors = true;

        $.ajax({
            crossDomain: true,
            url: app.config.searchAPI + "&eniro_id=" + id,
            type: 'GET',
            dataType: 'json',
            async: false,
            cache: false
        }).success(function (response) {
            var searchData = "";
            $.each(response.adverts, function () {
                searchData += "<li>" + this.companyInfo.companyName + "</li>";
                searchData += "<li><b>Address: </b></li>";
                searchData += "<li>  " + this.address.streetName + "</li>";
                searchData += "<li>  " + this.address.postCode + "</li>";
                searchData += "<li>  " + this.address.postArea + "</li>";
                searchData += "<li><b>Telefon: </b></li>";

                if (this.phoneNumbers.length > 0)
                    searchData += "<li>  " + this.phoneNumbers[0].phoneNumber + "</li>";
            });
            $('#search-data').html(searchData);

            app.showNotification("Success", response.statusText);
        }).error(function (response) {
            app.showNotification("Error", response.statusText);
        });
    }

    function addCompanyData(data) {

        Office.context.document.setSelectedDataAsync(data, { coercionType: Office.CoercionType.Html }, function (res) {
            if(res.status == "failed") {
                app.showNotification("Error", res.error.message);
            }
        });

    }

    function fillSearchData(data) {
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
        $('#search-data').html(unescape(searchData));
        $('.ms-ListItem').click(function (e) {
            addCompanyData($(this).attr('data-to-paste'));
        })
    }
    
    function setBindings(id, val) {
        Office.select("bindings#" + id, function () {
            console.log("Binding ID " + id + " not found!");
          }).setDataAsync(
          val,
          { coercionType: Office.CoercionType.Text},
          function (asyncResult) {
              if (asyncResult.status == "failed") {
                  console.log("Action failed with error: " + asyncResult.error.message);
              } else {
                  console.log("Updated with " + val);
              }
          }
        );

    }

    function addBinding(bindingId) {
        Office.context.document.bindings.addFromSelectionAsync(Office.BindingType.Text, { id: bindingId }, function (result) {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                app.showNotification("Binding!", "Binding added successfully");
            } else {
                app.showNotification("Error", result.error.message);
            }
        });
    }

})();