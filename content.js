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
        console.log("content formatting");
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
 * The message handler for the content script.
 * If the message is of type 'cite', parse the page and send
 * the results back to the background script.
 */
function processMessage(message, sender, sendResponse) {
    console.log("content processMessage");
    if (message.type == "cite") {
        console.log("cite message, sending response");
        formatAndCopy(parsePage());
    } else {
        console.log("Unexpected message");
    }
}

/**
 * Add the processMessage handler as a listener for messages.
 */
browser.runtime.onMessage.addListener(processMessage);
