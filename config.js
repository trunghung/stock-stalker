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