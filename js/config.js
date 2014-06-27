var DEF_VIEW = "viewPerformance",
UI_SETTINGS = {
    hideHomeSumGain: false,
    hideHomeSumValueChange: false,
    hideHomeSumCash: false,
    hideHomeTopNews: false,
    hideHomeMovers: false,
    sortingMethod: "value", // [none, value, alpha, change]
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
                                    'value-delta' : { },  'market-value' : { landscape: true },  'gain' : { landscape: true }},
						  tags: ['symbol', 'price', 'change', 'percent-change', 'value-delta', 'market-value', 'gain'],
						  landscapeTags: {'market-value': true, 'gain': true}
                            },
            "viewPosition" : 
                            {   name: "Positions",
                                header: ['<tr class="header">',
                                         '<th class="header title">Symbol</th>',
                                         '<th class="header title info">Shares</th>',
                                         '<th class="header title info double" colspan="2">Gain/Loss</th>',
                                         '<th class="header title info">Value</th>',
                                         '<th class="header title info landscape_col">Position</th></tr>'].join(''),                                
                                columns: {'symbol' : { },  'shares' : { }, 'gain' : { },  'gain-percent' : { },  
                                          'market-value' : { },  'pf-percent' : { landscape: true } },
						  tags: ['symbol', 'shares', 'gain', 'gain-percent', 'market-value', 'pf-percent'],
						  landscapeTags: {'pf-percent': true}
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
                            requires: ["mUI", "iui", "node", "PortfolioManager", "util", "templates", "QuoteManager"]
                        },
                        news: {
                            path: "js/news.js",
                            requires: ["iui", "node", "PortfolioManager", "substitute", "util", "templates", "QuoteManager"]
                        },
                        protocol: {
                            path: "js/protocol.js",
                            requires: ["jsonp", "util"]
                        },
                        PortfolioManager: {
                            path: "js/portfoliomgr.js",
                            requires: ["node", "yql", "substitute", "util", "mcap_history", "protocol", "QuoteManager"]
                        },
                        QuoteManager: {
                            path: "js/quotemgr.js",
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
     };