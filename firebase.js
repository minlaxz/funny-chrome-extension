chrome.runtime.onMessage.addListener((msg, sender, resp) => {
  chrome.tabs.query({active: true}, function(tab){
    console.log(tab)
  })


  if(msg.command == "post"){
    chrome.tabs.getSelected(function(tab){
      db.collection("Bookmarks").doc(msg.data).set({
        url: tab.url,
        title : tab.title
    })
      .then(function() {
          console.log("Document successfully written!");
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });
    });
    }
    if(msg.command == "fetch"){
      var docRef = db.collection("cities").doc("LA");
      docRef.get().then(function(doc) {
          if (doc.exists) {
            //doc.data()
            resp({type: "result", status: "success", data: doc.data(), request: msg});
          } else {
              //No such document!
              resp({type: "result", status: "error", data: 'No such document!', request: msg});
          }
      }).catch(function(error) {
        //Error getting document:",error
        resp({type: "result", status: "error", data: error, request: msg});
      });
    }
  
    //submit  data..
    if(msg.command == "post"){
     //...
    }
  
    return true;
  
  
  })