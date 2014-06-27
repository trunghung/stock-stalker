
YUI.add('view_portfolio', function (Y) {
    Y.namespace('Stock');
    var viewPort = function() {
        var _util = Y.Stock.util,
        _portMgr = Y.Stock.portMgr,
	   _pageId = "#view_pf",
        _mUI = Y.mUI,
        _portfolio = null, 
        _portId = null,
	   _inited = false,
        _root = Y.one(_pageId),
        _positionExpanded = false,
        _combinedStocks = null,
        _contentReady = false,
        _isPortrait = -1,
        _chartDrawPending = false,
        _render = function(port_id) { 
            // If we already rendered this portfolio on this page, no need to re-render it, just show right away
            // If the combine option changed, we should render it again
            if (_positionExpanded === UI_SETTINGS.expandPositions && port_id == _portId) {
                iui.showPageById("view_pf");
                return;
            }
            if (false === _contentReady) {
	            Y.on("contentready", function () {
	            	_contentReady = true;
	            }, _pageId);
            }
            _portId = port_id;
            _portfolio = _portMgr.getPortfolio(_portId);
            if (_root) {
	            var chart = _root.one(".chart");
	            if (chart)
	            	chart.addClass('hidden');
            }
            if (_portfolio) {
            	Y.later(0,  this, _createMarkup, true, false);
            }
            else {
            	alert("Unable to show your portfolio " + port_id);
            }
        },
        _generateCombinedStocks = function() {
        	var stocks;
        	if (!UI_SETTINGS.expandPositions) {
            	stocks = _util.consolidatePositions(_portfolio.content);
            }
            else {
            	stocks = _util.cloneArray(_portfolio.content);            	
            }
		  _positionExpanded = UI_SETTINGS.expandPositions;
		  stocks.sort(_util.stockSortFunc);
            
		  _combinedStocks = stocks;
        },
	   _getRenderContext = function() {
		  return {port: _portfolio,
				positions: _combinedStocks,
				tags: VIEWS[UI_SETTINGS.stockListView].tags,
				viewPosition: UI_SETTINGS.stockListView == "viewPosition",
				viewPerf: UI_SETTINGS.stockListView == "viewPerformance",
				getTagClass: function(chunk, context, bodies, params) {
				    switch(params.tag) {
					   case "change":
					   case "percent-change":
					   case "value-delta":
					   case "market-value":
					   case 'value-delta-percent':
					   case 'gain':
					   case 'gain-percent':
					   {
						  var tagValue = Y.Stock.quoteMgr.getTagInfo(_getPositionInfo(params.index), _portId, params.tag);
						  if (isValueNegative(tagValue)) {
							 chunk.write("negative");
						  }
						  if (VIEWS[UI_SETTINGS.stockListView].landscapeTags[params.tag]) {
							 chunk.write(" landscape_col");
						  }
						  break;
					   }
				    }
				},
				getTagValue: function(chunk, context, bodies, params) {
				    var tagValue = Y.Stock.quoteMgr.getTagInfo(_getPositionInfo(params.index), _portId, params.tag);
				    chunk.write(formatTagValue(tagValue, params.tag, false, 10));
				}};
	   },
        _createMarkup = function(navigateToPageWhenDone) {
            _mUI.showLoading();
            var  params, summary, stockList, rootInfo;
            if (_portfolio) {
			 _generateCombinedStocks();
			 var context = _getRenderContext();
			 
			 if (!_inited) {
				_inited = true;
				dust.render("view_portfolio_page", context, function(err, out){
				    _root.setContent(out);
				    _renderSummaryBlock();
				    _renderStockList();
				    bindUI();
				    _setActiveTab(UI_SETTINGS.stockListView);
				});
			 }
			 else {
				_renderSummaryBlock();
				_renderStockList();
			 }
                
                if (_portfolio.id == "total")
                	_root.addClass("total_pf");
                else
                	_root.removeClass("total_pf");
            }         
                 
            //_updateStockContent();
            _util.updatePortfolioSummaryBlocks(_portfolio);
            
            if (navigateToPageWhenDone) {
	            Y.later(200,  this, function() {
	                iui.showPageById("view_pf");
	                _mUI.hideLoading();
	            }, false);
            }
            else {
                _mUI.hideLoading();
            }
        },
        bindUI = function() {
            var t = this;
            // View Portfolio event handlers for tab navigation
            _root.one(".tabs").delegate("click", onNavTabClicked, ".tab", t);
            _root.one("#stocks_container").delegate("click", onStockEntryClicked, "tr.entry");
            _root.one(".edit_cash").on("click", function(){
            	var input = prompt("Enter cash balance"),
            	value = parseFloat(input);
            	if (input == value) {
            		Y.Stock.portMgr.editCashBalance(_portId, value);            		
            	}
            });
            _root.one(".record_buy").on("click", function(){
            	recordNewPosition(false, _portId);
            });
            _root.one(".record_sell").on("click", function(){
            	showEditTransaction(null, _portId, -1, true);
            });
            _root.one(".edit_positions").on("click", function(){
            	showEditTransaction(null, _portId);
            });            
            _root.one(".rename").on("click", function(){
            	var portName = prompt("Enter new name:");
            	if (portName != null && portName != "") {
            		Y.Stock.portMgr.renamePortfolio(_portId, portName);            		
            	}
            });
			_root.one(".delete_port").on("click", function() {
			   _portMgr.removePortfolio(_portId);
			});
            Y.on("portfoliosReady", function() {
            	_onPortChange(_portMgr.getPortfolio(_portId));
            }, t);
            Y.on("portUpdated", _onPortChange);
            Y.on("portRemoved", function(port_id) {
                if (_portId == port_id && _root.getAttribute("selected") == "true") {
                    _mUI.returnHome();
                    _removePage();
                }
            });
            Y.on("orientationChanged", _onOrientationChanged);
            Y.on("stock_history_recorded", _onStockHistoryRecorded);
            Y.on("quotesInfoUpdated", function() {
			 var delay = _util.isPageActive(_pageId) ? 10 : 500;
			 console.log(["quotesInfoUpdated: updating", _pageId, "in", delay, "ms"].join(" "));
			 Y.later(delay, this, _renderStockList);
		  });
        },
        _onPortChange = function(port) {
            // Port updated, portfolio obj may change, so we regrab it and update the stock table
            if (_portId == port.id) {
                _portfolio = _portMgr.getPortfolio(_portId);
                Y.later(0,  this, _createMarkup, false, false);
            }
        },
        _onStockHistoryRecorded = function (port) {
        	if (port.id === _portfolio.id) {
        		_showChart();
        	}
        },
        _onOrientationChanged = function(isPortrait) {
        	if (_isPortrait !== isPortrait) {
        		_isPortrait = isPortrait;
        		_showChart();
        	}
        },
        _showChart = function() {
        	if (0 && _chartDrawPending == false && _root.getAttribute("selected") == "true") {
        		_chartDrawPending = true;
        		// BUGBUG show loading screen for chart and hide it while we wait
                Y.later(500,  this, function() {
                	_util.showChart(_root, _portfolio);
		        	_chartDrawPending = false;
                }, false);
        	}
        },
        _removePage = function() {
            Y.later(1000, this, function() {
                // TODO: clean up events
                _root.remove(true);
                _portId = null;
            }, false);  
        },
        _setActiveTab = function(view) {
            var nodeNew = _root.one(['.tabs .', view].join("")),
            nodeCur = _root.all('.tabs .active');
            nodeCur.removeClass("active");
            if (nodeNew)
                nodeNew.addClass("active");
        },
        onNavTabClicked = function(e) {
            var view, target = e.currentTarget;
            e.preventDefault();
            if (_mUI.clickCheck(e) && !target.hasClass("active")) {
                view = target.getAttribute("view");
                UI_SETTINGS.stockListView = view;
                _setActiveTab(view);
                _renderStockList();
            }
        },
	   _renderSummaryBlock = function() {
		  dust.render("portfolio_summary", _portfolio, function(err, out) {
			 _root.one("#summary_container").setContent(out);
		  }); 
	   },
        _renderStockList = function() {
		  var context = _getRenderContext();
		  dust.render("portfolio_stocks_list", context, function(err, out){
			 _root.one("#stocks_container").setContent(out);
		  });
        },
        onStockEntryClicked = function(e) {
            if (_mUI.clickCheck(e)){
                var node = e.currentTarget,
                positionId = node.getAttribute("lotId"),
                symbol = node.getAttribute("sym");
                log("show stock info" + symbol);
                e.preventDefault();
                if (symbol) {
                	Y.use("view_stock", function(){
                		Y.Stock.view_stock.render(symbol, _portfolio.id, positionId);
                	});
                }
            }
        },
        _getPositionInfo = function(index) {
        	var info = {};
        	if (_combinedStocks) {
                info = _combinedStocks[index];
        	}
        	else {
        		info = _portMgr.getPositionInfo(_portId, index);
        	}
            return info;
        },      
        edit = function() {
        	// Can't edit total _portfolio
        	if (_portfolio.id != "total") {
	            Y.use("edit_portfolio", function() {
	                Y.Stock.EditPort.render(_portfolio.id);
	                Y.later(100,  this, function() {
	                    iui.showPageById("editPortfolio");
	                }, false);
	            });
        	}
        };
        
        
        return {
                render: _render,
                onEdit: edit,
                pageId: function() { return "view_pf"; }
                };
    };
    Y.Stock.viewPort = new viewPort();
    log("ViewPort: loaded");
}, '1.0.1', {requires: ['node', "PortfolioManager", "util", "templates", "home"/*, 'event', 'anim'*/]});

