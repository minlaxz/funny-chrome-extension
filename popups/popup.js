// Browser Action `popup.html controller`
console.log('popup.js called.')
const methods = {
    0 : 'test',
    1 : 'login',
    2 : 'logout'
  }
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('auth-in').addEventListener('click', auth_in_onclick, false)
    function auth_in_onclick() {
        console.log('in clicked.')
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            chrome.runtime.sendMessage({ action: methods[1] }, (response) => {
                showData(response.code)
            })
        });
    }

    var showData = function (code) {
        console.log('bg return : ', code);
    }

});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('auth-out').addEventListener('click', auth_out_onclick, false)
    function auth_out_onclick() {
        console.log('out clicked.')
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            chrome.runtime.sendMessage({ action: methods[2] }, (response) => {
                showData(response.code)
            })
        });
    }

    var showData = function (code) {
        console.log('bg return : ', code);
    }

});

/**
 * Deprecated.
 *chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
 *    chrome.runtime.sendMessage({ action: "update_icon", value: tabs[0].id }, (response) => {
 *        showData(response.data)
 *    })
 *});
 *chrome.tabs.getCurrent(function(tab) {
 *    chrome.runtime.sendMessage({action:"update_icon", value: tab.url }, (response)=> {
 *        showData(response.data)
 *    })
 *});
*/