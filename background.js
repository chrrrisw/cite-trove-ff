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
 * Get the format from storage, format the citation, put it in selection.
 */
function formatAndCopy(message) {
    browser.storage.sync.get({
        troveFormat: "%A%n%C%n%T%n%I, page %P%n[Quote]%n%Q%n[Quote]%n"
      }).then(function(items) {
        console.log("background formatting");
        var input = document.createElement("textarea");
        document.body.appendChild(input);
        input.value = formatCitation(items.troveFormat, message);
        input.focus();
        input.select();
        document.execCommand("Copy");
        input.remove();
      }, onError);
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
        ).then(response => {
            console.log("background response");
            console.log(response);
            if (response && response.type == "citation") {
                formatAndCopy(response);
            }
        }).catch(onError);
    }
}

/**
 * Add a listener for clicks in the context menu.
 */
browser.menus.onClicked.addListener(onClickHandler);

/**
 * A rule to show the pageAction on the trove.nla.gov.au site.
 */
// var pageActionRule = {
//     conditions: [
//         new chrome.declarativeContent.PageStateMatcher({
//             pageUrl: { hostEquals: "trove.nla.gov.au", schemes: ["http", "https"] }
//         })
//     ],
//     actions: [ new chrome.declarativeContent.ShowPageAction() ]
// };

/**
 * When installed set up context menu item and add a rule to show pageAction.
 */
chrome.runtime.onInstalled.addListener(function(details) {
    browser.menus.create({
        "title" : "Cite Trove",
        "contexts" : ["selection"],
        "id" : "citeTrove",
        "documentUrlPatterns": ["http://trove.nla.gov.au/*", "https://trove.nla.gov.au/*"]
    });

    // chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    //     chrome.declarativeContent.onPageChanged.addRules([pageActionRule]);
    // });
});

function pageActionCallback(tab) {
    // console.log("pageAction pressed");
    console.log("pageAction pressed");
    // Must use browser.tabs.sendMessage to send to content script.
    browser.tabs.sendMessage(
        tab.id,
        {type : "cite"}
    ).then(response => {
        if (response && response.type == "citation") {
            formatAndCopy(response);
        }
    }).catch(onError);
}

browser.pageAction.onClicked.addListener(pageActionCallback);
