//get current time of the youtube video 
function getCurrentTime(player) {
    let controls = player.children[0].children[0].currentTime;
    let time = {
        minutes: Math.floor(controls / 60),
        seconds: Math.floor(controls % 60)
    }
    return time;
}

//get the title of the youtube video
function getTitle() {
    return document.title;
}

//get query of youtube video id
function getUrl() {
    let query = new URLSearchParams(window.location.search).get('v');
    if (typeof query === "string") {
        return query;
    }
    return undefined;
}

//listen for message for creating bookmark and redirection
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.bookmark) {
            if (getUrl() !== undefined) {
                setStorage();
                sendMessage();
            }
        } else if (request.link !== undefined) {
            openLink(request.link.url);
        }
    }
);

//store the bookmark into chrome sync storage
function setStorage() {
    let player = document.getElementById("movie_player");
    let time = getCurrentTime(player);

    chrome.storage.sync.get(['youtubeBookmarks'], function (result) {
        let bookmarks = result.youtubeBookmarks;
        if (bookmarks === undefined) {
            bookmarks = {
                value: [{
                    time: time,
                    url: getUrl(),
                    title: getTitle()
                }]
            }
        } else {
            bookmarks = JSON.parse(bookmarks);
            let value = {
                time: time,
                url: getUrl(),
                title: getTitle()
            };
            bookmarks.value.push(value);
        }

        chrome.storage.sync.set({
            youtubeBookmarks: JSON.stringify(bookmarks)
        });
    });
}

//redirect current window to link on call
function openLink(link) {
    window.open(link, '_self');
}

//send message to popup script to refresh popup
function sendMessage() {
    chrome.runtime.sendMessage({
        refresh: true
    });
}