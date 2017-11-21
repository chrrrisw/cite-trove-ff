/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @author Chris Willoughby
 */

/**
 * The message handler for the content script.
 * If the message is of type 'cite', parse the page and send
 * the results back to the background script.
 */
function processMessage(message, sender, sendResponse) {
    console.log("content processMessage");
    if (message.type == "cite") {
        console.log("cite message, sending response");
        sendResponse(parsePage());
    } else {
        console.log("Unexpected message");
    }
}

/**
 * Add the processMessage handler as a listener for messages.
 */
browser.runtime.onMessage.addListener(processMessage);
