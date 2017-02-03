var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var request = require("sdk/request");
var notifications = require("sdk/notifications");
var prefs = require("sdk/simple-prefs").prefs;
var _ = require("sdk/l10n").get;

var button = buttons.ActionButton({
  id: "url-sender",
  label: _("url_sender_button_label"),
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

function handleClick(state) {
  var serverAddLinkUlr = prefs.sendToURL;
  var content = {};
  content[prefs.parameterName] = tabs.activeTab.url;

  var req = request.Request({
        url: serverAddLinkUlr,
        content: content,
        onComplete: handleResponse
      });
  sendRequest(req);
}

function sendRequest(req){
  var senderMethod = prefs.senderMethod;
  switch (senderMethod) {
    case 0:
      req.post();
      break;
    case 1:
      req.get();
      break;
    default:
        console.log("Sender method under code" + senderMethod + " is not supported");
  };
}

function handleResponse(response) {
  var successResult = response && response.status && response.status == 200;
  var responseText = successResult ? _("success_message") : _("erro_message");
  notifySenderResult(responseText);
}

function notifySenderResult (text){
  notifications.notify({
    title: "URL",
    text: text
  });
}
