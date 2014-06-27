window.Stock = window.Stock || {};
window.Stock.Collection.Quotes = Backbone.Collection.extend({
	model: Y.Stock.Model.Quote,
	
	comparator: function (lot) {
	    return lot.get("value");
	},

	initialize: function () {
	    var self = this;
	    
	},
	normalizeData: function(quote) {
		
	},
	_handleQuoteUpdate: function (data) {
          var self = this, quote = {
                
          };
            
          quote = self.normalizeData(quote);
          self.update([quote], {remove: false});
     }
});