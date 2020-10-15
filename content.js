//Get current domain

// alert(window.location.href)
// window.open('width=600,height=600,scrollbars=no,resizable=no')
// console.log('content.js : ', window.location.href)

var switcher = true

function f1() {
    chrome.runtime.sendMessage({
        action: 'updateIcon',
        value: true
    });
    switcher = false
}

function f2() {
    chrome.runtime.sendMessage({
        action: 'updateIcon',
        value: false
    });
    switcher = true
}

var setint = setInterval( function () {
    if (switcher) {
        f1();
    } else {
        f2();
    }
} , 3000);



// chrome.tabs.query({ currentWindow : true, active: true }, function (tab) {
//     chrome.tabs.sendMessage({command:"regular", data:tabs[0].id}, response => {
//         console.log('fallback resopnse: ', response)
//     })
//   })