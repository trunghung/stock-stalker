(function () {
	window.Stock = window.Stock || {};
	var _unmatchedLots = [],
		_unmatchedPortNames = [],
		_matched = [],
		_matchedLots = [],
		_importing = -1;
	function addItem(port, lot) {
		// This is a cash line
		if (lot.Shares == lot.Value) {
			port.cash += lot.Shares;
		}
		else {
			port.lots.push(lot);
			_matchedLots.push({port: port.port, lot: lot});
		}
	}
	function _parseData(jsonText) {
		if (_importing != -1) {
			alert("Importing right now please wait");
			return {};
		}
		var i, item, port, ports = [], unmatchedPortSeen = {},
			data = JSON.parse(jsonText);
		_unmatchedLots = [];
		_matched = [];
		_matchedLots = [];
		_unmatchedPortNames = [];
		for (i in data) {
			item = data[i];
			// Ignore the portfolio name listing
			if (item.Value !== undefined) {
				// if we already found before, just reuse it no need to search again
				port = ports[item.Portfolio];
				// Searched and couldn't find this port before
				if (port == -1) {
					_unmatchedLots.push(item);
					if (!unmatchedPortSeen[item.Portfolio]) {
						unmatchedPortSeen[item.Portfolio] = true;
						_unmatchedPortNames.push(item.Portfolio);
					}
				}
				else if (port) {
					addItem(port, item);
				}
				else {
					port = Stock.Portfolios.getPortByName(item.Portfolio);
					if (port == null) {
						ports[item.Portfolio] = -1;	// mark this port as unmatched
					}
					else {
						var newPort = {name: item.Portfolio, lots: [], cash: 0, port: port};
						ports[item.Portfolio] = newPort;
						_matched.push(newPort);
						addItem(ports[item.Portfolio], item);
					}
				}
			}
		}
		return _getData();
	}
	function _getData() {
		return {matchedLots: _matched, unmatchedLots: _unmatchedLots, unmatchedPortNames: _unmatchedPortNames};
	}
	function _importLots() {
		if (_matchedLots.length > 0 && _importing == -1) {
			_importing = 0;
			_performImport();
		}
	}

	function _performImport() {
		var i, lot, port, lotInfo;
		if (_importing < _matchedLots.length) {
			port = _matchedLots[_importing].port;
			lot = _matchedLots[_importing].lot;
			lotInfo = { symbol:  lot.Symbol.toUpperCase(),
				type: 0,
				qty: lot.Shares || 0,
				fee: 0,
				transDate: new Date(),
				price: lot.Cost || 0,
				expiration: undefined,
				note: ""
			};
			Stock.Portfolios.addLot(port, lotInfo, function (err, lot) {
				if (!err) {
					console.log("Add lot succeeded " + _importing + " of " + _matchedLots.length );
					_importing++;
					setTimeout(_performImport, 0);
				}
				else {
					console.log("Add lot failed at " + _importing);
					_importing++;
					setTimeout(_performImport, 0);
				}
			}, true);
		}
		else {
			_importing = -1;
		}
	}

	function _performImportPort(port, i) {
		var lot, lotInfo;
		if (i < port.lots.length) {
			lot = port.lots[i];
			lotInfo = { symbol:  lot.Symbol.toUpperCase(),
				type: 0,
				qty: lot.Shares || 0,
				fee: 0,
				transDate: new Date(),
				price: lot.Cost || 0,
				expiration: undefined,
				note: ""
			};
			Stock.Portfolios.addLot(port.port, lotInfo, function (err, lot) {
				if (!err) {
					console.log("Add lot succeeded " + (i+1) + " of " + port.lots.length );

				}
				else {
					console.log("Add lot failed at " + (i+1));
				}
				setTimeout(function() {
					_performImportPort(port, i+1);
				}, 0);
			}, true);
		}
	}
	function getDataAction(el, levelUp) {
		return getDataset(el, "action", levelUp);
	}
	/********************************************************************************************************
	 * Find and extract the dataset attribute from the provided element or it parents (default look up 1 level up)
	 */
	function getDataset(el, key, levelUp) {
		levelUp = levelUp || 1;
		var i = 0, ret = {};
		while (el && i <= levelUp) {
			if (el.dataset && el.dataset[key]) {
				ret.el = el;
				ret.action = el.dataset[key];
				break;
			}
			i++; el = el.parentNode;	// step up
		}
		return ret;
	}
	$(document).on("tap", "#ImportLotsTool", function(e) {
		var info = getDataAction(e.target, 4),
			handled = true;
		switch(info.action) {
			case "ImportPort":
				var port = _matched[e.target.dataset.index];
				Stock.Portfolios.updateCash(port.port, port.cash);
				_performImportPort(port, 0);
				break;

			case "ResetPort":
				var port = _matched[e.target.dataset.index];
				Stock.Portfolios.updateCash(port.port, 0);
				Stock.Portfolios.removeAllPortLot(port.port, function(err, msg) {

				});
				break;
			default:
				handled = false;
				break;
		}
		if (handled)
			e.preventDefault();
	});
	Stock.Import = {
		parseData: _parseData,
		importLots: _importLots,
		getData: _getData
	};
})();