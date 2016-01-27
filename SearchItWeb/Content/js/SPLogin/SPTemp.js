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

    function _login(userId, password, url, successBlock, failBlock) {
        userId = "mohamed@crayonsky.onmicrosoft.com";
        password = "JaalleDheere10";
        url = "https://crayonsky.sharepoint.com";
        $.ajax({
            url: "/sp",
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
                
                $.each(result, function (index, val) {
                    var expires = result[index]["Expires"];
                    //var expire = new Date(parseInt(expires.replace("/Date(", "").replace(")/", "")));
                    setCookieLogin(result[index]["Name"], result[index]["Value"], expire);
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
        //tokenReq += '<?xml version="1.0" encoding="utf-8"?>';
        //tokenReq += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
        //tokenReq += '  <soap:Body>';
        //tokenReq += '    <GetUpdatedFormDigestInformation xmlns="http://schemas.microsoft.com/sharepoint/soap/">';
        //tokenReq += '      <url>'+siteUrl+'</url>';
        //tokenReq += '    </GetUpdatedFormDigestInformation>';
        //tokenReq += '  </soap:Body>';
        //tokenReq += '</soap:Envelope>';
        return tokenReq;
    }

    //function getSAMLRequest(userId, password, url) { 
    //    //var strSaml = "";
    //    //strSaml +=" <s:Envelope xmlns:s=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:a=\"http://www.w3.org/2005/08/addressing\" xmlns:u=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\"> "
    //    //strSaml +="   <s:Header> "
    //    //strSaml +="     <a:Action s:mustUnderstand=\"1\">http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue</a:Action> "
    //    //strSaml +="     <a:ReplyTo> "
    //    //strSaml +="       <a:Address>http://www.w3.org/2005/08/addressing/anonymous</a:Address> "
    //    //strSaml +="     </a:ReplyTo> "
    //    //strSaml +="     <a:To s:mustUnderstand=\"1\">https://login.microsoftonline.com/extSTS.srf</a:To> "
    //    //strSaml +="     <o:Security s:mustUnderstand=\"1\" xmlns:o=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\"> "
    //    //strSaml +="       <o:UsernameToken> "
    //    //strSaml +="         <o:Username>[username]</o:Username> "
    //    //strSaml +="         <o:Password>[password]</o:Password> "
    //    //strSaml +="       </o:UsernameToken> "
    //    //strSaml +="     </o:Security> "
    //    //strSaml +="   </s:Header> "
    //    //strSaml +="   <s:Body> "
    //    //strSaml +="     <t:RequestSecurityToken xmlns:t=\"http://schemas.xmlsoap.org/ws/2005/02/trust\"> "
    //    //strSaml +="       <wsp:AppliesTo xmlns:wsp=\"http://schemas.xmlsoap.org/ws/2004/09/policy\"> "
    //    //strSaml +="         <a:EndpointReference> "
    //    //strSaml +="           <a:Address>[endpoint]</a:Address> "
    //    //strSaml +="         </a:EndpointReference> "
    //    //strSaml +="       </wsp:AppliesTo> "
    //    //strSaml +="       <t:KeyType>http://schemas.xmlsoap.org/ws/2005/05/identity/NoProofKey</t:KeyType> "
    //    //strSaml +="       <t:RequestType>http://schemas.xmlsoap.org/ws/2005/02/trust/Issue</t:RequestType> "
    //    //strSaml +="       <t:TokenType>urn:oasis:names:tc:SAML:1.0:assertion</t:TokenType> "
    //    //strSaml +="     </t:RequestSecurityToken> "
    //    //strSaml +="   </s:Body> "
    //    //strSaml +=" </s:Envelope> "

    //    //var strSaml = strSaml.replace("[username]",userId);
    //    //var strSaml = strSaml.replace("[password]",password);
    //    //var strSaml = strSaml.replace("[endpoint]",url);

    //    //return strSaml;
    //}

    function setCookieLogin(cname, cvalue, exdate) {
        var d = new Date();
        var expires = "expires=" + new Date(exdate).toUTCString();
        $.cookie(cname, cvalue);
        //document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    function _search(keyword) {
        console.log('search ', keyword)
    }
})(SPTemp);