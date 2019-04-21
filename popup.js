let bookmarkButton = document.getElementById('bookmarkButton');

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

chrome.storage.sync.get(['youtubeBookmarks'], function (result) {
    let value = JSON.parse(result.youtubeBookmarks).value;

    for (let i = 0; i < value.length; i++) {
        let div = document.createElement('div');
        div.innerHTML = value[i].title;
        document.body.appendChild(div);
    }
});