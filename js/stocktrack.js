var Y = Y || new YUI(YUI_Config);
Y.use("home", "mUI", 'scrollview', function(Y) {
    var portMgr = Y.Stock.portMgr,
    quoteMgr = Y.Stock.quoteMgr,
    _util = Y.Stock.util,
    _settingsEventHandler = null;
    
    function bindUI() {
    	
        // TODO Move to news
	   Y.delegate("click", function(e) {
            e.preventDefault();
            var root = e.currentTarget.ancestor(".news_container"),
            isMore = !root.hasClass("hide_extra_items"),
            text = isMore ? "Show more news" : "Show less news",
            node = e.currentTarget.one(".title");
            if (root)
                root.toggleClass("hide_extra_items");
            if (node)
                node.setContent(text);
            
        }, "body", ".show_extra");
	   
	   Y.one(".exportHist").on("click", function() {
		  var history = Y.Stock.History.getHistory(),
		  portId, html = "";
		  for(portId in history.year) {
			 var port = portMgr.getPortfolio(portId);
			 var exportHistory = { portfolio: port.name,
						  record: history.year[portId]};
			 html += JSON.stringify(exportHistory);
		  }
		  
		  var myWin=window.open("","myWin");
		  myWin.document.write('<!DOCTYPE html PUBLIC "-//W3C//DTD html 4.01//EN""http://www.w3.org/TR/html4/strict.dtd">'+ 
		  '<html><head><title>My Window</title></head><body>' + html + '</body></html>') 
	   });
    	
	   Y.Stock.util.hookEvent(".refresh_quotes", "click", function(e){
			e.preventDefault();
			quoteMgr.refreshQuotes();
		});
    
	   //_util.hookEvent(".settings", "click", onShowSettingPage);
	   // TODO move to Home.js
	   Y.on("mUI_BeforePageChange", function(pageId) {
    	   if (pageId === "settings") {
    	       onShowSettingPage();
    	   }
    	   else if (pageId === "news") {
    		   // TODO: make module name, page id and variable the same so we can consolidate these lines 
    		   Y.use("news", function() {
        	       Y.Stock.News.render();
    		   });
    	   }
    	   else if (pageId === "editPortfolio") {
    	       Y.use("edit_portfolio", function(){
                   Y.Stock.EditPort.render("new");    	           
    	       });
    	   }
    	});
    	Y.delegate("focus", function(e){
    		_curPage = e.currentTarget.get("id");
    		var curPage = Y.one("#" + _curPage),
    	    nodeTB = Y.one(".toolbar"),
    	    nodeCurBtn = nodeTB.one(".visible"),
    	    newBtn = curPage.getAttribute("button"),
    	    nodeNewBtn = nodeTB.one("#" + newBtn);
    	    
    	    if (nodeNewBtn != nodeCurBtn) {
    	        if (nodeCurBtn) {
    	            nodeCurBtn.removeClass("visible");
    	            nodeCurBtn.addClass("hidden");
    	        }
    	        if (nodeNewBtn) {
    	            nodeNewBtn.addClass("visible"); 
    	            nodeNewBtn.removeClass("hidden");
    	        }          
    	    }
    	}, "body", ".page");
    	// BUGBUG catch login focus and see if the state is logoff, then show iframe for log in
    	// also hide/show toolbar
    	if (Y.Stock.Protocol && Y.Stock.Protocol.getState() === "logoff") {    		
    		window.location.href = "http://stock-stalkers.appspot.com/login?dest=" + window.location.href;
    	}
    	else {
    		Y.on("notLogIn", function() {
    			if (confirm("You're not logged in currently. Do you want to sign in?")) {
    				window.location.href = "http://stock-stalkers.appspot.com/login?dest=" + window.location.href;    				
    			}
    		});
    	}
    	if (portMgr._state === "ready") {
			Y.one("#header").removeClass("hidden");
    		iui.showPageById("home");
    	}
    	else {
        	Y.on("portfoliosReady", function(){
        		Y.one("#header").removeClass("hidden");
        		iui.showPageById("home");
        	});
    	}
    	_util.hookEvent("#edit_btn", "click", onEditBtnClicked);
    	_util.hookEvent("#save_btn", "click", onSaveBtnClicked);
    	
    	/* BUGBUG disable scrollview for now
    	var scrollView = new Y.ScrollView({
            id: "scrollview",
            srcNode: '#scroll-content',
            height: 150,
            flick: {
                minDistance:10,
                minVelocity:0.3,
                axis: "y"
            }
        });
     
        scrollView.render();
        var content = scrollView.get("contentBox");         
        content.delegate("click", function(e) {
            // Prevent links from navigating as part of a scroll gesture
            if (Math.abs(scrollView.lastScrolledAmt) > 2) {
                e.preventDefault();
                Y.log("Link behavior suppressed.");
            }
        }, "a");
        content.delegate("mousedown", function(e) {
            // Prevent default anchor drag behavior, on browsers 
            // which let you drag anchors to the desktop
            e.preventDefault();
        }, "a");
        */
    }
    function getCurrentPage() {
        return Y.one("[selected='true']");
    }
    function onEditBtnClicked() {
        var id, page = getCurrentPage();
        if (page) {
            id = page.get("id");
            if (id == "view_pf") {
                Y.Stock.viewPort.onEdit();
            }
            Y.fire("editClicked", id);
        }
    }
    function onSaveBtnClicked() {
        // TODO switch to using polymorphism
        var page = getCurrentPage();
        if (page) {
            id = page.get("id");
            if (id === "editPortfolio") {
                Y.Stock.EditPort.onSave();
            } 
        }
    }
    function onShowSettingPage() {
	   var context = {portfolios: portMgr.getPortfolios(),
				showGain: UI_SETTINGS.hideHomeSumGain ? "false" : "true",
				showCash: UI_SETTINGS.hideHomeSumCash ? "false" : "true",
				expandPositions: UI_SETTINGS.expandPositions ? "false" : "true"};
	   dust.render("settings", context, function(err, out){
		  Y.one("#settings").setContent(out);
		  iui.showPageById("settings");
	   });
	   // Hide settings and refresh
	   Y.one("#backButton").once("click", saveSettings);
    }
    function saveSettings() {	
	   // Hide settings and refresh
	   Y.all("#settings .toggle").each(function(node) {
		   var fieldName = node.getAttribute("name"),
		   curVal = node.getAttribute("toggled");
		   UI_SETTINGS[fieldName] =  curVal === "false";
	   });
	   if (!UI_SETTINGS.hideHomeSumGain)
		   Y.all(".hide_gain").removeClass("hide_gain");
	   else {
		   Y.all(".port_summary").addClass("hide_gain");
	   }
	   if (!UI_SETTINGS.hideHomeSumCash)
		   Y.all(".hide_cash").removeClass("hide_cash");
	   else {
		   Y.all(".port_summary").addClass("hide_cash");
	   }
	   saveLocal("settings", UI_SETTINGS);
    }

    dust.render("main", {}, function(err, out){
	   document.body.innerHTML = out;
	   Y.Stock.home.render();
	   bindUI();
	   Y.all(".prerender_hidden").removeClass("prerender_hidden");
	   Y.Stock.quoteMgr.init();
	   Y.Stock.portMgr.init();
    });
    /*
    if (portMgr.isInit()) {
        Y.Stock.home.render();
    }
    else {
        Y.on("portfoliosReady", function(portfolios) {
            Y.Stock.home.render();
        });
    }    */

    //quoteMgr.updateAllQuotesFromAccounts();
});
