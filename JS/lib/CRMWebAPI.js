'use strict';
var CRMWebAPI;
CRMWebAPI = function (config) {
	
	
	CRMWebAPI.prototype.GetList = function (uri,QueryOptions) {
   	
	   return new Promise(function(resolve, reject) {

		var url = CRMWebAPI.prototype._BuildQueryURL(uri,QueryOptions,config);
	
		var req = CRMWebAPI.prototype._GetHttpRequest(config,"GET",url);
		
		req.onreadystatechange = function () {
			if (this.readyState == 4 /* complete */) {
				req.onreadystatechange = null;
				if (this.status == 200) 				
				{
					var data = JSON.parse(this.response, CRMWebAPI.prototype._DateReviver)
					var response = {
                        List: data.value,
						Count: 0        
              		};
					resolve(response);
				}
				else 
					reject(this);				
			}
		};
		req.send();
		
	   });
    };
	CRMWebAPI.prototype.Get = function (entityCollection,entityID,QueryOptions) {
   	
	   return new Promise(function(resolve, reject) {

		var url = CRMWebAPI.prototype._BuildQueryURL(entityCollection + "(" + entityID.ToString() + ")",QueryOptions,config);
	
		var req = CRMWebAPI.prototype._GetHttpRequest(config,"GET",url);
		
		req.onreadystatechange = function () {
			if (this.readyState == 4 /* complete */) {
				req.onreadystatechange = null;
				if (this.status == 200) 				
				{
					var data = parseInt(this.response);					
					resolve(data);
				}
				else 
					reject(this);				
			}
		};
		req.send();
		
	   });
    };
	CRMWebAPI.prototype.GetCount = function (uri,QueryOptions) {
   	
	   return new Promise(function(resolve, reject) {

		var url = CRMWebAPI.prototype._BuildQueryURL(uri +"/$count",QueryOptions,config);
	
		var req = CRMWebAPI.prototype._GetHttpRequest(config,"GET",url);
		
		req.onreadystatechange = function () {
			if (this.readyState == 4 /* complete */) {
				req.onreadystatechange = null;
				if (this.status == 200) 				
				{
					var data = JSON.parse(this.response, CRMWebAPI.prototype._DateReviver)					
					resolve(data);
				}
				else 
					reject(this);				
			}
		};
		req.send();
		
	   });
    };
    CRMWebAPI.prototype.Create = function (entityCollection,data) {
   	
	   return new Promise(function(resolve, reject) {

		var url = config.APIUrl +entityCollection;
	
		var req = CRMWebAPI.prototype._GetHttpRequest(config,"POST",url);
		
		req.onreadystatechange = function () {
			if (this.readyState == 4 /* complete */) {
				req.onreadystatechange = null;
				if (this.status == 200) 				
				{									
					resolve(this.getResponseHeader("OData-EntityId"));
				}
				else 
					reject(this);				
			}
		};
		req.send(JSON.stringify(data));
		
	   });
    };
    CRMWebAPI.prototype.Update = function (entityCollection,key,data,Upsert) {
   	
	   return new Promise(function(resolve, reject) {

		var url = config.APIUrl +entityCollection;
	
		var req = CRMWebAPI.prototype._GetHttpRequest(config,"POST",url);
		if (Upsert != null && Upsert == true)
            req.setRequestHeader("If-Match", "*");
            
		req.onreadystatechange = function () {
			if (this.readyState == 4 /* complete */) {
				req.onreadystatechange = null;
				if (this.status == 200) 				
				{		
                    var response = {
                        EntityID: this.getResponseHeader("OData-EntityId")						        
              		};							
					resolve(response);
				}
				else 
					reject(this);				
			}
		};
		req.send(JSON.stringify(data));
		
	   });
    };
    
    CRMWebAPI.prototype.Delete = function (entityCollection,entityID) {
   	
	   return new Promise(function(resolve, reject) {

		var url = config.APIUrl +entityCollection;
	
		var req = CRMWebAPI.prototype._GetHttpRequest(config,"DELETE",url);
            
		req.onreadystatechange = function () {
			if (this.readyState == 4 /* complete */) {
				req.onreadystatechange = null;
				if (this.status == 200) 				
				{		                    					
					resolve();
				}
				else 
					reject(this);				
			}
		};
		req.send(JSON.stringify(data));
		
	   });
    };
    CRMWebAPI.prototype.ExecuteFunction = function (functionName,parameters,entityCollection,entityID) {
   	
	   return new Promise(function(resolve, reject) {
		   
		var parmvars = [];
		var parmvalues = [];
		var parmcount = 1;
	
		if (parameters != null)
	   {	
			Object.keys(parameters).forEach(function (key) {
		   	var val = parameters[key];
			 parmvars.push(key + "=" + "@p" + parmcount.toString());
			 if (typeof val === 'string' || val instanceof String)
			 	parmvalues.push("@p" + parmcount.toString() + "='" + val +"'");
			 else
				parmvalues.push("@p" + parmcount.toString() + "=" + val);
			 parmcount++;
			});
	   }

		var url = "";
		if (parameters != null)
		{
			url = config.APIUrl + functionName +"("+ parmvars.join(",")+")?" +parmvalues.join("&") ;
			if (entityCollection != null)
				url = config.APIUrl + entityCollection +"(" + entityID.ToString() +functionName +"("+ parmvars.join(",") +")?" + parmvalues.join("&");
	    }
		else
		{
			url = config.APIUrl + functionName +"()";
			if (entityCollection != null)
				url = config.APIUrl + entityCollection +"(" + entityID.ToString() +functionName +"()";
		}
	
		var req = CRMWebAPI.prototype._GetHttpRequest(config,"GET",url);
		
		req.onreadystatechange = function () {
			if (this.readyState == 4 /* complete */) {
				req.onreadystatechange = null;
				if (this.status == 200) 				
				{
					var data = JSON.parse(this.response, CRMWebAPI.prototype._DateReviver)					
					resolve(data);
				}
				else 
					reject(this);				
			}
		};
		req.send();
		
	   });
    };
    CRMWebAPI.prototype.ExecuteAction = function (actionName,data,entityCollection,entityID) {
   	
	   return new Promise(function(resolve, reject) {

		var url = config.APIUrl + actionName;
        if (entityCollection != null)
            url = config.APIUrl + entityCollection +"(" + entityID.ToString() + ")"+actionName;
                    
	
		var req = CRMWebAPI.prototype._GetHttpRequest(config,"POST",url);
		
		req.onreadystatechange = function () {
			if (this.readyState == 4 /* complete */) {
				req.onreadystatechange = null;
				if (this.status == 200) 				
				{
					var data = JSON.parse(this.response, CRMWebAPI.prototype._DateReviver)					
					resolve(data);
				}
				else 
					reject(this);				
			}
		};
		req.send(JSON.stringify(data));
		
	   });
    };
    
	CRMWebAPI.prototype._BuildQueryURL = function (uri,queryOptions,config){
	
	 		var fullurl = config.APIUrl + uri;
            var firstParam = true;
            if (queryOptions != null)
            {
                if (queryOptions.Select != null)
                {

                    if (firstParam)
                        fullurl = fullurl +"?$select=" + queryOptions.Select.join(",");
                    else
                        fullurl = fullurl +"&$select=" + queryOptions.Select.join(",");
                    firstParam = false;

                }
                if (queryOptions.OrderBy != null)
                {
                    if (firstParam)
                        fullurl = fullurl +"?$orderby=" + queryOptions.OrderBy.join(",");                        
                    else
                        fullurl = fullurl +"&$orderby=" + queryOptions.OrderBy.join(",");
                    firstParam = false;

                }
                if (queryOptions.Filter != null)
                {
                    if (firstParam)
                        fullurl = fullurl + "?$filter=" + queryOptions.Filter;
                    else
                        fullurl = fullurl + "&$filter=" + queryOptions.Filter;
                    firstParam = false;
                }
                if (queryOptions.IncludeCount)
                {
                    if (firstParam)
                        fullurl = fullurl + "?$count=true";
                    else
                        fullurl = fullurl + "&$count=true";
                    firstParam = false;
                }

                if (queryOptions.Skip > 0)
                {
                    if (firstParam)
                        fullurl = fullurl + "?$skip=" + queryOptions.Skip;
                    else
                        fullurl = fullurl + "&$skip="+ queryOptions.Skip;
                    firstParam = false;
                }
                if (queryOptions.Top > 0)
                {
                    if (firstParam)
                        fullurl = fullurl + "?$top="+ queryOptions.Top;
                    else
                        fullurl = fullurl + "&$top="+ queryOptions.Top;
                    firstParam = false;
                }
                if (queryOptions.SystemQuery != null)
                {
                    if (firstParam)
                        fullurl = fullurl + "?savedQuery="+ queryOptions.SystemQuery;
                    else
                        fullurl = fullurl + "&savedQuery="+ queryOptions.SystemQuery;
                    firstParam = false;
                }
                if (queryOptions.UserQuery != null)
                {
                    if (firstParam)
                        fullurl = fullurl + "?userQuery="+ queryOptions.UserQuery;
                    else
                        fullurl = fullurl + "&userQuery="+ queryOptions.UserQuery;
                    firstParam = false;
                }
                if (queryOptions.FetchXml != null)
                {
                    if (firstParam)
                        fullurl = fullurl + "?fetchXml=" + encodeURI(queryOptions.FetchXml);
                    else
                        fullurl = fullurl + "&$fetchXml=" +encodeURI(queryOptions.FetchXml);
                    firstParam = false;
                }
            }

            return fullurl;	
	};
	
	CRMWebAPI.prototype._GetHttpRequest = function (config,method,url) {
		var req = new XMLHttpRequest();
		req.open(method, encodeURI(url), true);
		req.setRequestHeader("Authorization", "Bearer "+ config.AccessToken);
		req.setRequestHeader("Accept", "application/json");
		if (config.callerId) {
		req.setRequestHeader("MSCRMCallerID", config.callerId);
		}
		req.setRequestHeader("OData-MaxVersion", "4.0");
		req.setRequestHeader("OData-Version", "4.0");
		
		return req;
	};
	
	CRMWebAPI.prototype._DateReviver = function (key, value)
	{
		var a;
		if (typeof value === 'string') {
		a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
		if (a) {
			return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
		}
		}
		return value;	
	};
};