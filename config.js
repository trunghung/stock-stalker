var DEF_VIEW = "viewPerformance",
UI_SETTINGS = {
    hideHomeSumGain: false,
    hideHomeSumValueChange: false,
    hideHomeSumCash: false,
    hideHomeTopNews: false,
    hideHomeMovers: false,
    sortingMethod: "value", // [none, value, alpha]
    expandPositions: false,	// Combine positions of the same stock into 1 for rendering purpose
    homeSumTemplate: "test",
    indices: ["^DJI","^IXIC","^GSPC","^HSI"],
    stockListView: DEF_VIEW
},

INDICES = {
		"^DJI": "Dow Jones",
		"^IXIC": "NASDAQ",
		"^NYA": "NYSE",
		"^GSPC": "S&amp;P 500",
		"^RUI": "Russell 1000",
		"^RUT": "Russell 2000",
		"^RUA": "Russell 3000",
		"^TNX": "10y T-No",
		"^TYX": "30y T-No",
		"^FVX": "5y T-No",
		"^N225": "Nikkei",
		"^HSI": "Hang Seng"
},
    
VIEWS = { /*"viewQuote" : {       name: "Quote",
                                header: ['<tr class="header">',
                                         '<th class="header title">Symbol</th>',
                                         '<th class="header title info double" colspan="2">Last Trade</th>',
                                         '<th class="header title info">Bid</th>',
                                         '<th class="header title info">Ask</th>',
                                         '<th class="header title info double landscape_col" colspan="2">Day Hi & Lo</th></tr>'].join(''),
                                columns: {'symbol' : { }, 'price': { }, 'change': { }, 'bid': { }, 
                                    'ask': { }, 'day_hi': { landscape: true }, 'day_lo': { landscape: true }}
                            },*/
            "viewPerformance" : 
                            {   name: "Performance",
                                header: ['<tr class="header">',
                                         '<th class="header title">Symbol</th>',
                                         '<th class="header title info double" colspan="2">Last Trade</th>',
                                         '<th class="header title info double" colspan="2">Day\'s Change</th>',
                                         '<th class="header title info double landscape_col" colspan="2">Market Value & Gain</th></tr>'].join(''),
                                columns: {'symbol' : { },  'price' : { },  'change' : { },  'percent-change' : { },  
                                    'value-delta' : { },  'market-value' : { landscape: true },  'gain' : { landscape: true }}
                            },
            "viewPosition" : 
                            {   name: "Positions",
                                header: ['<tr class="header">',
                                         '<th class="header title">Symbol</th>',
                                         '<th class="header title info">Shares</th>',
                                         '<th class="header title info double" colspan="2">Gain/Loss</th>',
                                         '<th class="header title info">Value</th>',
                                         '<th class="header title info landscape_col">Position</th></tr>'].join(''),                                
                                columns: {'symbol' : { },  'shares' : { },  'gain' : { },  'gain-percent' : { },  
                                          'market-value' : { },  'pf-percent' : { landscape: true } }
                            }
},

