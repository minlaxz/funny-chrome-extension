// Browser Action `popup.html controller`
console.log('popup.js called.')

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('save').addEventListener('click', onclick, false)

    function onclick() {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            chrome.runtime.sendMessage({ action: "update_icon", value: tabs[0].id }, (response) => {
                showData(response.data)
            })
        });
        // chrome.tabs.getCurrent(function(tab) {
        //     chrome.runtime.sendMessage({action:"update_icon", value: tab.url }, (response)=> {
        //         showData(response.data)
        //     })
        // });
    }

    var showData = function (data) {
        console.log('From Necromancer--', data);
    }

});