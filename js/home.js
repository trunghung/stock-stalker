YUI.add('home', function (Y) {
    Y.namespace('Stock');
    var homePage = function() {
        var _util = Y.Stock.util,
        _root = null,
        _prefetching = true,
        _isPortrait = -1,
        _chartDrawPending = false,
        _lastTopNewsUpdatedTime = -1,
        _mUI = Y.mUI,
        _render = function() {
            _root = Y.one("#home");
            
            log("Home: rendering");
            _insertPortfolioSummaries();          
            setTimeout(scrollTo, 100, 0, 1);
            bindUI();
            _getTopNews();

            _renderFeatureBlocks();
            Y.later(1000, this, _updatePortfolioSummaryBlocks, false);
        },
        _insertPortfolioSummaries = function() {
            var cur=0, portfolios = Y.Stock.portMgr.getPortfolios();
            _root.one("#portfolio_summaries").setContent("");
        	addPortSummaryToHomePage(portfolios["total"]);
            
            for (cur in portfolios) {
                if (cur != "total") {
                    addPortSummaryToHomePage(portfolios[cur]);
                }
            } 
            if (Y.Stock.quoteMgr.isQuotesReady()) {
            	onQuotesUpdated();
            }
            
        },
        _getTopNews = function(force) {
        	var date = new Date(),
        	hour = date.getHours();
        	if (_lastTopNewsUpdatedTime == -1 || _lastTopNewsUpdatedTime != hour) { 
        		_lastTopNewsUpdatedTime = hour;
        		Y.Stock.quoteMgr.queryForTopNews(_onTopNewsDownload);
        	}
        },
        _getPortSummaryNode = function(port_id) {
            return _root.one(['#portfolio_summaries .port_summary[port_id="', port_id,'"]'].join(''));
        },
        addPortSummaryToHomePage = function (port) {
            if (port && port.show !== false) {
                var summary = _getSummaryBlockMarkup(port, !UI_SETTINGS.hideHomeSumCash, !UI_SETTINGS.hideHomeSumGain, true),
                nodeHome = _root.one("#portfolio_summaries"),   
                nodeCur = _getPortSummaryNode(port.id);
                
                // If it exists, no need to insert it again
                if (!nodeCur) {      
                    nodeHome.append(summary);
                }
            }
        },
        _initFeatureBlock = function(slot, symbol, shares, name, noPrefix) {
        	var html, node = _root.one(".feature_blocks .slot_" + slot);
        	if (node) {
        		html = Y.Lang.substitute(templates["feature_block"], {symbol: symbol, shares: shares, name: name, noPrefix: noPrefix===true ? "true" : "false"});
	        	node.setContent(html);
        	}
        },
        _renderFeatureBlocks = function() {
	        _initFeatureBlock(0, UI_SETTINGS.indices[0], 1, INDICES[UI_SETTINGS.indices[0]], true);
	        _initFeatureBlock(1, UI_SETTINGS.indices[1], 1, INDICES[UI_SETTINGS.indices[1]], true);
	        _initFeatureBlock(2, "", 1, "Big Mover...");
	        _initFeatureBlock(3, "", 1, "Big Mover...");
	        _initFeatureBlock(4, "", 1, "Big Mover...");
	        _initFeatureBlock(5, "", 1, "Big Mover...");
        },
        _updateFeatureBlock = function() {
        	var feature_blocks = _root.one(".feature_blocks").all(".feature_block div.entry");
        	feature_blocks.each(function(node) {
        		var symbol, shares, stockInfo, price, change, changePercent, name;
        		symbol = node.getAttribute("stock");
        		shares = node.getAttribute("shares");
        		noPrefix = node.getAttribute("noPrefix");
        		if (symbol.length == 0) 
        			node.addClass("hidden");
        		else
        			node.removeClass("hidden")
            	stockInfo = { shares: shares, symbol: symbol};
            	price = formatTagValue(Y.Stock.quoteMgr.getTagInfo(stockInfo, null, "market-value"), "market-value", noPrefix=="true");
            	change = formatTagValue(Y.Stock.quoteMgr.getTagInfo(stockInfo, null, "value-delta"), "value-delta", noPrefix=="true");
            	changePercent = formatTagValue(Y.Stock.quoteMgr.getTagInfo(stockInfo, null, "percent-change"), "percent-change");
            	
        		Y.Stock.util.updateNegativePositive(node.one(".content"), change);
            	
            	node.one(".price").setContent(price);
            	node.one(".change").setContent(change);
            	if (changePercent.length == 0) 
            		changePercent = "0";
            	node.one(".percent-change").setContent("("+changePercent+")");
            });
        	
        },
        _updatePortfolioSummaryBlocks = function() {
        	var portfolios = Y.Stock.portMgr.getPortfolios(), cur=0;
        	for (cur in portfolios) {
                _util.updatePortfolioSummaryBlocks(portfolios[cur]);
            }
        },
        onQuotesUpdated = function () {
        	_updatePortfolioSummaryBlocks();
        	var positions = _util.consolidatePositions(Y.Stock.portMgr.getPortfolio("total").content, true);
        	positions.sort(_util.stockSortFuncByChange);
        	var len = positions.length,
        	position = positions[0];
            _initFeatureBlock(2, position.symbol, position.shares, position.symbol);
            if (len >= 2) {
            	position = positions[1];
            	_initFeatureBlock(3, position.symbol, position.shares, position.symbol);
            }
            if (len >= 4) {
            	position = positions[2];
            	_initFeatureBlock(4, position.symbol, position.shares, position.symbol);
            }
            if (len >= 4) {
            	position = positions[3];
            	_initFeatureBlock(5, position.symbol, position.shares, position.symbol);
            }            	
            _updateFeatureBlock();
            Y.later(500, this, _getTopNews, false);
        },
        onPortfolioAdded = function (port) {
            if (port) {
                // Put in the markup
                addPortSummaryToHomePage(port);

                // Update the summaries and stock table
                _util.updatePortfolioSummaryBlocks(port);   
            }
        },
        onPortfolioRemoved = function (portId) {
            if (portId) {
                var nodePortSum = _getPortSummaryNode(portId);
                if (nodePortSum) {
                    nodePortSum.remove(true);
                    log("Home: Remove summary module for " + portId);
                }
            }
        },
        onPortfolioUpdated = function (port) {
            if (port) {
                // Update the summaries and stock table
                _util.updatePortfolioSummaryBlocks(port);   
            }
        },
        bindUI = function () {
        	var node;
            Y.on('quotesInfoUpdated', onQuotesUpdated);
            Y.on("portAdded", onPortfolioAdded);
            Y.on("portUpdated", onPortfolioUpdated);
            Y.on("portRemoved", onPortfolioRemoved);
            Y.on("portfoliosReady", _insertPortfolioSummaries);
            
            Y.on('quotesInfoUpdated', function() {
                Y.all(".quote_update").setContent(Y.Stock.util.getLocalTime());
            });
            _root.one(".newPort").on("click", function(){
            	var portName = prompt("Enter your new portfolio's name:");
            	if (portName != null && portName != "") {
            		Y.Stock.portMgr.addNewPortfolio(portName);            		
            	}
            });
            _root.one("#portfolio_summaries").delegate("click", function(e) {
                if (Y.mUI.clickCheck(e)) {
                    e.preventDefault();
                    Y.use("view_portfolio", function() {
                        var portId = e.currentTarget.getAttribute("port_id");
                        Y.Stock.viewPort.render(portId, Y.one("#viewPortfolio"));
                    });
                }
            }, ".port_summary");
            Y.on("orientationChanged", _onOrientationChanged);
            Y.on("quotesInfoUpdated", function() {
            	Y.later(500, this, _showChart, false);
            });
            _root.one(".logout").on("click", Y.Stock.Protocol.logout);
            
            node = _root.one(".tabs");
            if (node)
            	node.delegate("click", _onNavTabClicked, ".tab", this);
            
            _root.one(".feature_blocks").delegate("click", onStockEntryClicked, ".feature_block .entry");            
        },
        onStockEntryClicked = function(e) {
            if (_mUI.clickCheck(e)){
                var node = e.currentTarget,
                stock = node.getAttribute("stock");
                log("show stock info" + stock);
                e.preventDefault();
                if (stock) {
                	Y.use("view_stock", function(){
                		Y.Stock.view_stock.render(stock, "total");
                	});
                }
            }
        },
        _onNavTabClicked = function(e) {
        	var view, target = e.currentTarget;
            e.preventDefault();
            if (_mUI.clickCheck(e) && !target.hasClass("active")) {
                view = target.getAttribute("view");
                _setActiveTab(target.ancestor(".tabs"), view);
                if (view == "viewChart")
                	_showChart();
            }
        },
        _setActiveTab = function(root, view) {
        	var nodeNew = root.one(['.', view].join("")),
            nodeCur = root.all('.active'),
            newTab = _root.one(['div.', view].join("")),
            curActiveTabs = _root.all('div.active');
            curActiveTabs.removeClass("active");
            nodeCur.removeClass("active");
            if (nodeNew)
                nodeNew.addClass("active");
            if (newTab)
            	newTab.addClass("active");
        },
        _onStockHistoryRecorded = function (port) {
        	if (port.id === "total") {
        		_showChart();
        	}
        },
        _onOrientationChanged = function() {
        	var isPortrait = Y.mUI.getIsPortrait();
        	if (_isPortrait !== isPortrait) {
        		_isPortrait = isPortrait;
        		_showChart();
        	}
        },
        _showChart = function() {
        	if (_chartDrawPending == false && _root.getAttribute("selected") == "true" && _root.one(".viewChart").hasClass("active")) {
        		_chartDrawPending = true;
        		// BUGBUG show loading screen for chart and hide it while we wait
                Y.later(500,  this, function() {
                	_util.showChart(_root, Y.Stock.portMgr.getPortfolio("total"));
		        	_chartDrawPending = false;
                }, false);
        	}
        },
        _onTopNewsDownload = function(results) {
        	Y.use("news", function(Y){
            	Y.Stock.News.parseReceivedNewsFeed(_root.one(".news_container"), 10, results);
        	});
        },
        _getSummaryBlockMarkup = function(port, showCash, showGain, clickable) {
            var param = {
                        port_id: port.id, 
                        port_name: port.name, 
                        market_value: "",
                        gain: "",
                        value_delta: "",
                        classes: (showCash ? "" : "hide_cash ") + (showGain ? "" : "hide_gain"),
                        clickable: clickable ? 'onclick=""' : ''
                        },
            templateSum = templates["home_account_summary"];
            summary = Y.Lang.substitute(templateSum, param);
            return summary;
        };
        
        // Once the quotes are downloaded, we will start pre-fetching modules, one module at a time
        if (_prefetching) {
	        Y.on('quotesInfoUpdated', function() {
	        	Y.use("view_portfolio", "news", function() {
	        		Y.use("view_stock", function() {});
	        	});
	        	
	        });
        }
            
        return {
                render: _render,
                pageId: function() { return "home"; },
                getSummaryBlockMarkup: _getSummaryBlockMarkup
                };
    };
    Y.Stock.home = new homePage();
    log("Home: loaded");
}, '1.0.0', {requires: ["iui", "node", "PortfolioManager", "util", "templates", "mUI"]});
