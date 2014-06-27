var TAG_FORMATTER = {
	"change": 				{ decimal: 2, dollarSign: false, percentSign: false , label: "Change"},
	"percent-change": 		{ decimal: 1, dollarSign: false, percentSign: true, label: "Change %" },
	"value-delta": 			{ decimal: 0, dollarSign: true, percentSign: false, label: "Day's Change" },
	"value-delta-percent": 	{ decimal: 1, dollarSign: false, percentSign: true, label: "Day's Change %" },
	"market-value": 		{ decimal: 0, dollarSign: true, percentSign: false, label: "Market Value" },
	"gain": 				{ decimal: 0, dollarSign: true, percentSign: false, label: "Gain/Loss" },
	"gain-percent": 		{ decimal: 1, dollarSign: false, percentSign: true, label: "Gain/Loss %" },
	"price": 				{ decimal: 2, dollarSign: false, percentSign: false, label: "Last" },
	"pf-percent":           { decimal: 0.2, dollarSign: false, percentSign: true, label: "Position" },
	"shares":               { decimal: 0, dollarSign: false, percentSign: false, label: "Shares" }
};
function formatTagValue(tagValue, tag, noDollarSign, maxLength) {
	if (Y.Lang.isNull(tagValue) || Y.Lang.isUndefined(tagValue)) 
		tagValue = "";
	else {
		// Normalize large values
        if (tagValue > 999999999) {
            tagValue = (tagValue / 1000000000).toFixed(1) + "B";
        }
        else if (tagValue > 999999) {
            tagValue = (tagValue / 1000000).toFixed(1) + "M";
        }
	    if (TAG_FORMATTER[tag]) {
			var decimal = TAG_FORMATTER[tag].decimal;		
			if (decimal >= 0) {
			    // This is the optional decimal for smaller numbers
			    if (decimal < 1) {
			        if (tagValue >= 10)
			            decimal = 0;
			        else
			            decimal = parseInt(decimal * 10);
			    }
				// If the value is a string, we should just return it to be displayed
				if (Y.Lang.isNumber(tagValue))
				    tagValue = tagValue.toFixed(decimal);
				else 
				    return tagValue;
			}
			
			if (TAG_FORMATTER[tag].dollarSign) {
				if (noDollarSign !== true)
					tagValue = prefixCurrency(tagValue);
			}
			else if (TAG_FORMATTER[tag].percentSign)
				tagValue = appendPercentSign(tagValue);
		}
	}
	if (maxLength && tagValue.length > maxLength)
		tagValue = tagValue.substr(0, maxLength);
	return tagValue;
}
function getTagLabel(tag) {
	return TAG_FORMATTER[tag] ? TAG_FORMATTER[tag].label : "";
}

//Turn computeDeltaPercent(10, 100) => 10
function computeDeltaPercent(delta, value) {
    var diff = value - delta;
	return diff == 0 ? "-" : (delta * 100 / diff);
}

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
function prefixCurrency(val) {
	if (val) {
		val = addCommas(val);
		var firstChar = val.charAt(0);
		if (firstChar == "-" || firstChar == "+") {
			return [firstChar, "$", val.slice(1)].join('');
		}
		return "$" + val;
	}
	return "$0";
}

function appendPercentSign(val) {
	if (val) {
		return addCommas(val) + "%";
	}
	return "0%";
}

function isValueNegative(val) {
	if (Y.Lang.isNumber(val)) 
		return val < 0;
	else if (val && val.indexOf && val !== "+" && val !== "-") {
		if (0 <= val.indexOf('-'))
			return true;
	}
	return false;
}
function getPositiveOrNegative(tagValue) {
	return tagValue < 0 ? "negative" : "positive"; 
}
function getUrlParamValue(name) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}
function saveLocalString(key, val) {
	if (!window.localStorage){
        return;
    }    
    if (val == null)
        localStorage.removeItem(key);
    if (val)
        localStorage.setItem(key, val);
}
function saveLocal(key, obj){
    // check if the browser supports localStorage
    if (!window.localStorage){
        return;
    }    
    if (obj == null)
        localStorage.removeItem(key);
    if (obj)
        localStorage.setItem(key, JSON.stringify(obj));
}
function readLocalStorage(key, keyword) {
    if (!window.localStorage){
        return null;
    }
    return localStorage.getItem(key);
}
function loadLocal(key, keyword){
    var portfolios=null, content = readLocalStorage(key, keyword);
    if (content) {
    	portfolios = JSON.parse(content);
    }
    return portfolios;
}

