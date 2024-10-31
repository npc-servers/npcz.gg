"use strict";

var isGmod = false;
var isTest = false;
var totalFiles = 50;
var totalCalled = false;
var downloadingFileCalled = false;
var percentage = 0;

/**
 * Gmod Called functions
 */
function GameDetails(
    servername,
    serverurl,
    mapname,
    maxplayers,
    steamid,
    gamemode
) {
    isGmod = true;
    if (!isTest) {
        loadAll();
    }

    if (Config.enableMap) {
        document.getElementById("map").appendChild(document.createTextNode(mapname));
        fadeIn(document.getElementById("map"));
    } else {
        document.getElementById("map").style.display = "none";
    }

    if (Config.enableCustomText) {
        document.getElementById("steamid").innerHTML = Config.customText;
        fadeIn(document.getElementById("steamid"));
    } else {
        document.getElementById("steamid").style.display = "none";
    }
}

function SetFilesTotal(total) {
    totalCalled = true;
    totalFiles = total;
}

function SetFilesNeeded(needed) {
    if (totalCalled) {
        var sPercentage = 100 - Math.round((needed / totalFiles) * 100);
        percentage = sPercentage;
        setLoad(sPercentage);
    }
}

var fileCount = 0;
function DownloadingFile(filename) {
    filename = filename.replace("'", "").replace("?", "");
    downloadingFileCalled = true;
    var history = document.getElementById("history");
    var newItem = document.createElement("div");
    newItem.className = "history-item";
    newItem.appendChild(document.createTextNode(filename));
    history.insertBefore(newItem, history.firstChild);

    var items = document.getElementsByClassName("history-item");
    for (var i = 0; i < items.length; i++) {
        if (i > 10) {
            items[i].parentNode.removeChild(items[i]);
        } else {
            items[i].style.opacity = (1 - i * 0.1).toString();
        }
    }
}

var allow_increment = true;
function SetStatusChanged(status) {
    var history = document.getElementById("history");
    var newItem = document.createElement("div");
    newItem.className = "history-item";
    newItem.appendChild(document.createTextNode(status));
    history.insertBefore(newItem, history.firstChild);

    var items = document.getElementsByClassName("history-item");
    for (var i = 0; i < items.length; i++) {
        if (i > 10) {
            items[i].parentNode.removeChild(items[i]);
        } else {
            items[i].style.opacity = (1 - i * 0.1).toString();
        }
    }
    if (status === "Workshop Complete") {
        allow_increment = false;
        setLoad(80);
    } else if (status === "Client info sent!") {
        allow_increment = false;
        setLoad(95);
    } else if (status === "Starting Lua...") {
        setLoad(100);
    } else {
        if (allow_increment) {
            percentage = percentage + 0.1;
            setLoad(percentage);
        }
    }
}

/**
 * External Functions
 */
function loadAll() {
    fadeIn(document.querySelector("nav"));
    fadeIn(document.querySelector("main"));

    // first time loading if DownloadingFile isn't called after some time
    setTimeout(function() {
        if (downloadingFileCalled) {
            announce(
                "This is your first time joining, please wait for the files to download.",
                true
            );
        }
    }, 10000);
}

function setLoad(percentage) {
    document.querySelector(".overhaul").style.left = percentage + "%";
}

var permanent = false;
function announce(message, ispermanent) {
    if (Config.enableAnnouncements && !permanent) {
        var announcement = document.getElementById("announcement");
        announcement.style.display = "none";
        announcement.innerHTML = message;
        fadeIn(announcement);
    }
    if (ispermanent) {
        permanent = true;
    }
}

function fadeIn(element) {
    element.style.opacity = 1;
    element.style.display = "block";
}

/**
 * Title rotation function
 */
function rotateTitle(index) {
    if (!Config.enableRotatingTitles || !Config.titleMessages || Config.titleMessages.length === 0) {
        return;
    }

    var titleMessage = Config.titleMessages[index];
    var h2Element = document.querySelector('.title h2');
    var h1Element = document.querySelector('.title h1');

    // Fade out
    h2Element.style.opacity = '0';
    h1Element.style.opacity = '0';

    setTimeout(function() {
        // Update text
        h2Element.innerHTML = titleMessage.heading;
        h1Element.innerHTML = titleMessage.subheading;

        // Fade in
        h2Element.style.opacity = '1';
        h1Element.style.opacity = '1';
    }, 500); // Half a second for fade out
}

/**
 * Initial function
 */
document.addEventListener("DOMContentLoaded", function() {
    // Add transition style to title elements
    var h2Element = document.querySelector('.title h2');
    var h1Element = document.querySelector('.title h1');
    if (h2Element && h1Element) {
        h2Element.style.transition = 'opacity 0.5s ease-in-out';
        h1Element.style.transition = 'opacity 0.5s ease-in-out';
    }

    // Initialize title rotation
    if (Config.enableRotatingTitles && Config.titleMessages && Config.titleMessages.length > 0) {
        var titleIndex = 0;
        rotateTitle(titleIndex); // Show first title immediately
        
        setInterval(function() {
            titleIndex++;
            if (titleIndex >= Config.titleMessages.length) {
                titleIndex = 0;
            }
            rotateTitle(titleIndex);
        }, Config.titleRotationLength);
    }

    // print announcement messages every few seconds
    if (Config.announceMessages && Config.enableAnnouncements && Config.announcementLength) {
        if (Config.announceMessages.length > 0) {
            var i = 0;
            setInterval(function() {
                announce(Config.announceMessages[i]);
                i++;
                if (i > Config.announceMessages.length - 1) {
                    i = 0;
                }
            }, Config.announcementLength);
        }
    }

    // if it isn't loaded by gmod load manually
    setTimeout(function() {
        if (!isGmod) {
            isTest = true;
            loadAll();

            GameDetails(
                "Servername",
                "Serverurl",
                "Mapname",
                "Maxplayers",
                "SteamID",
                "Gamemode"
            );

            var totalTestFiles = 100;
            SetFilesTotal(totalTestFiles);

            var needed = totalTestFiles;
            setInterval(function() {
                if (needed > 0) {
                    needed = needed - 1;
                    SetFilesNeeded(needed);
                    DownloadingFile("Filename " + needed);
                }
            }, 500);

            SetStatusChanged("Testing..");
        }
    }, 1000);
});