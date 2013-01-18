
YUI.add('edit_portfolio', function (Y) {
    Y.namespace('Stock');
    var EditPort = function() {
        var _util = Y.Stock.util,
        _portMgr = Y.Stock.portMgr,
        _portId = null,
        _root = null,
        _render = function(portId) {
            var deleteBtn, port = null, html = [], i=0, 
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
}, '1.0.0', {requires: ["iui", 'node', "PortfolioManager", "util", "templates"]});