YUI_Config = {
            //base: '../../build/', // the base path to the YUI install.  Usually not needed because the default is the same base path as the yui.js include file
            charset: 'utf-8', // specify a charset for inserted nodes, default is utf-8
            //loadOptional: true, // automatically load optional dependencies, default false
            combine: true, // use the Yahoo! CDN combo service for YUI resources, default is true unless 'base' has been changed
            filter: 'raw', // apply a filter to load the raw or debug version of YUI files
            timeout: 10000, // specify the amount of time to wait for a node to finish loading before aborting
            //insertBefore: 'customstyles', // The insertion point for new nodes
            throwFail: true,
            gallery: 'gallery-2011.01.26-20-33',
            modules:  { 
            },

            // one or more groups of modules which share the same base path and
            // combo service specification.
            groups: {
                // Note, while this is a valid way to load YUI2, 3.1.0 has intrinsic
                // YUI 2 loading built in.  See the examples to learn how to use
                // this feature.
                stock: {
                    combine: false,
                    base: './',
                    //comboBase: 'http://yui.yahooapis.com/combo?',
                    //root: '2.8.0r4/build/',
                    modules:  {
                        iui: {
                            path: 'iui/iui.js',
                            requires: ["mUI", "iui_css", "default_theme_css", "default_theme_css"]
                        },
                        iui_css: {
                            type: "css",
                            path: 'iui/iui.css'
                        },
                        default_theme_css: {
                            type: "css",
                            path: 'iui/t/default/default-theme.css'
                        },
                        iui_panel_css: {
                            type: "css",
                            path: 'iui/iui-panel-list.css'
                        },
                        mUI: {
                            path: "sdk/sdk.js",
                            requires: ["mUI_css", "base_css", "util"]
                        },
                        mUI_css: {
                            type: "css",
                            path: "sdk/sdk.css"
                        },
                        base_css: {
                            type: "css",
                            path: "css/stocktrack.css"
                        },
                        mcap_history: {
                            path: "js/history.js",
                            requires: ["node"]
                        },
                        home: {
                            path: "js/home.js",
                            requires: ["mUI", "iui", "node", "PortfolioManager", "util", "templates"]
                        },
                        news: {
                            path: "js/news.js",
                            requires: ["iui", "node", "PortfolioManager", "substitute", "util", "templates"]
                        },
                        protocol: {
                            path: "js/protocol.js",
                            requires: ["jsonp", "util"]
                        },
                        PortfolioManager: {
                            path: "js/portfoliomgr.js",
                            requires: ["node", "yql", "substitute", "util", "mcap_history", "protocol"]
                        },
                        templates: {
                            path: "js/template.js"
                        },
                        util: {
                            path: "js/util.js",
                            requires: ["node"]
                        },
                        view_portfolio: {
                            path: "js/viewPort.js",
                            requires: ["iui", 'node', "PortfolioManager", "util", "templates", "home"]
                        },
                        view_stock: {
                            path: "js/viewStock.js",
                            requires: ["iui", "node", "PortfolioManager", "substitute", "util", "templates", "view_stock_template", "news"]
                        },
                        view_stock_template: {
                            path: "js/templates/template_view_stock.js"
                            
                        },
                        edit_portfolio: {
                            path: "js/editPort.js",
                            requires: ["iui", 'node', "PortfolioManager", "util", "templates"]                            
                        }
                    }
                }
            }
     };var Y = Y || new YUI(YUI_Config);

