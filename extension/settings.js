// Saves options to chrome.storage.sync.
function save_options() {
  var site1 = document.getElementById('site1').value;
  var site2 = document.getElementById('site2').value;
  var site3 = document.getElementById('site3').value;
  var news = document.getElementById('news').value;
  var input1 = document.getElementById('input1').value;
  var input2 = document.getElementById('input2').value;
  var input3 = document.getElementById('input3').value;

  chrome.storage.sync.set({
    site1: site1,
    site2: site2,
    site3: site3,
    news: news,
    input1: input1,
    input2: input2,
    input3: input3
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Do this on initial install
// chrome.storage.sync.set{
// site1: 'https://example.com',
// site2: 'https://example.com',
// site3: 'https://example.com',
// news: 'https://www.theguardian.com/international',
// input1: 'email@example.com',
// input2: 'John Doe',
// input3: 'Cute Kittens'
// }



// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {


  chrome.storage.sync.get(['site1', 'site2', 'site3', 'news', 'input1', 'input2', 'input3'], function(items) {
      if(typeof items.site1 !== 'undefined') document.getElementById('site1').value = items.site1;
      if(typeof items.site2 !== 'undefined') document.getElementById('site2').value = items.site2;
      if(typeof items.site3 !== 'undefined') document.getElementById('site3').value = items.site3;
      // if(typeof items.news !== 'undefined') hideContactDetails = items.hideContactDetails;
      // if(typeof items.input1 !== 'undefined') hideContactDetails = items.hideContactDetails;
      // if(typeof items.input2 !== 'undefined') hideContactDetails = items.hideContactDetails;
      // if(typeof items.input3 !== 'undefined') hideContactDetails = items.hideContactDetails;
  });



  // // Use default value color = 'red' and likesColor = true.
  // chrome.storage.sync.get([
  //   'site1': '',
  //   'site2': '',
  //   'site3': '',
  //   'news': '',
  //   'input1': '',
  //   'input2': '',
  //   'input3': ''
  // ], function(items) {
  //     document.getElementById('site1').value = (items.site1 != undefined) ? items.site1 : "";
  //     document.getElementById('site2').value = (items.site2 != undefined) ? items.site2 : "";
  //     document.getElementById('site3').value = (items.site3 != undefined) ? items.site3 : "";
  //     document.getElementById('news').value = (items.news != undefined) ? items.news : "";
  //     document.getElementById('input1').value = (items.input1 != undefined) ? items.input1 : "";
  //     document.getElementById('input2').value = (items.input2 != undefined)? items.input2 : "";
  //     document.getElementById('input3').value = (items.input3 != undefined) ? items.input3 : "";
  // });
}
// document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);