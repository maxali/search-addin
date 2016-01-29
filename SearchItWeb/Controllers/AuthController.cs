using Microsoft.SharePoint.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SearchItWeb.Controllers
{
    public class AuthController : Controller
    {
        // GET: Auth
        public JsonResult Code()
        {
            string code = "";
            //check for error
            if (Request["error"] != null)
            {
                //Redirect to error
                //return RedirectToAction("Error", "Home", new { error = Request["error"] });
            }
            
            else if (Request["code"] != null)
            {
                code = Request["code"];
            }
            return Json(new { code = code }, JsonRequestBehavior.AllowGet);
        }
    }
}