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
const output_info = document.getElementById('info');
const track_btn = document.getElementById('track');
const untrack_btn = document.getElementById('untrack');


document.addEventListener('DOMContentLoaded', () => {

    chrome.storage.local.get("necro_thrive", (data) => {
        data.necro_thrive.track ? track_btn.hidden = true : untrack_btn.hidden = true
    })

    chrome.storage.onChanged.addListener((changed_data => {
        if (changed_data.necro_thrive) {
            // console.log(changed_data.necro_thrive.newValue)
            if (changed_data.necro_thrive.newValue.track) {
                track_btn.hidden = true
                untrack_btn.hidden = false
            } else {
                untrack_btn.hidden = true
                track_btn.hidden = false
            }

        }
    }))

    chrome.storage.local.get("necro", (data) => {
        output_info.innerText = 'as : ' + data.necro.email;
        data.necro.is_authed ? logout_field.hidden = false : login_field.hidden = false;
    });


    login_btn.addEventListener('click', onclick_auth_in, false)
    logout_btn.addEventListener('click', onclick_auth_out, false)
    track_btn.addEventListener('click', onclick_track, false)
    untrack_btn.addEventListener('click', onclick_untrack, false)

    function onclick_untrack() {
        chrome.storage.local.set({
            'necro_thrive': {
                'track': false
            }
        }, () => {
            if (chrome.runtime.lastError) {
                console.error(
                    "Error setting " + key + " to " + JSON.stringify(data) +
                    ": " + chrome.runtime.lastError.message
                );
            }
        })
    }

    function onclick_track() {
        chrome.storage.local.set({
            'necro_thrive': {
                'track': true
            }
        }, () => {
            if (chrome.runtime.lastError) {
                console.error(
                    "Error setting " + key + " to " + JSON.stringify(data) +
                    ": " + chrome.runtime.lastError.message
                );
            }
        })
    }

    function onclick_auth_in() {
        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
            chrome.runtime.sendMessage({ action: 'login', extra: tabs }, (res) => {
                showData(res.code)
            })
        });
    }

    function onclick_auth_out() {
        console.log('out clicked.')
        let c = confirm('log out : Are you sure ?')
        if (c) {
            chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
                chrome.runtime.sendMessage({ action: 'logout', extra: tabs }, (res) => {
                    showData(res.code)
                })
            });
            window.location.reload();
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