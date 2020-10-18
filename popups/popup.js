// Browser Action `popup.html controller`
console.log('popup.js called.')

const r = {
    200: 'ok.',
    201: 'created.',
    400: 'bad request!',
    404: 'not found!',
    410: 'gone'
}

const login_field = document.getElementById('login-form');
const logout_field = document.getElementById('logout-form');
const login_btn = document.getElementById('auth-in');
const logout_btn = document.getElementById('auth-out');
const output = document.getElementById('info');

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        logout_field.hidden = false;
        output.innerText = 'as : ' + user.email;
    } else {
        login_field.hidden = false;
        output.innerText = 'as : ' + user
    }
})

document.addEventListener('DOMContentLoaded', () => {

    login_btn.addEventListener('click', onclick_auth_in, false)
    logout_btn.addEventListener('click', onclick_auth_out, false)

    var onclick_auth_in = () => {
        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
            chrome.runtime.sendMessage({ action: 'login', extra: tabs }, (res) => {
                showData(res.code)
            })
        });
    }

    var onclick_auth_out = () => {
        var c = confirm('log out : Are you sure ?')
        if (c) {
            chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
                chrome.runtime.sendMessage({ action: 'logout', extra: tabs }, (res) => {
                    showData(res.code)
                })
            });
        } else { window.location.reload(); }

    }
});

var showData = (code) => {
    console.log('bg return : ', r[code]);
}

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