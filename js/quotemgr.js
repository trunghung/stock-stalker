YUI.add('QuoteManager', function (Y) {
    Y.namespace("Stock");
    var QuoteManager = function() {
        var _this = this;
        _this.quotesInfo = {};
        _this.yqlQuery = null;
        _this.yqlNewsQuery = null;
        _this.updatingQuote = false;
        _this.quoteDownloaded = false;
        
        _this.isQuotesReady = function() {
            return _this.quoteDownloaded;
        };
        _this.getAllInfo = function(sym) {
            var t=this;
            if (sym && t.quotesInfo[sym]) {
                return Y.merge(t.quotesInfo[sym]);
            }
            return {};
        };
        _this.animateRefreshBtn = function() {
        	var t=this,
        	node = Y.one("#refreshBtn img"),
        	degree = 0, timer=0;
        	
    	    function rotate(updatingQuote) {   
    	    	if (updatingQuote != false) {
    	    		// timeout increase degrees:
        	        timer = setTimeout(function() {
        	        	degree = ++degree%360;
        	            rotate(t.updatingQuote); // loop it
        	        },20);
    	    	}
    	    	else {
    	    		degree = 0;
    	    	}
    	    	node.setStyle("-webkit-transform", 'rotate(' + degree + 'deg)');  
    	    }

        	rotate(t.updatingQuote);    
        	
        };
        _this.getInfo = function(sym, key) {
            var t=this, ret = 0;    
            if (sym && key) {
                if (key == "symbol")
                    return sym;
                if (t.quotesInfo[sym])
                    ret = t.quotesInfo[sym][key];
                else {
                    ret = 0;
                    //t.fetchQuote(sym); // TODO need to implement
                }
            }
            return ret;
        };
        _this.getFloatInfo = function(sym, key) {
            var t=this;
            var val = parseFloat(t.getInfo(sym, key));
            if (!Y.Lang.isNumber(val)) {
                val = 0;
            }
            return val;
        };
        function isNumericField(field) {            
            return field == "price" || field == "change";
        }
        _this.parseResults = function(results) {
            var i=0, field=0, quotes = results;
            if (!Y.Lang.isArray(quotes))
                quotes = [results];
            // Note: fork the process so it doens't block UI
            for (i in quotes) {
                quote = quotes[i];
                info = {};
                for (field in quote) {
                    if (isNumericField(field)) {
                        if (quote[field]) {
                            info[field] = parseFloat(quote[field]);
                            // If the value isn't valid set it to 0
                            if (!Y.Lang.isNumber(info[field])) {
                            	info[field] = 0;
                            }
                        }
                        else {
                            info[field] = 0;
                        }
                    }
                    else {
                        info[field] = quote[field];
                        //log("Quote info downloaded - " + field + ": " + info[field]);
                    }
                }               
                _this.quotesInfo[info.symbol] = info;
            }   
        };
        
        _this.onQueryResult = function(result) {
        	log("onQueryResult");
            var t=this;
            if (result && result.query && result.query.results && result.query.results.quotes ) {               
                t.parseResults(result.query.results.quotes.result);
                _this.quoteDownloaded = true;
                Y.Stock.portMgr.onQuotesInfoUpdated();
                Y.fire('quotesInfoUpdated');
                log("Quote info downloaded");
            }
            else {
                log("Error in query for stock quote " + result);
            }
            t.updatingQuote = false;
            if (t.refreshQuotesAgain) {
            	t.refreshQuotesAgain = false;
            	t.refreshQuotes();
            }
        };
        _this.onNewsQueryResult = function(results) {
                Y.fire('newsDownloaded', results);
        };
        _this.queryForNews = function(stocks, callback) {
        	if (stocks) {
	            query = ['select * from rss where url="http://finance.yahoo.com/rss/headline?s=', stocks.replace(/\^/gi, "%5E"),'"'].join('');
	            return Y.YQL(query, {
            		allowCache: false,
                    on: {
                        success: callback,
                        failure: callback
                    }
                });
        	}
        	return false;
        };
        _this.queryForTopNews = function(callback) {
            query = 'select * from rss where url="http://hosted.ap.org/lineups/BUSINESSHEADS-rss_2.0.xml?SITE=NHPOR&SECTION=HOME"';
            return Y.YQL(query, {
            		allowCache: false,
                    on: {
                        success: callback
                    }
            });
        };
        function addStock(stocks, sym, stocksAdded) {
        	if (sym === "^DJI") {
        		sym = "INDU";	// rename dow jones due to a legal restriction from yahoo API
        	}
        	if (!stocksAdded[sym]) {
        		stocks.push(sym.charAt(0) === "^" ? ("%5E" + sym.slice(1)) : sym);
        		stocksAdded[sym] = true;
        	}
        }
        _this.getStockList = function() {
            var t=this, stock=0, stocks=[], options = [], indices = UI_SETTINGS.indices,
            stocksAdded = [], sym=0;
            for (stock in indices) {
            	sym = indices[stock];
            	addStock(stocks, sym, stocksAdded);
            }
            for (sym in t.quotesInfo) {
                if (sym.length > 15) {
                    options.push(sym);
                }
                else {
                	addStock(stocks, sym, stocksAdded);
                }
            }
            return {
                stocks: stocks,
                options: options
            };
        };
        _this.getAllNews = function() {
            var t = this, info = t.getStockList(),
            stockList = info.stocks.join(',');
            t.yqlNewsQuery = t.queryForNews(stockList, t.onNewsQueryResult);
            log("New query for news");
        };
        _this.getYqlQuery = function() {
            var t=this, query, url;
            if (t.yqlQuery === null) {              
                info = t.getStockList();
                if (info.options.length > 0 || info.stocks.length > 0) {
                	url = window.location.host + window.location.pathname;
                	if (url === "localhost:8080/stock/") {
                		url = "www.jimming.com/money/";
                	}
                	query = ['use "http://', url, 'yahoo.finance.scrapper.new.xml" as MyTable; select * from MyTable where symbol in ("',         
                       	         info.stocks.join('","'), ",", info.options.join(","), '")'].join('');
                
                    log("New query for quotes: " + query);
                    t.yqlQuery = Y.YQL(query, {
                		allowCache: false,
                        on: {
                            success: Y.bind(t.onQueryResult, t),
                            failure: Y.bind(t.onQueryResult, t)
                        },
                        timeout: 50000
                    });
                }
                else {
                    _this.quoteDownloaded = true;
                    // if there isn't any quotes to retrieve just fire update now
                    Y.fire('quotesInfoUpdated');    // TODO: may need to rework this so it's more logic in a design sense
                }
            }
            return t.yqlQuery;
        };
        _this.refreshQuotes = function(rebuildQuery) {
            var t=this;
            // Make sure we are not already updating
            if (t.updatingQuote !== true) {
                if (t.yqlQuery && true !== rebuildQuery) {
                    log("Querying quotes using a cached YQL query");
                    t.yqlQuery.send();
                }
                else {
                    log("Requesting a new query");
                    t.getYqlQuery();
                }
                t.updatingQuote = true;
                t.animateRefreshBtn();
                // Reset the flag after 5 seconds
                Y.later(5000, t, function() {
                	this.updatingQuote = false;
                });
            }
            // if we are requesting to refresh quote while it's being updated
            // we will cache it and refresh again once the current one is done
            else {
            	t.refreshQuotesAgain = true;
            	log("Refresh quote in progress, will update again once finished");
            }
        };
        _this.refreshNews = function() {    
            var t=this;
            if (t.yqlNewsQuery) {
                t.yqlNewsQuery.send();
            }
            else {
                t.getYqlQuery();
            }
        };
        _this.onPortfolioContentChanged = function(port) {
            var t = this, symbol;
            // If any of the stock doesn't exist, we will just re-query the whole thing again
            for (i in port.content) {
                symbol = port.content[i].symbol;
                if (!t.quotesInfo[symbol]) {
                    delete t.yqlQuery;    // clear out the old query 
                    delete t.yqlNewsQuery;
                    t.yqlQuery = t.yqlNewsQuery = null;
                    // TODO: perhaps we should only update the new stock only but for now thsi will do
                    t.updateAllQuotesFromAccounts(true);    // We'll need to recompute the query again
                    break;
                } 
            }
        };
        _this.updateAllQuotesFromAccounts = function(rebuildQuery) {
            var t=this, i=0, j=0, port, sym, portfolios = Y.Stock.portMgr.getPortfolios();
            for (i in portfolios) {
                port = portfolios[i];
                for (j in port.content) {
                    sym = port.content[j].symbol;
                    t.quotesInfo[sym] = t.quotesInfo[sym] || {};
                }
            }
            t.refreshQuotes(rebuildQuery);
        };
        _this.init = function() {
            var t = this;
            // When there is a new stock or portfolio added, we see if there was a change to the cached stock list
            Y.on("portAdded", t.onPortfolioContentChanged, t);
            Y.on("portUpdated", t.onPortfolioContentChanged, t);
            Y.on("portfoliosReady", function() {
            	t.updateAllQuotesFromAccounts(true);
            }, t);   
            
            // Update the quotes for the first time
            // TODO need to optimize the timing
            //t.updateAllQuotesFromAccounts();
        };
        
        _this.getTagInfo = function(stockInfo, port_id, tag) {
            var t = this, 
            shares = stockInfo.shares, value = 0,
            stock = stockInfo.symbol;
            if (tag === "shares") {
                return shares ? shares : 0;
            }
            else if (tag === 'market-value') {
                if (shares != 0)
                    value = shares * t.getFloatInfo(stock, 'price');
                return value ? value : 0;
            }
            else if (tag === 'value-delta') {
                if (shares != 0)
                    value = shares * t.getFloatInfo(stock, 'change');
                return value ? value : 0;
            }
            else if (tag === 'gain') {
                if (shares != 0)
                    value = shares * (t.getInfo(stock, 'price') - stockInfo.buy);
                return value ? value : 0;
            }
            else if (tag === 'gain-percent') {
                if (shares != 0)
                    value = computeDeltaPercent(t.getTagInfo(stockInfo, port_id, 'gain'),
                            t.getTagInfo(stockInfo, port_id, 'market-value'));
                return value ? value : 0;
            }
            else if (tag === 'pf-percent') {
                if (shares != 0) {
                    var marketVal = t.getTagInfo(stockInfo, port_id, 'market-value'),
                    port = Y.Stock.portMgr.getPortfolio(port_id),
                    pfVal = port ? port.totalValue : 0;
                    value = pfVal != 0 ? (marketVal * 100 / pfVal) : "-";
                }
                return value ? value : 0;
            }
            return t.getInfo(stock, tag);
        };
        return this;
    };

    Y.Stock.quoteMgr = new QuoteManager();
    Y.Stock.quoteMgr.init();
    log("QuoteMgr: loaded");
}, '1.0.0', {requires: ['node', 'yql', "substitute", "util", "mcap_history", "protocol"]});