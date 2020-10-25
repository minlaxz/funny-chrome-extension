/* script description
This script will be injected every page
and call to chrome runtime API
API, lives in background.js
*/


// var main = () => {
//   chrome.runtime.sendMessage({ action: "update" }, (res) => {
//     switch (res.code) {
//       case 201: { set_storage(); break; }
//       default: { console.log("this is an error .-. "); }
//     }
//   });

//   // chrome.runtime.onMessage.addListener((request, sender, responseBack) => {
//   //   if (request.code == 403) {alert ("u're logged out!")}
//   // });
  
// };

// var set_storage = () => {
//   chrome.storage.local.set({ "a": "b" });
//   console.log("ALL SET.");
// }; // solved

/**not really need to set an interval loop.
 * var set_int = setInterval( speak(), 3000 );
 * this is talkative.
 */ //omitted.

/** TODO
 * this wouldn't get called, when user choose
 * `open in new window or new tab`
 * but i commonly used to choose `open in new` option alot.
 */ // solved


// main();
