(function() {
window.Stock = window.Stock || {};
var utils = Stock.Utils = {
	timeMoreThan: function(ts, minutes) {
		return !ts || (new Date()).getTime() - ts.getTime() > minutes * 60000;
	},
	convertToDom: function(html) {
		var el = null;
		if (html) {
			el = document.createElement("DIV");
			// neuter all the image and script tags
			el.innerHTML = html;
		}
		return el;
	},
	requestFileParse: function(url, callbackFn) {
		Parse.Cloud.run('getPage', { url: url }, {
			success: function(data) {
				callbackFn.success(data);
			},
			error: function(error) {
				console.error("Failed to download file: " + url);
				callbackFn.error && callbackFn.error();
			}
		});
	},
	requestFileXHR: function(url, callbackFn) {
		var xmlhttp=new XMLHttpRequest();
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4) {
				if (xmlhttp.status==200 && callbackFn.success)
					callbackFn.success(xmlhttp.responseText);
				else if (xmlhttp.status!=200 && callbackFn.error)
					callbackFn.error();
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}

};
})();