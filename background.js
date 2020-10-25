/**
 * background should Check \
 * authentication process or user
 **/

let active_tab_id = 0;
let is_authed;
/** tabs onActivated -> get urls */
// chrome.tabs.onActivated.addListener((tab) => {
//   chrome.tabs.get(tab.tabId, (current_tab_info) => {
//     active_tab_id = tab.tabId;
//     console.log("bg : ", current_tab_info.url);

//     main(current_tab_info.url); // evaluation goes here

//     // chrome.tabs.insertCSS(null, {file : "./mystyle.css"});
//     // chrome.tabs.executeScript(null, { file: "./foreground.js" }, () => { }
//   });
// });


var get_date = () => {
  return new Date().toLocaleString()
}

/** main func 
var main = (url) => {
  // if (! firebase.auth().currentUser) {chrome.tabs.sendMessage(active_tab_id, {code : 403})};
  var snap = datebase_handler()
  console.log(snap)
  // const pattern = new RegExp("https");
  // const href = new RegExp(snap.url)
  // set_status(href.test(url))
};
*/

/** database handler
function datebase_handler() {
  const user = firebase.auth().currentUser
  var ref = db.ref(user.uid+'/chrome_records/')
  ref.once('value', (snap) => {
    console.log (snap.val())
  })
} */

const alreadyAuthed = (user) => {
  chrome.browserAction.setIcon({
    path: {
      19: "./flags/right19.png",
      38: "./flags/right38.png"
    }
  });
  is_authed = true;
  chrome.storage.local.set({ 
    'necro' : { 
      'is_authed': is_authed ,
      'email' : user.email
    }
  }, () => { if (chrome.runtime.lastError) { console.error(
        "Error setting " + key + " to " + JSON.stringify(data) +
        ": " + chrome.runtime.lastError.message
      );
    }
  })
};

const notAuthYet = () => {
  chrome.browserAction.setIcon({
    path: {
      19: "./flags/wrong19.png",
      38: "./flags/wrong38.png"
    }
  });
  is_authed = false;
  chrome.storage.local.set({ 
    'necro' : { 
      'is_authed': is_authed ,
      'email' : null
    }
  }, () => { if (chrome.runtime.lastError) { console.error(
        "Error setting " + key + " to " + JSON.stringify(data) +
        ": " + chrome.runtime.lastError.message
      );
    }
  })
};


const signIn = () => {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      console.log(result.credential.accessToken);
    }).catch((error) => {
      console.log(error);
    });
}

const signOut = () => {
  firebase.auth().signOut()
    .then(() => {
      console.log('bg : signed out.')
    })
    .catch((error) => {
      console.log('bg: sign out error. ', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  firebase.auth().onAuthStateChanged((user) => {
    user ? alreadyAuthed(user) : notAuthYet();
  })
  /** Runtime Listener -> connect with popup via API */
  chrome.runtime.onMessage.addListener((request, sender, responseBack) => {
    switch (request.action) {
      case "post": {
        responseBack({ code: 201 });  // Respond back to the frontend.*/
        console.log('responsed post signal.', sender)
        main(sender.url)
        break;
      }
      case "delete": {
        responseBack({ code: 201 });  // Respond back to the frontend.*/
        console.log('responsed delete signal.', sender)
        main(sender.url)
        break;
      }
      case "login": {
        responseBack({ code: 200 })
        console.log('responsed login signal. extra : ', request.extra) //works
        if (!is_authed) signIn();
        // not useful sender
        break;
      }
      case "logout": {
        responseBack({ code: 200 })
        console.log('responsed logout signal.') //wroks
        console.log('extra : ', request.extra)
        if (is_authed) signOut();
        // console.log('sender : ', sender) // not useful
        break;
      }
      case "test": {
        responseBack({ code: 200 })
        console.log('responsed TEST signal.')
        break;
      }
      default: {
        console.log("bad request! : ", request.action);
      }
    }
  });
})



/**
 * testing interval, but it is bad idea.
 * setInterval(() => { chrome.tabs.sendMessage(active_tab_id, { message: "handled from background." }); }, 3000);
 */

// var ref = db.ref();
// ref.once("value", (snap) => {console.log(snap.val())})

// function send_test_message() {
//   chrome.tabs.sendMessage(active_tab_id, { message: get_date() });
//   console.log('sent to front.')
// }

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
