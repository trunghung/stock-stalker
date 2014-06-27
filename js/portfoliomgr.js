var demoDataSet = { pf_1: {   
                    "name": "Portfolio 1", 
                    "id": "pf_1",
                    "cash" : 100000,
                    //"show" : true,
                    "content": [ 
                        { symbol: 'YHOO', shares: 10, buy: "15.37", date: "1/3/2011", note: "30->35" }, 
                        { symbol: 'YHOO', shares: 20, buy: "14.37", date: "1/3/2011" },
                        { symbol: 'YHOO', shares: 30, buy: "12.70", note: "30->35" },
                        { symbol: 'MSFT', shares: 10, buy: "16.37", note: "30->35" }, 
                        { symbol: 'GOOG', shares: 257, buy: "39.35", date: "", note: "" }, 
                        { symbol: 'ORCL', shares: 1000, buy: "18.76", note: "" }, 
                        { symbol: 'AAPL', shares: 331, buy: "0", date: ""  }
                    ]
                },
                pf_2: {     
                    "name": "Portfolio 2", 
                    "id": "pf_2",
                    "cash" : 0,                 
                    "content": [
                        { symbol: 'YHOO', shares: 40, buy: "15.37", date: "1/3/2011", note: "30->35" }, 
                        { symbol: 'YHOO', shares: 50, buy: "14.37", date: "1/3/2011", note: "30->35" },
                        { symbol: 'YHOO', shares: 60, buy: "12.70", date: "1/3/2011", note: "30->35" },
                        { symbol: 'NFLX', shares: 108, buy: "92.50" , date: "", note: "" }, 
                        { symbol: 'BAC', shares: 164 , buy: "60.86" , date: "", note: "" }, 
                        { symbol: 'ORCL', shares: 1700, buy: "22", date: "", note: "" }
                    ]
                }
};

