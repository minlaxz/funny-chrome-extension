// Browser Action `popup.html controller`
/**
 * This is handling,
 * auth
 * tracking options
 * more feature will be added
 */

console.log('popup.js get called.')

document.addEventListener('DOMContentLoaded', () => {
    const login_field = document.getElementById('login-form');
    const logout_field = document.getElementById('logout-form');
    const login_btn = document.getElementById('auth-in');
    const logout_btn = document.getElementById('auth-out');
    const output_info = document.getElementById('info');
    const track_btn = document.getElementById('s-track');
    const untrack_btn = document.getElementById('s-untrack');
    const track_all_btn = document.getElementById('a-track');
    const untrack_all_btn = document.getElementById('a-untrack');
    const domain_name = document.getElementById('domain-name');
    const tab_full_url = document.getElementById('tab-full-url');
    const domain_title = document.getElementById('domain-title');
    const tracking_info = document.getElementById('tracking-info');
    const s_track_name = document.getElementById('s-track-name');
    // const domain_info = document.getElementById('domain-info'); TODO domain-info hide with AUTH

    untrack_all_btn.hidden = true
    track_all_btn.hidden = true

    login_btn.addEventListener('click', onclick_auth_in, false)
    logout_btn.addEventListener('click', onclick_auth_out, false)
    track_btn.addEventListener('click', onclick_track, false)
    untrack_btn.addEventListener('click', onclick_untrack, false)

    let url;
    let patt = new RegExp('https://')

    chrome.tabs.query({ active: true, 'lastFocusedWindow': true }, (tabs) => {

        url = new URL(tabs[0].url)
        s_track_name.innerText = ":" + url.hostname

        if (patt.test(url)) {
            domain_name.className += 'text-success'
            domain_name.innerText = url.hostname + ' (secured).'
        } else {
            domain_name.className += 'text-danger'
            domain_name.innerText = url.hostname + ' (unsecured).'
        }

        domain_title.innerText = tabs[0].title

        tab_full_url.innerText = 'Url : ' + tabs[0].url
        // console.log(tabs[0])
    });

    // track buttons first calls
    chrome.storage.local.get("necro_thrive", (data) => {
        data.necro_thrive.track ? track_btn.hidden = true : untrack_btn.hidden = true
        tracking_info.innerText = 'tracking : ' + data.necro_thrive.domain
    });

    // track button onChanged calls
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
            tracking_info.innerText = 'tracking : ' + changed_data.necro_thrive.newValue.domain
        }
    }));

    // login logout fields
    chrome.storage.local.get("necro", (data) => {
        output_info.innerText = 'as : ' + data.necro.email;
        data.necro.is_authed ? logout_field.hidden = false : login_field.hidden = false;
    });

    function onclick_untrack() {
        chrome.storage.local.set({
            'necro_thrive': {
                'track': false,
                'domain': null
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
    const isValid = (url) => {
        let patt = new RegExp('chrome:')
        return !patt.test(url)
        /** return false if not valid */
    }

    function onclick_track() {
        if (isValid(url)) {
            chrome.storage.local.set({
                'necro_thrive': {
                    'track': true,
                    'domain': url.hostname
                }
            }, () => {
                if (chrome.runtime.lastError) {
                    console.error(
                        "Error setting " + key + " to " + JSON.stringify(data) +
                        ": " + chrome.runtime.lastError.message
                    );
                }
            });
        } else {
            alert('Not Valid Origin. => ' + url)
            location.reload()
        }

    }

    function onclick_auth_in() {
        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
            chrome.runtime.sendMessage({ action: 'login', extra: tabs }, (res) => {
                console.log(res.code)
            })
        });
    }

    function onclick_auth_out() {
        console.log('out clicked.')
        let c = confirm('log out : Are you sure ?')
        if (c) {
            chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
                chrome.runtime.sendMessage({ action: 'logout', extra: tabs }, (res) => {
                    console.log(res.code)
                })
            });
            window.location.reload();
        } else { window.location.reload(); }

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