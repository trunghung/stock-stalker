
(function () {
	window.Stock = window.Stock || {};

	function init() {

		renderDashboard();

		var location = window.location.hash;
		//if (location.hash == "#Dashboard")
		//	$.mobile.changePage("#Dashboard");
		//else
		//	$.mobile.navigate("#Dashboard");

		if (location != "#Dashboard") {
			window.location.hash = "#Dashboard";
			// If we load the page with a dynamic page that doesn't exist, just clear the history and redirect to dashboard
			$.mobile.navigate.history.stack.splice(0, 1);
			$.mobile.navigate.history.initialDst = "Dashboard"
		}
		$.mobile.loading( "hide" );

		function onLoginOrOut() {
			render();
			if (Stock.Portfolios.isAuthed())
				$(".nav-panel").addClass("authed");
			else
				$(".nav-panel").removeClass("authed");
		}
		Stock.Portfolios.on("login", onLoginOrOut);
		Stock.Portfolios.on("logout", onLoginOrOut);
		Stock.Portfolios.on("portsReady", render);
		Stock.QuoteManager.on("quotesUpdated", render);
		Stock.QuoteManager.on("topNews", render);
		Stock.QuoteManager.on("news", render);
		Stock.Portfolios.portfolios.on("change", render);
		Stock.Portfolios.portfolios.on("add", render);
		Stock.Portfolios.portfolios.on("remove", render);
		Stock.Portfolios.lots.on("change", render);
		Stock.Portfolios.lots.on("add", render);
		Stock.Portfolios.lots.on("remove", render);

		bindUI();

		// Set a max-height to make large images shrink to fit the screen.
		$( document ).on( "pagebeforeshow", function(event, info) {
			$('.ui-header').trigger('resize');
		});
		$( document ).on( "pagechange", function(event, info) {
			render();
		});

		// Remove the popup after it has been closed to manage DOM size
		$( document ).on( "popupafterclose", ".ui-popup", function(e) {
			setTimeout(function() {
				$(e.currentTarget ).remove();
			}, 1000);
		});

		$( document ).on( "swipeleft", ".fixed-column-container", function( event ) {
			$(document).find(".fixed-column-container").scrollLeft($(document).find(".fixed-column-container").scrollLeft() + 100);

		});
		$( document ).on( "swiperight", ".fixed-column-container", function( event ) {
			$(document).find(".fixed-column-container").scrollLeft($(document).find(".fixed-column-container").scrollLeft() - 100);
		});

		setInterval(function() {
			Stock.QuoteManager.update();
		}, 300000);     // update quote once every 5 minutes
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
	function onAddPortSubmit(e) {
		var name = e.target.dataset.name ? e.target.dataset.name : $("#AddPort .name").val();
		if (name.length > 0) {
			console.log("Create new Port: " + name);
			Stock.Portfolios.createPort(name, function(err, port) {
				if (!err) {
					console.log("Add port succeeded");
					render();
				}
				else {
					console.log("Add port failed");
				}
			});
		}
		else {
			console.log("Invalid name");
			e.preventDefault();
		}
	}

	function extractLotFormInfo(el, edit) {
		var time = new Date(),
			expiration = new Date((new Date(el.find(".expiration").val())).getTime() + time.getTimezoneOffset()*60*1000),
			port = Stock.Portfolios.portfolios.get(el.find(".portfolios").val()),
			transType = el.find(".trans-type").val(),
			lot = { symbol:  el.find(".symbol").val().toUpperCase(),
				type: parseInt(el.find(".equity-type").val()) || 0,
				qty: parseFloat(el.find(".qty").val()) || 0,
				fee: parseFloat(el.find(".fee").val()) || 0,
				transDate: new Date((new Date(el.find(".date").val())).getTime() + time.getTimezoneOffset()*60*1000),
				price: parseFloat(el.find(".price").val()) || 0,
				expiration: !isNaN(expiration.getTime()) ? expiration : undefined,
				note: el.find(".note").val()
			};

		return {
			//!isNaN(lot.expiration.getTime())
			result: (port && (edit || transType) && !isNaN(lot.type) && lot.symbol && !isNaN(lot.qty) && !isNaN(lot.price) &&
				!isNaN(lot.transDate.getTime())),
			transType: transType,
			port: port,
			lot: lot
		};
	}
	function handleEditTrans(e) {
		var root = $("#AddTrans"), field,
			lot = Stock.Portfolios.lots.get(root.data().lot),
			info = extractLotFormInfo(root, true),
			port = info.port,
			lotInfo = info.lot,
			handled = false;
		if (lot && info.result) {
			for (field in lotInfo) {
				if (lot.get(field) != lotInfo[field]) {
					lot.set(field, lotInfo[field]);
				}
			}
			lot.save({
				success: function () {
					console.log("Edit lot succeeded");
					render();
				},
				error: function (obj, error) {
					console.log("Edit lot failed");
					// TODO: revert change
				}});
			handled = true;
		}
		else {
			console.log("Invalid transaction info");
		}
		return handled;
	}

	function handleAddTrans(e) {
		var root = $("#AddTrans"),
			info = extractLotFormInfo(root),
			port = info.port,
			lot = info.lot,
			handled = false;
		if (info.result) {
			if (info.transType == "buy") {
				Stock.Portfolios.addLot(port, lot, function (err, lot) {
					if (!err) {
						console.log("Add lot succeeded");
						render();
					}
					else {
						console.log("Add lot failed");
					}
				});
				handled = true;
			}
		}
		else {
			console.log("Invalid transaction info");
		}
		return handled;
	}

	function getAncestor(el, selector, stopAt)
	{
		if (!el)
			return null;

		stopAt = stopAt || document.body;

		var t = el;

		while (t != stopAt)
		{
			if (elMatchesSelector(t, selector))
				return t;
			t = t.parentNode;
		}

		function elMatchesSelector(el, selector)
		{
			var p = el.parentNode,
				selected = p.querySelectorAll(p.tagName + " > " + selector);

			for (i = 0; i < selected.length; i++)
			{
				if (selected[i] == el)
					return true;
			}
		}
	}

	function onClick(e) {
		var info = getDataAction(e.target, 4),
			handled = true;
		switch(info.action) {
			case "login":
				renderPopup("Login", "Login", {});
				$("#Login").popup("open").enhanceWithin();
				$('#Login form').on('submit', function (e) {
					$("#Login").popup("close");
					Stock.Portfolios.login($("#Login .un").val(), $("#Login .pw").val(), function(err) {
						if (err) {
							alert("Login failed. Please try again.")
						}
					});
					e.preventDefault();
				});
				break;
			case "logout":
				Stock.Portfolios.logout();
				break;
			case "showSignup":
				renderPage("Signup", "Signup", {});
				$.mobile.navigate("#Signup");
				var page = $("#Signup");

				page.find('form').on('submit', function (e) {
					var username = page.find(".un").val(),
						pass = page.find(".pw").val(),
						pass2 = page.find(".pw2").val(),
						fn = page.find(".fn").val(),
						ln = page.find(".ln").val(),
						email = page.find(".em").val();
					if (pass == pass2) {
						if (fn && ln && email) {
							Stock.Portfolios.createAccount(username, pass, fn, ln, email, function (err, msg) {
								if (err) {
									alert("Registration failed. Please try again. " + msg);
								}
								else {
									$.mobile.navigate("#Dashboard");
									alert("Welcome " + fn);
									page.remove();
								}
							});
						}
						else {
							alert("Please fill out all the information");
						}
					}
					else {
						alert("Password doesn't match");
					}
					e.preventDefault();
				});
				break;
			case "viewPort":
				if (renderViewPort(info.el.dataset.id)) {
					$.mobile.navigate("#ViewPort");
				}
				break;
			case "viewPorts":
				if (renderViewPorts())
					$.mobile.navigate("#ViewPorts");
				break;
			case "viewStock":
				if (renderViewStock(info.el.dataset.symbol, info.el.dataset.lot)) {
					Stock.QuoteManager.downloadSingleQuote(info.el.dataset.symbol);
					$.mobile.navigate("#ViewStock");
				}
				break;
			case "viewImportTool":
				var context = Stock.Import.getData();
				context.header = "Import Transactions";
				renderPage("ImportLotsTool", "ImportLotsTool", context);
				$.mobile.navigate("#ImportLotsTool");
				break;
			case "import-preview":
				var input = document.querySelector(".import-json").value,
					context = Stock.Import.parseData(input);
				context.header = "Import Transactions";
				context.data = input;
				renderPage("ImportLotsTool", "ImportLotsTool", context);
				break;
			case "viewNewsArticle":
				$.mobile.loading( "show" );
				var item = Stock.QuoteManager.getNewsItem(info.el.dataset.link, info.el.dataset.topnews == 1);
				function renderNewsArticle(newsItem) {
					if (newsItem) {
						renderPage("ViewNewsArticle", "ViewNewsArticle", newsItem);
						$.mobile.navigate("#ViewNewsArticle");
						$.mobile.loading("hide");
					}
					else {
						alert("Failed to load news article");
					}
				}

				renderNewsArticle(item);
				Stock.News.getNewsContent(item, renderNewsArticle);
				break;
			case "viewNews":
				if (renderViewNews()) {
					$.mobile.navigate("#ViewNews");
				}
				break;
			case "viewMarket":
				renderViewMarket();
				$.mobile.navigate("#ViewMarket");
				break;
			case "viewDashboard":
				$.mobile.navigate("#Dashboard");
				break;
			case "viewPorts":
				$.mobile.navigate("#Portfolios");
				break;
			case "viewAddPort":
				renderPopup("AddPort", "AddPort", {});
				$("#AddPort").popup("open");
				break;
			case "viewAddTrans":
				// Refresh the portfolio to prevent stale info
				Stock.Portfolios.update();
				renderPopup("AddTrans", "AddTrans", { ports: Stock.Portfolios.portfolios.toJSON(), transDate: new Date() });
				$("#AddTrans").popup("open");
				break;
			case "viewEditTrans":
				var lot = Stock.Portfolios.lots.get(info.el.dataset.lot);
				if (lot) {
					renderPopup("AddTrans", "AddTrans", { edit: true, ports: Stock.Portfolios.portfolios.toJSON(), lot: lot.toJSON(), transDate: lot.get("transDate") });
					$("#AddTrans").popup("open");
				}
				break;
			case "editLot":
				handled = !handleEditTrans(e);
				break;
			case "addTrans":
				handled = !handleAddTrans(e);
				break;
			case "toggleAlt":
				var el = getAncestor(e.target, ".summary-list-container");
				if (el) {
					if (el.classList.contains("show-alt"))
						el.classList.remove("show-alt");
					else
						el.classList.add("show-alt");
				}
				break;
			case "toggleOverlayBtns":
				var el = getAncestor(e.target, ".summary-list-container");
				if (el) {
					if (el.classList.contains("show-btn"))
						el.classList.remove("show-btn");
					else
						el.classList.add("show-btn");
				}
				break;
			case "AddPort":
				onAddPortSubmit(e);
				handled = false;
				break;
			case "import":
				Stock.Import.importLots();
				break;
			case "refresh":
				Stock.Portfolios.update();
				Stock.QuoteManager.update();
				break;
			case "sellLot":
				var lot = Stock.Portfolios.lots.get(info.el.dataset.lot);
				if (lot) {
					var price = prompt("What was the sell price for " + lot.get("symbol") + "?");
					if (price > 0) {
						var qty = prompt("How many shares to sell?", lot.get("qty"));
						if (qty > 0) {
							Stock.Portfolios.sellLot(lot, qty, price, 0);
						}
					}

				}
				break;
			case "setPortCash":
				var port = Stock.Portfolios.portfolios.get(info.el.dataset.id);
				if (port) {
					var cash = prompt("What's the cash balance for " + port.get("name") + "?");
					if (cash)
						cash = cash.replace(",", "");
					cash = parseFloat(cash);
					if (cash != NaN) {
						Stock.Portfolios.updateCash(port, cash);
					}
				}
				else {
					alert("Can't find the portfolio");
				}
				break;
			default:
				handled = false;
				break;
		}
		if (handled)
			e.preventDefault();
	}
	function bindUI() {
		$(document).on("tap", onClick);
	}

	function _sumTotalForLots(lotsList, context) {
		context = context || {};
		if (lotsList.length > 0) {
			context.gain = 0;
			context.marketValue = 0;
			context.valueDelta = 0;

			lotsList.forEach(function (lot) {
				context.gain += lot.gain;
				context.marketValue += lot.marketValue;
				context.valueDelta += lot.valueDelta;
			});
			context.gainPercent = toFixed(context.gain * 100 / (context.marketValue - context.gain));
			context.valueDeltaPercent = toFixed(context.valueDelta * 100 / (context.marketValue - context.valueDelta));
		}
		return context;
	}
	function renderViewStock(symbol, portId) {
		if (symbol) {
			var start = new Date(),
				symbols = Stock.Portfolios.getAllRelatedSymbols(symbol),
				lotsBySumbols = [];
			symbols.forEach(function(symbol) {
				var symLot = Stock.Portfolios.getAllLots({symbol: symbol, portId: portId });
				if (symLot.lots.length > 0)
					lotsBySumbols.push(symLot);
			});

			var context = {
				lotsBySumbols : lotsBySumbols,
				quote : Stock.QuoteManager.quotes[symbol],
				headlines : Stock.QuoteManager.getNews(symbol)
			};
			_sumTotalForLots(lotsBySumbols, context);

			renderPage("ViewStock", "ViewStock", context);

			var page = document.querySelector("#ViewStock");
			if (page) {
				if (portId)
					page.dataset.port_id = portId;
				else
					delete page.dataset.port_id;

				page.dataset.symbol = symbol;
			}

			//alert("Render time: " + ((new Date()).getTime() - start.getTime()) + "ms");
			return true;
		}
		return false;
	}

	function setTitle(elRoot, name) {
		elRoot.querySelector("#header .header-title").innerText = name;
	}

	function renderViewPort(portId) {
		var start = new Date(),
			showPortName = false;
		var port = null,
			singleLot = true,
			lots = Stock.Portfolios.getCombinedLots({ portId: portId, getSublots: true });
			//lots = Stock.Portfolios.getCombinedLots({  });//
			//lots = Stock.Portfolios.getAllLots({ portId: portId });

		if (portId == "all") {
			showPortName = singleLot;
			port = { objectId: "all", name: "All Portfolios", cash: Stock.Portfolios.getAllCash()};
		}
		else {
			port = Stock.Portfolios.portfolios.get(portId);
		}
		if (port) {
			var context = {
				port: port.toJSON ? port.toJSON() : port,
				lotsInfo: lots,
				showPortName: showPortName
			};

			context.lotsInfo.lots.sort(function(a, b) {
				// Sort lots by name then value
				if (a.symbol == b.symbol) {
					return (a.marketValue || b.marketValue) ? b.marketValue - a.marketValue : 0;
				}
				else
					return a.symbol > b.symbol ? 1 : -1;
			});

			// Include cash in the port market value
			context.lotsInfo.marketValue += context.port.cash;
			renderPage("ViewPort", "ViewPort", context);

			var page = document.querySelector("#ViewPort");
			if (page) {
				page.dataset.port_id = portId;
				setTitle(page, context.port.name);
			}

			//alert("Render time: " + ((new Date()).getTime() - start.getTime()) + "ms");
			return true;
		}
		return false;
	}
	function renderPopup(template, pageId, context) {
		var cssSel = "#" + pageId,
			page = document.querySelector(cssSel);
		if (page)
			page.remove();
		if (!page) {
			context.pageId = pageId;
			var html = Stock.Template.render(template, context);
			var el = document.createElement("div");
			el.innerHTML = html;
			document.body.appendChild(el.firstChild);
			$(cssSel).popup();
		}
	}
	function renderPage(template, pageId, context) {
		var cssSel = "#" + pageId,
			page = document.querySelector(cssSel);
		context = context || {};
		context.authenticated = Stock.Portfolios.isAuthed();
		if (!page) {
			context.pageId = pageId;
			var html = Stock.Template.render("Page", context);
			var el = document.createElement("div");
			el.innerHTML = html;
			document.body.appendChild(el.firstChild);
		}
		else if (page.dataset.temp == 1) {
			page.dataset.temp = 0;
			context.noPageDiv = true;
			Stock.Template.renderInto("Page", context, page);
		}
		page = document.querySelector(cssSel);
		if (page) {
			Stock.Template.renderInto(template, context, page.querySelector("[data-role='main']"));
			$(cssSel).trigger('create');
		}
	}

	function getPortContext(portId) {
		var context = null,
			port = Stock.Portfolios.portfolios.get(portId),
			lotInfo = Stock.Portfolios.getPortLots(portId, true, true);
		if (port) {
			context = port.toJSON();
		}
		else if (portId == "all")
			context = { cash: Stock.Portfolios.getAllCash() };

		if (context) {
			context.marketValue = toFixed(lotInfo.marketValue + context.cash, 0);
			context.valueDelta = toFixed(lotInfo.valueDelta, 0);
			context.gain = toFixed(lotInfo.gain, 0);
			context.cost = toFixed(lotInfo.cost, 0);
			context.valueDeltaPercent = toFixed(lotInfo.valueDeltaPercent);
			context.gainPercent = toFixed(lotInfo.gainPercent);
		}
		return context;
	}

	function renderViewPorts() {
		var context = { myPorts: [] };
		var portContext = getPortContext("all");
		if (portContext)
			context.allPorts = portContext;
		Stock.Portfolios.portfolios.forEach(function(port) {
			portContext = getPortContext(port.id);
			if (portContext)
				context.myPorts.push(portContext);
		});
		context.myPorts.sort(function(a, b) {
			if (a.marketValue || b.marketValue)
				return b.marketValue - a.marketValue;
			else
				return a.name > b.name ? 1 : (a.name == b.name ? 0 : -1);
		});
		context.header = "Portfolios";
		renderPage("ViewPorts", "ViewPorts", context);
		return true;
	}
	function renderViewNews() {
		var context = { headlines: Stock.QuoteManager.getStocksNews(),
		header: "News"
		};
		renderPage("News", "ViewNews", context);
		return true;
	}
	function renderViewMarket() {
		var context = { topNews: 1, header: "Top News" };
		context.myStocks = Stock.Portfolios.getWatchList({ ignoreOptions: true });
		var news = Stock.QuoteManager.getTopNews();
		if (news.length > 0)
			context.headlines = news;
		context.myStocks.sort(function(a, b) {
			if (a.symbol == b.symbol) {
				return 0;
			}
			return a.symbol > b.symbol ? 1 : -1;
		});
		renderPage("Market", "ViewMarket", context);
		return true;
	}
	function renderDashboard() {
		var context = { };
		context.myStocks = Stock.Portfolios.getCombinedLots({ ignoreOptions: false }).lots;
		context.earnings = Stock.QuoteManager.getEarnings();
		context.indices = ["^GSPC", "^DJI", "^IXIC"];

		var portContext = Stock.Portfolios.getAllLots();
		if (portContext) {
			portContext.cash = Stock.Portfolios.getAllCash();
			portContext.marketValue += portContext.cash;	// Include cash in the portfolio market value
			context.allPorts = portContext;
		}

		context.myStocks.sort(function(a, b) {
			a = Math.abs(a.valueDelta) || 0;
			b = Math.abs(b.valueDelta) || 0;
			return b - a;
		});
		renderPage("Dashboard", "Dashboard", context);
	}

	function render() {
		var page = document.querySelector(".ui-page-active");
		switch(page ? page.dataset.url : location.hash) {
			case "Dashboard":
				renderDashboard();
				break;
			case "ViewStock":
				renderViewStock(page.dataset.symbol, page.dataset.port_id);
				break;
			case "ViewPort":
				renderViewPort(page.dataset.port_id);
				break;
			case "ViewPorts":
				renderViewPorts();
				break;
			case "ViewNews":
				renderViewNews();
				break;
			case "ViewMarket":
				renderViewMarket();
				break;
		}
	}
	Stock.App = {
		init: init
	};
	if (window.Parse && Parse.Events)
		_.extend(Stock.Portfolios, Parse.Events);


})();

