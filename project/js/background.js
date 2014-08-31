chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
        chrome.tabs.sendRequest(tabs[0].id, {message: "MP3Recoder-Google-Chrome-Extension"}, function(response) {
        });
    });
});
