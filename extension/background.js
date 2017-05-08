var bkg = chrome.extension.getBackgroundPage();
var socket = io('https://serene-harbor-37271.herokuapp.com/'); //TODO Replace this with your own server URL
  
 
// this is fired when a Login with Amazon popup on the setup page returns an email address
chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {  
  bkg.console.log('received data: ' + data)
  if(sender.url.includes("serene-harbor-37271.herokuapp.com")) {
    if (data.indexOf("mail") == 0) {  //login request
      var mail = data.substring(4);
      bkg.console.log('Received mail id ' + mail + ' from ' + sender.url + '. Hashing and storing')
      var hash = md5(mail);
      chrome.storage.sync.set({'channel': hash}, function() {
        // Notify that we saved.
        // var text = "alert('stored hash for " + mail + ": " + hash + "');";
        // chrome.tabs.executeScript({code: text})
        startSocket(hash);
        var text = "$('.form').animate({height: 'toggle','padding-top': 'toggle','padding-bottom': 'toggle',opacity: 'toggle'}, 'slow');";
        chrome.tabs.executeScript(null, { file: "jquery.min.js" }, function() {
          bkg.console.log('Login Successful. Identifier stored');
          chrome.tabs.executeScript({code: text});
        });
      });
    } else if (data.indexOf("options") == 0) {  //options page request
        bkg.console.log('opening options page from extension');
        if (chrome.runtime.openOptionsPage) {
          // New way to open options pages, if supported (Chrome 42+).
          chrome.runtime.openOptionsPage();
        } else {
          // Reasonable fallback. TODO
          // window.open(chrome.runtime.getURL('options.html'));
        }
    }
    
  }
});

function startExtension() {
  chrome.storage.sync.get("channel", function (data) {
      var channel = data.channel;
      if(channel != undefined && channel.length == 32) {
        bkg.console.log('Channel found: ' + channel);
        startSocket(channel);

      } else {
        bkg.console.log('No correct channel found when starting, channel found: ' + channel);
      }
  });
  // if(!setup) {
  //   text = "alert('No channel set');";
  //   // chrome.tabs.executeScript({code: text});
  //   bkg.console.log(text)
  // }
}
startExtension();


// Only start socket when login with Amazon is completed
function startSocket(channel) {
  // var text = "alert('Starting socket for channel " + channel + "');";
  // chrome.tabs.executeScript({code: text})
  bkg.console.log('Starting socket for channel: ' + channel);


  socket.on('connect', function(){
    bkg.console.log('connected');
  });
  socket.on(channel, function (action) {
    bkg.console.log(action);
    /* action can be one of: open facebook, scroll up, scroll down, navigate back, navigate forward, open <site name>, open <url>, search <phrase>*/
    switch(action) {
        case 'open facebook':
        case 'load facebook':
            loadPage('https://facebook.com');
            break;
        case 'open youtube':
        case 'load youtube':
            loadPage('https://youtube.com');
            break;
        case 'open google':
        case 'search with google':
        case 'load google':
        case 'google':
            startGoogleVoiceSearch();
            break;
        case 'open hacker news':
        case 'load hacker news':
            loadPage('https://news.ycombinator.com');
            break;
        case 'open twitter':
        case 'load twitter':
            loadPage('https://twitter.com');
            break;
        case 'show news':
            showNews();
            break;
        case 'scroll up':
            scrollUp();
            break;
        case 'scroll down':
            scrollDown();
            break;
        case 'refresh':
        case 'refresh page':
        case 'reload page':
            refreshing();
        case 'navigate back':
        case 'go back':
            goBack();
            break;
        case 'navigate forward':
        case 'go forward':
            goFoward();
            break;
        case 'open tab':
        case 'new tab':
            newTab();
            break;
        case 'close tab':
            removeTab();
            break;
        case 'display links':
        case 'highlight links':
        case 'show links':
        case 'display options':
        case 'highlight options':
        case 'show options':
            highlightLinks();
            break;
        case 'deselect links':
        case 'restore links':
        case 'deselect':
        case 'undo':
        case 'restore':
        case 'remove highlights':
        case 'remove highlighting':
            deselectLinks();
            break;
        case 'search near-by supermarkets':
            loadPage('https://www.google.com/search?q=nearby+supermarkets&oq=nearby+supermarkets');
            break;
        case 'open 1st':
        case 'open 2nd':
        case 'open 2nd link':
        case 'open second link':
            openLink(1);
            break;
        case 'open 2nd':
        case 'open second':      
        case 'open 2nd link':
        case 'open second link':
            openLink(2);
            break;
        case 'open 3rd':
        case 'open third':      
        case 'open 3nd link':
        case 'open third link':
            openLink(3);
            break;
        case 'open 4th':
        case 'open fourth':      
        case 'open 4th link':
        case 'open fourth link':
            openLink(4);
            break;
        default:
            if(action.includes('select link')) {
              const linkNumber = action.substring(12);
              openLink(linkNumber);// openLink(linkNumber);                         //TODO: change back
            } else if (action.includes('open favourite')){
              const siteNumber = action.substring(15);
              openSite(siteNumber);
            } else if (action.includes('use input')){
              const inputNumber = action.substring(10);
              useInput(inputNumber);
            } else if (action.includes('press ')){
              const button = action.substring(6);
              press(button);
            } else {
              //TODO
            }
    }
  });
}

