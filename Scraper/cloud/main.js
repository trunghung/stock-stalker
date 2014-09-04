
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("getPage", function(request, response) {
  		Parse.Cloud.httpRequest({
			url: request.params.url,
		    headers: {
			    "user-agent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36"
		    },
			success: function(httpResponse) {
				// First remove all the script tag from the html string and neuter the img tag
				var start, end, html = httpResponse.text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

				if (!request.params.leaveImg) {
					html = html.replace(/src=\"http/g,'src2="http');
				}
				start = html.indexOf("<body");
				end = html.indexOf("</body>");
				if (start > -1 && end > -1) {
					response.success(html.substring(start, end+7));
				}
				else {
					response.success(httpResponse.text);
				}

			},
			error: function(httpResponse) {
				response.success('Request failed with response code ' + httpResponse.status);
			}
		});
});