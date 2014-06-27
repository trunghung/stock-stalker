window.Stock = window.Stock || {};
window.Stock.Model.Config = Backbone.Model.extend({
	defaults: {
		homeShowGain: true,	// Show the total gain in home page
		homeShowCash: true,	// Show the total cash balance in home page
		favIndices: ["^DJI", "^IXIC", "^GSPC"],	// Market indices to follow
		sortingMethod: "value", // [none, value, alpha, change] Sorting method for rendering a portfolio
		expandPositions: false,	// Combine positions of the same stock into 1 line for rendering purpose
		portViewMode: "viewPerformance"
	},

	initialize: function () {
	    
	}
 });