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

    function _setLists(lists) {
        SPTemp.lists = lists;
    }

    function _login(userId, password, url, successBlock, failBlock) {
        $.ajax({
            url: "https://login.microsoftonline.com/extSTS.srf",
            dataType: 'text',
            type: 'POST',
            data: getSAMLRequest(userId, password, url), 
            headers: {
                Accept : "application/soap+xml; charset=utf-8" 
            },
            success: function(result, textStatus, jqXHR) {
                var xmlDoc = $.parseXML(result); 
                var xml = $(xmlDoc);
                var securityToken = xml.find("BinarySecurityToken").text(); 
                if (securityToken.length == 0) {
                    failBlock();
                } else {


                }
                         
            },
            error: function(xhrError){
                console.log(xhrError);
            }

        });
    }

    function getSAMLRequest(userId, password, url) { 
        var strSaml = "";
        strSaml +=" <s:Envelope xmlns:s=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:a=\"http://www.w3.org/2005/08/addressing\" xmlns:u=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\"> "
        strSaml +="   <s:Header> "
        strSaml +="     <a:Action s:mustUnderstand=\"1\">http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue</a:Action> "
        strSaml +="     <a:ReplyTo> "
        strSaml +="       <a:Address>http://www.w3.org/2005/08/addressing/anonymous</a:Address> "
        strSaml +="     </a:ReplyTo> "
        strSaml +="     <a:To s:mustUnderstand=\"1\">https://login.microsoftonline.com/extSTS.srf</a:To> "
        strSaml +="     <o:Security s:mustUnderstand=\"1\" xmlns:o=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\"> "
        strSaml +="       <o:UsernameToken> "
        strSaml +="         <o:Username>[username]</o:Username> "
        strSaml +="         <o:Password>[password]</o:Password> "
        strSaml +="       </o:UsernameToken> "
        strSaml +="     </o:Security> "
        strSaml +="   </s:Header> "
        strSaml +="   <s:Body> "
        strSaml +="     <t:RequestSecurityToken xmlns:t=\"http://schemas.xmlsoap.org/ws/2005/02/trust\"> "
        strSaml +="       <wsp:AppliesTo xmlns:wsp=\"http://schemas.xmlsoap.org/ws/2004/09/policy\"> "
        strSaml +="         <a:EndpointReference> "
        strSaml +="           <a:Address>[endpoint]</a:Address> "
        strSaml +="         </a:EndpointReference> "
        strSaml +="       </wsp:AppliesTo> "
        strSaml +="       <t:KeyType>http://schemas.xmlsoap.org/ws/2005/05/identity/NoProofKey</t:KeyType> "
        strSaml +="       <t:RequestType>http://schemas.xmlsoap.org/ws/2005/02/trust/Issue</t:RequestType> "
        strSaml +="       <t:TokenType>urn:oasis:names:tc:SAML:1.0:assertion</t:TokenType> "
        strSaml +="     </t:RequestSecurityToken> "
        strSaml +="   </s:Body> "
        strSaml +=" </s:Envelope> "

        var strSaml = strSaml.replace("[username]",userId);
        var strSaml = strSaml.replace("[password]",password);
        var strSaml = strSaml.replace("[endpoint]",url);

        return strSaml;
    }



    function _search(keyword) {
        console.log('search ', keyword)
    }
})(SPTemp);