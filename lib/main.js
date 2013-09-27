/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var self = require("sdk/self");
var clipboard = require("sdk/clipboard");
var contextMenu = require("sdk/context-menu");
var preferences = require("sdk/simple-prefs");
var tabs = require("sdk/tabs");
var page_regexp = new RegExp("http://trove.nla.gov.au/ndp/del/article/\\d+");

// Use the preferences to format the output, and place in clipboard.
function copyCitation(citation) {
	var prefText = preferences.prefs.formatCitation;
	var copyText = prefText.replace(/%./g, function(match, pattern, offset,	string) {
		if (match == "%n")
			return "\n";
		else if (match == "%U")
			return citation.url;
		else if (match == "%u") {
			
			//http://trove.nla.gov.au/ndp/del/article/110644884?searchTerm=space&searchLimits=
			//http://trove.nla.gov.au/ndp/del/article/109648159/11912181?zoomLevel=3
			var page_match = citation.url.match(page_regexp);
			//console.log(page_match);
			if (page_match == null)
				return citation.url;
			
			if (page_match.length == 0)
				return citation.url;
			else
				return page_match[0];
			
		}
		else if (match == "%A") {
			var page_match = citation.url.match(page_regexp);
			if (page_match == null)
				return citation.url;
			
			if (page_match.length == 0)
				return citation.url;
			else
				return "http://nla.gov.au/nla.news-article" + page_match[0].match("\\d+");
			
        }
		else if (match == "%C")
			return citation.today;
		else if (match == "%T")
			return citation.title;
		else if (match == "%I")
			return citation.issue;
		else if (match == "%P")
			return citation.page;
		else if (match == "%Q")
			return citation.selection;
		else
			return match;
	});

	clipboard.set(copyText);
}

preferences.on("showHelp", function() {
	tabs.open(self.data.url("cite_trove.html"));
});

// Create a context menu item, only on Trove pages with selected text.
var citeTroveMenuItem = contextMenu.Item({
	label : "Cite Trove",
	context : [ contextMenu.URLContext("*.trove.nla.gov.au"),
			contextMenu.SelectionContext() ],
	contentScriptFile : [ self.data.url("trove_select.js") ],
	contentScript : "self.on('context', cite_trove_context_cb);"
			+ "self.on('click', cite_trove_click_cb);",
	onMessage : copyCitation
});