function useInput(inputNumber) {
    var input = 'input' + inputNumber; 
    chrome.storage.sync.get(input, function (data, inputNumber) {
        var input;
        if(inputNumber == 1) {
          input = data.input1;
        } else if(inputNumber == 2) {
          input = data.input2;
        } else {
          input = data.input3;
        }
        if(input != undefined) {
          bkg.console.log('Entered input: ' + input);
          
        } else {
          bkg.console.log('No input stored');
          alert('No text stored for input ' + inputNumber + '. You can set this in the options page of the extension');
        }
    });
}

function highlightForms() {

}

function press(button) {
  switch(button) {
    case 'enter':
        //TODO
        break;
    case 'spacebar':
        //TODO
        break;
    case 'tab':
        //TODO
        break;
    case 'backspace':
        //TODO
        break;
  }
}

function selectForm() {

}

function submitForm() {
  document.forms[0].submit();
}

function openSite(siteNumber) {
    var site = 'site' + siteNumber; 
    bkg.console.log(site);
    chrome.storage.sync.get(site, function (data, siteNumber) {
        bkg.console.log(data);
        var url = data[site];
        bkg.console.log(url);
        if(url != undefined) {
          bkg.console.log('Favourite site found: ' + url);
          if (!/^https?:\/\//i.test(url)) {
              url = 'http://' + url;
          }
          loadPage(url);
        } else {
          bkg.console.log('No favourite site stored');
          alert('No site stored for favourite ' + siteNumber + '. You can set this in the options page of the extension');
        }
    });
}

function showNews() {
    chrome.storage.sync.get('news', function (data) {
        url = data.news;
        if(url != undefined) {
          if (!/^https?:\/\//i.test(url)) {
              url = 'http://' + url;
          }
          loadPage(url);
        } else {
          bkg.console.log('No news site found');
          alert('You have not yet stored your default news site. You can set this in the options page of the extension');
        }
    });
}

function newTab(e) {
  chrome.tabs.create({});
  bkg.console.log("New tab created")
}

function refreshing(e) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.reload(tabs[0].id);
  });
  bkg.console.log("Refreshed")
}

function highlightLinks() {
  // chrome.tabs.getSelected(null, function(tab){
  //   chrome.tabs.remove(tab.id)
  //   console.log("The current tab was removed")
  // });
  // $x("//*[@id=\"rso\"]/div/div/div[1]/div/h3/a")[0].href
  // bkg.console.log(getElementByXpath("//*[@id=\"rso\"]/div/div/div[1]/div/h3/a")[0]);

  chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {
      file: 'highlightLinks.js'
    })
  });
  // var i = 1;
  // while(getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3/a`)) {
  //   // console.log(getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3/a`));
  //   getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3/a`).style.backgroundColor = "yellow";
  //   i++;
  // }

}

function deselectLinks() {
  chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {
      code: "var stylesheets = document.styleSheets;for(var i = 0; i < stylesheets.length; i++) {if(stylesheets[i].title == 'highlights') {stylesheets[i].disabled=true;}}"
    })
  });
}

