(function(){dust.register("earnings_cal",body_0);function body_0(chk,ctx){return chk.write("\t<h2 class=\"section_title\">Upcoming Earnings</h2>\n<ul>\n").section(ctx.get("earnings"),ctx,{"block":body_1},null).write("</ul>");}function body_1(chk,ctx){return chk.write("<li>").reference(ctx.get("symbol"),ctx,"h").write(" <span class=\"date\">").reference(ctx.get("shortEarningsDate"),ctx,"h").write("</span></li>\n");}return body_0;})();(function(){dust.register("feature_block",body_0);function body_0(chk,ctx){return chk.write("<div class=\"round_block color_bg entry\" stock=\"").reference(ctx.get("symbol"),ctx,"h").write("\" shares=\"").reference(ctx.get("shares"),ctx,"h").write("\" noPrefix=\"").reference(ctx.get("noPrefix"),ctx,"h").write("\"> \n\t<div class=\"block lighter_bg header\">\n\t    <span class=\"name\">").reference(ctx.get("name"),ctx,"h").write("</span>\n\t    <span class=\"value right-align price\"></span>\n\t</div>\n\t<div class=\"block content positive\">\n\t    <span class=\"change\"></span> \n\t    <span class=\"value right-align percent-change\"></span>\n\t</div>\n </div>");}return body_0;})();(function(){dust.register("home",body_0);function body_0(chk,ctx){return chk;}return body_0;})();(function(){dust.register("main",body_0);function body_0(chk,ctx){return chk.write("<div id=\"header\" class=\"toolbar prerender_hidden hidden\">\n    <h1 id=\"pageTitle\"></h1>\n    <a id=\"backButton\" class=\"button\" href=\"#\"></a>\n    <a id=\"save_btn\" class=\"button blueButton hidden\">Save</a>\n    <a id=\"edit_btn\" class=\"button hidden\">Edit</a>\n\t<span id=\"refreshBtn\" class=\"visible button refresh_quotes\" title=\"Refresh quotes\"><img class=\"toolbar_btn_icon\" src=\"./res/sync.png\"></span>\n</div>\n<div id=\"login\" class=\"page panel\" title=\"\" toolbar=\"false\">\n\t<h2 class=\"load_title\">Loading...</h2>\n\t<div id=\"auth_iframe\"></div>\n</div>\n<form id=\"editStock\" class=\"dialog\"></form>\n<form id=\"new_trans\" class=\"dialog\"></form>\n\n<div id=\"home\" class=\"page panel prerender_hidden\" title=\"Home\" button=\"refreshBtn\"  selected=\"true\">\n\t<ul class=\"tabs three_tabs\">\n\t\t<li class=\"viewHome tab first active\" view=\"viewHome\" onclick=\"\"><a>Snapshot</a></li><li class=\"viewNews tab\" view=\"viewNews\" onclick=\"\"><a>Market News</a></li><li class=\"viewPortfolios tab last\" view=\"viewPortfolios\" onclick=\"\"><a>Portfolios</a></li><!--<li class=\"viewChart tab last\" view=\"viewChart\" onclick=\"\"><a>Chart</a></li>-->\n\t</ul>\t\t\n\t<div class=\"viewHome tab_content active\">\n\t\t<div class=\"feature_blocks\">\n\t\t\t<table>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"feature_block slot_0\" >\n\t\t\t\t  </td>\n\t\t\t\t\t<td class=\"feature_block slot_1 last\" >\n\t\t\t\t  </td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"feature_block slot_2\">\n\t\t\t\t  </td>\n\t\t\t\t\t<td class=\"feature_block slot_3 last\">\n\t\t\t\t  </td>\n\t\t\t\t</tr>\n\t\t\t\t<tr>\n\t\t\t\t\t<td class=\"feature_block slot_4\">\n\t\t\t\t  </td>\n\t\t\t\t\t<td class=\"feature_block slot_5 last\">\n\t\t\t\t  </td>\n\t\t\t\t</tr>\n\t\t\t</table>\n\t\t</div>\n\t\t<div class=\"earnings-cal\">\n\t\t</div>\n\t</div>\n\t<div class=\"viewNews tab_content\">\n\t\t<h2 class=\"section_title\">Business Top News</h2>\n\t\t<ul id=\"scroll-content\" class=\"block rounded news_container hide_extra_items\"></ul>\n\t</div>\n\t<div id=\"portfolio_summaries\" class=\"viewPortfolios tab_content\"></div>\n\t<div class=\"quote_update tip\"></div>\n\t<div class=\"viewChart tab_content\">\n\t\t<div class=\"chart hidden\">\n\t\t\t<div class=\"port_name\"></div>\n\t\t\t<div class=\"content\"></div>\n\t\t</div>\n\t</div>\n\t<table id=\"app_toolbar\" class=\"buttons\">\n\t\t<tr>\n\t\t\t<td><button class=\"pageLink flat_button\" targetPage=\"news\">News</button></td>\n\t\t\t<td><button class=\"pageLink flat_button\" targetPage=\"settings\">Settings</button></td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td><button class=\"pageLink flat_button newPort\">New Portfolio</button></td>\n\t\t\t<td><button class=\"pageLink flat_button logout\">Logout</button></td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td><button class=\"pageLink flat_button exportHist\">Export History</button></td>\n\t\t\t<td></td>\n\t\t</tr>\n\t</table>\n\t<div id=\"debug_tool\" class=\"hidden\">\n\t\t<br><br>\n\t\t<h2>These buttons for Debug Purpose</h2>\n\t\t<table class=\"buttons\">\n\t\t\t<tr>\n\t\t\t\t<td><button id=\"save\" class=\"flat_button\">Save</button></td>\n\t\t\t\t<td><button id=\"clear\" class=\"flat_button\">Clear</button></td>\n\t\t\t</tr>\n\t\t</table>\t\n\t\t<table class=\"buttons\">\n\t\t\t<tr>\n\t\t\t\t<td><button class=\"dump_cache flat_button\">Dump Cache</button></td>\n\t\t\t\t<td><button class=\"toggle_log flat_button\">Log</button></td>\n\t\t\t</tr>\n\t\t</table>\n\t</div>\n\t<div id=\"logconsole\" class=\"hidden\">Log: <button class=\"toggle_log\">Hide</button> - <button class=\"clear_log\">Clear Log</button><br><div id=\"log\"></div></div>\n\t\t\n</div>\n<div id=\"view_pf\" class=\"page panel view_pf\" title=\"Portfolio\" button=\"refreshBtn\" > </div>\n<div id=\"view_stock\" class=\"page panel edit\" title=\"Stock\" button=\"\" > </div>\n<div id=\"settings\" class=\"page panel\" title=\"Settings\" class=\"panel iui\"> </div>");}return body_0;})();(function(){dust.register("portfolio_stocks_list",body_0);function body_0(chk,ctx){return chk.write("<table class=\"stocks even_odd\" port_id=\"").reference(ctx.getPath(false,["port","id"]),ctx,"h").write("\">\n\t").exists(ctx.get("viewPerf"),ctx,{"block":body_1},null).exists(ctx.get("viewPosition"),ctx,{"block":body_2},null).section(ctx.get("positions"),ctx,{"block":body_3},{"portId":ctx.get("id")}).write("</table>");}function body_1(chk,ctx){return chk.write("<tr class=\"header\">\n\t\t<th class=\"header title\">Symbol</th>\n\t\t<th class=\"header title info double\" colspan=\"2\">Last Trade</th>\n\t\t<th class=\"header title info double\" colspan=\"2\">Day's Change</th>\n\t\t<th class=\"header title info double landscape_col\" colspan=\"2\">Market Value & Gain</th>\n\t</tr>\n\t");}function body_2(chk,ctx){return chk.write("<tr class=\"header\">\n\t\t<th class=\"header title\">Symbol</th>\n\t\t<th class=\"header title info\">Shares</th>\n\t\t<th class=\"header title info double\" colspan=\"2\">Gain/Loss</th>\n\t\t<th class=\"header title info\">Value</th>\n\t\t<th class=\"header title info landscape_col\">Position</th>\n\t</tr>\n\t");}function body_3(chk,ctx){return chk.write("<tr class=\"group_content entry\" sym=\"").reference(ctx.get("symbol"),ctx,"h").write("\" lotId=\"").reference(ctx.get("id"),ctx,"h").write("\" index=\"").reference(ctx.get("$idx"),ctx,"h").write("\" onclick=\"\">\n").section(ctx.get("tags"),ctx,{"block":body_4},{"index":ctx.get("$idx")}).write("</tr>\n");}function body_4(chk,ctx){return chk.write("<td class=\"update_target info ").reference(ctx.getPath(true,[]),ctx,"h").write(" ").section(ctx.get("getTagClass"),ctx,{},{"tag":ctx.getPath(true,[]),"index":ctx.get("index")}).write("\" val-type=\"").reference(ctx.getPath(true,[]),ctx,"h").write("\">\n\t\t\t\t").section(ctx.get("getTagValue"),ctx,{},{"tag":ctx.getPath(true,[]),"index":ctx.get("index")}).write("</td>\n\t\t");}return body_0;})();(function(){dust.register("portfolio_summary",body_0);function body_0(chk,ctx){return chk.write("<div class=\"port_summary\" port_id=\"").reference(ctx.get("id"),ctx,"h").write("\" onclick=\"\">\n\t<div class=\"round_block\" >\n\t    <div class=\"block header lighter_bg\">\n\t\t   <h2 class=\"name\">").reference(ctx.get("name"),ctx,"h").write("<span class=\"market-value value right-align\">").reference(ctx.get("market_value"),ctx,"h").write("</span></h2> \n\t    </div>\n\t    <div class=\"block loading last_block\">Loading...</div>\n\t    <div class=\"block content hidden\">\n\t\t   <table class=\"content row\">\n\t\t\t  <tr class=\"cash_balance\">\n\t\t\t\t <td><div class=\"label\">Cash Balance</div></td>\n\t\t\t\t <td><div class=\"value info\">").reference(ctx.get("cash"),ctx,"h").write("</div></td>\n\t\t\t  </tr>\n\t\t\t  <tr class=\"gain\">\n\t\t\t\t <td><div class=\"label\">Gain/Loss</div></td>\n\t\t\t\t <td><div class=\"value info negative\">").reference(ctx.get("gain"),ctx,"h").write("</div></td>\n\t\t\t  </tr>\n\t\t\t  <tr class=\"value-delta\">\n\t\t\t\t <td><div class=\"label\">Day Change</td>\n\t\t\t\t <td><div class=\"value info\">").reference(ctx.get("value_delta"),ctx,"h").write("</div></td>\n\t\t\t  </tr>\n\t\t   </table>\n\t    </div>\n\t</div>\n</div>");}return body_0;})();(function(){dust.register("settings",body_0);function body_0(chk,ctx){return chk.write("<h2>Change Your Portfolio Settings</h2>            \n<br><br><h2>Portfolio Summary Settings</h2> \n<fieldset class=\"home_group group\">\n    <div class=\"row\">\n\t   <label>Show Gain/Loss</label>\n\t   <div class=\"toggle\" name=\"hideHomeSumGain\" onclick=\"\" toggled=\"").reference(ctx.get("showGain"),ctx,"h").write("\"><span class=\"thumb\"></span><span class=\"toggleOn\">show</span><span class=\"toggleOff\">hide</span></div>\n    </div>\n    <div class=\"row\">\n\t   <label>Show Cash Balance</label>\n\t   <div class=\"toggle\" name=\"hideHomeSumCash\" onclick=\"\" toggled=\"").reference(ctx.get("showCash"),ctx,"h").write("\"><span class=\"thumb\"></span><span class=\"toggleOn\">show</span><span class=\"toggleOff\">hide</span></div>\n    </div>\n    <!--\n    <div class=\"row hidden\">\n\t   <label>Auto refresh every 30 seconds </label>\n\t   <div class=\"toggle\" name=\"autoRefreshInterval\" onclick=\"\" toggled=\"false\"><span class=\"thumb\"></span><span class=\"toggleOn\">auto</span><span class=\"toggleOff\">off</span></div>\n    </div>\n    <div class=\"row hidden\">\n\t   <label>Show Day\\'s Value Change</label>\n\t   <div class=\"toggle\" name=\"hideHomeSumValueChange\" onclick=\"\" toggled=\"true\"><span class=\"thumb\"></span><span class=\"toggleOn\">show</span><span class=\"toggleOff\">hide</span></div>\n    </div>\n    <div class=\"row hidden\">\n\t   <label>Show News Headlines</label>\n\t   <div class=\"toggle\" name=\"hideHomeTopNews\" onclick=\"\" toggled=\"true\"><span class=\"thumb\"></span><span class=\"toggleOn\">show</span><span class=\"toggleOff\">hide</span></div>\n    </div>\n    <div class=\"row hidden\">\n\t   <label>Show Movers & Shakers</label>\n\t   <div class=\"toggle\" name=\"hideHomeMovers\" onclick=\"\" toggled=\"true\"><span class=\"thumb\"></span><span class=\"toggleOn\">show</span><span class=\"toggleOff\">hide</span></div>\n    </div>\n    -->\n</fieldset>\n<br><br><h2>Combine positions of same stock</h2> \n<fieldset class=\"group\">\n\t<div class=\"row\">\n\t\t<label>Combine positions</label>\n\t\t<div class=\"toggle\" name=\"expandPositions\" onclick=\"\" toggled=\"").reference(ctx.get("expandPositions"),ctx,"h").write("\"><span class=\"thumb\"></span><span class=\"toggleOn\">yes</span><span class=\"toggleOff\">no</span></div>\n\t </div>\n</fieldset>  ");}return body_0;})();(function(){dust.register("view_portfolio_page",body_0);function body_0(chk,ctx){return chk.write("<div id=\"summary_container\">\n\t").section(ctx.get("port"),ctx,{"block":body_1},null).write("</div>\n<ul class=\"tabs two_tabs\">\n\t<li class=\"viewPerformance tab first\" view=\"viewPerformance\" onclick=\"\"><a>Gain/Loss</a></li><li class=\"viewPosition tab last\" view=\"viewPosition\" onclick=\"\"><a>Position</a></li>\n</ul>\n<div id=\"stocks_container\">\n").partial("portfolio_stocks_list",ctx,null).write("</div>\n<div class=\"tip\">*Turn your phone to landscape mode to display more info</div>\n<table class=\"buttons toolbar \">\n\t<tr>\n\t\t <td><button class=\"pageLink flat_button edit_cash\">Edit Cash Balance</button></td>\n\t\t <td><button class=\"pageLink flat_button rename\">Rename</button></td>\n\t</tr>\n\t<tr>\n\t\t <td><button class=\"pageLink flat_button record_buy\">Record a Buy</button></td>\n\t\t <td><button class=\"pageLink flat_button rename record_sell\">Record a Sell</button></td>\n\t</tr>\n\t<tr>\n\t\t <td><button class=\"pageLink flat_button edit_positions\">Edit Positions</button></td>\n\t\t <td><button class=\"pageLink flat_button delete_port\">Delete Portfolio</button></td>\n\t</tr>\n</table>\n<div class=\"chart hidden\"><div class=\"content\"></div></div>");}function body_1(chk,ctx){return chk.partial("portfolio_summary",ctx,null);}return body_0;})();(function(){dust.register("view_stock",body_0);function body_0(chk,ctx){return chk.write("<div class=\"page_content\">\n\t<ul class=\"nav_tabs tabs four_tabs\">\n\t\t<li class=\"viewQuote tab first active\" view=\"viewQuote\" onclick=\"\"><a>Quote</a></li>\n\t\t<li class=\"viewLots tab\" view=\"viewLots\" onclick=\"\"><a>Lots</a></li>\n\t\t<li class=\"viewNews tab\" view=\"viewNews\" onclick=\"\"><a>News</a></li>\n\t\t<li class=\"viewChart tab last\" view=\"viewChart\" onclick=\"\"><a>Chart</a></li>\n\t</ul>\n\t<div class=\"viewChart tab_content round_block\">\n\t\t<div class=\"block header dark_bg\">\n\t\t\t").section(ctx.get("quote"),ctx,{"block":body_1},null).write("</div>\n\t\t<div class=\"block content\">\n\t\t\t<img class=\"chart\" src=\"\" width=\"90%\">\n\t\t</div>\t\t\n\t\t<ul class=\"chart_range tabs five_tabs\">\n\t\t\t<li class=\"1d tab first\" view=\"1d\" onclick=\"\"><a>1d</a></li>\n\t\t\t<li class=\"5d tab active\" view=\"5d\" onclick=\"\"><a>5d</a></li>\n\t\t\t<li class=\"3m tab\" view=\"3m\" onclick=\"\"><a>3m</a></li>\n\t\t\t<li class=\"6m tab\" view=\"6m\" onclick=\"\"><a>6m</a></li>\n\t\t\t<li class=\"1y tab last\" view=\"1y\" onclick=\"\"><a>1y</a></li>\n\t\t</ul>\n\t</div>\n\t<div class=\"viewLots tab_content\">\n\t\t<div class=\"lots round_block\">\n\t\t\t<div class=\"block header dark_bg\">\n\t\t\t\t").section(ctx.get("quote"),ctx,{"block":body_2},null).write("</div>\n\t\t\t<div class=\"content block\">\n\t\t\t\t<table class=\"positions_root\" portId=\"").reference(ctx.get("port_id"),ctx,"h").write("\">\n\t\t\t\t\t<tr class=\"row\">\n\t\t\t\t\t\t<th class=\"\">Shares</td>\n\t\t\t\t\t\t<th class=\"\">Paid</td>\n\t\t\t\t\t\t<th class=\"\">Gain</td>\n\t\t\t\t\t\t<th class=\"\">Value</td>\n\t\t\t\t\t\t<th class=\"landscape_col\">Account</td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t\n\t\t\t\t\t").section(ctx.get("lots"),ctx,{"block":body_3},null).write("</table>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t").section(ctx.get("quote"),ctx,{"block":body_4},null).write("</div>    \n");}function body_1(chk,ctx){return chk.write("<label class=\"name\">").reference(ctx.get("name"),ctx,"h").write("</label> <label class=\"symbol\">(").reference(ctx.get("symbol"),ctx,"h").write(")</label>\n\t\t\t");}function body_2(chk,ctx){return chk.write("<label class=\"name\">").reference(ctx.get("name"),ctx,"h").write("</label> <label class=\"symbol\">(").reference(ctx.get("symbol"),ctx,"h").write(")</label>\n\t\t\t\t");}function body_3(chk,ctx){return chk.write("<tr class=\"row position_item\" positionId=\"").reference(ctx.get("id"),ctx,"h").write("\">\n\t\t\t\t\t\t<td class=\"value shares\">").reference(ctx.get("shares"),ctx,"h").write("</td>\n\t\t\t\t\t\t<td class=\"value price\">$").reference(ctx.get("buy"),ctx,"h").write("</td>\n\t\t\t\t\t\t<td class=\"value price forward\">").reference(ctx.get("gain"),ctx,"h").write("</td>\n\t\t\t\t\t\t<td class=\"value value forward\">").reference(ctx.get("marketVal"),ctx,"h").write("</td>\n\t\t\t\t\t\t<td class=\"value date landscape_col\">").reference(ctx.get("port_name"),ctx,"h").write("</td>\n\t\t\t\t\t</tr>\n\t\t\t\t\t");}function body_4(chk,ctx){return chk.write("<div id=\"stock_info_header\" class=\"viewQuote tab_content round_block stock_info active\">\n\t\t<div class=\"block header dark_bg\">\n\t\t\t<label class=\"name\">").reference(ctx.get("name"),ctx,"h").write(" (").reference(ctx.get("symbol"),ctx,"h").write(")</label>\n\t\t</div>\n\t\t<div class=\"block stock_info_summary color_bg\">\n\t\t\t<div class=\"round_header\">\n\t\t\t\t<table class=\"sub_header\">\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td class=\"first ").reference(ctx.get("positive"),ctx,"h").write(" price\"><div class=\"title\">Last</div><div class=\"title price\">").reference(ctx.get("price"),ctx,"h").write("</div></td>\n\t\t\t\t\t\t<td class=\"last ").reference(ctx.get("positive"),ctx,"h").write(" change\"><div class=\"title\">Change</div><div class=\"title price\">").reference(ctx.get("change"),ctx,"h").write(" (").reference(ctx.get("percent-change"),ctx,"h").write(")</div></td> \n\t\t\t\t\t</tr>\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"block stock_info_detail\">             \n\t\t\t<table>\n\t\t\t\t<tr class=\"row\">\n\t\t\t\t\t<td>Bid</td>\n\t\t\t\t\t<td class=\"value bid\">").reference(ctx.get("bid"),ctx,"h").write("</td>\n\t\t\t\t\t<td><label>Ask</td>\n\t\t\t\t\t<td class=\"value ask\">").reference(ctx.get("ask"),ctx,"h").write("</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr class=\"row\">\n\t\t\t\t\t<td>Open</td>\n\t\t\t\t\t<td class=\"value open\">").reference(ctx.get("open"),ctx,"h").write("</td>\n\t\t\t\t\t<td>MCap</td>\n\t\t\t\t\t<td class=\"value MCap\">").reference(ctx.get("MCap"),ctx,"h").write("</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr class=\"row\">\n\t\t\t\t\t<td>Day Hi</td>\n\t\t\t\t\t<td class=\"value high\">").reference(ctx.get("day_hi"),ctx,"h").write("</td>\n\t\t\t\t\t<td>Day Lo</td>\n\t\t\t\t\t<td class=\"value low\">").reference(ctx.get("day_lo"),ctx,"h").write("</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr class=\"row\">\n\t\t\t\t\t<td>52w Hi</td>\n\t\t\t\t\t<td class=\"value year_hi\">").reference(ctx.get("year_hi"),ctx,"h").write("</td>\n\t\t\t\t\t<td>52w Lo</td>\n\t\t\t\t\t<td class=\"value year_lo\">").reference(ctx.get("year_lo"),ctx,"h").write("</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr class=\"row\">\n\t\t\t\t\t<td>P/E</td>\n\t\t\t\t\t<td class=\"value pe\">").reference(ctx.get("pe"),ctx,"h").write("</td>  \n\t\t\t\t\t<td>Volume</td>\n\t\t\t\t\t<td class=\"value vol\">").reference(ctx.get("vol"),ctx,"h").write("</td>\n\t\t\t\t</tr>\n\t\t\t\t<tr class=\"position_info row ").reference(ctx.get("show_lots"),ctx,"h").write("\">  \n\t\t\t\t\t<td>Shares</td>\n\t\t\t\t\t<td class=\"value shares\">").reference(ctx.get("totalShares"),ctx,"h").write("</td>\n\t\t\t\t\t<td>Earnings Date</td>\n\t\t\t\t\t<td class=\"value earningsDate\">").reference(ctx.get("earningsDate"),ctx,"h").write("</td>\n\t\t\t\t</tr>\n\t\t\t</table>\n\t\t</div>\n\t</div>\n\t<div class=\"viewNews tab_content round_block\">\n\t\t<div class=\"block header dark_bg\">\n\t\t\t<label class=\"name\">").reference(ctx.get("name"),ctx,"h").write("</label> <label class=\"symbol\">(").reference(ctx.get("symbol"),ctx,"h").write(")</label>\n\t\t</div>\n\t\t<ul class=\"block rounded news_container hide_extra_items\">\n\t\t\t<div class=\"status loading\">Loading...</div>\n\t\t</ul>\n\t</div>\n\t");}return body_0;})();