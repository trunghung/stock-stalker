YUI.add('mcap_history', function (Y) {
	Y.namespace('Stock');
    var History = function() {
        var portfoliosValueHistory = { week: {}, year: {} },
        _saveHistory = true,
        _one_day=1000*60*60*24,
        getHistory = function() { return portfoliosValueHistory; },
        computeMinMax = function(historyData) {
    		var val, i, min = false, max = false;
        	for (i=0; i < historyData.length; i++) {
        		val = historyData[i].value;
    			if (min === false || min > val)
    				min = val;
    			if (max === false || max < val)
    				max = val;
			}
        	return { min: min, max: max};
        },
        getWeekHistory = function(portId, rangeDays) {
        	var week, ret = [], i=0;
        	if (!portfoliosValueHistory.week[portId]) {
        		readHistory("week", portId);
        	}
        	week = portfoliosValueHistory.week[portId];		        	
        	if (week) {
	        	for (item in week) {
	    			entry = week[item];
	    			ret[i++] = {category: convertIntToDate(entry.date), value: entry.value};
	        	}
        	}
        	return ret;        	
        },
        saveHistory = function (key, port, value) {
			if (!window.localStorage){
		        return;
		    }    
			var historyKey = [port.id, key].join("_"); 
		    if (value == null)
		        localStorage.removeItem(historyKey);
		    if (value)
		        localStorage.setItem(historyKey, JSON.stringify(value));
			
		},
		readLocalStorage = function (key) {
		    if (!window.localStorage){
		        return;
		    }
		    return localStorage.getItem(key);
		},
 		readHistory = function (key, portId){
			var historyKey = [portId, key].join("_"),
		   	content = readLocalStorage(historyKey),
		   	retVal = null;
		    if (content && _saveHistory) {
		    	retVal = JSON.parse(content);
		    	if (retVal) {
		    		portfoliosValueHistory[key][portId] = retVal;
		    		return true;
		    	}
		    }
		    return false;
		},
		printHistory = function (rangeKey, port, root) {
			var entries = portfoliosValueHistory[rangeKey][port.id],
			entry, i, graph = root.one(".graph");
			for(i in entries) {
				entry = entries[i];					
			}
		},
		convertDateToInt = function (date) {
			return (date.getFullYear() - 2000) * 10000 + date.getMonth() * 100 + date.getDate();
		},
		convertIntToDate = function(date) {
			var year = parseInt(date/10000) + 2000,
			day = parseInt(date%100),
			month = parseInt((date/100)%100);
			return [month, day, year].join("/");
		},
		isWithinNumOfDays = function (days, date) {
			var d = new Date(convertIntToDate(date)),
			today = new Date(),
			diff = (today.getTime() - d.getTime())/_one_day;
			return (diff < days);
		},
		_recordWeekValue = function (port, date) {
	    	var week = portfoliosValueHistory.week[port.id], 
	    	value = parseInt(port.totalValue),
	    	lastEntry, recorded = false, needRecording = true,
	        dateStr = date.year * 10000 + date.month * 100 + date.date;
	    	if (week) {
	    		if (week.length > 0) {
	        		lastEntry = week[week.length - 1];
	        		if (lastEntry.date == dateStr) {
	        			needRecording = false;
	        			if (lastEntry.value != value) {
		        			lastEntry.value = value;
		        			recorded = true;
	        			}
	        		}
	    		}
	    		if (needRecording) {
	    			week.push({date: dateStr, value: value});
	    			recorded = true;
	    		}
	    		// Trim week length to be less than 10
	    		var days = 30;
	    		while (week.length > days || (week.length > 0 && !isWithinNumOfDays(days, week[0].date)))
	    			week.shift();
	    		if (recorded && _saveHistory) {
	    			saveHistory("week", port, week);
	    		}
	    	}
	    	return recorded;
	    },
	    _isMonthRecorded = function(month, entries) {
	    	var  i, entry;
	    	for (i in entries) {
	    		entry = entries[i];
	    		if (entry.date == month)
	    			return i;
	    	}
	    	return null;
	    },
	    _recordMonthValue = function (port, date) {
	    	var  year = portfoliosValueHistory.year[port.id], 
	    	value = parseInt(port.totalValue),
	    	month = date.year * 100 + date.month, recorded = false;
	    	if (year) {
	    		var index = _isMonthRecorded(month, year);
	    		if (index === null) {
	    			year.push({date:month, value: value});
	    			recorded = true;
	    		}
	    		else {
	    			year[index].value = value;
	    			recorded = true;
	    		}
	    		// Only track the last 36 entries
	    		while (year.length > 36)
	    			year.shift();
	    	}
	    	if (recorded && _saveHistory) {
				saveHistory("year", port, year);
			}
	    	return recorded;
	    },
	    recordPortValue = function (port, paramDay) {
	    	// There is no need to store total portfolio
	        var d = paramDay ? new Date(paramDay) : new Date(),
	        day = d.getDay(),
	        date = {
	            date : d.getDate(),
	            month : d.getMonth() + 1,	// Since the month is 0-index
	            year : d.getFullYear() - 2000};
	        // Don't record weekend
	        if (day != 0 && day != 6) {
	        	if (!portfoliosValueHistory.week[port.id]) {
	        		if (!readHistory("week", port.id))
	        			portfoliosValueHistory.week[port.id] = [];
	        	}
	        	if (!portfoliosValueHistory.year[port.id]) {
	        		if (!readHistory("year", port.id))
		        		portfoliosValueHistory.year[port.id] = [];
	        	}
	        	_recordWeekValue(port, date);
	        	_recordMonthValue(port, date);
	        	Y.fire("stock_history_recorded", port);
	        }
	    },
        _generateSampleHistory = function() {
	    	_saveHistory = false;
	    	var port = { id: "total", totalValue: 100000},
	    	date = new Date(),
	    	day = date.getDate(),
	    	month = date.getMonth() + 1,
	    	year = date.getFullYear(),
	    	index=0;
	    	var ports = ["total", "pf_1", "pf_2"];
	    	for (index in ports) {
	    		port.id = ports[index];
		    	if (day-3 > 0) {
			    	recordPortValue(port, [month,day-3,year].join("/"));
			    	port.totalValue -= 200;
		    	}	    
		    	if (day-2 > 0) {
			    	recordPortValue(port, [month,day-2,year].join("/"));
			    	port.totalValue -= 200;
		    	}	
		    	if (day-1 > 0) {
			    	recordPortValue(port, [month,day-1,year].join("/"));
			    	port.totalValue -= 200;
		    	}
		    	recordPortValue(port, [month,day,year].join("/"));
		    	port.totalValue -= 500;
		    	if (month - 1 > 0) {
		    		_recordMonthValue(port, [month,day,year-2].join("/"));
			    	port.totalValue -= 1200;
		    	}
		    	_recordMonthValue(port, [month,day,year-1].join("/"));
		    }        	
        };
	    return { 
	    	getHistory: getHistory,
	    	computeMinMax: computeMinMax,
	    	getWeekHistory: getWeekHistory,
	    	readHistory: readHistory,
	    	printHistory: printHistory,
	    	recordPortValue: recordPortValue,
	    	recordWeekValue: _recordWeekValue,
	    	recordMonthValue: _recordMonthValue,
	    	generateSampleHistory: _generateSampleHistory
	    };
    };
    Y.Stock.History = new History();
}, '1.0.0', {requires: ["node"]});