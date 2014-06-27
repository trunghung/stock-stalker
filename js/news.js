YUI.add('news', function (Y) {
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
        _parseReceivedNewsFeed = function (container, numShown, items) {
            var item, html = [], i=0;
			if (items.length > 0) {
				for (item in items) {
					if (items[item].link) {
						
						params = {   title: items[item].title, 
									link: items[item].link, 
									date: items[item].time ? items[item].time : "",
									hidden: i > numShown ? "extra_item" : ""
									};
						html[i++] = Y.Lang.substitute(templates["news_item"], params);
					} 
				}
				if (i > numShown) {
					html[i++] = '<li class="news_item show_extra" onclick=""><div class="title">Show more news</div></li>';
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
				container.setContent("There is no news for your stocks");
			}
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
}, '1.0.0', {requires: ['node', "PortfolioManager", "substitute", "util"]});