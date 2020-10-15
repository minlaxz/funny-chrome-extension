// chrome.tabs.onActivated.addListener(tab => {
//     chrome.tabs.get(tab.tabId, current_tab_info => {
//       console.log('from background : ', current_tab_info.url)
//       chrome.tabs.executeScript(null, {file:'./foreground.js'}, () => { console.log('injected.')    })
//     });
//   });

  
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse){
  if (msg.action === "updateIcon"){
    console.log('called.')
    if (msg.value){
      chrome.browserAction.setIcon({
        path:  {
          "19" : "./right19.png",
          "38" : "./right38.png"
        }
      });
    } else {
      chrome.browserAction.setIcon({
        path: {
          "19" : "./wrong19.png",
          "38" : "./wrong38.png"
        }
      });
    }
  }
});

  // chrome.runtime.onMessage.addListener((msg, sender, resp) => {
  //   // chrome.tabs.query({ active: true }, function (tab) {
  //   //   console.log(tab)
  //   // })
  
  
  // if (msg.command == "post") {
  //     chrome.tabs.getSelected(function (tab) {
  //       db.collection("Bookmarks").doc(msg.data).set({
  //         url: tab.url,
  //         title: tab.title
  //       })
  //         .then(function () {
  //           console.log("Document successfully written!");
  //         })
  //         .catch(function (error) {
  //           console.error("Error writing document: ", error);
  //         });
  //     });
  //   }
  //   if (msg.command == "fetch") {
  //     var docRef = db.collection("cities").doc("LA");
  //     docRef.get().then(function (doc) {
  //       if (doc.exists) {
  //         //doc.data()
  //         resp({ type: "result", status: "success", data: doc.data(), request: msg });
  //       } else {
  //         //No such document!
  //         resp({ type: "result", status: "error", data: 'No such document!', request: msg });
  //       }
  //     }).catch(function (error) {
  //       //Error getting document:",error
  //       resp({ type: "result", status: "error", data: error, request: msg });
  //     });
  //   }
  
  //   if (msg.command == "regular") {
  //     var docRef = db.collection("Bookmarks").doc("Domain");
  //     docRef.get().then((doc) => {
  //       if (doc.exists) {
  //         console.log(doc.data())
  //       } else {
  //         console.log('can\'t get')
  //       }
  //     }).catch((error) => {
  //       console.log(error.message)
  //     });
  //   }
  //   return true;
  
  
  // })
  
  // chrome.runtime.sendMessage({ command: "regular", data: window.location.href }, (response) => {
  //   showResult(response.data);
  // });
  
  // var showResult = function (data) {
  //   console.log('From Necromancer--', data);
  // }
  
  // console.log(window.location.href)
  // {url: "chrome://extensions/", title: "Extensions"}
  
  
  // var docRef = db.collection("Bookmarks").doc("Domain");
  //   docRef.get().then((doc) => {
  //     if (doc.exists) {
  //       console.log("auto fetched", doc.data())
  //     } else {
  //       console.log('can\'t get')
  //     }
  //   }).catch((error) => {
  //     console.log(error.message)
  //   });