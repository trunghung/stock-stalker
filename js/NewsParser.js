/**
 * Created by hnguyen on 8/31/14.
 */
(function() {
	var urlAuthorMap = {
		"thestreet.com": {
			name: "TheStreet",
			xpath: "//div[@id=\'story\']",
			title: "#titleBar h1",
			author: "#titleBar #storyAuthorLink span a",
			paragraphs: ".virtualpage p" },
		"cnbc.com": {
			name: "CNBC",
			xpath: "//div[@id=\'cnbc-contents\']",
			title: "h1.title",
			author: ".source a[rel=author]",
			remove: ["#article_body .embed-container", "#article_body .group-container img"],
			paragraphs: "#article_body .group-container" },
		"businessweek.com": {
			name: "Business Week",
			xpath: "//div[@id=\'content\']",
			title: "h1.headline",
			author: ".byline-text",
			paragraphs: "#article_body p" },
		"forbes.com": {
			name: "Forbes",
			xpath: "//div[contains(@class, \'article_content\')]",
			title: "h1",
			author: "[itemprop=author]",
			paragraphs: ".body_inner > p"
		},
		"ap.org": {
			name: "Associated Press",
			xpath: "//table[contains(@class, \'ap-story-table\')]",
			title: ".headline",
			author: ".byline .author",
			paragraphs: "p.ap-story-p"
		},
		/*"ft.com": {
			name: "Financial Times",
			xpath: "//div[contains(@class, \'article_content\')]",
			title: "h1.title",
			publisher: ".source a[rel=author]",
			remove: ["#article_body .embed-container", "#article_body .group-container img"],
			paragraphs: "#article_body .group-container" }*/
		//"bloomberg.com": "Bloomberg",
		//"wsj.com": "Wallstreet Journal",
		"investors.com": {
			name: "Investor's Business Daily",
			xpath: "//div[@id=\'main\']",
			title: "h1.am-title",
			author: "[itemprop=author]",
			paragraphs: ".newsStory .quickTools p"
		},
		"finance.yahoo.com": {
				useParse: true,
				name: "Yahoo Finance",
				xpath: "#Main, #yog-bd",
				title: "h1.headline",
				author: ".credit cite",
				paragraphs: ".body > p, .entry-content > p, .bd > p",
				atags: ".body > p a, .entry-content > p a, .bd > p a",
				quotes: "a[rel=nofollow]"
		},
		"nytimes.com": {
			name: "New York Times",
			xpath: "#story",
			title: "#story-header h1",
			author: "a[rel=author]",
			paragraphs: "p.story-content"
		},
		"barrons.com": {
			name: "Barrons.com",
			xpath: "//div[contains(@class, \'mastertextCenter\')]",
			title: "h1",
			author: "h3.byline",
			paragraphs: ".articlePage > p, .articlePage > b, .articlePage ul, .articlePage blockquote",
			atags: ".articlePage > p a, .articlePage > b a, .articlePage ul a, .articlePage blockquote a"
		}
		};

	function removeNodes(el, css) {
		var nodes = el.querySelectorAll(css);
		for (var i = 0; i < nodes.length; i++) {
			el = nodes[i];
			el.remove();
		}
	}

	function extractContent(item, elContent) {
		var i, nodes, el, newsContent = [];
		var info = urlAuthorMap[item.source];
		if (info && elContent) {
			item.symbols = item.symbols || [];
			if (!item.author && info.author) {
				el = elContent.querySelector(info.author);
				item.author = el && el.innerText.trim();
			}

			removeNodes(elContent, "img");
			for (i=0; info.remove && i < info.remove.length; i++) {
				// Remove images and videos, and charts
				removeNodes(elContent, info.remove[i]);
			}

			// replace all the <a> tags
			nodes = elContent.querySelectorAll(info.atags ? info.atags : (info.paragraphs + " a"));
			for(i=0; i < nodes.length; i++) {
				el = nodes[i];
				replaceAnchorTag(el);
			}

			nodes = elContent.querySelectorAll(info.paragraphs);
			for (i = 0; i < nodes.length; i++) {
				el = nodes[i];
				if (el.tagName == "B") {
					newsContent.push("<p>" + el.innerHTML + "</p>");
				}
				else
					newsContent.push(el.outerHTML);
			}
			item.content = newsContent.join("");
			return item;
		}
		return null;
	}
	function replaceAnchorTag(el) {
		var elChild = document.createTextNode(el.innerText.trim());
		el.parentNode.replaceChild(elChild, el);
	}
	function parseItem(item) {
		if (item && item.link) {
			var info, source, url = item.link.toLowerCase();

			var urls = item.link.split("/*");
			if (urls.length == 2 && urls[1].indexOf("http") == 0) {
				// handle the redirection to https for yahoo
				if (urls[1].indexOf("yahoo.com") > 0 && urls[1].indexOf("http:") >= 0)
					item.link = "https:" + urls[1].split("http:")[1];
				else
					item.link = urls[1];
			}

			for (source in urlAuthorMap) {
				if (url.indexOf(source) > 0)
					item.source = source;
			}
			if (!item.source) {
				console.log("News: Ignore source: " + item.link);
			}
			if (item.source) {
				if (item.description) {
					var description = item.description.split("] - "),
						publisher = description[0],
						marker = "[";
					if (publisher.indexOf("[at ") >= 0) {
						marker = "[at ";
					}
					item.publisher = publisher.split(marker)[1];
					item.description = description[1];
				}
				if (!item.publisher)
					item.publisher = urlAuthorMap[item.source].name;
			}
		}
		return item && item.source;
	}
	function getNewsContent(item, callback) {
		var info = urlAuthorMap[item.source];
		if (!info) {
			callback && callback(null);
			return;
		}
		if (info.useParse) {
			Stock.Utils.requestFileParse(item.link, {
				success: function(response) {
					var elContent = Stock.Utils.convertToDom(response);
					if (elContent) {
						elContent = elContent.querySelector(info.xpath);
					}
					extractContent(item, elContent);
					callback && callback(item);
				}
			});
		}
		else {
			var query = ['select * from htmlstring where url="' + item.link + '" and  xpath="' + info.xpath + '"'].join('');
			var requestUrl = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(query) + "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&rand=" + (new Date()).getTime();
			console.log(query);
			Stock.Utils.requestFileXHR(requestUrl, {
				success: function (response) {
					try {
						var elContent, html = JSON.parse(response);
						// Neuter all the img tags and script tags
						html = html.query.results.result.replace(/src=\"http/g, 'src2="http').replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/\n/g, "");
						elContent = Stock.Utils.convertToDom(html);

						extractContent(item, elContent);
					}
					catch (e) {
					}
					callback && callback(item);
				},
				error: function () {
					callback && callback(null);
				}
			});
		}
	}
	Stock.News = {
		parseItem: parseItem,
		getNewsContent: getNewsContent
	};

	/*
	function extractTheStreet(item, elContent) {
		var item = { symbols: [] },
			i, nodes, el, newsContent = [];

		el = elContent.querySelector("#titleBar h1");
		item.title = el && el.innerText.trim();
		el = elContent.querySelector("#titleBar #storyAuthorLink span a");
		item.publisher = el && el.innerText.trim();
		el = elContent.querySelector("#titleBar #storyAuthorLink > span:nth-child(4)");
		item.pubDate = el && el.innerText.trim();
		if (item.pubDate)
			item.date = new Date(item.pubDate);

		nodes = elContent.querySelectorAll(".virtualpage p a");
		for(i=0; i < nodes.length; i++) {
			el = nodes[i];
			replaceAnchorTag(el);
		}
		nodes = elContent.querySelectorAll(".virtualpage p");
		for(i=0; i<nodes.length; i++) {
			el = nodes[i];
			// if the paragraph content is too small it's either a chart
			if (el.innerText.replace(/[\t,\n, ]/g, "").length > 30) {
				newsContent.push(el.outerHTML);
			}
		}
		item.content = newsContent.join("");
		return item;
	}
	function extractCNBC(item, elContent) {
		var item = { symbols: [] },
			i, nodes, el, newsContent = [];

		el = elContent.querySelector("h1.title");
		item.title = el && el.innerText.trim();
		el = elContent.querySelector(".source a[rel=author]");
		item.publisher = el && el.innerText.trim();
		el = elContent.querySelector(".datestamp");
		item.pubDate = el && el.innerText.trim();
		if (item.pubDate)
			item.date = new Date(item.pubDate);

		// Remove images and videos, and charts
		nodes = elContent.querySelectorAll("#article_body .embed-container");
		for(i=0; i < nodes.length; i++) {
			el = nodes[i];
			el.remove();
		}
		nodes = elContent.querySelectorAll("#article_body .group-container img");
		for(i=0; i < nodes.length; i++) {
			el = nodes[i];
			el.remove();
		}
		nodes = elContent.querySelectorAll("#article_body .group-container");
		for(i=0; i<nodes.length; i++) {
			el = nodes[i];
			newsContent.push(el.outerHTML);
		}
		item.content = newsContent.join("");
		return item;
	}
	*/

})();