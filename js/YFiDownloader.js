(function () {
	window.Stock = window.Stock || {};
	var onQuotesDownloadedCB = null;
	
	// " 119.13 (0.70%)"
	function parseChange(str, quote) {
		var ret = {},
		parts = str.trim().replace(/[ ,\,]/g, "").split("(");
		if (parts.length == 2) {
			ret = {};
			ret.change = parseFloat(parts[0]);
			ret.percent = parseFloat(parts[1].substr(0, parts[1].length - 2));
		}
		return ret;
	}
	function parseRange(str) {
		var ret = {},
		parts = str.trim().replace(/[ ,\,]/g, "").split("-");
		if (parts.length == 2) {
			ret = {};
			ret.low = parseFloat(parts[0]);
			ret.high = parseFloat(parts[1]);
		}
		return ret;
	}
	function toFixed(val) {
		return Math.round(val*100)/100;
	}

	function parseMSNMoney(response) {
		var el = Stock.Utils.convertToDom(response);
		if (!el) return [];


		var quote = {};
		quote.name = el.querySelector("h1 a").innerText.trim();
		var symbol = el.querySelector(".ex").innerText.replace(/[ ,(,)]/g, "").split(":");
		quote.symbol = symbol[1].replace(/\//g, ".");
		if (symbol[0])
			quote.xchange = symbol[0];
		quote.price = parseFloat(el.querySelector(".lp").innerText.trim());
		quote.change = parseFloat(el.querySelector(".chg").innerText.trim());
		quote["percent-change"] = toFixed(100*quote.change/(quote.price - quote.change));

		return [quote]
	}

	function parseDetailedView(response) {
		var quotes = [], range, change, entry,
		el = Stock.Utils.convertToDom(response);
		if (!el) return [];
			
		var entries = el.querySelectorAll(".yfi_summary_table");
		for (var i=0; i < entries.length; i++) {
			entry = entries[i];
			var quote = {};
			quote.name = entry.querySelector(".hd h2").innerText;
			var symbol = entry.querySelector(".hd p").innerText.replace(/[ ,(,)]/g, "").split(":");
			quote.symbol = symbol[1];
			if (symbol[0])
				quote.xchange = symbol[0];
			if (entry.classList.contains("type_index")) {
				var info = entry.querySelectorAll(".bd tr td");
				if (info.length == 7) {
					// 0 - price
					//quote.price = parseFloat(info[0].innerText.replace(/,/g, ""));
					// 1 - trade time
					// 2 - change
					//change = parseChange(info[2].innerText);
					//quote.change = change.change;
					//quote["percent-change"] = change.percent;
					
					// 3 - prev_close
					quote.prev_close = parseFloat(info[3].innerText.replace(/,/g, ""));
					
					// 4 - open                			
					quote.open = parseFloat(info[4].innerText.replace(/,/g, ""));
				
					// 5 - day range
					range = parseRange(info[5].innerText);
					quote.day_lo = range.low;
					quote.day_hi = range.high;
					
					// 6 - yrRange
					quote.yrRange = info[6].innerText.replace(/[ ,\,]/g, "");
					
					quote.type = "INDEX";
				}
			}
			else if (entry.classList.contains("type_mutualfund")) {
				var info = entry.querySelectorAll(".bd tr td");
				if (info.length == 5) {
					//quote.price = parseFloat(info[0].innerText.replace(/,/g, ""));
					quote.prev_close = quote.price;
					// 3 - YTD return
					quote.ytdRet = parseFloat(info[3].innerText.replace(/,/g, ""));
					// 4 - Yield ttm
					quote.yield = parseFloat(info[4].innerText.replace(/,/g, ""));
					if (entry.classList.contains("type_etf"))
						quote.type = "ETF";
					else if (entry.classList.contains("type_mutualfund"))
						quote.type = "MF";
				}
			}
			else if (entry.classList.contains("type_equity") || entry.classList.contains("type_etf")) {
				var isETF = entry.classList.contains("type_etf");
				var info = entry.querySelectorAll(".bd tr td");
				if (info.length == 16) {
					quote.price = parseFloat(info[0].innerText.replace(/,/g, ""));
					
					range = parseRange(info[1].innerText);
					quote.day_lo = range.low;
					quote.day_hi = range.high;
					quote.type = "equity";
					
					range = parseRange(info[3].innerText);
					quote.year_lo = range.low;
					quote.year_hi = range.high;
					
					//change = parseChange(info[4].innerText);
					//quote.change = change.change;
					//quote["percent-change"] = change.percent;
					
					quote.vol = parseFloat(info[5].innerText);
					
					quote.prev_close = parseFloat(info[6].innerText.replace(/,/g, ""));
					quote.open = parseFloat(info[8].innerText.replace(/,/g, ""));
					
					quote.bid = parseFloat(info[10].innerText.split("x")[0]);
					quote.ask = parseFloat(info[12].innerText.split("x")[0]);
					
					if (!isETF) {
						quote.MCap = info[9].innerText.trim();
						quote.pe = parseFloat(info[11].innerText.replace(/,/g, ""));
						quote.eps = parseFloat(info[13].innerText.replace(/,/g, ""));
						quote.YrTarEst = parseFloat(info[14].innerText.replace(/,/g, ""));
						change = parseChange(info[15].innerText);
						quote.dividend = change.change;
						quote.yield = change.percent;
					}
					else {
						quote.ytdRet = parseFloat(info[9].innerText.replace(/,/g, ""));
						quote.nav = parseFloat(info[14].innerText.replace(/,/g, ""));
						quote.yield = parseFloat(info[15].innerText);
					}
				}
			}
			else if (entry.classList.contains("type_option")) {
				var info = entry.querySelectorAll(".bd tr td");
				if (info.length == 8) {
					// No price returned here

					range = parseRange(info[3].innerText);
					quote.day_lo = range.low;
					quote.day_hi = range.high;
					quote.type = "option";
					quote.isOption = true;
															
					quote.vol = parseFloat(info[4].innerText);
					
					quote.prev_close = parseFloat(info[2].innerText.replace(/,/g, ""));
					quote.open = parseFloat(info[1].innerText.replace(/,/g, ""));
					
					quote.expiration = info[7].innerText.replace(/[ ,\,]/g, "");
					quote.strike = parseFloat(info[6].innerText.replace(/,/g, ""));


					function formatOptionName(quote, noSymbol) {
						var symbol = quote.symbol.substr(0, quote.symbol.length - 15),
							info = quote.symbol.substr(symbol.length),
							expiration = quote.expiration.split("-"),
							isPut = info.charAt(7);

						if (noSymbol)
							return [expiration[1], "'" + expiration[2]%1000, quote.strike, isPut ? "Put" : "Call" ].join(" ");
						else
							return [symbol, expiration[1], /*expiration[0], */"'" + expiration[2]%1000, quote.strike, isPut ? "P" : "C" ].join(" ");
					}
					quote.name = formatOptionName(quote);
				}
			}
			else {
				
			}
			//console.log("Parsed quote result: " + JSON.stringify(quote));
			quotes.push(quote);
		}
		return quotes;
	}
	function parseRTView(response) {
		var quotes = [], range, change, info, quote,
		el = Stock.Utils.convertToDom(response);
		if (!el) return [];

		var entries = el.querySelectorAll("table.yfi_portfolios_multiquote tr");
		console.log("Downloaded quotes for " + entries.length);
		for (var i=0; i < entries.length; i++) {
			entry = entries[i];
			quote = {};
			info = entry.querySelector("td.col-symbol a");
			if (!info) {
				if (i > 0)	// First line is the header
					console.log("Quote not found: " + entry.innerText.replace(/  /g, ""));
				continue;
			}
			
			quote.symbol = info.innerText;
							
			info = entry.querySelector("td.col-price");
			if (info) quote.price = parseFloat(info.innerText.replace(/,/g, ""));
			
			info = entry.querySelector("td.col-change");
			if (info) quote.change = parseFloat(info.innerText.replace(/,/g, ""));
			
			info = entry.querySelector("td.col-percent_change");
			if (info) quote["percent-change"] = parseFloat(info.innerText.replace(/,/g, ""));
							
			//console.log("Parsed quote result: " + JSON.stringify(quote));
			quotes.push(quote);
		}
		return quotes;
	}
	// sample
	// ETF: IVV, OPTIONS: yhoo150117c00025000, MF: fcntx
	function parseSingleQuoteView(ticker, response) {
		var isUp = false, quotes = [], range, change, info, quote = { symbol: ticker.toUpperCase()}, elInfo,
		elRoot = Stock.Utils.convertToDom(response), el;
		if (!elRoot) return null;
		el = elRoot.querySelector("#yfi_investing_content .yfi_rt_quote_summary");
		if (!el) return null;
		elInfo = el.querySelector(".time_rtq_ticker span");
		if (elInfo) quote.price = parseFloat(elInfo.innerText.replace(/,/g, ""));
		
		elInfo = el.querySelector(".time_rtq_content");
		if (elInfo) {
			change = parseChange(elInfo.innerText.replace(/,/g, ""));
			var isUp = !!elInfo.querySelector(".pos_arrow");
			quote.change = change.change * (isUp ? 1 : -1);
			quote["percent-change"] = change.percent;
		}
		
		// extract AH prices
		var lcTicker = ticker.toLowerCase();
		elInfo = el.querySelector("#yfs_l86_" + lcTicker);
		if (elInfo) quote.priceAH = parseFloat(elInfo.innerText.replace(/,/g, ""));
		elInfo = el.querySelector("#yfs_c85_" + lcTicker);
		if (elInfo) quote.changeAH = parseFloat(elInfo.innerText.replace(/[ ,\,]/g, ""));
		var isUp = elInfo && !!elInfo.querySelector(".pos_arrow");
		if (!isUp) quote.changeAH *= -1;

		elInfo = el.querySelector("#yfs_c86_" + lcTicker);
		if (elInfo) quote.percent_changeAH = parseFloat(elInfo.innerText.replace(/[(,),\,%]/g, ""));
		
		el = elRoot.querySelectorAll("#yfi_investing_content .yfi_quote_summary tr");
		// Equity
		if (el.length == 15) {
			if (el[6].innerText.indexOf("Earnings") != -1) {
				// Jul 15 - Jul 17 (Est.)
				// "22-Jul-14"
				quote.earningsDate = el[6].querySelector("td").innerText.trim();
				parseEarningsDate(quote);
			}
		}		
		
		console.log("Parsed single quote result: " + JSON.stringify(quote));
		return quote;
	}
	function parseEarningsDate(quote) {
		if (quote.earningsDate.indexOf("Est.") > 0) {
			var date = new Date(quote.earningsDate.split("-")[0] + " " + (new Date()).getFullYear());
			if (!isNaN(date.getTime())) {
				quote.earningsDateObj = date;
			}
			else {
				console.log("Error: couldn't parse earning date");
			}
		}
		else {
			var date = new Date(quote.earningsDate);
			if (!isNaN(date.getTime()))
				quote.earningsDateObj = date;
		}
	}

	function downloadDetailedQuotes(tickers) {
		var url;
		if (tickers && tickers.options.length > 0 || tickers.stocks.length > 0) {
			url = ["http://finance.yahoo.com/quotes/", tickers.stocks.join(','), ",", tickers.options.join(","), "/view/dv"].join('');
			console.log("Downloading detailed quotes.\nQuery: " + url);
			Stock.Utils.requestFileParse(url, {
				success: function(response) {
					var quotes = parseDetailedView(response);
					onQuotesDownloadedCB && onQuotesDownloadedCB(quotes);
				}
			});
		}
	}
	function downloadRTQuotes(tickers) {
		console.log("downloadRTQuotes");
		var url;
		if (tickers && tickers.options.length > 0 || tickers.stocks.length > 0) {
			url = ["http://finance.yahoo.com/quotes/", tickers.stocks.join(','), ",", tickers.options.join(","), "/view/e"].join('');
			console.log("Downloading RT quotes.\nQuery: " + url);
			Stock.Utils.requestFileParse(url, {
				success: function(response) {
					var quotes = parseRTView(response);
					onQuotesDownloadedCB && onQuotesDownloadedCB(quotes);
				}
			});
		}
		if (tickers && tickers.warrants.length > 0) {
			for (var i=0; i < tickers.warrants.length; i++) {
				var warrant = tickers.warrants[i].replace(/\./g, "%2f"),
					url = ["http://investing.money.msn.com/investments/stock-price?Symbol=", warrant].join(''),
					query = ['select * from htmlstring where url="' + url + '" and  xpath="//div[@id=\'subhead\']"'].join('');
				var requestUrl = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(query) + "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&rand=" + (new Date()).getTime();
				console.log(query);
				Stock.Utils.requestFileXHR(requestUrl, {
					success: function (response) {
						try {
							response = JSON.parse(response);
							var quotes = parseMSNMoney(response.query.results.result);
							onQuotesDownloadedCB && onQuotesDownloadedCB(quotes);
						}
						catch (e) {
						}
					}
				});
			}
		}

	}
	function downloadSingleQuote(ticker, cb) {
		console.log("downloadSingleQuote for " + ticker);
		var url;
		url = "http://finance.yahoo.com/q?s=" + ticker + "&rand=" + (new Date()).getTime();
		Stock.Utils.requestFileParse(url, {
				success: function(response) {
					var quote = parseSingleQuoteView(ticker, response);
					//onQuotesDownloadedCB && onQuotesDownloadedCB([quote]);
					cb && cb(quote );
				}
			});
		
	}
	function getTopNews(callback) {
		var query = 'select * from rss where url="http://hosted.ap.org/lineups/BUSINESSHEADS-rss_2.0.xml?SITE=NHPOR&SECTION=HOME"';
		var url = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(query) + "&format=json&rand=" + (new Date()).getTime();
		Stock.Utils.requestFileXHR(url, {
				success: function(response) {
					try {
						var news = JSON.parse(response);
						callback && callback(news.query.results.item);
					}
					catch(e) {
						
					}
				}
			});
	}

	function getNews(stock, callback) {
		var query = ['select * from rss where url="http://finance.yahoo.com/rss/headline?s=', stock.replace(/\^/gi, "%5E"),'"'].join(''),
		requestUrl = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(query)  + "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&rand=" + (new Date()).getTime();
		console.log(query);
		Stock.Utils.requestFileXHR(requestUrl, {
				success: function(response) {
					var results = null;
					try {
						var json = JSON.parse(response);
						results = json.query.results.item;
					}
					catch(e) {
					}
					callback && callback(results, stock);
				}
			});
		return false;
	}


	Stock.Downloader = { downloadDetailedQuotes: downloadDetailedQuotes,
		downloadRTQuotes: downloadRTQuotes,
		downloadSingleQuote: downloadSingleQuote,
		getTopNews: getTopNews,
		getNews: getNews,
		setCallback: function(cb) { onQuotesDownloadedCB = cb; }
	};
})();