var sample = { 
    hung:{ pf_1: { 	
					"name": "Mine", 
					"id": "pf_1",
					"cash" : 0,					
					"content": [
					    { symbol: 'AAPL', shares: 0, buy: "", date: "", note: "" }, 
					    { symbol: 'CBG', shares: 800, buy: "25.19", date: "", note: "" }, 
					    { symbol: 'CEG', shares: 650, buy: "32.97", date: "", note: "" }, 
					    { symbol: 'CSE', shares: 2500, buy: "7.90", date: "", note: "" }, 
					    { symbol: 'EXXI', shares: 1500, buy: "22.72", date: "", note: "30->35" }, 
					    { symbol: 'FIG', shares: 2000, buy: "5.81", date: "", note: "" }, 
					    { symbol: 'FIG', shares: 3200, buy: "6.8", date: "", note: "" }, 
					    { symbol: 'GGC', shares: 3000, buy: "18.71", date: "", note: "" }, 
					    { symbol: 'GGC', shares: 500, buy: "31.22", date: "", note: "" }, 
					    { symbol: 'GOOG', shares: 0, buy: "469", date: "", note: "" }, 
					    { symbol: 'KKR', shares: 4300, buy: "10.436083", date: "", note: "" }, 
					    { symbol: 'LIZ', shares: 2000, buy: "5.95", date: "", note: "" }, 
                        { symbol: 'MCP', shares: 0, buy: "47.64", date: "", note: "" }, 
					    { symbol: 'MSFT', shares: 0, buy: "", date: "", note: "" }, 
					    { symbol: 'NFLX', shares: 0, buy: "", date: "", note: "" }, 
					    { symbol: 'NFLX110618P00190000', shares: 300, buy: "30.15", date: "", note: "" }, 
					    { symbol: 'NOV', shares: 250, buy: "41.03", date: "", note: "45->55" }, 
					    { symbol: 'ODP', shares: 3000, buy: "4.30", date: "", note: "45->55" }, 
					    { symbol: 'OMX', shares: 1000, buy: "13.65", date: "", note: "45->55" }, 
					    { symbol: 'ORCL', shares: 0, buy: "", date: "", note: "" }, 
					    { symbol: 'SU', shares: 400, buy: "45.08", date: "", note: "" }, 
					    { symbol: 'YHOO', shares: 0, buy: "", date: "", note: "" }
					]
				},
				pf_2: { 	
					"name": "Family", 
					"id": "pf_2",
					"cash" : 7501.63,
					
					"content": [
					    { symbol: 'EXXI', shares: 428, buy: "20.92" , date: "", note: "" }, 
					    { symbol: 'GGC', shares: 808 , buy: "18.71" , date: "", note: "" },
					    { symbol: 'GGC', shares: 834 , buy: "31.31" , date: "", note: "" },
					    { symbol: 'KKR', shares: 900, buy: "10.44", date: "", note: "" }
					]
				},
				pf_3: { 	
					"name": "401k", 
					"id": "pf_3",
					"cash" : 32.77,
					
					"content": [
					    { symbol: 'EXXI', shares: 756, buy: "19.29", date: "", note: "" }, 
					    { symbol: 'IP', shares: 586, buy: "30.2255", date: "", note: "" }, 
					    { symbol: 'CEG', shares: 650, buy: "33.0755", date: "", note: "" }, 
					    { symbol: 'GGC', shares: 400, buy: "36.39" , date: "", note: "" }, 
					    { symbol: 'KKR', shares: 2000, buy: "10.11", date: "", note: "" }
					]
				},
				pf_4: { 	
					"name": "Roth IRA", 
					"id": "pf_4",
					"cash" : 8.52,					
					"content": [
					    { symbol: 'KKR', shares: 613 , buy: "16.31 "}, 
					    { symbol: 'GGC', shares: 56 , buy: "35.93" }
					]
				},
				pf_5: { 	
					"name": "401k Mutual Funds", 
					"id": "pf_5",
					"cash" : 0,
					
					"content": [
					    { symbol: 'RYLPX', shares: 2588.952, buy: "15.99"}, 
					    { symbol: 'VMGRX', shares: 2497.323, buy: "17.09" }
					]
				}
    },
    kathy: { pf_1: { 	
					"name": "TD Ameritrade", 
					"id": "pf_1",
					"cash" : 0,
					
					"content": [ 
					    { symbol: 'EXXI', shares: 587, buy: "15.37", date: "", note: "30->35" }, 
					    { symbol: 'NOV', shares: 457, buy: "39.35", date: "", note: "" }, 
					    { symbol: 'PFE', shares: 1000, buy: "18.76", date: "", note: "" }, 
					    { symbol: 'ROC', shares: 331, buy: "27.49", date: "", note: "" }
					]
				},
				pf_2: { 	
					"name": "Fidelity Individual", 
					"id": "pf_2",
					"cash" : 0,
					
					"content": [
					    { symbol: 'CVX', shares: 108, buy: "92.50" , date: "", note: "" }, 
					    { symbol: 'DRQ', shares: 164 , buy: "60.86" , date: "", note: "" }, 
					    { symbol: 'ORCL', shares: 1700, buy: "22", date: "", note: "" }
					]
				},
				pf_3: { 	
					"name": "Roth IRA", 
					"id": "pf_3",
					"cash" : 0,
					
					"content": [
					    { symbol: 'JCP', shares: 310, buy: "26.23", date: "", note: "" }, 
					    { symbol: 'KKR', shares: 3478, buy: "11.687" , date: "", note: "" }
					]
				},
				pf_4: { 	
					"name": "401k", 
					"id": "pf_4",
					"cash" : 0,
					
					"content": [
					    { symbol: 'EXXI', shares: 607, buy: "21.19", date: "", note: "" }, 
					    { symbol: 'GGC', shares: 2503, buy: "17.558" , date: "", note: "" }, 
					    { symbol: 'BAM', shares: 577, buy: "29.41", date: "", note: "" },
					    { symbol: 'ITUB', shares: 740, buy: "24.37", date: "", note: "" }, 
					    { symbol: 'PBR', shares: 470, buy: "36.86", date: "", note: "" } 
					]
				}
    },
    jimming: { pf_1: { 	
					"name": "Main", 
					"id": "pf_1",
					"cash" : 257.73,
					
					"content": [ 
						{ symbol: "NOV", shares: 651, buy: "42.99" }, 
						{ symbol: "GGC", shares: 1173, buy: "18.1" },
						{ symbol: "AA", shares: 1972, buy: "12.81" },
						{ symbol: "JNY", shares: 3347, buy: "13.84" },
						{ symbol: "PPO", shares: 388, buy: "53.01" },
						{ symbol: "LIZ", shares: 13709, buy: "6.0546" },
						{ symbol: "JNY110521C00011000", shares: 800, buy: "4" },
						{ symbol: "JNY110521C00012000", shares: 1000, buy: "3.1" },
						{ symbol: "LIZ110416C00006000", shares: 3000, buy: "1.5733" },
						{ symbol: "MAS130119C00010000", shares: 1200, buy: "3.75" },
						{ symbol: "MAS", shares: 3012, buy: "11.64" },
						{ symbol: "JCP", shares: 351, buy: "24.12" },
						{ symbol: "ODP", shares: 5845, buy: "4.7725" },
						{ symbol: "LIZ110716C00005000", shares: 22, buy: "1.8" }					]
				},
				pf_2: { 	
					"name": "Roth A", 
					"id": "pf_2",
					"cash" : 112.3,
					
					"content": [
						{ symbol: "KKR", shares: 1400, buy: "16.16" },
						{ symbol: "AA", shares: 600, buy: "16.51" },
						{ symbol: "JCP", shares: 700, buy: "32.16" },
						{ symbol: "CRM", shares: 150, buy: "135.7" }
					]
				},
				pf_3: { 	
					"name": "Roth B", 
					"id": "pf_3",
					"cash" : 72.64,
					
					"content": [
						{ symbol: "KKR", shares: 200, buy: "15.29" },
						{ symbol: "KKR", shares: 200, buy: "15.3" },
						{ symbol: "KKR", shares: 1388, buy: "15.2936" },
						{ symbol: "EXXI", shares: 938, buy: "28.08" },
						{ symbol: "JCP", shares: 838, buy: "34.48" }
					]
				},
				pf_4: { 	
					"name": "Roth C", 
					"id": "pf_4",
					"cash" : 45.7,
					
					"content": [
						{ symbol: "NOV", shares: 281, buy: "77.98" },
						{ symbol: "KKR", shares: 1375, buy: "16.64" },
						{ symbol: "JNY", shares: 1333, buy: "12.95" },
						{ symbol: "EXXI", shares: 200, buy: "26.34" },
						{ symbol: "EXXI", shares: 725, buy: "26.4" }
					]
				}
    }
};var Y = Y || new YUI(YUI_Config);
var DEBUG_MODE = 0;
function _getUrlParamValue(name)
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}
DEBUG_MODE = DEBUG_MODE || _getUrlParamValue("debug") == 1;