// <body onorientationchange="alert('orient');">
function orient()  
{  
    switch(window.orientation){  
            case 0: 
            	// portrait mode
            break;  
  
            case -90: 
            	// landscape mode
            break;  
  
            case 90: 
            	// landscape mode
            break;  
    }
}  

function addPlusAndPercent(val, showPlusSign, showPercent) {
    if (showPlusSign && val > 0)
        val = "+" + val;
    if (showPercent)
        val += "%";
    return val;
}

function log(str) {
    if (DEBUG_MODE) {
        var node = Y.one ? Y.one("#log") : null;
        if (node)
            node.append("<li class='item'>" + str + "</li>");
    }
    if (Y) {
        Y.log(str);
    }
}
function forceNumericInput(node) {
    Y.use('event-key', function(Y) {        
        // store the return value from Y.on to remove the listener later
        var handle = Y.on('key', function(e) {
            Y.log(e.type + ": " + e.keyCode);
     
            var allowed = false, text, allowMinus=true, allowDot=true;
            // If alt or control key is pressed, we allow all
            // if the key code isnot in the alphanumeric range
            if (e.altKey || e.ctrlKey || e.keyCode < 48)
                return;
            
            switch(e.keyCode) {
            case 109:   // -
                if(allowMinus === true) {
                    text = e.currentTarget.get("value");
                    if (text.length == 0)
                        allowed = true;    
                }
                break;
            case 190:   // .
                if(allowDot === true) {
                    allowed = true;
                    text = e.currentTarget.get("value");
                    if(text.indexOf(".") > -1) {
                        // don't allow more than one dot
                        allowed = false;
                    }
                }
                break;
            default:
                // If the char is between 0 and 9
                if (e.keyCode >= 48 && e.keyCode <= 57) {
                   allowed = true;
                }
            }
            if (!allowed) {               
                // stopPropagation() and preventDefault()
                e.halt();  
            }
        }, '.shares input', 'down', Y);
     
    }, "body", "input.number");
}


