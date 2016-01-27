using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Xml;

namespace SearchItWeb.DAL
{
    public class SoapRequest
    {
        public string url { get; set; }
        public string action { get; set; }
        public CookieContainer cookie { get; set; }

        public SoapRequest(string _url, string _action)
        {
            this.url = _url;
            this.action = _action;
        }

        /// <summary>
        /// Execute a Soap WebService call
        /// </summary>
        public string CallWebService()
        {

            XmlDocument soapEnvelopeXml = CreateSoapEnvelope();
            HttpWebRequest webRequest = CreateWebRequest(url, action);
            InsertSoapEnvelopeIntoWebRequest(soapEnvelopeXml, webRequest);

            // begin async call to web request.
            IAsyncResult asyncResult = webRequest.BeginGetResponse(null, null);

            // suspend this thread until call is complete. You might want to
            // do something usefull here like update your UI.
            asyncResult.AsyncWaitHandle.WaitOne();

            // get the response from the completed web request.
            string soapResult;
            using (WebResponse webResponse = webRequest.GetResponse())
            {
                using (StreamReader rd = new StreamReader(webResponse.GetResponseStream()))
                {
                    soapResult = rd.ReadToEnd();
                }
                return soapResult;
            }

            return null;
        }

        /// <summary>
        /// Create a soap webrequest to [Url]
        /// </summary>
        /// <returns></returns>
        private HttpWebRequest CreateWebRequest(string url, string action)
        {
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(url);
            webRequest.Headers.Add("SOAPAction", action);
            webRequest.ContentType = "text/xml;charset=\"utf-8\"";
            webRequest.Accept = "text/xml";
            webRequest.Method = "POST";
            webRequest.CookieContainer = cookie;

            return webRequest;

        }

        private static XmlDocument CreateSoapEnvelope()
        {
            XmlDocument soapEnvelop = new XmlDocument();
            soapEnvelop.LoadXml(@"<?xml version=""1.0"" encoding=""utf-8"" ?><soap:Envelope xmlns:xsi=""http://www.w3.org/2001/XMLSchema-instance"" xmlns:xsd=""http://www.w3.org/2001/XMLSchema"" xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"" ><soap:Body><GetUpdatedFormDigestInformation xmlns=""http://schemas.microsoft.com/sharepoint/soap/"" /></soap:Body></soap:Envelope>");
            return soapEnvelop;
        }

        private static void InsertSoapEnvelopeIntoWebRequest(XmlDocument soapEnvelopeXml, HttpWebRequest webRequest)
        {
            using (Stream stream = webRequest.GetRequestStream())
            {
                soapEnvelopeXml.Save(stream);
            }
        }
    }
}