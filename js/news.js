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
}, '1.0.0', {requires: ['node', "PortfolioManager", "substitute", "util"]});