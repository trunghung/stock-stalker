/**
 * Template module
 *
 * A slightly higher-level abstraction for using dust templates.
 * Localized strings are made automatically available to templates.
 * If a template contains `{str_localized_string|i}`, the localized string referenced
 * will be processed for variable substitutions.
 *
 */

(function(){

	window.Stock = window.Stock || {};
	
    Stock.Template = {
        render: render,
        renderInto: renderInto,
        renderFasterInto: renderFasterInto
    };

    var current_vars,
        iRegEx = /\{([^{}]*)\}/g;
    // So.. if your localized strings use {something|i}, this filter will be called recursively.
    // Not that you should. But you could.
    dust.filters.i = function(value) {
        iRegEx.lastIndex = 0;
        return value.replace(iRegEx,
            function (a, b) {
                var filters = b.split("|"), key = filters.shift();
                var r = current_vars.get(key);
                if (typeof r == "function") {
                    // comment the throw to live on the edge. Note that functions called here will have no access to a Chunk object
                    throw new Error("Template doesn't support function references in a 'i'-filter substitution.");
                    r = r.apply(current_vars.current(), [null, current_vars, null, {auto: null, filters: filters}]);
                }
                if (typeof r !== 'string' && typeof r !== 'number') { return ''; }
                return dust.filter(String(r), null, filters);
            }
        );
    };

	dust.helpers.getDigitalSize = getDigitalSize;
	dust.helpers.evalres = evaluateResources;
	dust.helpers.every = everyHelper;
	dust.helpers.formatField = function(chunk, context, bodies, params) {
		var field = context.get(params.field),
			format = params.format ? params.format : params.field;
		if (field) {
			chunk.write(formatTagValue(field, format));
		}
		
		return chunk.write("");
    };
	dust.helpers.formatEarningDate = function(chunk, context, bodies, params) {
		var dateStr = context.get(params.dateStr),
		isEstimated = dateStr && dateStr.indexOf("Est") != -1;
		
		if (isEstimated)
			return chunk.write(dateStr);
	
		return dust.helpers.formatDate(chunk, context, bodies, params);
    };
	dust.helpers.formatDate = function(chunk, context, bodies, params) {
		var date = context.get(params.dateObj), str = "";
		
		if (date && date.getDay) {
			var dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
			str = [dayOfWeek[date.getDay()], month[date.getMonth()], date.getDate()].join(" ");
		}
		return chunk.write(str);
    };

    var Context = dust.makeBase().constructor; // sneak dust's Context type out of their module.

    function _render(template, vars, helpers) {
        var str;
		vars = Context.wrap(vars);
        //vars = Messenger.Intl.withStrings(Context.wrap(vars));

		if (helpers) {
			vars = vars.push(helpers);
		}
        vars = vars.push(
				{
					
                    /*presenceOpi: function(chunk, context) {
                        var presence = context.get("presence"),
							state = presence ? presence.state : context.get("presenceState");
                        return Messenger.UserUtils.getUserPresenceString({presenceState:state});
                    },
                    unreadCount: function(check, context) {
						var unread = context.get("unread");
						return (unread > 0) ? unread : null;
					},
                    videoEnabled: (Messenger.appMode.videoEnabled? Messenger.appMode.videoEnabled : null),
                    locale: Messenger.appMode.locale
                    */
				});

        current_vars = vars;
        dust.render(template, vars, function(err, out) {
            if (err) {
                str = err;
                console.error("Error rendering "+template, vars, err);
            }
            str = out;
        });
        current_vars = undefined;
        return str;
    }

    /**
     * Return a string resulting from rendering a template against
     * a set of variables.
     *
     * Since this class aims to provide higher-level methods that not
     * only render templates but also use them, wrapping DOM methods that
     * are otherwise considered unsafe, calling this method dumps a warning
     * to the console.
     *
     * If you have a use case that isn't covered by this class and forces you
     * to use this method directly, chances are we need to add another method here.
     *
     * @method render
     * @params {string} template The name of a dust.js template
     * @params {object} vars     A set of variables to apply
     */
    function render(template, vars, helpers) {
        console.warn("Raw Template.render called.",template, vars);
        return _render(template, vars, helpers);
    }

    /**
     * Process a template against a set of variable and render it within a DOM element.
     *
     * @method renderInto
     * @params {string} template The name of a dust.js template
     * @params {object} vars     A set of variables to apply
     * @params {elt}    Element  A DOM element to target
     */
    function renderInto(template, vars, elt, helpers) {
        var str = _render(template, vars, helpers);
        if (elt)
            elt.innerHTML = str;
        else
            return str;
        
        return str != null;
    }

    /**
     * Process a template against a set of variable and render it within a DOM element.
     *
     * Note: This method is about 2x faster than renderInto BUT it trashes the
     * element passed, and return a new one that must be used in its stead.
     *
     * @method renderInto
     * @params {string} template The name of a dust.js template
     * @params {object} vars     A set of variables to apply
     * @params {elt}    Element  A DOM element to target
     */
    function renderFasterInto(template, vars, elt, helpers) {
        var str = _render(template, vars, helpers),
			newChild = elt.cloneNode(false);
		newChild.innerHTML = html;
		return elt.parentNode.replaceChild(newChild, elt);
    }

    

	/**
	 * Dust helper to convert a number to human readable size. For example 1024 to 1k.
	 * usage {#getDigitalSize size=1024 /}. The value of size can be a context field
	 */
	var digNoms = [ "str_attach_filesize_bytes", "str_attach_filesize_kb", "str_attach_filesize_mb", "str_attach_filesize_gb", "str_attach_filesize_tb", "str_attach_filesize_pb" ];
	function getDigitalSize(chunk, context, bodies, parms) {
		var size = parseInt(parms.size),
			place, num,
			dSize = "";

		if(size) {
			place = Math.floor( Math.log(size) / Math.log(1024) );
			if(place > 0) {
				num = size / Math.pow(1024, place);
				if(place > 2) {
					//if its gb or above show two decimal points
					num = Math.round( num * 100 );
					num = num / 100;
				} else {
					num = Math.ceil( num );
				}
				dSize = num + context.get(digNoms[place]);
			} else {
				dSize = size + context.get(digNoms[0]);
			}
		}

		return chunk.write(dSize);
	}

	/**
	 * Dust helper to evaluate resource string with context
	 * usage {@evalres text="{str_gtc_tab_display_name}" /}
	 * This one keeps the context where as "i" filter doesn't and resets the context to the root.
	 */
	function evaluateResources(chunk, context, bodies, parms) {
		var text = dust.helpers.tap(parms.text, chunk, context);

		iRegEx.lastIndex = 0;
        text = text.replace(iRegEx,
            function (a, b) {
				var val = context.get(b),
					helper, newChunk;
				if(typeof val === "function") {
					return val(chunk, context, bodies, parms);
				} else if( val === undefined) {
					helper = dust.helpers[b];
					if(helper) {
						newChunk = createFakeChunk();
						helper(newChunk, context, bodies, parms);
						return newChunk.read();
					}
				} else {
					return val;
				}
            }
        );
		
		return chunk.write(text);
	}

	function createFakeChunk() {
		var text = "";
		return {
			write: function(val) {
				text += val;
			}, 
			read: function() {
				return text;
			}
		};
	}

	/**
	 * Dust helper to check a property equal to the value supplied for every item in an array
	 * usage 
	 * {@every list=<array> keypath=<property path> value=<value to be checked>}
	 *	<body block>
	 * [{:else}]
	 *  <else block>
	 * {/every}
	 */
	function everyHelper(chunk, context, bodies, parms) {
		var list	= dust.helpers.tap(parms.list, chunk, context),
			keypath		= dust.helpers.tap(parms.keypath, chunk, context),
			keys = keypath.split("."),
			value	= dust.helpers.tap(parms.value, chunk, context),
			passed;

		passed = list.every(function(item) {
			var obj = item;
			keys.forEach(function(key) {
				obj = obj && obj[key];
			});
			return obj == value;
		})

		if(passed) {
			chunk.render(bodies.block, context);
		} else {
			chunk.render(bodies["else"], context);
		}

		return chunk;
	}
})();

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
				tagValue = tagValue.toFixed(decimal);
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
