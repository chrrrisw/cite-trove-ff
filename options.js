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

// Saves options to browser.storage
function save_options() {
    var citationFormat = document.getElementById("format").value;
    browser.storage.sync.set({
        troveFormat: citationFormat
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById("status");
        status.textContent = "Options saved.";
        setTimeout(function() {
            status.textContent = "";
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value = "%A%n%C%n%T%n%I, page %P%n[Quote]%n%Q%n[Quote]%n".
    browser.storage.sync.get({
        troveFormat: "%A%n%C%n%T%n%I, page %P%n[Quote]%n%Q%n[Quote]%n"
    }).then(function(items) {
        document.getElementById("format").value = items.troveFormat;
    }, onError);
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click",
    save_options);
