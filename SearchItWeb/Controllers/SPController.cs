using System;
using System.Net;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SearchItWeb.DAL;
using Microsoft.SharePoint.Client;
using System.Threading.Tasks;
using System.IO;

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

            CookieContainer cookieContainer = GetRequestCookie();

            SPOnlineLoginHelper SPLogin = new SPOnlineLoginHelper(new Uri(url));
            SPAccessTokens accessTokens = SPLogin.RefreshDigestToken(url, cookieContainer);
            return Json(accessTokens);
        }



        [HttpPost]
        public JsonResult getListByTitle(string title, string spServer, string requestDigest)
        {
            var url = spServer + "/_api/lists/getbytitle('" + title + "')";
            HttpWebRequest webRequest = CreateWebRequest(url, requestDigest);

            string requestResult;
            using (WebResponse webResponse = webRequest.GetResponse())
            {
                using (StreamReader rd = new StreamReader(webResponse.GetResponseStream()))
                {
                    requestResult = rd.ReadToEnd();
                }
            }

            Console.WriteLine(requestResult);
            return Json(new { title = title, url= url, requestDigest = requestDigest });
        }





        /// <summary>
        /// Create a soap webrequest to [Url]
        /// </summary>
        /// <returns></returns>
        private HttpWebRequest CreateWebRequest(string url, string requestDigest)
        {
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(url);
            webRequest.ContentType = "application/json;odata=verbose";
            webRequest.Accept = "application/json;odata=verbose";
            webRequest.Method = "GET";
            //webRequest.Headers.Add("X-RequestDigest", requestDigest);
            webRequest.CookieContainer = GetRequestCookie();

            return webRequest;
        }


        private CookieContainer GetRequestCookie()
        {
            CookieContainer cookieContainer = new CookieContainer();
            HttpCookieCollection oCookies = Request.Cookies;

            for (int j = 0; j < oCookies.Count; j++)
            {

                HttpCookie oCookie = oCookies.Get(j);
                if (oCookie.Name != "FedAuth" && oCookie.Name != "rtFa") continue;
                Cookie oC = new Cookie();

                // Convert between the System.Net.Cookie to a System.Web.HttpCookie...
                //oC.Domain = Request.Url.Host;
                oC.Domain = new Uri("https://skydata.sharepoint.com").Host;
                oC.Expires = DateTime.Now.AddHours(1);//oCookie.Expires;
                oC.Name = oCookie.Name;
                oC.Path = oCookie.Path;
                oC.Secure = true;
                oC.HttpOnly = true;
                oC.Value = oCookie.Value;


                cookieContainer.Add(oC);
            }

            return cookieContainer;

        }
    }
}