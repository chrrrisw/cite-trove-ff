/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var self = require("sdk/self");
var clipboard = require("sdk/clipboard");
var contextMenu = require("sdk/context-menu");
var preferences = require("sdk/simple-prefs");
var tabs = require("sdk/tabs");
var formatter = require("./lib/formatter.js");

// Use the preferences to format the output, and place in clipboard.
function copyCitation(citation) {
    var format = preferences.prefs.formatCitation;
    var copyText = formatter.formatCitation(format, citation);
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
