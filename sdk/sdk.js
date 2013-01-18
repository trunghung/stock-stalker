YUI.add('mUI', function (Y) {
    Y.namespace('mUI');
    var portraitVal = "portrait";
    var landscapeVal = "landscape";
    var mobileUI = function() {
        var _clickBlocking = false,
        _hasOrientationEvent = false,
        _isPortrait = 0,
        _onLoad = function(port_id, nodeRoot) {
            Y.delegate("mSDK|click", _onPageLinClicked, "body", ".pageLink");

            if (typeof window.onorientationchange == "object") {
        		window.onorientationchange = _orientChangeHandler;
        		_hasOrientationEvent = true;
        		setTimeout(_orientChangeHandler, 0);
        	}
        },
        _isPortraitMode = function() {
        	var orientation=window.orientation,
        	portrait = true;
        	if (orientation == 90 || orientation == -90)
        		portrait = false;
        	return portrait;
        },
        _getIsPortrait = function() {
        	return _isPortrait;
        },
        _orientChangeHandler = function() {
        	var isPortrait = _isPortraitMode(), node;
        	if (_isPortrait === 0 || _isPortrait !== isPortrait) {
        		_isPortrait = isPortrait;
    			node = Y.one("body");
    			node.addClass(_isPortrait ? portraitVal : landscapeVal);
    			node.removeClass(!_isPortrait ? portraitVal : landscapeVal);
        		
        		log("Orientation changed. " + (_isPortrait ? portraitVal : landscapeVal));
            	Y.fire("orientationChanged", isPortrait);
        	}
        },
        _clickCheck = function(e) {
        	var curTime = new Date().getTime();
            if (_clickBlocking != 0 && curTime - _clickBlocking <  500) {
                log("mUI: Prevent fast clicking");
                e.halt();
                return false;
            }
            else {
                // We will only allow 1 click every 1 seconds 
                _clickBlocking = curTime;
                setTimeout(function(){
                	_clickBlocking = 0;
                }, 500);
            }
            return true;    // This click is OK
        },
        _onPageLinClicked = function(e) {
            var target = e.currentTarget,
            curPage = _getCurrentPage(),
            targetPageId, curPageId, selector;
            if (target && _clickCheck(e)) {
                targetPageId = target.getAttribute("targetPage");
                curPageId = curPage.getAttribute("targetPage");
                if (targetPageId && curPageId !== targetPageId) {
                    e.preventDefault();
                    Y.fire("mUI_BeforePageChange", targetPageId);
                    selector = "#" + targetPageId;
                    // If the page exists, we show it right away, otherwise, don't                        
                    if (Y.one(selector)) {
                        _showPageById(targetPageId);
                    }
                    else {
                        log("mUI: Page doesn't exist so we will wait for it to be available first");
                        Y.on('contentready', Y.bind(_showPageById, this, targetPageId), selector, this);
                    }
                }
                else if (curPageId) {
                    log("mUI: Already on same page.  No need to navigate. #" + curPageId);
                }
            }
        },
        _returnHome = function() {
            // TODO: configure home page
            _showPageById("home");
        },
        _showPageById = function(pageId) {
            Y.later(100,  this, function() {
                iui.showPageById(pageId);
                // TODO Check if there is no page change, no need to fire event
                Y.fire("mUI_PageChange", pageId);
            }, false);
        },
        _getCurrentPage = function () {
            return Y.one("[selected='true']");
        },
        _getOrCreateLoadingScreen = function() {
            if (!Y.one("#loading")) {
                Y.one("body").append('<div id="loading"><div class="box"><img src="./res/spinner-w-s.gif"><div class="caption">Loading</div></div></div>');
            }
            return Y.one("#loading");
        },
        _showLoading = function() {
            var nodeLoading = _getOrCreateLoadingScreen(), styles, paddingTop;
            if (nodeLoading) {
                paddingVert = parseInt((window.innerHeight - 100)/2) + "px";
                paddingHoriz = parseInt((window.innerWidth - 100)/2) + "px";
                styles = {
                            width: window.innerWidth,
                            height: window.innerHeight,
                            display: "block",
                            "padding": paddingVert + " " + paddingHoriz
                };
                nodeLoading.setStyles(styles);
            }
        },
        _hideLoading = function() {
            var nodeLoading = _getOrCreateLoadingScreen();
            if (nodeLoading) {
                nodeLoading.setStyle("display", "none");                
            }
        },
        _getPageHeight = function() {
        	return window.innerHeight + "px";
        };
        _onLoad();
        return {
            getCurrentPage: _getCurrentPage,
            showPageById: _showPageById,
            returnHome: _returnHome,
            showLoading: _showLoading,
            hideLoading: _hideLoading,
            clickCheck: _clickCheck,
            getIsPortrait: _getIsPortrait,
            onLoad: _onLoad
        };
    };
    Y.mUI = new mobileUI();
    log("mUI: mUI loaded");
    // TODO remove util dependency
}, '1.0.0', {requires: ["node", "iui"]});   