Y.use("node", function(Y) {
	var node = Y.one("#debug_tool");
    if (!DEBUG_MODE) {
        if (node)
            node.remove(true);
        return;
    }
    if (Y.one("#logconsole"))
        Y.one("#logconsole").removeClass("hidden");
    if (node)
        node.removeClass("hidden");

    function hookEvent(cssSelector, event, cbFunc, rootNode) {
        if (!rootNode) 
            rootNode = Y;
        var node = Y.one(cssSelector);
        if (node)
            node.on(event, cbFunc);
    }
    // DEBUG buttons
    hookEvent("#save", "click", function(e) {
        e.preventDefault();
        saveLocal("portfolios", Y.Stock.portMgr.portfolios);
        saveLocal("settings", UI_SETTINGS);
        log("Cached saved");
    });
    hookEvent("#clear", "click", function(e) {
        e.preventDefault();
        saveLocal("portfolios", null);
        saveLocal("settings", null);
        log("Cached cleared");
    }); 
    Y.all(".dump_cache").on("click", function(e) {
        log("----- In memory portfolio data ----");
        log(JSON.stringify(Y.Stock.portMgr.portfolios));
        log("----- Cached portfolio data -----");
        log(readLocalStorage("portfolios"));
        log("----- In memory settings data ----");
        log(JSON.stringify(UI_SETTINGS));
        log("----- Cached settings data -----");
        log(readLocalStorage("settings"));        
    });
    Y.all(".clear_log").on("click", function(e) {
        e.preventDefault();
        var node = Y.one("#logconsole #log");
        if (node)
            node.setContent('');
    });
    Y.all(".toggle_log").on("click", function(e) {
        e.preventDefault();
        var node = Y.one("#logconsole"),
        hidden = node.hasClass("hidden");
        if (hidden)
            node.removeClass("hidden");
        else
            node.addClass("hidden");
    });
});
YUI.add('edit_portfolio', function (Y) {
    Y.namespace('Stock');
    var EditPort = function() {
        var _util = Y.Stock.util,
        _portMgr = Y.Stock.portMgr,
        _portId = null,
        _root = null,
        _render = function(portId) {
            var deleteBtn, port, html = [], i=0, 
            params = { name: "", cash: "", show_state: "true", aggregate_state: "true"};
            _portId = portId,            
            nodeInfo = _util.getOrCreatePageNode("editPortfolio", templates["edit_portfolio_page"]);
            _root = nodeInfo.node;
            if (nodeInfo.created) {
                _bindUI();
            }
            
            if (_portId !== "new") {
                port = _portMgr.getPortfolio(_portId);
                if (port) {
                    params.name = port.name;
                    if (port.cash)
                        params.cash = port.cash;
                    if (port.show === false)
                        params.show_state = "false";
                    if (port.aggregate === false)
                        params.aggregate_state = "false";            
                }
                _root.one(".delete_button").removeClass("hidden");
            }
            else {
            	_root.one(".delete_button").addClass("hidden");
            }
            _root.one(".content").setContent(Y.Lang.substitute(templates["edit_portfolio"], params));            
            
            if (port) {
                for (i in port.content) {
                    stock = port.content[i];
                    _insertNewStockEntry(stock);
                }
            }
        },
        _insertNewStockEntry = function(stock) {
            var params = { symbol: "", shares: "", paid: "", date: "", note: ""},
            content = _root.one(".content"),
            html;
            if (content) {
                if (stock) {
                	params.id = stock.id;
                    params.symbol = stock.symbol;
                    if (stock.shares)
                        params.shares = stock.shares;
                    if (stock.buy)
                        params.paid = stock.buy;
                    if (stock.date)
                        params.date = stock.date;
                    if (stock.note)
                        params.note = stock.note;   
                }
                html = Y.Lang.substitute(templates["new_stock"], params);
                content.append(html);
            }
        },
        _bindUI = function() {
            _util.hookEvent(".add_position", "click", _insertNewStockEntry, _root);
            // TODO: cleanup
            // Clean remove the input_group when user clicks on the delete button
            _root.delegate("editPort|click", function(e) {
                e.preventDefault();
                var root = e.currentTarget.ancestor(".input_group");
                if (root)
                    root.remove(true); 
            }, ".input_group .icon .delete"); 
            _util.hookEvent(".delete_button", "click", _delete, _root);
        },
        _delete = function() {
            var port = _portMgr.getPortfolio(_portId);
            if (confirm("Delete " + port.name, "?")) {
                _portMgr.removePortfolio(_portId);
                Y.mUI.returnHome();
                _removePage();
            }
        },
        _removePage = function() {
            Y.later(100, this, function() {
                _root.remove(true);
            }, false);
            /*
            var timer = Y.later(100, this, function() {
                if (_root.getAttribute("selected") != "true") {
                    // TODO: clean up events
                    //_root.remove(true);
                    _root.setContent("");
                    timer.cancel();
                }
            }, true);  */
        },
        _save = function() {
            var nodePort = _root.one(".port_info"),  
            isNew = _portId == "new",
            portInfo = {};
            
            if (!isNew)
                portInfo.id = _portId;
            
            portInfo.name = getInfo(nodePort, ".name");
            portInfo.cash = getInfoNum(nodePort, ".cash");
            portInfo.show = getInfoToggle(nodePort, ".show_state");
            portInfo.aggregate = getInfoToggle(nodePort, ".include_total");
            
            if (portInfo.name.length > 0) {
                log(["Edit portfolio - New: " , isNew, " Name: ", portInfo.name, " Cash: $", portInfo.cash, " show: ", portInfo.show].join(""));
                
                portInfo.content = parseStockInfos(_root);
                if (isNew)
                    _portMgr.addPortfolio(portInfo);
                else 
                    _portMgr.updatePortfolio(portInfo);
            }
            // TODO if there isn't a valid number, need to no go back
            iui.goBack();
            _removePage();
        },
        parseStockInfos = function(nodeRoot) {
            var info, stocks = [], nodeStock, i,
            nodeStocks = nodeRoot.all(".stock_info"),
            count = nodeStocks.size();
            
            // Enumerate through all the stock added
            for(i=0; i < count; i++) {
                nodeStock = nodeStocks.item(i);
                info = {};  // reset
                info.symbol = getInfo(nodeStock, ".symbol").toUpperCase();
                if (info.symbol.length > 0) {
                    info.shares = getInfoNum(nodeStock, ".shares");
                    info.buy = getInfoNum(nodeStock, ".paid");
                    info.date = getInfo(nodeStock, ".date");
                    info.note = getInfo(nodeStock, ".note");
                    if (info.symbol.length > 0) {
                        stocks.push(Y.merge(info));
                        log(["Parsed stock info - Name: ", info.symbol, " Shares: ", info.shares, 
                               " Price: $", info.buy, " Date: ", info.date, " Note: ", info.note].join(""));
                    }
                }
            }
            return stocks;
        },
        getInfo = function (node, name) {
            var info = "";
            if (node) {
                node = node.one(name + " input");
                if (node)
                    info = node.get("value");
            }
            return info;
        },
        getInfoNum = function (node, name) {
            var val = getInfo(node, name),
            num = parseFloat(val);
            if (val.length > 0 && !Y.Lang.isNumber(num)) {
                val = node.getAttribute("name");
                if (val)
                    alert('Invalid input for "' + val + '"');
                else
                    alert("Invalid input");
            }
            return num ? num : 0;
        },
        getInfoToggle = function (node, name) {
            var info = false;
            if (node) {
                node = node.one(name + " .toggle");
                if (node) 
                    info = node.getAttribute("toggled") == "true";
            }
            return info;
        };
        return {
            render: _render,
            onSave: _save
        };
    };
    Y.Stock.EditPort = new EditPort();
    log("EditPort: loaded");
}, '1.0.0', {requires: ["iui", 'node', "PortfolioManager", "util", "templates"]});YUI.add('mcap_history', function (Y) {
	Y.namespace('Stock');
    var History = function() {
        var portfoliosValueHistory = { week: {}, year: {} },
        _saveHistory = true,
        _one_day=1000*60*60*24,
        getHistory = function() { return portfoliosValueHistory; },
        computeMinMax = function(historyData) {
    		var val, min = false, max = false;
        	for (i=0; i < historyData.length; i++) {
        		val = historyData[i].value;
    			if (min === false || min > val)
    				min = val;
    			if (max === false || max < val)
    				max = val;
			}
        	return { min: min, max: max};
        },
        getWeekHistory = function(portId, rangeDays) {
        	var week, ret = [], i=0;
        	if (!portfoliosValueHistory.week[portId]) {
        		readHistory("week", portId);
        	}
        	week = portfoliosValueHistory.week[portId];		        	
        	if (week) {
	        	for (item in week) {
	    			entry = week[item];
	    			ret[i++] = {category: convertIntToDate(entry.date), value: entry.value};
	        	}
        	}
        	return ret;        	
        },
        saveHistory = function (key, port, value) {
			if (!window.localStorage){
		        return;
		    }    
			var historyKey = [port.id, key].join("_"); 
		    if (value == null)
		        localStorage.removeItem(historyKey);
		    if (value)
		        localStorage.setItem(historyKey, JSON.stringify(value));
			
		},
		readLocalStorage = function (key) {
		    if (!window.localStorage){
		        return;
		    }
		    return localStorage.getItem(key);
		},
 		readHistory = function (key, portId){
			var historyKey = [portId, key].join("_"),
		   	content = readLocalStorage(historyKey),
		   	retVal = null;
		    if (content && _saveHistory) {
		    	retVal = JSON.parse(content);
		    	if (retVal) {
		    		portfoliosValueHistory[key][portId] = retVal;
		    		return true;
		    	}
		    }
		    return false;
		},
		printHistory = function (rangeKey, port, root) {
			var entries = portfoliosValueHistory[rangeKey][port.id],
			entry, i, graph = root.one(".graph");
			for(i in entries) {
				entry = entries[i];					
			}
		},
		convertDateToInt = function (date) {
			return (date.getFullYear() - 2000) * 10000 + date.getMonth() * 100 + date.getDate();
		},
		convertIntToDate = function(date) {
			var year = parseInt(date/10000) + 2000,
			day = parseInt(date%100),
			month = parseInt((date/100)%100);
			return [month, day, year].join("/");
		},
		isWithinNumOfDays = function (days, date) {
			var d = new Date(convertIntToDate(date)),
			today = new Date(),
			diff = (today.getTime() - d.getTime())/_one_day;
			return (diff < days);
		},
		_recordWeekValue = function (port, date) {
	    	var week = portfoliosValueHistory.week[port.id], 
	    	value = parseInt(port.totalValue),
	    	lastEntry, recorded = false, needRecording = true,
	        dateStr = date.year * 10000 + date.month * 100 + date.date;
	    	if (week) {
	    		if (week.length > 0) {
	        		lastEntry = week[week.length - 1];
	        		if (lastEntry.date == dateStr) {
	        			needRecording = false;
	        			if (lastEntry.value != value) {
		        			lastEntry.value = value;
		        			recorded = true;
	        			}
	        		}
	    		}
	    		if (needRecording) {
	    			week.push({date: dateStr, value: value});
	    			recorded = true;
	    		}
	    		// Trim week length to be less than 10
	    		var days = 30;
	    		while (week.length > days || (week.length > 0 && !isWithinNumOfDays(days, week[0].date)))
	    			week.shift();
	    		if (recorded && _saveHistory) {
	    			saveHistory("week", port, week);
	    		}
	    	}
	    	return recorded;
	    },
	    _isMonthRecorded = function(month, entries) {
	    	var  i, entry;
	    	for (i in entries) {
	    		entry = entries[i];
	    		if (entry.date == month)
	    			return i;
	    	}
	    	return null;
	    },
	    _recordMonthValue = function (port, date) {
	    	var  year = portfoliosValueHistory.year[port.id], 
	    	value = parseInt(port.totalValue),
	    	month = date.year * 100 + date.month, recorded = false;
	    	if (year) {
	    		var index = _isMonthRecorded(month, year);
	    		if (index === null) {
	    			year.push({date:month, value: value});
	    			recorded = true;
	    		}
	    		else {
	    			year[index].value = value;
	    			recorded = true;
	    		}
	    		// Only track the last 36 entries
	    		while (year.length > 36)
	    			year.shift();
	    	}
	    	if (recorded && _saveHistory) {
				saveHistory("year", port, year);
			}
	    	return recorded;
	    },
	    recordPortValue = function (port, paramDay) {
	    	// There is no need to store total portfolio
	        var d = paramDay ? new Date(paramDay) : new Date(),
	        day = d.getDay(),
	        date = {
	            date : d.getDate(),
	            month : d.getMonth() + 1,	// Since the month is 0-index
	            year : d.getFullYear() - 2000};
	        // Don't record weekend
	        if (day != 0 && day != 6) {
	        	if (!portfoliosValueHistory.week[port.id]) {
	        		if (!readHistory("week", port.id))
	        			portfoliosValueHistory.week[port.id] = [];
	        	}
	        	if (!portfoliosValueHistory.year[port.id]) {
	        		if (!readHistory("year", port.id))
		        		portfoliosValueHistory.year[port.id] = [];
	        	}
	        	_recordWeekValue(port, date);
	        	_recordMonthValue(port, date);
	        	Y.fire("stock_history_recorded", port);
	        }
	    },
        _generateSampleHistory = function() {
	    	_saveHistory = false;
	    	var port = { id: "total", totalValue: 100000},
	    	date = new Date(),
	    	day = date.getDate(),
	    	month = date.getMonth() + 1,
	    	year = date.getFullYear(),
	    	index;
	    	var ports = ["total", "pf_1", "pf_2"];
	    	for (index in ports) {
	    		port.id = ports[index];
		    	if (day-3 > 0) {
			    	recordPortValue(port, [month,day-3,year].join("/"));
			    	port.totalValue -= 200;
		    	}	    
		    	if (day-2 > 0) {
			    	recordPortValue(port, [month,day-2,year].join("/"));
			    	port.totalValue -= 200;
		    	}	
		    	if (day-1 > 0) {
			    	recordPortValue(port, [month,day-1,year].join("/"));
			    	port.totalValue -= 200;
		    	}
		    	recordPortValue(port, [month,day,year].join("/"));
		    	port.totalValue -= 500;
		    	if (month - 1 > 0) {
		    		_recordMonthValue(port, [month,day,year-2].join("/"));
			    	port.totalValue -= 1200;
		    	}
		    	_recordMonthValue(port, [month,day,year-1].join("/"));
		    }        	
        };
	    return { 
	    	getHistory: getHistory,
	    	computeMinMax: computeMinMax,
	    	getWeekHistory: getWeekHistory,
	    	readHistory: readHistory,
	    	printHistory: printHistory,
	    	recordPortValue: recordPortValue,
	    	recordWeekValue: _recordWeekValue,
	    	recordMonthValue: _recordMonthValue,
	    	generateSampleHistory: _generateSampleHistory
	    };
    };
    Y.Stock.History = new History();
}, '1.0.0', {requires: ["node"]});YUI.add('home', function (Y) {
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
            var port;
            _root = Y.one("#home");
            
            log("Home: rendering");
            _insertPortfolioSummaries();          
            setTimeout(scrollTo, 100, 0, 1);
            bindUI();
            _getTopNews();

            var node, indices = _root.one(".indices"), html;
            for (index in UI_SETTINGS.indices) {
            	node = indices.one(".index_" + index);
            	if (node) {
	            	html = Y.Lang.substitute(templates["index"], {index: UI_SETTINGS.indices[index]});
	            	node.setContent(html);
            	}
            }
            onQuotesUpdated();
        },
        _insertPortfolioSummaries = function() {
            var cur, portfolios = Y.Stock.portMgr.getPortfolios();
            _root.one("#portfolio_summaries").setContent("");
        	addPortSummaryToHomePage(portfolios["total"]);
            
            for (cur in portfolios) {
                if (cur != "total") {
                    addPortSummaryToHomePage(portfolios[cur]);
                }
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
        onQuotesUpdated = function () {
            var portfolios = Y.Stock.portMgr.getPortfolios(), cur,
            indices = _root.one(".indices").all(".index"), index, node;
            for (cur in portfolios) {
                _util.updatePortfolioSummaryBlocks(portfolios[cur]);
            }
            indices.each(function(node) {
            	var symbol = node.getAttribute("stock"),
            	stockInfo = { shares: 0, symbol: symbol},
            	name = INDICES[symbol],
            	price = Y.Stock.quoteMgr.getTagInfo(stockInfo, null, "price"),
            	change = Y.Stock.quoteMgr.getTagInfo(stockInfo, null, "change"),
            	changePercent = Y.Stock.quoteMgr.getTagInfo(stockInfo, null, "percent-change"),
            	positive = change > 0;
            	if (!Y.Lang.isString(name)) {
            		name = Y.Stock.quoteMgr.getTagInfo(stockInfo, null, "name");
            	}
            	if (!Y.Lang.isString(name)) {
            		name = symbol;
            	}
            	if (positive) {
            		change = "+" + change;
                    node.one(".content").removeClass("negative");
            	}
            	else {
                    node.one(".content").addClass("negative");
            	}
            	
            	node.one(".name").setContent(name);
            	node.one(".price").setContent(price.toFixed(0));
            	node.one(".change").setContent(change);
            	node.one(".percent-change").setContent(changePercent);
            });
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
            	Y.Stock.News.parseReceivedNewsFeed(_root.one(".news_container"), 5, results);
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
}, '1.0.0', {requires: ["iui", "node", "PortfolioManager", "util", "templates"]});YUI.add('news', function (Y) {
    Y.namespace('Stock');
    var News = function() {
        var _util = Y.Stock.util,
        _root = null,
        _render = function() {  
        	var params = {}, rootInfo;
            Y.mUI.showLoading();
            rootInfo = _util.getOrCreatePageNode("news", Y.Lang.substitute(templates["news_page"], params));
            _root = rootInfo.node;
            
            if (_root) {
                Y.on('newsDownloaded', _onNewsReceived);
                Y.Stock.quoteMgr.getAllNews();                
            }
        },
        _parseReceivedNewsFeed = function (container, numShown, results) {
            function onError(node) {
                var node = container.one(".status");
                if (node)
                    node.setContent("There was an error download headlines");
            }
            Y.use("datatype-date", function() {
                var item, items, html = [], i=0, linkUrl, index, params, node, time, date, curDate, dateOrDayThreshold, timeFormat;
                if (results.query && results.query.results && results.query.results.item) {
                    items = results.query.results.item;
                    if(!Y.Lang.isArray(items))
                        items = [items];
                    curDate = new Date();
                    dateOrDayThreshold = 1000 * 60 * 60 * 24 * 3; // 3 days
                    for (item in items) {
                        if (items[item].link) {
                            linkUrl = items[item].link;
                            date = Y.DataType.Date.parse(items[item].pubDate);
                            timeFormat = "%a %l:%M %p";
                            if (curDate.getDate() == date.getDate() && curDate.getMonth() == date.getMonth()) {
                            	timeFormat = "%l:%M %p";
                            }
                            else if (curDate.getTime() - date.getTime() > dateOrDayThreshold)
                            	timeFormat = "%m/%d %l:%M %p";
                            time = Y.DataType.Date.format(date, {format: timeFormat});
                
                            index = linkUrl.indexOf("http%3A//");
                            if (index > 0) {
                                linkUrl = "http://" + linkUrl.slice(index + 9);
                            }
                            params = {   title: items[item].title, 
                                        link: linkUrl, 
                                        date: time,
                                        hidden: i > numShown ? "extra_item" : ""
                                        };
                            html[i++] = Y.Lang.substitute(templates["news_item"], params);
                        }
                        else {
                            onError(container);
                        }
                            
                    }
                    if (i > numShown) {
                        html[i++] = '<li class="row news_item show_extra" onclick=""><div class="title">Show more news</div></li>';
                    }
                    if (i > 0) {
                        // Hide the status line
                        node = container.one(".status");
                        if (node)
                            node.addClass("hidden");
                        container.setContent(html.join(''));
                    }
                }
                else {
                    if (results.error) {
                        onError(container);
                    }
                    else {
                        container.setContent("There is no news for your stocks");
                    }
                    // TODO: Handle error
                }
            });
        },
        _onNewsReceived = function(results) {
            Y.later(0, this, function(){
            	_parseReceivedNewsFeed(_root.one(".news_container"), 30, results);
                Y.mUI.hideLoading();
            }, false);            
        };
        return {
                render: _render,
                pageId: function() { return "news"; },
        		parseReceivedNewsFeed: _parseReceivedNewsFeed
                };
    };
    Y.Stock.News = new News();
    log("News: loaded");
}, '1.0.0', {requires: ['node', "PortfolioManager", "substitute", "util"]});