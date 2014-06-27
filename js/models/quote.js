window.Stock = window.Stock || {};
window.Stock.Model.Quote = Backbone.Model.extend({
	defaults: {
		price: 0, 	// ticker last trade price
		change: 0, 	// ticket day change
		"percent-change": 0,// Day change percentage
		vol: 0,		// Volume
		symbol: "",	// Ticker symbol 
		name: 0,		// Company name
		bid: 0,		// Current bid
		ask: 0,
		open: 0,		// Ope price
		day_hi: 0,	//
		day_lo: 0,
		year_hi: 0,
		year_lo: 0,
		pe: 0,
		eps: 0,
		MCap: ""
	},

	initialize: function () {
	    
	}
 });