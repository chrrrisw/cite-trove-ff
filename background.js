/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @author Chris Willoughby
 */

 "use strict";

/**
 * The callback function for the citeTrove menu item.
 */
function onClickHandler(info, tab) {
    if (info.menuItemId == "citeTrove") {
        console.log("citeTrove pressed");
        // Must use chrome.tabs.sendMessage to send to content script.
        chrome.tabs.sendMessage(
            tab.id,
            {type : "cite"});

    } else {
        console.log("Not citeTrove menu item");

    }
}

/**
 * Add a listener for clicks in the context menu.
 */
chrome.contextMenus.onClicked.addListener(onClickHandler);

/**
 * Get the format from storage, format the citation, put it in selection.
 */
function formatAndCopy(message) {
    chrome.storage.sync.get({
        troveFormat: "%A%n%C%n%T%n%I, page %P%n[Quote]%n%Q%n[Quote]%n"
      }, function(items) {
        var input = document.createElement("textarea");
        document.body.appendChild(input);
        input.value = formatCitation(items.troveFormat, message);
        input.focus();
        input.select();
        document.execCommand("Copy");
        input.remove();

      });
}

/**
 * Add a listener for messages from the content script.
 */
chrome.runtime.onMessage.addListener(function(message) {
    if (message && message.type == "citation") {
        formatAndCopy(message);
    }
});

/**
 * A rule to show the pageAction on the trove.nla.gov.au site.
 */
var pageActionRule = {
    conditions: [
        new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "trove.nla.gov.au", schemes: ["http", "https"] }
        })
    ],
    actions: [ new chrome.declarativeContent.ShowPageAction() ]
};

/**
 * When installed set up context menu item and add a rule to show pageAction.
 */
chrome.runtime.onInstalled.addListener(function(details) {
    chrome.contextMenus.create({
        "title" : "Cite Trove",
        "contexts" : ["selection"],
        "id" : "citeTrove",
        "documentUrlPatterns": ["http://trove.nla.gov.au/*", "http://trove-beta.nla.gov.au/*"]
    });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([pageActionRule]);
    });
});

function pageActionCallback(tab) {
    // console.log("pageAction pressed");
    chrome.tabs.sendMessage(
        tab.id,
        {type : "cite"});
}

chrome.pageAction.onClicked.addListener(pageActionCallback);
