
YUI.add('protocol', function (Y) {
	Y.namespace('Stock');
    var Protocol = function() {
    	var _state = "loading",
    	getState = function() {
    		return _state;
    	},
    	// resp: URL redirect to: [dest]?email=[logged in Google account's email] 
    	login = function(dest) {
    		//var url = "http://stock-stalkers.appspot.com/login?dest=" + encodeURI("http://jimming.com/money-d/auth.html");
    		//createIFrame(url);
    		//window.open("http://stock-stalkers.appspot.com/login?dest=" + encodeURI(window.location.href));
    		window.location.href = "http://stock-stalkers.appspot.com/login?dest=" + window.location.href;
    		//jsonpRequest("login", {dest: dest} );
    	},
    	// resp: URL redirect to location specified by "dest" 
    	logout = function() {
    		window.location.href = "http://stock-stalkers.appspot.com/logout?dest=" + encodeURIComponent(window.location.href);
    		//jsonpRequest("logout", {dest: window.location.href} );
    	},
    	getPortfolio = function(portId) {
    		jsonpRequest("portfolio", {pfid: portId} );    		
    	},
    	getPortfolios = function() {
    		this.jsonpRequest("portfolios");    		
    	},
    	editPortfolio = function(portId, portName) {
    		jsonpRequest("editPortfolio", {pfid: portId, pfname: portName} );    	
    	},
    	// resp: { "pfid": val       // (long) ID for portfolio }
    	addPortfolio = function(portName) {
    		jsonpRequest("addPortfolio", {pfname: portName} );    		
    	},
    	deletePortfolio = function(portId) {
    		jsonpRequest("deletePortfolio", {pfid: portId} );    		
    	},
    	// Clean out all portfolio
    	deletePortfolios = function() {
    		jsonpRequest("deletePortfolios");
    	},
    	editCurrentCashBalance = function(pfid, cashamt) {
    		jsonpRequest("editCurrentCashBalance", {pfid: pfid, cashamt:cashamt});    		
    	},
    	// Resp: "stid": val
    	addStockTransaction = function (pfid, symbol, shares, price, commmission, date, note) {
    		var params = {
    				pfid: pfid, 
    				sym: symbol,
    				sttype: shares > 0 ? 0 : 1,	// BUY
    				sectype: symbol.length > 15 ? 1 : 0,
    				qty: Math.abs(parseInt(shares ? shares : 0)),
    				price: price ? price : 0,
    				comm: commmission,	
    				note: note || ""
    		};
    		if (date)
    			params.date = date;
    		jsonpRequest("addStockTransaction", params);      		
    	},
    	deleteStockTransaction = function (pfid, stid) {
    		var params = {
    				pfid: pfid, 
    				stid: stid
    		};
    		jsonpRequest("deleteStockTransaction", params); 
    	},
    	editStockTransaction = function (pfid, stid, shares, price, date, note) {
    		var params = {
    				pfid: pfid, 
    				stid: stid,
    				qty: shares,
    				price: price,
    				note: note || ""
    		};
    		if (date)
    			params.date = date;
    		jsonpRequest("editStockTransaction", params);
    	},
    	getUserPreferences = function () {
    		userPreferences();
    	},
    	userPreferences = function(newPref) {
    		jsonpRequest("userPreferences", newPref ? {setval: newPref} : {});
    	},
    	resetUser = function() {
    		jsonpRequest("resetUser");    		
    	},
        jsonpRequest = function(action, parameters) {
    		var params = "", paramName=0;
        	for (paramName in parameters) {
        		params += ["&", paramName, "=", encodeURIComponent(parameters[paramName])].join("");
        	}
        	var url = ["http://stock-stalkers.appspot.com/", action, "?callback={callback}", params].join(""),
            service = new Y.JSONPRequest(url, {
                on: {
                    success: handleJSONP,
                    failure: handleFailure,
                    timeout: handleTimeout
                },
                //format: prepareJSONPUrl,
                context: this,
                timeout: 20000,          // 20 second timeout
                args: [action, parameters] // e.g. handleJSONP(data, date, number)
            });
        	service.send();
        },
        prepareJSONPUrl = function(url, proxy, action, parameters) {
        	var params = "", paramName="";
        	for (paramName in parameters) {
        		params += ["&", paramName, "=", parameters[paramName]].join("");
        	}
        	return Y.Lang.sub(url, {
                callback: proxy,
                action: action,
                params: params
            });
        },
        handleJSONP = function(response, callbackParams0, callbackParams1) {
        	if (response && response.status) {
            	if (response.status[0] === 0) {
            		log("Server Response: " + JSON.stringify(response));
            		Y.fire("CmdResponse", response, callbackParams0, callbackParams1);        		
            	}
            	if (response.status[0] == 2) {
            		_state = "logoff";
            		Y.fire("notLogIn");
        		}
        	}
        },
        handleFailure = function(data) {
        	
        },
        handleTimeout = function(data) {
        	
        };
        return {
        	login: login,
        	logout: logout,
        	getState: getState,
        	getPortfolio: getPortfolio,
        	getPortfolios: getPortfolios,
        	editPortfolio: editPortfolio,
        	addPortfolio: addPortfolio,
        	deletePortfolio: deletePortfolio,
        	deletePortfolios: deletePortfolios,
        	addStockTransaction: addStockTransaction,
        	deleteStockTransaction: deleteStockTransaction,
        	editStockTransaction: editStockTransaction,
        	editCurrentCashBalance: editCurrentCashBalance,
        	userPreferences: userPreferences,
        	resetUser: resetUser,
        	
        	jsonpRequest: jsonpRequest,
        	prepareJSONPUrl: prepareJSONPUrl,
        	handleJSONP: handleJSONP,
        	handleFailure: handleFailure,
        	handleTimeout: handleTimeout
            };
    };
    Y.Stock.Protocol = new Protocol();

}, '1.0.0', {requires: ['json', "util"/*, 'node', "substitute",  "mcap_history"*/]});