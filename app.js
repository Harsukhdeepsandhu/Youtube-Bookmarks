function getCurrentTime(player) {
    let controls = player.children[0].children[0].currentTime;
    let time = {
        minutes: Math.floor(controls / 60),
        seconds: Math.floor(controls % 60)
    }
    return time;
}

function getTitle() {
    return document.title;
}

function getUrl() {
    return new URLSearchParams(window.location.search).get('v');
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.bookmark) {
            setStorage();
        }
    }
);

function setStorage() {
    let player = document.getElementById("movie_player");
    let time = getCurrentTime(player);

    chrome.storage.sync.get(['youtubeBookmarks'], function (result) {
        let bookmarks = JSON.parse(result.youtubeBookmarks);
        if (bookmarks === undefined) {
            bookmarks = {
                value: [{
                    time: time,
                    url: getUrl(),
                    title: getTitle()
                }]
            }
        } else {
            let value = {
                time: time,
                url: getUrl(),
                title: getTitle()
            };
            bookmarks.value.push(value);
        }

        chrome.storage.sync.set({
            youtubeBookmarks: JSON.stringify(bookmarks)
        }, function () {
            console.log('Value is set to ' + bookmarks.value);
        });
    });
}