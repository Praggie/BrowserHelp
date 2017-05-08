// Runs only when login page opened, pass data back to background.js
document.addEventListener("mail", function(data) {
	var mail = 'mail' + data.detail;
    chrome.runtime.sendMessage(mail);
});

document.addEventListener("options", function(data) {
    chrome.runtime.sendMessage(data.detail);
});