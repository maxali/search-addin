using System;
using System.Net;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SearchItWeb.DAL;
using Microsoft.SharePoint.Client;
using System.Threading.Tasks;

namespace SearchItWeb.Controllers
{
    public class SPController : Controller
    {
        // GET: SP
        public async Task<JsonResult> Index(string username, string password, string url)
        {
            SPOnlineLoginHelper SPLogin = new SPOnlineLoginHelper(new Uri(url), username, password);
            CookieContainer cookie = await SPLogin.GetCookieContainer();

            SoapRequest soap = new SoapRequest("https://crayonsky.sharepoint.com/_vti_bin/sites.asmx", "http://schemas.microsoft.com/sharepoint/soap/GetUpdatedFormDigestInformation");
            soap.cookie = cookie;

            string digestToken = soap.CallWebService();

            Tokens token = new Tokens();
            token.cookies = cookie.GetCookies(new Uri(url));
            token.digest = digestToken;

            //return Json(cookie.GetCookies(new Uri(url)));
            return Json(token);  
        }

        private class Tokens
        {
            public string digest { get; set; }
            public CookieCollection cookies { get; set; }
        }
    }
}