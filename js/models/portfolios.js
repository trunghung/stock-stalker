window.Stock = window.Stock || {};
window.Stock.Collection.Portfolios = Backbone.Collection.extend({
	model: Y.Stock.Model.Portfolios,
	
	comparator: function (port) {
	    return port.get("value");
	},

	initialize: function () {
	    var self = this;
	},
	_handlePortChange: function (data) {
          var port = {
                
          };
            
          port = this.normalizeData(port);
          this.update([port], {remove: false});
     },
});