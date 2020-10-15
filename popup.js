// Browser Action `popup.html controller`
console.log('popup.js called.')

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('save').addEventListener('click', onclick, false)

    function onclick() {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            // chrome.tabs.sendMessage(tabs[0].id, 'href', responseParse)
            chrome.runtime.sendMessage({ command: "post", data: "Domain" }, (response) => {
                showData(response.data)
            })
        });
        // chrome.tabs.getCurrent(function(tab) {
        //     chrome.runtime.sendMessage({command:"post", data: tab.url }, (response)=> {
        //         showData(response.data)
        //     })
        // });
    }

    var showData = function (data) {
        console.log('From Necromancer--', data);
    }

});