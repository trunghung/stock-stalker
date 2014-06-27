window.Stock = window.Stock || {};
window.Stock.Model.Lot = Backbone.Model.extend({
	defaults: {
		lotId: -1,	// Id of this lot
		type: 0,		// 0: equity, 1: options, 2: employee options
		isShort: 0, 	// 0: long position, 1: short position
		sym: "",		// Ticker symbol 
		price: 0,		// Cost per share
		shares: 0,	// The number of shares
		comm: 0,		// Commission
		date: 0,		// Date YYYYMMDD
		note: "",		// Lot specific notes
		strikePrice: 0,// Option strike price
		expDate: 0	// Option expiration date YYYYMMDD
	},

	initialize: function () {
	    
	}
 });