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


firebase.auth().onAuthStateChanged(function (user) {
    user ? logged_in(user) : logged_out(user)
})

var logged_in = (u) => {
    login_field.hidden = true;
    logout_field.hidden = false;
    output.innerText = 'as : ' + u.email
}

var logged_out = (u) => {
    login_field.hidden = false;
    logout_field.hidden = true;
    output.innerText = 'as : ' + u
}

document.addEventListener('DOMContentLoaded', function () {

    login_btn.addEventListener('click', onclick_auth_in, false)
    logout_btn.addEventListener('click', onclick_auth_out, false)

    function onclick_auth_in() {
        console.log('in clicked.')
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            chrome.runtime.sendMessage({ action: 'login', extra: tabs }, (res) => {
                showData(res.code)
            })
        });
    }

    function onclick_auth_out() {
        var c = confirm('log out : Are you sure ?')
        if (c) {
            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                chrome.runtime.sendMessage({ action: 'logout', extra: tabs }, (res) => {
                    showData(res.code)
                })
            });
        } else { window.location.reload() }

    }

    var showData = function (code) {
        console.log('bg return : ', r[code]);
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