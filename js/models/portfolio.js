window.Stock = window.Stock || {};
window.Stock.Model.Portfolio = Backbone.Model.extend({
	defaults: {
		timestamp: -1,
		id: -1,
		name: "",
		cash: 0,
		preferences: "",
		defComm: 0,
		broker: "",
		brokerAcctNum: "",
		lotPref: 0, 	// 0: FIFO, 1: LIFO
		lots: null	// Collection of lots
	},

	initialize: function () {
	    var self = this;
	    self.attributes.lots = new Y.Stock.Model.Lots;
	}
 });