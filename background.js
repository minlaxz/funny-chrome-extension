let active_tab_id = 0;
let is_set = false;
var d = new Date();

const methods = {
  0 : 'test',
  1 : 'update_status',
  2 : 'update_icon'
}
const responses = {
  200 : 'ok.',
  201 : 'created.',
  400 : 'bad request!'
}

chrome.tabs.onActivated.addListener((tab) => {
  chrome.tabs.get(tab.tabId, (current_tab_info) => {
    active_tab_id = tab.tabId;
    console.log("bg : ", current_tab_info.url);
    main(current_tab_info.url); /**evaluation goes here*/

    // chrome.tabs.insertCSS(null, {file : "./mystyle.css"});
    // chrome.tabs.executeScript(null, { file: "./foreground.js" }, () => { }
  });
});

chrome.runtime.onMessage.addListener((request, sender, responseBack) => {
  switch (request.action) {
    case "update_status": {
      /**Respond back to the frontend.*/
      responseBack({ code: 201 }); 
      console.log('responsed update status signal.')

      // var extracted = extractor(sender);
      // console.log(extracted);

      /**sender has a bunch of stuff to deal, this is great, take a look! */
      //console.log("inside sender", sender); 
       /**evaluation goes here*/
      // main(request.value);
      break;
    }
    case "login" : {
      responseBack({code: 200})
      console.log('responsed login signal.')
      break;
    }
    case "logout" : {
      responseBack({code: 200})
      console.log('responsed logout signal.')
      break;
    }
    case "test" : {
      responseBack({code: 200})
      console.log('responsed test signal.')
      break;
    }
    default: {
      console.log("bad request! : ", request.action);
    }
  }
});

var get_date = () => {
  return new Date().toLocaleString()
}

var extractor = (obj) => {
  return {
    url: obj.url,
    origin: obj.origin,
  };
};

var main = (url) => {
  const pattern = new RegExp("https");
  pattern.test(url) ? set_true() : set_false();
};

/**
 * testing interval, but it is bad idea.
 * setInterval(() => { chrome.tabs.sendMessage(active_tab_id, { message: "handled from background." }); }, 3000);
 */

var set_true = () => {
  chrome.browserAction.setIcon({
    path: {
      19: "./flags/right19.png",
      38: "./flags/right38.png",
    },
  });
};

var set_false = () => {
  chrome.browserAction.setIcon({
    path: {
      19: "./flags/wrong19.png",
      38: "./flags/wrong38.png",
    },
  });
};

// var ref = db.ref();
// ref.once("value", (snap) => {console.log(snap.val())})

function signin() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function (result) { console.log(result.credential.accessToken);
  }).catch(function (error) { console.log(error.code);
    // var errorMessage = error.message;
    // var email = error.email;
    // var credential = error.credential;
  });
}

function signout() {
  if (firebase.auth.currentUser) {
    firebase.auth().signOut().then(function () { alert("signed out."); })
      .catch(function (error) { console.log(error); });
  }
}

function send() {
  chrome.tabs.sendMessage(active_tab_id, { message: get_date() });
  console.log('sent to front.')
}


// firebase.auth().currentUser ? signout() : signin();

// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     alert('signed in.')
//   } else {
//     alert('signed out.')
//   }
// });

// chrome.tabs.onUpdated.addListener((callback) => {
//   console.log(callback)
// })

// chrome.runtime.onMessage.addListener((request, sender, resp) => {
//   // chrome.tabs.query({ active: true }, function (tab) {
//   //   console.log(tab)
//   // })

// if (request.command == "post") {
//     chrome.tabs.getSelected(function (tab) {
//       db.collection("Bookmarks").doc(request.data).set({
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
//   if (request.command == "fetch") {
//     var docRef = db.collection("cities").doc("LA");
//     docRef.get().then(function (doc) {
//       if (doc.exists) {
//         //doc.data()
//         resp({ type: "result", status: "success", data: doc.data(), request: request });
//       } else {
//         //No such document!
//         resp({ type: "result", status: "error", data: 'No such document!', request: request });
//       }
//     }).catch(function (error) {
//       //Error getting document:",error
//       resp({ type: "result", status: "error", data: error, request: request });
//     });
//   }

//   if (request.command == "regular") {
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
