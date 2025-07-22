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

  document.getElementById("title").innerHTML = servername;
  fadeIn(document.getElementById("title"));

  if (SharedConfig.ui.enableMap) {
    document.getElementById("map").appendChild(document.createTextNode(mapname));
    fadeIn(document.getElementById("map"));
  } else {
    document.getElementById("map").style.display = "none";
  }

  if (SharedConfig.ui.enableSteamID) {
    document.getElementById("steamid").innerHTML = steamid;
    fadeIn(document.getElementById("steamid"));
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
  // Only fade in if not already visible
  var navElement = document.querySelector("nav");
  
  if (navElement && navElement.style.opacity != 1) {
    fadeIn(navElement);
  }
}
function setLoad(percentage) {
  document.querySelector(".overhaul").style.left = percentage + "%";
}


function fadeIn(element) {
  if (!element) return;
  
  // Set display first to ensure the element is in the DOM
  element.style.display = "block";
  // Then set opacity for the fade effect
  element.style.opacity = 1;
  
  // Ensure the powered-by element is properly visible when nav is shown
  if (element.tagName === 'NAV') {
    const poweredBy = element.querySelector('.powered-by');
    if (poweredBy) {
      poweredBy.style.display = "flex";
      poweredBy.style.opacity = 1;
    }
  }
}

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Initial function
 */
document.addEventListener("DOMContentLoaded", function() {
  // Make nav visible immediately
  var navElement = document.querySelector("nav");
  fadeIn(navElement);



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