function addZeroIfNeeded(value, length) {
    var i;
    // convert to string
    value = value + "";
    for (i=value.length; i < length; i++) {
	    value = "0" + value;
    }
    return value;	
}
function extractTransactionInfo(node, portId) {
	var date, info = { portId: portId};
	// TODO: validate input
	var isOption = !node.hasClass("stock_trans");
	info.positionId = node.getAttribute("positionId");
	info.sym = node.one(".symbol").get("value");
	info.secType = isOption ? 1 : 0;
	info.shares = parseFloat(node.one(".shares").get("value").replace(",",""));
	info.price = parseFloat(node.one(".buy").get("value").replace(",",""));
	info.comm = parseFloat(node.one(".comm").get("value").replace(",",""));
	if (isOption) {
	    var strike_price = parseFloat(node.one(".strike_price").get("value").replace(",",""));
	    var OptionType = (node.one("#putOrCall").getAttribute("toggled") == "true") ? "P" : "C";
	    var date = node.one(".strike_date").get("value");
	    date = date.split("/");
	    // Public option is formatted as followed sym + YYMMDD + [P,C] + 8-digit stock price (to 1/1000 of a dollar accurracy)
	    info.sym = info.sym + date[2]%1000 + addZeroIfNeeded(date[0], 2) + addZeroIfNeeded(date[1], 2) + OptionType + addZeroIfNeeded(strike_price*1000, 8);
	}
	date = node.one(".date").get("value");
	date = date.split("/");
	info.date = [date[2], addZeroIfNeeded(date[0], 2), addZeroIfNeeded(date[1], 2)].join("");
	info.note = node.one(".note").get("value");
	return info;
}
function getPositionParams(isSell, portId, lotId) {
	var d = new Date, position = null,
	params = { stock_trans: "stock_trans", symbol: "", positionId: "", shares: "", buy: "", strike_price:"", expire_date: "",
		    comm: "9.99", note: "", isPut: "false"};
	params.date = [d.getMonth() + 1, d.getDate(), d.getFullYear()].join("/");
	if (portId > 0 && lotId > 0) {
		position = Y.Stock.portMgr.getPosition(portId, lotId);
		if (position) {
			params.symbol = "" || position.symbol;
			params.positionId = "" || position.id;
			params.shares = "" || position.shares;
			// No need to extract comm, price or date if we are recording a sell
			if (!isSell) {
				params.buy = "" || position.buy;
				params.comm = "" || position.comm;
				if (position.date) {
					var date = position.date + "";
					params.date = [date.substring(4, 6), date.substring(6, 8), date.substring(0, 4)].join("/");
				}
			}
			params.note = "" || position.note;
		}
	}
	return params;
}
function recordNewPosition (isSell, portId, positionId) {
	var html="", node = Y.one("#new_trans"),
	params = getPositionParams(isSell, portId, positionId);
	params.title = isSell ? "Record a Sell" : "Record a Buy"; 
	params.trans_fields = Y.Lang.substitute(templates["trans_fields"], params);
	html =  Y.Lang.substitute(templates["new_trans_dialog"], params);
	node.setContent(html);
	node.one(".content").addClass("stock_trans");
	node.one("#stockOrOptions").on("click", function(e) {
	    var toggled = e.currentTarget.getAttribute("toggled") == "true";
	    if (toggled) {
		node.one(".content").removeClass("stock_trans");
	    }
	    else {
		node.one(".content").addClass("stock_trans");
	    }
	});
	
	Y.later(100,  this, function() {
		iui.showPageById("new_trans");
		node.one(".done_btn").on("viewStock|click", function(e){
			var info = extractTransactionInfo(Y.one("#new_trans .content"), portId);
			e.preventDefault();
			if (isSell) {
				info.shares *= -1;
			}
			// TODO need to check to make sure the necessary info are present
			Y.Stock.portMgr.addStockTransaction(info);
		});
		node.one("input.symbol").on("change", function(e){
		    var target = e.currentTarget,
		    sym = target.get("value"),
		    query, yqlQuery;
		    if (sym.length > 0 && sym.length < 8) {
			query = "SELECT * FROM yahoo.finance.option_contracts WHERE symbol='"+sym+"'";
			log("Options: " + query);
			yqlQuery = Y.YQL(query, {
			    allowCache: true,
			    on: {
				success: function(result) {
				    //log(result);
				    if (result && result.query && result.query.results && result.query.results.option ) {
					var html="",i, option, options = result.query.results.option;
					if (options.lenght <= 0) {
					    alert("There are no options for " + options.symbol + ".");
					}
					else {
					    for (i in options.contract) {
						option = options.contract[i];
						html += ["<option value='", option, "'>", option, "</option>"].join("");
					    }
					}
					node.one(".strike_date").setContent(html);					
				    }
				},
				failure: function() {
				    // BUGBUG
				    alert("Can't download the list of options date");
				}
			    },
			    timeout: 50000
			});
			yqlQuery.send();
		    }
		    
		});
		node.one("select.strike_date").on("change", function(e){
		    var target = e.currentTarget,
		    date = target.get("value"),
		    sym = node.one(".symbol").get("value"),
		    query, yqlQuery;
		    if (sym.length > 0 && sym.length < 8) {
			query = ["SELECT * FROM yahoo.finance.options WHERE symbol='", sym ,"' AND expiration='", date, "'"].join("");
			log("Options: " + query);
			yqlQuery = Y.YQL(query, {
			    allowCache: true,
			    on: {
				success: function(result) {
				    //log(result);
				    if (result && result.query && result.query.results && result.query.results.optionsChain ) {
					var html="",i, option,
					optionsChain = result.query.results.optionsChain,
					symbol = optionsChain.symbol,
					expiration = optionsChain.expiration,
					options = optionsChain.option;
					if (!options || options.lenght <= 0) {
					    alert("There are no options for " + options.symbol + ".");
					}
					else {
					    /*
					     "symbol": "GOOG130622C00330000",
					    "type": "C",
					    "strikePrice": "330",
					    "lastPrice": "378.70",
					    "change": "0",
					    "changeDir": null,
					    "bid": "421.2",
					    "ask": "423.1",
					    "vol": "10",
					    "openInt": "10"
					    */
					    var OptionType = (node.one("#putOrCall").getAttribute("toggled") == "true") ? "P" : "C";
					    for (i in options) {
						option = options[i];
						if (OptionType == option.type) {
						    html += ["<option value='", option.symbol, "'>", (option.type == "C" ? "Call" : "Put"), " $", option.strikePrice, "</option>"].join("");
						}
					    }
					}
					node.one(".strike_price").setContent(html);
					
				    }
				},
				failure: function() {
				    // BUGBUG
				    alert("Can't download the list of options");
				}
			    },
			    timeout: 50000
			});
			yqlQuery.send();
		    }
		    
		});
		
	
	}, null, false);
}