//Added /ncr to avoid country-specific redirect, causing country-specific aria-labels
function startGoogleVoiceSearch(n) {
  bkg.console.log('searching with google');
  loadPage('https://google.com/ncr');
  chrome.tabs.getSelected(null, function(tab){
    // chrome.tabs.onUpdated.addListener(function(tab, info) {
    //     if (info.status == "complete") {
    //         bkg.console.log('ready');
    //         chrome.tabs.executeScript(tab.id, {
    //           code: 'console.log(\'voiceSearch script injected\');myFunc();function myFunc() {console.log(\'polling\');if (document.querySelector(\'[aria-label="Search by voice"]\')) {document.querySelector(\'[aria-label="Search by voice"]\').click();console.log(\'found\');} else {;setTimeout(myFunc, 100);}}' 
    //         }) 
    //     }
    // });
    setTimeout(()=>{
      chrome.tabs.executeScript(tab.id, {
        // code: 'console.log(\'voiceSearch script injected\');myFunc();function myFunc() {console.log(\'polling\');if (document.querySelector(\'[aria-label="Search by voice"]\')) {setTimeout(()=>{document.querySelector(\'[aria-label="Search by voice"]\').click();},1000);console.log(\'found:\');console.log(document.querySelector(\'[aria-label="Search by voice"]\'));} else {;setTimeout(myFunc, 100);}}' 
        code: 'console.log(\'voiceSearch script injected\');myFunc(10);function myFunc(x) {if(x < 0){return;}console.log(\'polling \' + (x));if (document.querySelector(\'[aria-label="Search by voice"]\')) {setTimeout(()=>{document.querySelector(\'[aria-label="Search by voice"]\').click();},1000);console.log(\'found:\');console.log(document.querySelector(\'[aria-label="Search by voice"]\'));} else if (document.querySelector(\'[aria-label="Gesproken zoekopdracht"]\')) {setTimeout(()=>{document.querySelector(\'[aria-label="Gesproken zoekopdracht"]\').click();},1000);console.log(\'found:\');console.log(document.querySelector(\'[aria-label="Gesproken zoekopdracht"]\'));} else {;setTimeout(myFunc(x-1), 200);}}' 
      }) 
    }, 2000);
  });
}


function openLink(n) {
  // chrome.tabs.getSelected(null, function(tab){
  //   chrome.tabs.remove(tab.id)
  //   console.log("The current tab was removed")
  // });
  // $x("//*[@id=\"rso\"]/div/div/div[1]/div/h3/a")[0].href
  // bkg.console.log(getElementByXpath("//*[@id=\"rso\"]/div/div/div[1]/div/h3/a")[0]);
  bkg.console.log('Opening link ' + n);

  chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {
      code: `var link = document.querySelector('[data-index="${n}"]'); console.log(link);window.location.href = link`
    }, function(results){ bkg.console.log(results); } )
  });
  // var i = 1;
  // while(getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3/a`)) {
  //   // console.log(getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3/a`));
  //   getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3/a`).style.backgroundColor = "yellow";
  //   i++;
  // }

}

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function removeTab(e) {
  chrome.tabs.getSelected(null, function(tab){
      chrome.tabs.remove(tab.id)
      bkg.console.log("The current tab was removed")
  });
}

function loadPage(url) {
  chrome.tabs.getSelected(null, function(tab){
      chrome.tabs.update(tab.id, {url: url})
      bkg.console.log('opening ' + url);
  });
}

function goBack(e){
  chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {code: 'window.history.go(-1);'})
    bkg.console.log("Went back")
  });
}

function goFoward(e){
  chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {code: 'window.history.go(1);'})
    bkg.console.log("Went back")
  });
}

function scrollDown(e){
  chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {code: 'document.body.scrollTop+=1000;'})
    bkg.console.log("Scrolling down")
  });
}

function scrollUp(e){
  chrome.tabs.getSelected(null, function(tab){
    chrome.tabs.executeScript(tab.id, {code: 'document.body.scrollTop-=1000;'})
    bkg.console.log("Scrolling up")
  });
}

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
    chrome.tabs.create({url: "https://serene-harbor-37271.herokuapp.com/login"}, function (tab) {
        console.log("Prompted user to login with Amazon");
    });
    if(details.reason == "install"){
        console.log("This is a first install!");
        // chrome.tabs.create({url: "https://serene-harbor-37271.herokuapp.com/login"}, function (tab) {
        //     console.log("Prompted user to login with Amazon");
        // });
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});



