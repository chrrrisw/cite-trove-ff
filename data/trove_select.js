/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function cite_trove_click_cb() {
	// Get the selected text
	var selection = window.getSelection();

	// Get the current date and time
	var today = new Date();

	// Get the URL
	var article_url = location.href;

	// Get the newspaper title
	var newspaper_title = "Unknown";
	var title_box = document.getElementsByClassName("box title")[0];
	if (title_box != null) {
		var title_heading = title_box.getElementsByTagName("h1")[0];
		if (title_heading != null) {
			newspaper_title = title_heading.innerHTML;
		}
	}

	// Get the issue
	var newspaper_issue = "Unknown";
	var issue_box = document.getElementsByClassName("box issue")[0];
	if (issue_box != null) {
		var issue_strong = issue_box.getElementsByTagName("strong")[0];
		if (issue_strong != null) {
			newspaper_issue = issue_strong.innerHTML;
		}
	}

	// And the page
	var newspaper_page = "Unknown";
	var pages_box = document.getElementsByClassName("box pages")[0];
	if (pages_box != null) {
		var all_options = pages_box.getElementsByTagName("option");
		if (all_options != null) {
			for ( var index = 0; index < all_options.length; index++) {
				if (all_options[index].selected) {
					newspaper_page = all_options[index].innerHTML;
				}
			}
		}
	}

	// Send the string back to the addon
	self.postMessage({
		"url" : article_url,
		"today" : today,
		"title" : newspaper_title,
		"issue" : newspaper_issue,
		"page" : newspaper_page,
		"selection" : selection.toString()
	});

}

function cite_trove_context_cb() {
	return true;
}
