
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("getPage", function(request, response) {
  		Parse.Cloud.httpRequest({
			url: request.params.url,
			success: function(httpResponse) {
				// First remove all the script tag from the html string and neuter the img tag
				var start, end, html = httpResponse.text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

				if (!request.params.leaveImg) {
					html = html.replace(/<img/g,"<img2");
				}
				start = html.indexOf("<body");
				end = html.indexOf("</body>");
				if (start > -1 && end > -1) {
					response.success(html.substring(start, end+7));
				}
				else {
					response.success('Request failed: cannot find body ' + httpResponse.status);
				}

			},
			error: function(httpResponse) {
				response.success('Request failed with response code ' + httpResponse.status);
			}
		});
});