let active_tab_id = 0;
let is_set = false;
var d = new Date();

chrome.tabs.onActivated.addListener((tab) => {
  chrome.tabs.get(tab.tabId, (current_tab_info) => {
    active_tab_id = tab.tabId;
    console.log("bg : ", current_tab_info.url);

    // main(current_tab_info.url); // evaluation goes here

    // chrome.tabs.insertCSS(null, {file : "./mystyle.css"});
    // chrome.tabs.executeScript(null, { file: "./foreground.js" }, () => { }
  });
});

chrome.runtime.onMessage.addListener((request, sender, responseBack) => {
  switch (request.action) {
    case "update": {
      responseBack({ code: 201 });  // Respond back to the frontend.*/
      console.log('responsed update signal.')
      console.log('sender : ', sender)

      break;
    }
    case "login": {
      responseBack({ code: 200 })
      console.log('responsed login signal.') //works
      console.log('extra : ', request.extra)

      firebase.auth().currentUser ? console.log('already loggin!!!') : signin() ; 
      // console.log('sender : ', sender) // not useful
      break;
    }
    case "logout": {
      responseBack({ code: 200 })
      console.log('responsed logout signal.') //wroks
      console.log('extra : ', request.extra)
      
      firebase.auth().currentUser ? signout() : console.log('already logged out!!!');
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

var get_date = () => {
  return new Date().toLocaleString()
}

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
  firebase.auth().signInWithPopup(provider).then(function (result) {
    console.log(result.credential.accessToken);
  }).catch(function (error) {
    console.log(error.code);
    // var errorMessage = error.message;
    // var email = error.email;
    // var credential = error.credential;
  });
}

function signout() {
    firebase.auth().signOut().then(function () { alert("signed out."); })
      .catch(function (error) { console.log(error); });
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
