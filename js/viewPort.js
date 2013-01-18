
YUI.add('view_portfolio', function (Y) {
    Y.namespace('Stock');
    var viewPort = function() {
        var _util = Y.Stock.util,
        _portMgr = Y.Stock.portMgr,
        _mUI = Y.mUI,
        _portfolio = null, 
        _portId = null,
        _root = null,
        _positionExpanded = false,
        _combinedStocks = null,
        _contentReady = false,
        _isPortrait = -1,
        _chartDrawPending = false,
        _render = function(port_id){ 
            // If we already rendered this portfolio on this page, no need to re-render it, just show right away
            // If the combine option changed, we should render it again
            if (_positionExpanded === UI_SETTINGS.expandPositions && port_id == _portId) {
                iui.showPageById("view_pf");
                return;
            }
            if (false === _contentReady) {
	            Y.on("contentready", function () {
	            	_contentReady = true;
	            }, "#view_pf");
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
            
        	if (_combinedStocks) delete _combinedStocks;
        	_combinedStocks = stocks;
        },
        _createMarkup = function(navigateToPageWhenDone) {
            _mUI.showLoading();
            var  params, summary, stockList, rootInfo;
            if (_portfolio) {
                summary = Y.Stock.home.getSummaryBlockMarkup(_portfolio, true, true, false);
                _generateCombinedStocks();	// Generated the stock view
                stockList = generateStockListMarkup(_portfolio, UI_SETTINGS.stockListView);
                params = { port_id: _portfolio.id, port_name: _portfolio.name, summary: summary, stocks: stockList, pf_type: ""};
                // OPTIMIZE: Change the view_stock page to show edit button or not
                /*var nodeViewStock = Y.one("#view_stock");
                if (nodeViewStock)
                	nodeViewStock.setAttribute("button", _portfolio.id === "total" ? "" : "edit_btn");
				*/
                // If the view portfolio page isn't up, we will insert the template
                rootInfo = _util.getOrCreatePageNode("view_pf", Y.Lang.substitute(templates["view_portfolio_page"], params));
                _root = rootInfo.node;
                if (rootInfo.created) {                    
                    bindUI();
                    _setActiveTab(UI_SETTINGS.stockListView);
                }
                else {
                    _root.one("#summary_container").setContent(summary);
                    _root.one("#stocks_container").setContent(stockList);
                }
                if (_portfolio.id == "total")
                	_root.addClass("total_pf");
                else
                	_root.removeClass("total_pf");
            }         
                 
            _updateStockContent();
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
            Y.on("quotesInfoUpdated", function(){
            	_updateStockContent();
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
        	if (_chartDrawPending == false && _root.getAttribute("selected") == "true") {
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
                _updateStockContent();
                //log("ViewPort: Tab clicked. Classes: " + e.currentTarget.getAttribute("class") + " view: " + view + " setting view: " + UI_SETTINGS.stockListView);
            }
        },
        _updateStockContent = function() {
            var stockList = generateStockListMarkup(_portfolio, UI_SETTINGS.stockListView);
            // TODO: Use fading out and in
            _root.one("#stocks_container").setContent(stockList);
            updateStocksTable();
        },
        onStockEntryClicked = function(e) {
            if (_mUI.clickCheck(e)){
                var node = e.currentTarget,
                positionId = node.getAttribute("id"),
                stock = node.getAttribute("stock");
                log("show stock info" + stock);
                e.preventDefault();
                if (stock) {
                	Y.use("view_stock", function(){
                		Y.Stock.view_stock.render(stock, _portfolio.id, positionId);
                	});
                }
            }
        },
        updateStocksTable = function () {
        	// TODO use alternating CSS style
            // add odd/even classes      
        	var nodes = _root.one("#stocks_container").all('.group_content');
            nodes.even().addClass("even");
            nodes.odd().addClass('odd');
            var page = _root.one("#stocks_container");
            page.all(".update_target").each(updateStockEntryMarkup);
        },
        // TODO: still needed?
        computeHeaders = function(view) {
            var html = [], i=0, curIndex, viewCount = view.length, tag, tagLabel;
            html[i++] = '<tr class="header">';
            for (curIndex=0; curIndex < viewCount; curIndex++) {
                tag = view[curIndex];
                tagLabel = getTagLabel(tag);
                if (tag != "symbol")
                    html[i++] = '<th class="header title info">';
                else
                    html[i++] = '<th class="header title">';
                html[i++] = tagLabel;
                html[i++] = '</th>';
            }
            html[i++] = '</tr> ';
            return html.join('');
        },
        //viewPort copied
        generateStockListMarkup = function(portfolio, viewName) {
            var index=0, stocks = _combinedStocks, extraClass, symbol,
                html = [], i=0, header, view, info,
                tag=0, tagValue;
            if (!viewName || !VIEWS[viewName]) {
                viewName = DEF_VIEW;
            }
            log(["ViewPort: Generating page for port: ", portfolio.id, " with view: ", viewName].join(""));
            header = VIEWS[viewName].header;
            view = VIEWS[viewName].columns;
            landscapeView = VIEWS[viewName].columns;
            html[i++] = '<table class="stocks ';            
           
            html[i++] = '" port_id="';
            html[i++] = portfolio.id;
            html[i++] = '">';
            //html[i++] = computeHeaders(view); 
            html[i++] = header;
            for (index in stocks) {
            	positionID = stocks[index].id;
                symbol = stocks[index].symbol;
                hasShare = stocks[index].shares != 0;
                extraClass = hasShare ? "" : "no_shares";
                html[i++] = ['<tr class="group_content entry ', extraClass,'" stock="', symbol, '" id="', positionID, '" index="', index, '" port_id="', portfolio.id,'" onclick="">'].join('');
                for (tag in view) {
                    info = view[tag];
                    // Shrink the stock symbol to just 6 characters
                    if (tag == "symbol")
                        tagValue = symbol.substr(0,6);
                    else
                        tagValue = "";
                    param = {   tag: tag,
                                stock: symbol,
                                index: index,
                                port_id: portfolio.id,
                                tagValue: tagValue,
                                classes: info.landscape ? "landscape_col" : ""
                                };                    
                    html[i++] = Y.Lang.substitute(templates["stock_entry_in_list"], param);
                }
                html[i++] = '</tr> ';
            }
            html[i++] = '</table>';
            return html.join('');
        },
        setDisplayClassForNode = function(node, tag, tagValue) {
            if (!tagValue) 
                return;
            
            switch(tag) {
            case "change":
            case "percent-change":
            case "value-delta":
            case "market-value":
            case 'value-delta-percent':
            case 'gain':
            case 'gain-percent':
                if (isValueNegative(tagValue))
                    node.addClass("negative");
                else
                    node.removeClass("negative");
                break;
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
        updateStockEntryMarkup = function(node) {
            var tag = node.getAttribute("val-type"),
            tagValue;
            if (tag.length > 0 && tag !== "symbol") {
                index = node.getAttribute("index");                
                tagValue = Y.Stock.quoteMgr.getTagInfo(_getPositionInfo(index), _portId, tag);
                tagValue = formatTagValue(tagValue, tag);
                setDisplayClassForNode(node, tag, tagValue);    
                node.setContent(tagValue);
            }   
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

function addZeroIfNeeded(value) {
	if (value < 10)
		value = "0" + value;
	return value;	
}
function extractTransactionInfo(node, portId) {
	var info = { portId: portId};
	// TODO: validate input
	info.positionId = node.getAttribute("positionId");
	info.sym = node.one(".symbol").get("value");
	info.shares = parseFloat(node.one(".shares").get("value").replace(",",""));
	info.price = parseFloat(node.one(".buy").get("value").replace(",",""));
	info.comm = parseFloat(node.one(".comm").get("value").replace(",",""));
	var date = node.one(".date").get("value");
	date = date.split("/");
	info.date = [date[2], addZeroIfNeeded(date[0]), addZeroIfNeeded(date[1])].join("");
	info.note = node.one(".note").get("value");
	return info;
}
function getPositionParams(isSell, portId, lotId) {
	var d = new Date, position = null,
	params = {symbol: "", positionId: "", shares: "", buy: "", comm: "9.99", note: "" };
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
	}, null, false);
}

function showEditTransaction(stock, portId, lotId, selectToSell) {
	var node = Y.one("#editStock"),
	_portMgr = Y.Stock.portMgr,
	position = null,
	lotsInfo= {}, lot, i=0, html = [], len = 0,
	params = {type: "edit_stock", lots_info: "", positionId: "", shares: "", buy: "", comm: "", date: "", note: "" };
	
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