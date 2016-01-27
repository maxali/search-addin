using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.SharePoint.Client;
using System.Net;
using System.Security;

namespace SearchItWeb.DAL
{
    public class SPService : IDisposable
    {
        public ClientContext context { get; set; }
        public Web web { get; set; }
        public WebInfo webinfo { get; set; }


        public SPService(string username, string password, string url)
        {
            using (ClientContext ctx = new ClientContext(url))
            {
                var securePassword = new SecureString();
                foreach (char c in password)
                {
                    securePassword.AppendChar(c);
                }

                var onlineCredentials = new SharePointOnlineCredentials(username, securePassword);
                
                ctx.Credentials = onlineCredentials;
                web = ctx.Web;
                ctx.Load(web);
                ctx.ExecuteQuery();
                //ctx.GetFormDigestDirect().DigestValue
                var authCookie = onlineCredentials.GetAuthenticationCookie(new Uri(url));
                //var fedAuthString = authCookie.TrimStart("SPOIDCRL=".ToCharArray());
                
                webinfo = new WebInfo { Title = web.Title, ErrorMessage = "", DigestInfo = authCookie.ToString() };
                
                context = ctx;
            }
        }



        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    // TODO: dispose managed state (managed objects).
                    context.Dispose();
                    
                }

                // TODO: free unmanaged resources (unmanaged objects) and override a finalizer below.
                // TODO: set large fields to null.

                disposedValue = true;
            }
        }

        // TODO: override a finalizer only if Dispose(bool disposing) above has code to free unmanaged resources.
        // ~SPService() {
        //   // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
        //   Dispose(false);
        // }

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            // Do not change this code. Put cleanup code in Dispose(bool disposing) above.
            Dispose(true);
            // TODO: uncomment the following line if the finalizer is overridden above.
            // GC.SuppressFinalize(this);
        }
        #endregion

    }

    public class WebInfo
    {
        public string ErrorMessage { get; set; }
        public string Title { get; set; }
        public string DigestInfo { get; set; }
    }
}