function showEditTransaction(stock, portId, lotId, selectToSell) {
	var node = Y.one("#editStock"),
	_portMgr = Y.Stock.portMgr,
	position = null,
	lotsInfo= {}, lot, i=0, html = [], len = 0,
	params = {type: "edit_stock", lots_info: "", positionId: "", shares: "", buy: "", comm: "", date: "", note: "" };
	node.addClass("stock_trans");
	if (lotId >= 0) {
		position = Y.Stock.portMgr.getPosition(portId, lotId);
		len = 1;
	}
	else {
		lotsInfo = _portMgr.getShareCount(stock, portId);
		len = lotsInfo.lots.length;
	}
	
	// If there is more than 1 lot, we need to prompt the user to select which lot
	if (len > 1) {
		params.type = "multi_lots";
		for (i in lotsInfo.lots) {
			lot = lotsInfo.lots[i];
			html.push(Y.Lang.substitute(templates["edit_stock_dialog_lot"], lot));
		}

		params.lots_info = html.join("");
	}
	else {
	    if (!position)
		  position = lotsInfo.lots[0];
	    if (selectToSell && position) {
		  recordNewPosition(true, portId, position.id);
		  return;
	    }
	    else {
		  params.type = "edit_stock";		
		  if (stock)
			params.symbol = stock;
		  if (position) {
			params.symbol = "" || position.symbol;
			params.positionId = "" || position.id;
			params.shares = "" || position.shares;
			params.buy = "" || position.buy;
			if (position.comm) params.comm = position.comm;
			params.date = "" || position.date;
			params.note = "" || position.note;
		}
	    }
	}
	params.trans_fields = Y.Lang.substitute(templates["trans_fields"], params);
	html =  Y.Lang.substitute(templates["edit_stock_dialog"], params);
	node.setContent(html);
	
	Y.later(100,  this, function() {
		iui.showPageById("editStock");
		node.one("button.delete").on("viewStock|click", function(e){
			e.preventDefault();
			var node = Y.one("#editStock .content"),
			id = node.getAttribute("positionId");
			recordNewPosition(true, portId, id);
		});
		node.one(".done_btn").on("viewStock|click", function(e){
			var root = Y.one("#editStock .content"),
			info = extractTransactionInfo(root, portId);
			e.preventDefault();
			if (root.hasClass("edit_stock")) {
				Y.Stock.portMgr.editPosition(info);				
			}
		});
		// Bind the event
		node.delegate("viewStock|click", function(e){
			e.preventDefault();
			var lotId = e.currentTarget.getAttribute("positionId");
			if (selectToSell)
				recordNewPosition(true, portId, lotId);
			else
				showEditTransaction(stock, portId, lotId);
		}, ".multi", this);
	}, null, false);
}