YUI.add('util', function (Y) {
    Y.namespace("Stock");
    var Util = {
	isPageActive: function(cssSelector) {
		var node = Y.one(cssSelector);
		return (node && node.getAttribute("selected") == "true");
	},
        //Update all the blocks that belong to this portfolio
        updatePortfolioSummaryBlocks: function(port) {
            var node;
            if (port) {
                //Now update the portfolio summaries
                node = Y.all([".port_summary[port_id='", port.id, "']"].join(''));
                node.each(function(node) {
                    Util.updateSummaryBlock(node, port);
                });
            }
        },
        // Update 1 specific block of portfolio summary
        updateSummaryBlock: function(nodeParent, port) {
            var node, value = port.totalValue, delta = port.dayChange, gain = port.gain, cash = port.cash,
            updateValue = Util.updateNegativePositive;
            if (Y.Stock.quoteMgr.isQuotesReady()) {
            	log(["updateSummaryBlock", port.name, "- value:", value, "cash:", cash, "delta:", delta, "gain:", gain].join(" "));
                // Cash balance
                node = nodeParent.one('.cash_balance .value');
                node.setContent(prefixCurrency(cash.toFixed(0)));
                updateValue(node, cash);
                
                // value-delta
                node = nodeParent.one('.value-delta .value');
                node.setContent(Util.getValueAndChangePercentString(delta, value));
                updateValue(node, delta);
                
                // market-value
                node = nodeParent.one('.market-value');
                node.setContent(prefixCurrency(value.toFixed(0), 0));
                updateValue(node, value);
                
                // gain
                node = nodeParent.one('.gain .value');
                node.setContent(Util.getValueAndChangePercentString(gain, value));
                updateValue(node, gain);
                
                // Show the summary
                nodeParent.one('.loading').addClass("hidden");
                nodeParent.one('.content').removeClass("hidden");
            }
        },
        updateNegativePositive: function(node, val) {
            if (isValueNegative(val))
                node.addClass("negative");
            else
                node.removeClass("negative");
        },
        getValueAndChangePercentString: function(delta, value) {
            var val, percent;
            // value-delta
            if (value == 0 || delta == 0) {
                val = "$0";
            }
            else {
                percent = computeDeltaPercent(delta, value);
                if (Y.Lang.isNumber(percent))
                   percent = percent.toFixed(1);
                val = [prefixCurrency(delta.toFixed(0)), ' (', percent, '%)'].join('');
            }
            return val;
        },        
        getLocalTime: function () {
            var d = new Date, 
            dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
            hour = d.getHours(),
            min = d.getMinutes(),
            param = {day : dayOfWeek[d.getDay()],
                    month :  month[d.getMonth()],
                    date : d.getDate(),
                    hour : hour,
                    min : min < 10 ? "0" + min : min,
                    amPm : hour >= 12 ? "PM" : "AM" };
            hour = hour % 12;
            if (hour == 0) {
                hour = 12;
            }
            param.hour = hour;
            return Y.Lang.substitute("Last updated: {day}, {month} {date}, {hour}:{min}{amPm}", param);
        },
        hookEvent: function(cssSelector, event, cbFunc, rootNode) {
            if (!rootNode) 
                rootNode = Y;
            var node = Y.one(cssSelector);
            if (node)
                node.on(event, cbFunc);
        },
        // TODO Move to sdk.js
        getOrCreatePageNode: function(pageId, html) {
            var cssSelector = "#" + pageId,
            node = Y.one(cssSelector),
            created = false;
            if (!node) {
                // If the view stock page doesn't exist, we need to create it
                Y.one("body").append(html);
                created = true;
            }
            return {node: Y.one(cssSelector),
                    created: created
            };
        },
        stockSortFuncByChange: function(a, b) {
    		if (b.change == a.change) {
    			return b.value - a.value;
    		}
    		return b.change - a.change;
        },
        stockSortFuncByVal: function(a, b) {
    		if (b.value == a.value) {
    			return a.symbol > b.symbol ? 1 : -1;
    		}
    		return b.value - a.value;
        },
        stockSortFuncByAlpha: function(a, b) {
        	if (a.symbol == b.symbol) return 0;
    		return a.symbol > b.symbol ? 1 : -1;
        },
        stockSortFunc: function(a, b) {
        	var sortMethod = UI_SETTINGS.sortingMethod;
        	if (!sortMethod)
        		sortMethod = "alpha";	// Default of alpha sorting
        	if (sortMethod === "value") {
        		return Util.stockSortFuncByVal(a, b);
        	}
        	else if (sortMethod === "change") {
        		return Util.stockSortFuncByChange(a, b);
        	}
        	return Util.stockSortFuncByAlpha(a, b);
        },
        consolidatePositions: function(positions, absVal) {
        	var curPos, retPositions = [], stocks = {};
        	// First combine all the positions and add up its value
        	for (index in positions) {
                info = positions[index];                
                if (stocks[info.symbol]) {
                	curPos = stocks[info.symbol];
                	curPos.value += info.shares * info.buy;
                	curPos.shares += info.shares;
                }
                else {
                	stocks[info.symbol] = Y.merge(info);
                	stocks[info.symbol].value = info.shares * info.buy;           	
                }
        	}
        	// Now compute the average buy price for them
        	for (stock in stocks) {
        		curPos = stocks[stock];
        		curPos.buy = curPos.shares <= 0 ? 0 : (curPos.value / curPos.shares);
        		curPos.change = curPos.shares * Y.Stock.quoteMgr.getInfo(curPos.symbol, "change");
        		if (absVal && curPos.change < 0) {
        			curPos.change = Math.abs(curPos.change);
        		}
        		retPositions.push(curPos);
        	}
        	return retPositions;
        },
        cloneArray: function(array) {
        	var ret = [];
        	for (index in array) {
                ret.push(array[index]);
        	}
        	return ret;
        },
        showChart: function(root, port) {

            var computeRoundingFactor = function(num) {
            	var str = num + '',
            	numDigits = str.length;
            	if (numDigits > 0)
            		return Math.pow(10, numDigits - 1);
            	else 
            		return 1;
            },
            roundNumber = function(num, round, ceiling) {
            	num /= round;
            	num = ceiling ? Math.ceil(num) : Math.floor(num);
            	num *= round;
            	return num;
            };
	        Y.use("gallery-charts", "mcap_history", function(T) {        		
				var data = Y.Stock.History.getWeekHistory(port.id), minMax;
				
				if (data && data.length > 1) {
					minMax = Y.Stock.History.computeMinMax(data);
					var minMaxDiff = Math.max(10, minMax.max - minMax.min),
	    	        round = computeRoundingFactor(minMaxDiff);
	    	       
					root.one(".chart").removeClass('hidden');
					root.one(".chart .content").setContent("");
	                var axes = {
	                	category: {
	                            type:"time",
	                            minimum: data[0].category,
	                            maximum: data[data.length - 1].category,
	                            styles:{
	                                majorTicks:{
	                                    display:"outside",
	                                    length:3,
	                                    color:"#333"
	                                },
	                                line:{color:"#333"},
	                                label: {
	                                    rotation:-45
	                                },
	                                margin:{top:5},
	                                majorUnit:{count: Math.min(5, data.length) }
	                            }
	                    },
	                    values: {
	                        maximum: roundNumber(minMax.max, round, true),
	                        minimum: roundNumber(minMax.min, round),
	                        styles:{
	                            majorTicks:{
	                                display:"outside",
	                                length:3,
	                                color:"#333"
	                            },
	                            line:{color:"#333"},
	                            margin:{top:5},
	                            majorUnit:{count: 5 }
	                        }
	                    }
	                };
	                var mychart = new Y.Chart({dataProvider: data, axes: axes, render: root.one(".chart .content")});
	    	        /*
	    	        var mychart = new Y.Chart({dataProvider:data, 
	                    axes:{
	                        marketVal:{
	                            keys:["value"],
	                            position:"left",
	                            type:"numeric",
	                            roundMinAndMax:true,
	                            roundingUnit:100,
	                            styles:{
	                                majorTicks:{
	                                    display:"inside",
	                                    length:3,
	                                    color:"#333"
	                                },
	                                line:{color:"#333"},
	                                label:
	                                {
	                                    margin:{right:5}
	                                },
	                                majorUnit:{count:5}
	                            }
	                        },
	                        dateRange:{
	                            keys:["date"],
	                            position:"bottom",
	                            type:"time",
	                            styles:{
	                                majorTicks:{
	                                    display:"outside",
	                                    length:3,
	                                    color:"#333"
	                                },
	                                line:{color:"#333"},
	                                label: {
	                                    rotation:-45
	                                },
	                                margin:{top:5},
	                                majorUnit:{count: 5}
	                            }
	                        }
	                    },
	                    seriesCollection: [
	                     {
	                            type:"combo",
	                            xAxis:"dateRange",
	                            yAxis:"marketVal",
	                            xKey:"date",
	                            yKey:"value",
	                            xDisplayName:"Date",
	                            yDisplayName:"Market Value",
	                            marker: {
	                                fill: {
	                                    color: "#6600cc"
	                                },
	                                border: {
	                                    weight: 0
	                                },
	                                width:8,
	                                height:8,
	                                over: {
	                                    fill: {
	                                        color: "#cc66cc"
	                                    },
	                                    border: {
	                                        color: "#6600cc",
	                                        weight: 1
	                                    },
	                                    width: 11,
	                                    height: 11
	                                }
	                            },
	                            line: {color: "#cc33cc"}
	                        },
	                        {
	                            type:"combo",
	                            xAxis:"dateRange",
	                            yAxis:"marketVal",
	                            xKey:"date",
	                            yKey:"value",
	                            marker:{
	                                fill: {
	                                    color:"#006633" 
	                                },
	                                border: {
	                                    weight: 0
	                                },
	                                width:8, 
	                                height:8,
	                                over: {
	                                    border: {
	                                        weight:"1",
	                                        color: "#006633"
	                                    },
	                                    fill: {
	                                        color: "#00ff66"
	                                    },
	                                    width: 11,
	                                    height: 11
	                                }
	                            },
	                            line: {
	                                color: "#00ff66"
	                            }
	                        }
	                    ],
	                    render:"#chart .content"});
	    	         */
				}
	        });
        }
    };
    
    Y.Stock.util = Util;
    log("Util: loaded");
}, '1.0.0', {requires: ["node"]});