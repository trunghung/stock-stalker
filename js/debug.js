var Y = Y || new YUI(YUI_Config);
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