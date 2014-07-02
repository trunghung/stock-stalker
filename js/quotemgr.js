YUI.add('QuoteManager', function (Y) {
    Y.namespace("Stock");
    var QuoteManager = function() {
        var _this = this;
        _this.quotesInfo = {};
		_this.earnings = {};
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
		
        _this.parseResults = function(quotes) {
            var i=0, field=0;
            
            // Note: fork the process so it doens't block UI
            for (i in quotes) {
                quote = quotes[i];
				if (!_this.quotesInfo[quote.symbol])
					_this.quotesInfo[quote.symbol] = {};
				info = _this.quotesInfo[quote.symbol];
				for (field in quote)
					info[field] = quote[field];
				if (quote.earningsDate && (!_this.earnings[quote.symbol] || _this.earnings[quote.symbol].date != quote.earningsDate)) {
					_this.earnings[quote.symbol] = { date: quote.earningsDate, lastUpdated: (new Date()).getTime()};
					localStorage.setItem("earnings", JSON.stringify(_this.earnings));
				}
            }   
        };
        
        _this.onQueryResult = function(quotes) {
        	log("onQueryResult");
            var t=this;
            if (quotes && quotes.length > 0) { 
                _this.quoteDownloaded = true;
                Y.Stock.portMgr.onQuotesInfoUpdated();
                Y.fire('quotesInfoUpdated');
                log("Quote info downloaded");
            }
            else {
                log("Error in query for stock quote " + quotes);
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
        
        function addStock(stocks, sym, stocksAdded) {
        	/*if (sym === "^DJI") {
        		sym = "INDU";	// rename dow jones due to a legal restriction from yahoo API
        	}*/
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
			Y.fire('newsDownloaded', this.news);
        };
		var _lastFullFetch = 0;
		_this.downloadQuotes = function() {
			var t=this, query, url, yqlQuery;   
			info = t.getStockList();
			
			if (info.options.length > 0 || info.stocks.length > 0) {
				var downloaded = 1;
				Stock.Downloader.setCallback(function(results) {
					t.parseResults(results.quotes);
					downloaded++;
					if (downloaded >= 2) {
						t.onQueryResult(results.quotes);
					}
					if (results.news.length > 0) {
						t.news = results.news;
						Y.fire('newsDownloaded', this.news);
					}
				});
				Stock.Downloader.downloadRTQuotes(info);
				// do a full fetch once an hour
				if (!_lastFullFetch || (new Date()).getTime() - _lastFullFetch.getTime() > 3600000) {
					_lastFullFetch = new Date();
					downloaded = 0;
					Stock.Downloader.downloadDetailedQuotes(info);
				}
			}
			else {
				_this.quoteDownloaded = true;
				// if there isn't any quotes to retrieve just fire update now
				Y.fire('quotesInfoUpdated');    // TODO: may need to rework this so it's more logic in a design sense
			}
		}
        _this.refreshQuotes = function(rebuildQuery) {
            var t=this;
            // Make sure we are not already updating
            if (t.updatingQuote !== true) {
                t.downloadQuotes();
				//t.getYqlQuery();
                t.updatingQuote = true;
                t.animateRefreshBtn();
                // Reset the flag after 5 seconds
                Y.later(10000, t, function() {
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
				t.downloadQuotes();
                //t.getYqlQuery();
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
			function parseEarningsDate(quote) {
				if (quote.earningsDate.indexOf("Est.") > 0) {
					var date = new Date(quote.earningsDate.split("-")[0] + " " + (new Date()).getFullYear());
					if (!isNaN(date.getTime())) {
						quote.earningsDateObj = date;
						quote.earningsDateEst = true;
					}
					else {
						console.log("Error: couldn't parse earning date");
					}
				}
				else {
					var date = new Date(quote.earningsDate);
					if (!isNaN(date.getTime())) {
						quote.earningsDateObj = date;
						quote.earningsDateEst = false;
					}
				}
			}
			function timeToUpdateEarnings(quote, lastUpdated) {
				var now = new Date();
				// If it's an estimate or the time is in the past
				if (quote.earningsDateEst || !quote.earningsDateObj || (quote.earningsDateObj && quote.earningsDateObj.getTime() < now.getTime())) {
					// As we get closer to the earning estimate date, we will check more frequently
					var timeDiff = 0, checkInterval = 2419200000;
					if (quote.earningsDateObj) {
						timeDiff = quote.earningsDateObj.getTime() - now.getTime();
						// check every day if the earning is less than 2 weeks away
						if (timeDiff < 2419200000)
							checkInterval = 24*60*60*1000;
						else
							checkInterval = timeDiff/4;
					}
					return (checkInterval - (now.getTime() - lastUpdated));
				}
				return 1;
			}
			var cachedEarnings = JSON.parse(localStorage.getItem("earnings"));
			if (cachedEarnings) {
				_this.earnings = cachedEarnings;
				var quotes = [];
				for (var sym in _this.earnings) {
					var earning = _this.earnings[sym];
					var quote = {symbol: sym, earningsDate: earning.date };
					parseEarningsDate(quote);
					// Update the earnings info once a week or if the date is in the past
					var timeToUpdate = timeToUpdateEarnings(quote, earning.lastUpdated);
					if (timeToUpdate > 0) {
						quotes.push(quote);
						console.log("Earnings: Time to update: " + sym + " : " + Math.round(timeToUpdate/(24*60*60*1000)) + "days");
					}
					else {
						delete _this.earnings[sym];	 // clear it from cache
						console.log("Clear outdated earnings date for " + sym);
					}
				}
				_this.parseResults(quotes);
			}
            
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
    log("QuoteMgr: loaded");
}, '1.0.0', {requires: ['node', 'yql', "substitute", "util", "mcap_history", "protocol"]});