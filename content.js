/* script description
This script will be injected every page
and call to chrome runtime API
API, lives in background.js
*/
function in_sync() {
  chrome.runtime.sendMessage({
    action: "update_icon",
    value: window.location.href,
  });
}
in_sync();

/* not really need to set an interval loop.
 * var set_int = setInterval( in_sync(), 3000 );
 */

/* TODO
this wouldn't get called, when user choose
`open in new window or new tab`
but i really commonly used to choose
`open in new` option alot.
*/



/* Temp solution - Not working
// chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
//   chrome.tabs.sendMessage(
//     {
//       action: "update_icon",
//       value: window.location.href,
//     },
//     //  data: tabs[0].id },
//     (response) => {
//       console.log("fallback response: ", response);
//     }
//   );
// });
*/

