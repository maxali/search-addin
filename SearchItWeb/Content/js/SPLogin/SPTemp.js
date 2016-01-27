//SPTemp file
var SPTemp = SPTemp || {};
SPTemp = SPTemp || {};
(function (SPTemp) {
    "use strict";
    SPTemp.lists = "";
    var self = this;

    SPTemp.login = _login;
    SPTemp.search = _search;
    SPTemp.setLists = _setLists;
    SPTemp.getDigestToken = _getDigestToken;

    function _setLists(lists) {
        SPTemp.lists = lists;
    }
    function isSPAuthCookie(thisCookie) {
        return (thisCookie == "FedAuth" || thisCookie == "rtFa")
    }

    function _login(userId, password, url, successBlock, failBlock) {
        if(userId )
        $.ajax({
            url: "/sp/auth",
            type: 'POST',
            data: {
                username: userId,
                password: password,
                url: url
            },
            headers: {
                Accept: "application/json; charset=utf-8"
            },
            success: function (result, textStatus, jqXHR) {
                
                $.each(result.cookies, function (index, val) {
                    console.log(val["Name"]);
                    if (isSPAuthCookie(result.cookies[index]["Name"])) {
                        var expires = result.cookies[index]["Expires"];
                        var expire = new Date(parseInt(expires.replace("/Date(", "").replace(")/", "")));
                        console.log(expire);
                        setCookieLogin(result.cookies[index]["Name"], result.cookies[index]["Value"], expire);
                    }
                });

                //console.log(refreshDigestViaREST(url));
                successBlock(result)
                         
            },
            error: function(xhrError){
                failBlock(xhrError);
            }

        });
    }

    function _refreshDigestViaREST(siteFullUrl) {
        console.log("ENTERY from refreshDigestViaREST: "+ siteFullUrl);
        $.support.cors = true; // enable cross-domain query
        $.ajax({
            type: 'POST',
            data: getTokenReq,
            crossDomain: true, // had no effect, see support.cors above
            contentType: 'text/xml; charset="utf-8"',
            url: siteFullUrl + '/_api/contextinfo',
            dataType: 'xml',
            success: function (data, textStatus, result) {
                console.log(result);
                digest = $(result.responseText).find("d\\:FormDigestValue").text();
                return digest;
            },
            error: function (result, textStatus, errorThrown) {
                var response = JSON.parse(result.responseText);
                console.log(respons.error);
                if ((response.error != undefined) && (response.error.message != undefined)) {
                    console.log(response.error.message.value);
                }
            }
        });
    }


    function _getDigestToken(siteFullUrl) {
        console.log("Came get digest token");
        $.support.cors = true; // enable cross-domain query
        $.ajax({
            type: 'POST',
            data: getTokenReq,
            crossDomain: true, // had no effect, see support.cors above
            contentType: 'text/xml; charset="utf-8"',
            url: siteFullUrl + '/_vti_bin/sites.asmx',
            headers: {
                'SOAPAction': 'http://schemas.microsoft.com/sharepoint/soap/GetUpdatedFormDigestInformation',
                'X-RequestForceAuthentication': 'true',
                'Expect:': '100-continue'
            },
            dataType: 'xml',
            success: function (data, textStatus, result) {
                console.log("Sucess from DIGEST: ", result);
                return $(result.responseXML).find("DigestValue").text();
            },
            error: function (result, textStatus, errorThrown) {
                var response = JSON.parse(result.responseText);
                app.showNotification("Error", result);
                if ((response.error != undefined) && (response.error.message != undefined)) {
                    console.log(response.error.message.value);
                }
            }
        });
    }
    function getTokenReq() {
        var tokenReq = '<?xml version="1.0" encoding="utf-8"?>';
        tokenReq += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
        tokenReq += '  <soap:Body>';
        tokenReq += '    <GetUpdatedFormDigestInformation xmlns="http://schemas.microsoft.com/sharepoint/soap/" />';
        tokenReq += '  </soap:Body>';
        tokenReq += '</soap:Envelope>';
        return tokenReq;
    }


    function setCookieLogin(cname, cvalue, exdate) {
        var d = new Date();
        var expires = "expires=" + new Date(exdate).toUTCString();
        $.cookie(cname, cvalue, {expires: 30});
        //document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    function _search(keyword) {
        console.log('search ', keyword)
    }
})(SPTemp);