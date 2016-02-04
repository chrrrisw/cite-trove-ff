/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
var scraper = require("./scraper.js");

function cite_trove_click_cb() {
    // Send the object back to the addon
    self.postMessage(scraper.parsePage());
}

function cite_trove_context_cb() {
    return true;
}
