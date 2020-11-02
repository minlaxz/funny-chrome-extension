/**
 * background should Check \
 * authentication process or user
 * update the local storage
 * DO NOT SET SENSITIVE DATA
 **/

// let active_tab_id = 0;
let is_authed;
let domain_to_be_track;

/**AUTH */
const alreadyAuthed = (user) => {
  chrome.browserAction.setIcon({
    path: {
      19: "./flags/right19.png",
      38: "./flags/right38.png"
    }
  });

  is_authed = true;
  chrome.storage.local.set({
    'necro': {
      'is_authed': is_authed,
      'email': user.email
    }
  }, () => {
    if (chrome.runtime.lastError) { chromeRuntimeError(chrome.runtime.lastError) }
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
    'necro': {
      'is_authed': is_authed,
      'email': null
    }
  }, () => {
    if (chrome.runtime.lastError) { chromeRuntimeError(chrome.runtime.lastError) }
  })
};

const chromeRuntimeError = (error) => {
  console.error(
    "Error setting " + key + " to " + JSON.stringify(data) +
    ": " + error.message
  );
}


const signIn = () => {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then((result) => {
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

const get_date = () => {
  return new Date().toLocaleString()
}

const url_to_origin = (url) => {
  var url = new URL(url)
  return url.hostname
}

const isNotValid = (url) => {
  var patt = new RegExp('chrome:')
  return patt.test(url)
  /** true if invalid */
}

const cleanInfo = (obj, flag) => {
  if (domain_to_be_track !== null) {
    if (obj.url == "" || isNotValid(obj.url)) {
      console.log('Not Valid Origin')
    } else {
      var origin = url_to_origin(obj.url)
      if (flag == 'bg') { /** bg */
        local_handler(origin, obj.title)
      } else { /** fg */
        local_handler(origin, obj.tab.title)
      }
    }
  } else {
    console.log('No domain is currently tracking.')
  }
}

const onTrackDomain = () => {
  chrome.storage.local.get('necro_thrive', (data) => {
    if (data.necro_thrive.track) {
      domain_to_be_track = data.necro_thrive.domain
    } else {
      domain_to_be_track = null
    }

  })

  chrome.storage.onChanged.addListener((data) => {
    if (data.necro_thrive.newValue.track) {
      domain_to_be_track = data.necro_thrive.newValue.domain
      console.log(data.necro_thrive.newValue.domain)
    } else {
      domain_to_be_track = null
      console.log(data.necro_thrive.newValue.domain)
    }
  })
}

const local_handler = (origin, title) => {
  console.log(title)
  console.log(origin)
  domain_to_be_track == origin ? console.log('tracking this domain') : console.log('not tracking.')
}



document.addEventListener('DOMContentLoaded', () => {

  /**AUTH FIELD */
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      is_authed = true; alreadyAuthed(user);
    } else { is_authed = false; notAuthYet(); }
  })

  /** tabs onActivated -> get urls background -> changing tabs */
  chrome.tabs.onActivated.addListener((tab) => {
    // active_tab_id = tab.tabId;
    chrome.tabs.get(tab.tabId, (current_tab_info) => {
      cleanInfo(current_tab_info, 'bg')
      // console.log("bg : ", current_tab_info);
      // main(current_tab_info.url); // evaluation goes here
      // chrome.tabs.insertCSS(null, {file : "./mystyle.css"});
      // chrome.tabs.executeScript(null, { file: "./foreground.js" }, () => { }
    });
  });


  /** Runtime Listener -> connect with popup via API */
  chrome.runtime.onMessage.addListener((request, sender, responseBack) => {
    switch (request.action) {
      case "post": {
        responseBack({ code: 200 });  /** Respond back to the frontend.*/
        cleanInfo(sender, 'fg') /** get info from foreground -> on new tabs, click links */
        break;
      }
      case "delete": {
        responseBack({ code: 201 }); console.log('responsed delete signal.', sender);
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
        responseBack({ code: 200 }); console.log('responsed TEST signal.');
        break;
      }
      default: {
        console.log("bad request! : ", request.action);
      }
    }
  });
  onTrackDomain();

})



/** Firebase
var main = (url) => {
  // if (! firebase.auth().currentUser) {chrome.tabs.sendMessage(active_tab_id, {code : 403})};
  var snap = datebase_handler()
  console.log(snap)
  // const pattern = new RegExp("https");
  // const href = new RegExp(snap.url)
  // set_status(href.test(url))
};
*/

/** Firebase database handler
function datebase_handler() {
  const user = firebase.auth().currentUser
  var ref = db.ref(user.uid+'/chrome_records/')
  ref.once('value', (snap) => {
    console.log (snap.val())
  })
} */

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
