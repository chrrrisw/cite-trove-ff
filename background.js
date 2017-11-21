/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @author Chris Willoughby
 */

"use strict";

function onError(error) {
    console.error(`Error: ${error}`);
}

/**
 * The callback function for the citeTrove menu item.
 */
function onClickHandler(info, tab) {
    if (info.menuItemId == "citeTrove") {
        console.log("citeTrove pressed");
        // Must use browser.tabs.sendMessage to send to content script.
        browser.tabs.sendMessage(
            tab.id,
            {type : "cite"}
        ).catch(onError);
    }
}

/**
 * Add a listener for clicks in the context menu.
 */
browser.menus.onClicked.addListener(onClickHandler);

/**
 * When installed set up context menu item.
 */
browser.runtime.onInstalled.addListener(function(details) {
    browser.menus.create({
        "title" : "Cite Trove",
        "contexts" : ["selection"],
        "id" : "citeTrove",
        "documentUrlPatterns": ["http://trove.nla.gov.au/*", "https://trove.nla.gov.au/*"]
    });
});
