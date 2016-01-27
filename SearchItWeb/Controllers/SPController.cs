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
        [HttpPost]
        public async Task<JsonResult> Auth(string username, string password, string url)
        {
            SPOnlineLoginHelper SPLogin = new SPOnlineLoginHelper(new Uri(url), username, password);
            SPAccessTokens accessTokens = await SPLogin.GetAccessTokens();
            return Json(accessTokens);  
        }

        [HttpPost]
        public JsonResult DigestToken(string url)
        {
            CookieContainer cookieContainer = new CookieContainer();
            HttpCookieCollection oCookies = Request.Cookies;
            
            for (int j = 0; j < oCookies.Count; j++)
            {

                HttpCookie oCookie = oCookies.Get(j);
                if (oCookie.Name != "FedAuth" && oCookie.Name != "rtFa") continue;
                Cookie oC = new Cookie();

                // Convert between the System.Net.Cookie to a System.Web.HttpCookie...
                oC.Domain = Request.Url.Host;
                oC.Expires = oCookie.Expires;
                oC.Name = oCookie.Name;
                oC.Path = oCookie.Path;
                oC.Secure = oCookie.Secure;
                oC.Value = oCookie.Value;

                cookieContainer.Add(oC);
            }
            
            SPOnlineLoginHelper SPLogin = new SPOnlineLoginHelper(new Uri(url));
            SPAccessTokens accessTokens = SPLogin.RefreshDigestToken(url, cookieContainer);
            return Json(accessTokens);
        }

        public HttpCookie CookieToHttpCookie(Cookie cookie)
    {
        HttpCookie httpCookie = new HttpCookie(cookie.Name);
        

        /*Copy keys and values*/
        foreach (string value in cookie.Value.Split('&'))
        {
            string[] val = value.Split('=');
            httpCookie.Values.Add(val[0],val[1]); /* or httpCookie[val[0]] = val[1];  */
        }
       

        /*Copy Porperties*/
        httpCookie.Domain = cookie.Domain;
        httpCookie.Expires = cookie.Expires;
        httpCookie.HttpOnly = cookie.HttpOnly;
        httpCookie.Path = cookie.Path;
        httpCookie.Secure = cookie.Secure;
        

        return httpCookie;
       

    }

    }
}