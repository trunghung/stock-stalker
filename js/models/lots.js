window.Stock = window.Stock || {};
window.Stock.Collection.Lots = Backbone.Collection.extend({
	model: Y.Stock.Model.Lot,
	
	comparator: function (lot) {
	    return lot.get("value");
	},

	initialize: function () {
	    var self = this;
	    
	    // Listen for changes to the session buddies object - this is populated at login time
	    //Session.on("change:buddies", self.parseBuddies, self);

	    // Listen for the session logoff event, and clear the contact list model when it is received
	    //Session.on(Events.OFFLINE, self.reset, self);

	    /*RequestManager.addListeners([
		   {id: "buddyInfo", callback: Y.bind(self._handleBuddyInfo, self)},
		   {id: "buddyStatus", callback: Y.bind(self._handleBuddyStatus, self)},
		   {id: "logOff", callback: Y.bind(self._handleBuddyLogout, self)}
	    ]);*/
	},
	
	normalizeData: function(lot) {
		
	},
	_handleLotChange: function (data) {
          var lot = {
                
          };
            
          lot = this.normalizeData(lot);
          this.update([lot], {remove: false});
     }
});