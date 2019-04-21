let bookmarkButton = document.getElementById('bookmarkButton');
let container = document.getElementById('container');

bookmarkButton.onclick = () => {
    sendMessage("bookmark", true);
}

function sendMessage(message, value) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            [message]: value
        });
    });
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.refresh) {
            location.reload();
        }
    }
);

function updateLayout() {
    chrome.storage.sync.get(['youtubeBookmarks'], function (result) {
        if (result.youtubeBookmarks != undefined) {
            let value = JSON.parse(result.youtubeBookmarks).value;
            let youtubeLink = "https://www.youtube.com/watch?v=";
            for (let i = 0; i < value.length; i++) {
                let time = "&t=" + value[i].time.minutes + "m" + value[i].time.seconds + "s";
                let div = document.createElement('div');
                let div2 = document.createElement('div');
                let div3 = document.createElement('div');
                let a = document.createElement('a');
                let a2 = document.createElement('a');
                a.innerHTML = value[i].title;
                a2.innerHTML = "DELETE";
                a.onclick = () => {
                    let linkObj = {
                        url: youtubeLink + value[i].url + time
                    }
                    sendMessage("link", linkObj);
                }
                a2.onclick = () => {
                    deleteStorageEntry(i);
                }
                div.className = "main-div";
                div2.className = "title-div";
                div3.className = "delete-div";
                div2.appendChild(a);
                div3.appendChild(a2);
                div.appendChild(div2);
                div.appendChild(div3);
                container.appendChild(div);
            }
        }
    });
}

function deleteStorageEntry(index) {
    chrome.storage.sync.get(['youtubeBookmarks'], function (result) {
        let bookmarks = JSON.parse(result.youtubeBookmarks);

        bookmarks.value.splice(index, 1);

        chrome.storage.sync.set({
            youtubeBookmarks: JSON.stringify(bookmarks)
        });
    });
    location.reload();
}

updateLayout();