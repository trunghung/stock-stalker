
YUI.add('view_stock', function (Y) {
    Y.namespace('Stock');
    var viewStock = function() {
        var _util = Y.Stock.util,
        _quoteMgr = Y.Stock.quoteMgr,
        _portMgr = Y.Stock.portMgr,
        _mUI = Y.mUI,
        _stock = null, 
        _portId = null,
        _positionId = null,
        _root = null,
        _positionTabInited = false,
        _render = function(stock, portId, positionId) {
            _stock = stock;
            _portId = portId;
            _positionId = positionId;
            _positionTabInited = false;
            log("view_stock: show stock info: " + stock);
            var info = _util.getOrCreatePageNode("view_stock", view_stock_page);
            _root = info.node;
            Y.later(0, this, createMarkup, false);
        },
        _onNewsFeedDownloaded = function(results) {
			if (results.query && results.query.results.item)
				Y.Stock.News.parseReceivedNewsFeed(_root.one(".news_container"), 4, results.query.results.item);
        },
        createMarkup = function() {
            var info = getInfo();
            if (_root) {
                _root.setContent(Y.Lang.substitute(template_view_stock, info));
                _quoteMgr.queryForNews(_stock, _onNewsFeedDownloaded);   // Show only 4 news headlines initially
                // OPTIMIZE: we can try to do once per portfolio view
                _root.setAttribute("button", _portId === "total" ? "" : "edit_btn");
            }
            Y.later(100,  this, function() {
                iui.showPageById("view_stock");
                _bindUI();
            }, false);
        },
        _onPortfolioUpdated = function() {
        	var node = Y.one("#editStock"), positionInfo;
    		if (!node || node.getAttribute("selected") != "true") {
        		positionInfo = _portMgr.getShareCount(_stock, _portId);
        		// If there is no position left, we should go back to the portfolio page
        		if (positionInfo.lots.length == 0) {
        			Y.Stock.viewPort.render(_portId);  
        		}
    		}
        },
        _bindUI = function() {
        	Y.detach("viewStock|*");	// clean up old events
        	Y.on("viewStock|portUpdated", _onPortfolioUpdated, this);
        	// P1: BUGBUG: in YUI 3.2, this stops working categories
        	_root.one(".nav_tabs").delegate("viewStock|click", _onNavTabClicked, ".tab", this); 
        	_root.one(".chart_range").delegate("viewStock|click", _onChartRangeClicked, ".tab", this);
        	Y.on("viewStock|editClicked", _onEditClicked);
        },
        _onEditClicked = function(pageId){
    		if ("view_stock" == pageId) {
    			showEditTransaction(_stock, _portId);
    		}
    	},
        _onChartRangeClicked = function(e) {
            var view, target = e.currentTarget, 
            root = target.ancestor(".tabs");
            e.preventDefault();
            if (_mUI.clickCheck(e) && !target.hasClass("active")) {
                view = target.getAttribute("view");
                _setChartRange(view);
                var nodeNew = root.one(['[view="', view, '"]'].join("")),
                nodeCur = root.all('.active');
                nodeCur.removeClass("active");
                if (nodeNew)
                    nodeNew.addClass("active");
            }
        },
        _setChartRange = function(range) {
        	var url;
        	if (range === "1d")
        		url = ["http://chart.finance.yahoo.com/b?s=", _stock, "&lang=en-US&region=US"].join("");
        	else if (range === "5d")
        		url = ["http://chart.finance.yahoo.com/w?s=", _stock, "&lang=en-US&region=US"].join("");
        	else
        		url = ["http://chart.finance.yahoo.com/c/", range, "/y/", _stock, "?lang=en-US&region=US"].join("");
        	_root.one(".viewChart .chart").set("src", url);
        	
        },
        _onNavTabClicked = function(e) {
            var view, target = e.currentTarget;
            e.preventDefault();
            if (_mUI.clickCheck(e) && !target.hasClass("active")) {
                view = target.getAttribute("view");
                _setActiveTab(target.ancestor(".tabs"), view);
                if (view === "viewChart") {
                	_setChartRange("5d");
                }
                else if (view === "viewLots") {
                	_changeLotContent(_portId);
                }
            }
        },
        _generateLotMarkup = function(lots, portName, templateId) {
        	var index=0, lot, params, html = [];
        	for (index in lots) {          
        		lot = lots[index];
        		if (lot.symbol == _stock) {
        			params = {
        					id: lot.id,
        					symbol: lot.symbol, 
        					buy: formatTagValue(lot.buy, "price"),
        					shares: lot.shares,
        					date: lot.date || "",
        					port_name: portName || ""
        					};
        			html.push(Y.Lang.substitute(templates[templateId], params));
        		}
            }
        	return html.join("");
        },
        _changeLotContent = function(portId) {
        	var port = _portMgr.getPortfolio(portId), 
        	params, htmlLots=[];
        	if (port) {            	
            	htmlLots = _generateLotMarkup(port.content, port.name, "position_item");
        		params = {
        				port_id: port.id, 
        				port_name: port.name,
        				lots: htmlLots
        				};
        		html = Y.Lang.substitute(templates["position_item_container"], params);
            	
            }
        	_root.one(".viewLots .lots .content").setContent(html);
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
        getInfo = function() {
            var i=0, field, info = _quoteMgr.getAllInfo(_stock),
            requiredFields = ["shares", "eps", "pe", "year_hi", "year_lo", "day_hi", "day_lo", "open", "MCap", "bid", "ask", 
                              "price", "change", "percent-change", "vol", "positive", "symbol", "name"],
            positionInfo = _portMgr.getShareCount(_stock, _portId);
            info.total_shares = positionInfo.shares;
            info.lots_count = positionInfo.lots.length;
                        
            info.positive = info.change < 0 ? "negative" : "positive";
            for (i in requiredFields) {
                field = requiredFields[i];
                info[field] = formatTagValue(info[field], field) || "N/A";
            }
            return info;
        };
        return {
                render: _render,
                pageId: function() { return "view_stock"; }
                };
    };
    Y.Stock.view_stock = new viewStock();
    log("ViewStock: loaded");
}, '1.0.1', {requires: ["node", "PortfolioManager", "substitute", "util", "news", "templates"/*, 'event', 'anim'*/]});