YUI.add('PortfolioManager', function (Y) {
    Y.namespace("Stock");
    var PortfolioManager = function () {
        var _this = this,
        _sp = Y.Stock.Protocol;
        _this._demoMode = false;
        _serverMode = false;
        _this._curUser = "";
        _this._suppressEvent = false;
        _this._cacheEnable = true;
        _this.portfolios = {};
        _this._isInit = false;
        _this._state = "loading";
        _this.isInit = function() {
            return this._isInit;
        };
        _this.fire = function(event, param1, param2) {
        	log("Firing event: " + event);
        	if (false == this._suppressEvent)
        		Y.fire(event, param1, param2);
        };
        _this.init = function() {
            var t = this, 
            cached;

            cached = loadLocal("settings");
            if (cached) {
            	if (cached.indices[0].indexOf("%5E") >= 0)
            		delete cached.indices;
            	for (setting in UI_SETTINGS) {
            		UI_SETTINGS[setting] = cached[setting] || UI_SETTINGS[setting];
            	}
            }

            Y.on("CmdResponse", t.onServerResponseReceived, this);
            
            t._serverMode = window.g_serverMode || getUrlParamValue("noserver") == 0;
            if (getUrlParamValue("demo") == 1 || window.g_demoOverwrite) {
                log("PortMgr: Loading sample data set ");
                t._demoMode = true;
                if (window.g_doNotUseSample != true) {
                	t.portfolios = demoDataSet;  
                	if (Y.Stock.History) {
                		Y.Stock.History.generateSampleHistory();
                	}
                }
            }
            else {
            	var curUser = readLocalStorage("currentUser");
            	if (curUser && curUser.length > 0) {
            		t._curUser = curUser;
	            	cached = loadLocal(t._curUser + "_portfolios");
	                if (cached) { 
	                    t.portfolios = cached;
	                    log("PortMgr: Load portfolio data from cache");
	                }
	                
	                // Create an artificial portfolio called "total" which aggregate all other portfolios together
	                // if it doesn't already exists
	                //delete t.portfolios["total"];
	                if (!t.portfolios["total"]) {
		                t.updateTotalPortfolio();	                	
	                }
	                log("Finished initializing portfolio mgr from cache");
	        		t._state = "ready";
	                t.fire("portfoliosReady", t.portfolios);
            	}                
            	//_sp.getPortfolios();
            }
            // BUGBUG TODO: HTN
            //Y.once("authenticate", function(){
            //	_sp.getPortfolios();
    		//});
            if (t._serverMode) {
            	_sp.getPortfolios();
            }
            else {
            	Y.Stock.portMgr._state = "ready"; 
            	Y.Stock.quoteMgr.refreshQuotes();
            }
            t._isInit = true;
        };
        _this.save = function() {
        	var t = this;
        	// Don't save if we are in demo mode
        	if (t._demoMode || t._cacheEnable == false || t._curUser.lenght == 0)
        		return;
            Y.later(2000, this, function(){
                log("PortMgr: Saving portfolios...");
                saveLocalString("currentUser", t._curUser);
                saveLocal(t._curUser + "_portfolios", this.portfolios);
                // TODO save settings separately
                saveLocal(t._curUser + "_settings", UI_SETTINGS);
            }, false);
        };    
        _this.ensureTransactionID = function() {
        	var t=this, cur=0, index=0, position, curId = 100;
        	for (cur in t.portfolios) {
                port = t.portfolios[cur];
                if (port.id !== "total") {
                    for (index in port.content) {
                        position = port.content[index];
                        position.id = curId++;
                    }
                }
            }
        };
        // Recompute the cash balance
        _this.updateTotalPortfolioCash = function() {
        	var t=this, cur=0, port, total = t.portfolios["total"];
        	total.cash = 0;	// reset it first
        	for (cur in t.portfolios) {
                port = t.portfolios[cur];
                if (port.id !== "total") {
                    total.cash += port.cash;
                }
            }
            total.cash = Math.round(total.cash);
            t.onPortChanged(t.portfolios.total, "cash");
        };
        
        // Update the Total portfolio positions
        _this.updateTotalPortfolio = function() {
            var t=this, cur=0, index=0, info, port,
            total = { "name": "All Accounts", 
                    "id": "total",
                    "cash" : 0,
                    "show" : true,
                    "content": []};
            // delete the old total porfolio first
            delete t.portfolios.total;
            for (cur in t.portfolios) {
                port = t.portfolios[cur];
                //if (port.aggregate !== false) {
                    total.cash += port.cash;
                    for (index in port.content) {
                        info = port.content[index];
                        total.content.push(Y.merge(info));
                    }
                //}
            }
            total.cash = Math.round(total.cash);
            t.portfolios.total = total;
            t.onPortChanged(t.portfolios.total);
        };
        // return the total number of shares you own in an account, if port_id is undefined, it will return from all accounts
        _this.getShareCount = function(stock, port_id) {
            var t = this, port = t.getPortfolio(port_id), i=0, info, ret = {shares: 0, lots: []};
            if (!port)
                port = t.portfolios.total;
            for(i in port.content) {
                info = port.content[i];
                if (stock == null || stock === info.symbol) {
                	ret.shares += info.shares;
                	ret.lots.push(info);
                	
                }
            }
            return ret;
        };

        _this.getNewPortId = function() {
            var t=this, key=0, id, largestId=0, idPrefix = "pf_";
            for (key in t.portfolios) {
                if (key != "total") {
                    id = parseInt(t.portfolios[key].id.slice(idPrefix.length));
                    if (id > largestId)
                        largestId = id;
                }
            }
            if (Y.Lang.isNumber(largestId)) {
                largestId++;  // increment it
                return idPrefix + largestId;
            }
        };
        _this.onServerResponseReceived = function(response, command, invokedParams) { 
        	var data = response.data,
        	t = this;
        	switch(command) {
        	case "deletePortfolios": 
        		break;
        	case "deletePortfolio":
        		alert("HN: need to implement delete port");
        		//delete t.portfolios[port_id]
        		break;
        	// TODO: deleteStockTransaction && editStockTransaction && addStockTransaction will impact cash balance, we need
        	// to set the cash amount in the response
        	case "editPortfolio": 
        		//alert("HN: need to implement editPortfolio");
        		// TODO: only need to handle error case
        		// Tell jimming to send back the old name if operation failed for edit
        		break;
        	case "editCurrentCashBalance":
        		t.updateTotalPortfolioCash();
        		break; 
        	case "addPortfolio":
        		t.addPortfolio(t.parsePortfolioJSON(data));
        		/*
        		// BUGBUG error handling	
				if (data.pfid) {            
					t.addPortfolio({name: decodeURIComponent(data.pfname), id: data.pfid, cash: data.pfcashbal, mtime:data.mtime, content: [] });
				}        		  */
        		break;
        	case "addStockTransaction":
        		if (data.stid && data.pfid) {
        			if (data.sttype == 0) {
        				t._onPurchaseTransaction(data);
	        			
        			}
        			else if (data.sttype == 1) {
        				t._onSellTransaction(data);
        			}
        		}
        		break;
        	case "editStockTransaction": 
        	case "deleteStockTransaction": 
        		if (data.pfid) {
        			port = t.portfolios[data.pfid];
        			if (port) {
        				port.cash = data.pfcashbal;
        				t.updateTotalPortfolioCash();
        				t.onPortChanged(port, "cash");        				
        			}
        		}
        		break;

        	case "portfolios":
        		t.parsePortfoliosJSON(response);
        		break;
        	//case "portfolio":
        		//t.parsePortfolioJSON(response);
        		break;
        	case "userPreferences": 
        		break;
        	case "resetUser": 
        		break;
    		default:
    			break;
        	}        	
        };
        // remove any locally cached portfolio that isn't on the list from server
        _this.cleanupDeletedPortfolios = function(porfoliosJSON) {
        	var t = this, i=0, ret = false, newPortsId = {};
        	for (i in porfoliosJSON) {
        		newPortsId[porfoliosJSON[i].pfid] = true;
        	}
        	for (i in t.portfolios) {
        		port = t.portfolios[i];
        		if ("total" !== port.id && !newPortsId[port.id]) {
        			delete t.portfolios[i];
        			ret = true;
        		}        			
        	}        	
        	return ret;
        };
        _this.parsePortfolioJSON = function(porfolioJSON) {
        	var t = this, port = null, i=0, lot, position,
    		curPort;
        	if (porfolioJSON && porfolioJSON.pfid) {
        		curPort = t.getPortfolio(porfolioJSON.pfid);
        		// if the time stamp is the same, the content would be the same as well
        		// otherwise the content changed, and we will just use the server's data
        		if (!curPort || 0 == curPort.mtime || porfolioJSON.mtime != curPort.mtime) {
	        		port = {id: porfolioJSON.pfid,
	        				name: decodeURIComponent(porfolioJSON.pfname),
	        				cash: porfolioJSON.pfcashbal,	// BUGBUG remove after server fixes decimal places
	        				mtime: porfolioJSON.mtime,
	        				content: []};
	        		for (i in porfolioJSON.lots) {
	        			lot = porfolioJSON.lots[i];
	        			if (Y.Lang.isArray(lot)) {
	        				position = {
	        							id: lot[0],
	        							date: lot[1] || "", // Date in format yyyyMMdd. Example: 20110228
	        							symbol: lot[2], 	// 
	        							sectype: lot[3], 	// Type of security: 0=EQUITY, 1=OPTION
	        							qty: lot[4] || 0, 	// Quantity bought or sold. For equity, this is number of shares. For options, this is number of contracts.
	        							shares: lot[5],	// Number of shares (can be negative). For options, this is qty * 100
	        							buy: lot[6] || 0,	// Price per share in dollars
	        							comm: lot[7],		// Commission in dollars
	        							note: decodeURIComponent(lot[8]) || ""
	        							};
	        				port.content.push(position);
	        				log(["position added", position.id, position.symbol, position.shares, position.buy, position.date, position.note].join(" "));
	        			}
	        		}
        		}
        		else {
        			log(["Port:", porfolioJSON.pfname, "-", porfolioJSON.pfid, ": didn't change. No update needed."].join(" "));        			
        		}
        	}
        	return port;
        };
        _this.parsePortfoliosJSON = function(response) {
        	var t = this, i=0, port, curPort, ports = [], portChanged = false,
        	porfoliosJSON = response.data,
        	userId = response.user.email;
        	if (t._curUser.length > 0 && t._curUser != userId) {
        		alert(["User changed from", t._curUser, "to", userId].join(" "));
    			delete t.portfolios;
        		t.portfolios = {};
        		// BUGBUG we should reload the page? what if the user id key is corrupted
        	}
        	t._curUser = userId;
        	
        	t._suppressEvent = true;
        	if (Y.Lang.isArray(porfoliosJSON)) {
        		// If the server is sending down an empty list of portfolios, remove all local portfolios
        		if (porfoliosJSON.length == 0) {
        			delete t.portfolios;
        			t.portfolios = {};
        			portChanged = true;
        		}
        		else {
	        		portChanged = t.cleanupDeletedPortfolios(porfoliosJSON);
	        		for (i in porfoliosJSON) {
	            		port = t.parsePortfolioJSON(porfoliosJSON[i]);
	            		if (port)
	            			ports.push(port);
	            	}
        		}
        	}
        	// Now compare with the local portfolios
        	for (i in ports) {
        		port = ports[i];
        		curPort = t.getPortfolio(port.id);
        		// If this portfolio doesn't exist, we will just simply add it
        		if (!curPort) {
        			t.addPortfolio(port, true);
        			portChanged = true;
        			log(["New port:", port.name, "-", port.id, ": was added."].join(" "));
        		}
        		else {
        			t.updatePortfolio(port, true);
        			portChanged = true;
        			log(["Port:", port.name, "-", port.id, ": changed & was updated."].join(" "));
        		}
        	}
        	if (portChanged) {
            	t.updateTotalPortfolio();
                log("Finished initializing portfolio mgr from server");
        	}
        	t._suppressEvent = false;
        	if (portChanged) {
        		t._state = "ready";
        		t.save();
        	}
    		t.fire("portfoliosReady", t.portfolios);
        };
        _this.addNewPortfolio = function (name) {
        	_sp.addPortfolio(name);
        };
        _this.addPortfolio  = function(portfolio, suppressTotalPortUpdate) {
            if (portfolio) {
                var t = this, id;
                if (!portfolio.id) {
                	portfolio.id = t.getNewPortId();
                }
                id = portfolio.id;
                t.portfolios[id] = portfolio; 
                t.computePortfolioSummaryInfo(portfolio);
                if (suppressTotalPortUpdate != true) {
	                t.updateTotalPortfolio();	
	                t.save();
                }
                t.fire("portAdded", portfolio);
            }
        };
        _this.renamePortfolio = function(portId, newName) {
        	var t = this, port = t.portfolios[portId];
        	if (port) {
        		port.name = newName;
            	_sp.editPortfolio(port.id, newName);
            	t.onPortChanged(port, "name");
        	}
        };
        _this.editCashBalance = function(portId, cashBal) {
        	var t = this, port = t.portfolios[portId];
        	if (port && Y.Lang.isNumber(cashBal)) {
        		port.cash = cashBal;
        		_sp.editCurrentCashBalance(port.id, cashBal);
            	t.onPortChanged(port, "cash");
        	}
        };
        _this.updatePortfolio = function(portfolio, suppressTotalPortUpdate) {
            if (portfolio && this.portfolios[portfolio.id]) {
                var t = this, old = t.portfolios[portfolio.id];
                t.portfolios[portfolio.id] = portfolio;
                delete old;

                if (suppressTotalPortUpdate != true) {
                	t.updateTotalPortfolio();
                    t.save();
                }
                // TODO need to compare to see what's dirty and send out the change flag with info
                t.onPortChanged(portfolio);
            }
        };
        _this.removePortfolio = function(port_id) {
            var t = this;
        	var port = t.portfolios[port_id];
            if (port) {
                _sp.deletePortfolio(port_id);
                t.updateTotalPortfolio();
                t.fire("portRemoved", port_id);
                log("PortMgr: Portfolio removed" + port_id);
                t.save();
                delete port;
            }
        };
        _this.addStockTransaction = function(info) {
             if (info && info.sym) {  
            	 _sp.addStockTransaction(info.portId, info.sym, info.secType, info.shares, info.price, info.comm, info.date, info.note);
            	 
     			// If we are selling a position, let's remove the position right away
            	 if (info.shares < 0 && info.positionId) {
            		 var t = this,
            		 port = t.getPortfolio(info.portId),
            		 index = t.getPositionIndex(port, info.positionId);
                     if (index >= 0) {                     	
                    	 t.removeStock(port, index, info.shares);
                     }            		 
            	 }
             }
        };
        _this._onPurchaseTransaction = function(data) {
			var t = this,
			position = {id: data.stid, symbol: data.sym, shares: data.qty, buy: data.price, date: data.date, note: data.note},
			port = t.portfolios[data.pfid];
			if (port)
				port.cash = data.pfcashbal;
	   	 	t._addPosition(data.pfid, position);
        };
        _this._onSellTransaction = function(data) {
			var t = this, port = t.portfolios[data.pfid];
			if (port) {			
				port.cash = data.pfcashbal;
				t.onPortChanged(port);
			}
        };        
        _this._addPosition = function(port_id, position) {
            var t = this, port = t.portfolios[port_id];
            if (port && position) {                
            	position.symbol = position.symbol.toUpperCase();
                port.content.push(position);
                t.updateTotalPortfolio();
                t.onPortChanged(port);
                t.save();
            }
        };
        _this.editPosition = function(info) {
            var t = this, position,
            port = t.getPortfolio(info.portId),
            index = t.getPositionIndex(port, info.positionId);
            if (index >= 0) {
            	position = port.content[index];
            	position.shares = info.shares;
            	position.price = info.price;
            	position.date = info.date;
            	position.note = info.note;
                t.updateTotalPortfolio();
                t.onPortChanged(port);
            	_sp.editStockTransaction(info.portId, info.positionId, info.shares, info.price, info.date, info.note);
            	return true;
            }
            return false;
        };
        _this.getPositionIndex = function(port, positionId) {
        	var index = -1, content;
        	if (port && positionId) {
        		content = port.content;
        		for (index in content) {
        			if (content[index].id == positionId) {
        				return index;
        			}
                }
        	}
        	return index;
        };
        _this.getPosition = function(port_id, positionId) {
        	var t = this,
        	position = {}, index,
        	port = t.getPortfolio(port_id);
			index = this.getPositionIndex(port, positionId);
        	if (index >= 0) {
        		position = port.content[index];
        	}
        	return position;
        };
        _this.removePosition = function(port_id, positionId) {
            var t = this,
            port = t.getPortfolio(port_id),
            index = t.getPositionIndex(port, positionId);
            if (index >= 0){
            	_sp.deleteStockTransaction(port_id, positionId);
            	t.removeStock(port, index);
            	return true;
            }
            return false;
        };
        _this.removeStock = function(port, index, shares) {
        	var t = this;
            if (port && index) {
            	position = port.content[index];
            	log(["PortMgr: Remove Position id:", position.id, "sym:", position.symbol, "shares:", position.shares].join(" - "));
            	// if the number of shares matches, we remove the position, otherwise we just reduce the number of shares           	 
           	 	if (Y.Lang.isUndefined(shares) || shares + position.shares == 0) {
           	 		delete port.content.splice(index, 1);
           	 	}
           	 	else {
           	 		position.shares += shares;
           	 	}
                
                t.updateTotalPortfolio();
                t.onPortChanged(port);
                t.fire("portPositionRemoved", port, position.id);
                t.save();
            }
        };
        _this.onPortChanged = function(port, param) {
        	var t = this;
        	if (param != "name") {
        		t.computePortfolioSummaryInfo(port);
        	}
        	t.fire("portUpdated", port, param);
        };
        
        _this.getPortfolioContent = function(port_id) {
            if (port_id && this.portfolios[id]) {
                return this.portfolios[id].content;
            }
            return {};
        };
        
        // Compute the summary information for a portfolio like market value, value delta, etc
        _this.computePortfolioSummaryInfo = function(port) {
            var portVal = 0, portDelta = 0, portGain = 0, stocks,
            quoteMgr = Y.Stock.quoteMgr;
            if (port) {
                if (Y.Lang.isNumber(port.cash))
                    portVal = port.cash;
                stocks = port.content;
                for (index in stocks) {
                    portVal += quoteMgr.getTagInfo(stocks[index], port.id, 'market-value');
                    portDelta += quoteMgr.getTagInfo(stocks[index], port.id, 'value-delta');
                    portGain += quoteMgr.getTagInfo(stocks[index], port.id, 'gain');
                }
                port.totalValue = portVal;
                port.dayChange = portDelta;
                port.gain = portGain;
                if (Y.Stock.History)
                	Y.Stock.History.recordPortValue(port);
            }
        };
        _this.onQuotesInfoUpdated = function() {
        	var t = this, port, cur=0;
        	for (cur in t.portfolios) {
                port = t.portfolios[cur];
                t.computePortfolioSummaryInfo(port);
        	}
        };
        _this.getPortfolios = function() {
            return this.portfolios;
        };
        _this.getPortfolio = function(port_id) {
            return this.portfolios[port_id];
        };
        _this.getPositionInfo = function(port_id, index) {
            try {
                return this.portfolios[port_id].content[index];
            }
            catch (e) {
				return -1;
            }
        };       
    };

    Y.Stock.portMgr = new PortfolioManager();
    log("PortMgr: loaded");
}, '1.0.0', {requires: ['node', 'yql', "substitute", "util", "mcap_history", "protocol", "QuoteManager"]});