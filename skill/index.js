/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
  *
  * TODO:
  * - Include unique amazon account ID in http request and use that as socket.on action string
  * - General intents instead of multiple specific string matches
  * - use this.event & this.context
 **/

'use strict';

const Alexa = require('alexa-sdk');
const actions = require('./recipes');
var md5 = require("blueimp-md5");
const request = require('request');
const http = require('http');
const baseUrl = 'serene-harbor-37271.herokuapp.com';    //TODO Replace this with your own server URL

const APP_ID = 'amzn1.ask.skill.f22034b7-53d6-4553-ae43-fc8f6963408c' //TODO replace with your app ID (OPTIONAL).

const handlers = {
    // 'NewSession': function () {
        
    //     this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
    //     // If the user either does not reply to the welcome message or says something that is not
    //     // understood, they will be prompted again with this text.
    //     this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');
    //     this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);

    // },
    'LaunchRequest': function () {
        //if no amazon token, return a LinkAccount card
        if (this.event.session.user.accessToken == undefined) {
            console.log('No access token found for user, logging request object:');
            console.log(this.event);
            this.emit(':tellWithLinkAccountCard', 'Welcome to Browser Help. To start using this skill, please use the companion Alexa app to link your account');
            return;
        } else {
            var amznProfileURL = 'https://api.amazon.com/user/profile?access_token=';
            amznProfileURL += this.event.session.user.accessToken;

            request(amznProfileURL, (error, response, body) => {
                if (response) { // we have a success so call the call back
                    // console.log(response);
                    if (response.statusCode == 200) {
                        var profile = JSON.parse(body);
                        // console.log(profile.name);
                        // console.log(profile.email);
                        var hash = md5(profile.email);
                        // console.log(hash);
                        this.attributes['mail'] = profile.email;
                        this.attributes['hash'] = hash;
                        console.log('Mail stored in attributes: ' + this.attributes['mail']);
                        console.log('Hash stored in attributes: ' + this.attributes['hash']);
                        // this.emit(':tell', "Hello " + profile.name.split(" ")[0]);
                        // if(this.attributes['extension'] == true) {
                        //     this.emit(':ask', 'BrowserHelp. For a list of options, say, help.');
                        // } else {
                        //     var cardContent = "To start using the app, install the BrowserHelp extension for your Chrome browser: https://chrome.google.com/webstore/detail/alexa-BrowserHelp/jjjjekfmojknabiflakbmnmapkkmefbe . "
                        //     this.emit(':askWithCard', 'BrowserHelp. To start using this skill, install the Chrome Extension, BrowserHelp. If you have already done this, confirm by saying, installed',);//Control your browser via actions like, search with google, navigate back, scroll down... Now, what can I help you with.');
                        //     this.attributes['extension'] == true;
                        // }
                        this.emit(':ask', 'Browser Help started. For a list of options, say help.');
                    } else {
                        console.log('Error: ' + error);
                        this.emit(':tell', "Welcome to BrowserHelp. Something went wrong when connecting to your extension, please try again later");
                    } 
                } else {
                    console.log('Error. No response from Amazon Profile Service. Error: ' + error);
                    this.emit(':tell', "Welcome to BrowserHelp. Something went wrong when connecting to your extension, please try again later");
                }
            });

        }
    },
    'Unhandled': function () {
        this.emit(':ask', 'Sorry, I didn\'t get that. For a list of options, say help');
    },
    'BrowserNavigator': function () {
        const itemSlot = this.event.request.intent.slots.Item;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }
        console.log("itemName is " + itemName);
        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
        const myActions = this.t('ACTIONS');
        const action = myActions[itemName];

        if (action) {   //found
            this.attributes.speechOutput = action;
            this.attributes.repromptSpeech = this.t('ACTION_REPEAT_MESSAGE');
            // this.emit(':askWithCard', action, this.attributes.repromptSpeech, cardTitle, action);

            // console.log("Value is: " + action);
            console.log("Key is: " + itemName);
            // console.log('getting hash from attributes');
            // var hash = this.attributes['hash'];
            // if(hash.length != 32) {
            //     console.log("Error. Hash is: " + hash);
            //     this.emit(':tell', 'Your profile could not be loaded. Please try restarting the skill');
            // }
            // var channelAction = hash + itemName;
            addChannel.call(this, itemName, (channelAction) => {
                postRequest({action:channelAction}, (result) => {
                    if (!result) {
                        this.emit(':tell', 'Server could not be reached, please try again later');
                    }
                    else {
                        this.attributes.repromptSpeech = this.t('REPROMPT_AGAIN');
                        this.emit(':ask', action, this.attributes.repromptSpeech);
                    }
                });
            });
        } else {
            let speechOutput = this.t('ACTION_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('ACTION_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput += this.t('ACTION_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput += this.t('ACTION_NOT_FOUND_WITHOUT_ITEM_NAME');
            }
            speechOutput += repromptSpeech;

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'SearchWithGoogle': function () {
        // const itemSlot = this.event.request.intent.slots.Item;
        // let itemName;
        // if (itemSlot && itemSlot.value) {
        //     itemName = itemSlot.value.toLowerCase();
        // }
        // console.log("itemName is " + itemName);
        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), 'Search with Google');
        const myActions = this.t('ACTIONS');

        this.attributes.speechOutput = 'Dictate query';
        this.attributes.repromptSpeech = this.t('ACTION_REPEAT_MESSAGE');
        // this.emit(':askWithCard', action, this.attributes.repromptSpeech, cardTitle, action);
        // console.log('getting hash from attributes');
        // var hash = this.attributes['hash'];
        // if(hash.length != 32) {
        //     console.log("Error. Hash is: " + hash);
        //     this.emit(':tell', 'Your profile could not be loaded. Please try restarting the skill');
        // }
        // var channelAction = hash + 'load google';
        addChannel.call(this, 'load google', (channelAction) => {
            postRequest({action:channelAction}, (result) => {
                if (!result) {
                    this.emit(':tell', 'Server could not be reached, please try again later');
                }
                else {
                    this.attributes.repromptSpeech = this.t('REPROMPT_AGAIN');
                    this.emit(':tell', 'Dictate query');
                }
            });
        });

    },  
    // 'Help': function () {
    //     const cardTitle = "BrowserHelp - Help Info";
    //     this.attributes.speechOutput = 'First install the Chrome extension called Alexa BrowserHelp, then try saying, search with Google, highlight links, open link 3, scroll down, open facebook, or view the Alexa app for a complete list of options';
    //     this.attributes.repromptSpeech = this.t('ACTION_REPEAT_MESSAGE');
    //     var queries = "\n- Search with Google\n- Highlight links\n- Open link {number}\n- Remove highlighting\n- Navigate {back/forward}\n- Scroll {up/down}\n- Reload page\n- {Open/close} tab\n- Show news\n- Open {Youtube/Google/Facebook/Twitter/Hacker News}\n- Press {Spacebar/Enter}";
    //     var cardContent = "To start using the app, install the Alexa Chrome™Control extension for your Chrome browser, which can be downloaded from the Chrome Web Store. \nAfter installing, try one of the following phrases:" + queries;
    //     this.emit(':askWithCard', this.attributes.speechOutput, this.attributes.repromptSpeech, cardTitle, cardContent);
    // },
    'No': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'OpenLink': function () {
        const number = this.event.request.intent.slots.Number.value;
        console.log("Link to select is " + number);
        const action = `select link ${number}`;
        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), action);
        const myActions = this.t('ACTIONS');

        this.attributes.speechOutput = `Selecting link ${number}`;
        this.attributes.repromptSpeech = this.t('ACTION_REPEAT_MESSAGE');
        // var hash = this.attributes['hash'];
        // if(hash.length != 32) {
        //     console.log("Error. Hash is: " + hash);
        //     this.emit(':tell', 'Your profile could not be loaded. Please try restarting the skill');
        // }
        // var channelAction = hash + action;
        addChannel.call(this, action, (channelAction) => {
            postRequest({action:channelAction}, (result) => {
                if (!result) {
                    this.emit(':tell', 'Server could not be reached, please try again later');
                }
                else {
                    this.attributes.repromptSpeech = this.t('REPROMPT_AGAIN');
                    this.emit(':ask', 'Link opened', this.attributes.repromptSpeech);
                }
            });
        });

    },  
    'OpenFavourite': function () {
        const number = this.event.request.intent.slots.Number.value;
        console.log("Favourite to select is " + number);
        const action = `open favourite ${number}`;
        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), action);
        const myActions = this.t('ACTIONS');

        this.attributes.speechOutput = `Opening favourite ${number}`;
        this.attributes.repromptSpeech = this.t('ACTION_REPEAT_MESSAGE');
        // var hash = this.attributes['hash'];
        // if(hash.length != 32) {
        //     console.log("Error. Hash is: " + hash);
        //     this.emit(':tell', 'Your profile could not be loaded. Please try restarting the skill');
        // }
        // var channelAction = hash + action;
        addChannel.call(this, action, (channelAction) => {
            postRequest({action:channelAction}, (result) => {
                if (!result) {
                    this.emit(':tell', 'Server could not be reached, please try again later');
                }
                else {
                    this.attributes.repromptSpeech = this.t('REPROMPT_AGAIN');
                    this.emit(':ask', 'Favourite opened', this.attributes.repromptSpeech);
                }
            });
        });

    },  
    'AMAZON.HelpIntent': function () {
        // this.attributes.speechOutput = this.t('HELP_MESSAGE');
        // this.attributes.repromptSpeech = this.t('HELP_REPROMT');
        // this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);

        const cardTitle = "BrowserHelp - Help Info";
        this.attributes.speechOutput = 'First install the Chrome extension called Alexa BrowserHelp, then try saying, search with Google, highlight links, open link 3, scroll down, open facebook, or view the Alexa app for a complete list of options';
        this.attributes.repromptSpeech = this.t('ACTION_REPEAT_MESSAGE');
        var queries = "\n- Search with Google\n- Highlight links\n- Open link {number}\n- Remove highlighting\n- Navigate {back/forward}\n- Scroll {up/down}\n- Reload page\n- {Open/close} tab\n- Show news\n- Open {Youtube/Google/Facebook/Twitter/Hacker News}\n- Press {Spacebar/Enter}";
        var cardContent = "To start using the app, install the Alexa BrowserHelp extension for your Chrome browser, which can be downloaded from the Chrome Web Store. \nAfter installing, try one of the following phrases:" + queries;
        this.emit(':askWithCard', this.attributes.speechOutput, this.attributes.repromptSpeech, cardTitle, cardContent);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

const languageStrings = {
    'en': {
        translation: {
            ACTIONS: actions.ACTIONS_EN,
            SKILL_NAME: 'Browser Navigator',
            WELCOME_MESSAGE: "Welcome to %s.",
            REPROMPT_AGAIN: "Can I help you with something else?",
            WELCOME_REPROMPT: "You can control your browser via actions like, navigate back, visit facebook ... Now, what can I help you with.",
            DISPLAY_CARD_TITLE: '%s  - Action for %s.',
            HELP_MESSAGE: "You can ask questions such as, what\'s the browser action, or, you can say exit...Now, what can I help you with?",
            HELP_REPROMT: "You can say things like, what\'s the browser action, or you can say exit...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            ACTION_REPEAT_MESSAGE: 'Try saying repeat.',
            ACTION_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
            ACTION_NOT_FOUND_WITH_ITEM_NAME: 'an action named %s. ',
            ACTION_NOT_FOUND_WITHOUT_ITEM_NAME: 'that browser action. ',
            ACTION_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    }
};

function loadHash(action, callback) {
    console.log('No hash stored yet. Requesting profile')
    //if no amazon token, return a LinkAccount card
    if (this.event.session.user.accessToken == undefined) {
        console.log('No access token found for user');
        this.emit(':tellWithLinkAccountCard', 'Welcome to Browser Help. To start using this skill, please use the companion Alexa app to link your account');
        return;
    } else {
        var amznProfileURL = 'https://api.amazon.com/user/profile?access_token=';
        amznProfileURL += this.event.session.user.accessToken;

        request(amznProfileURL, (error, response, body) => {
            if (response) { // we have a success so call the call back
                // console.log(response);
                if (response.statusCode == 200) {
                    var profile = JSON.parse(body);
                    // console.log(profile.name);
                    // console.log(profile.email);
                    var hash = md5(profile.email);
                    // console.log(hash);
                    this.attributes['mail'] = profile.email;
                    this.attributes['hash'] = hash;
                    console.log('Mail stored in attributes: ' + this.attributes['mail']);
                    console.log('Hash stored in attributes: ' + this.attributes['hash']);
                    var channelAction = hash + action;
                    callback.call(this,channelAction);
                } else {
                    console.log('Error: ' + error);
                    this.emit(':tell', "Welcome to BrowserHelp. Something went wrong when connecting to your extension, please try again later");
                } 
            } else {
                console.log('Error. No response from Amazon Profile Service. Error: ' + error);
                this.emit(':tell', "Welcome to BrowserHelp. Something went wrong when connecting to your extension, please try again later");
            }
        });
    }
}

function addChannel(action, callback) {
    var hash = this.attributes['hash'];
    if(!hash || hash.length != 32) {
        console.log("Error. Hash is: " + hash);
        loadHash.call(this, action, callback);
    } else {
        var channelAction = hash + action;
        callback.call(this,channelAction);
    }
}

function postRequest(input, callback) {
    
    var options = {
      host: baseUrl,
      path: '/action',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    var req = http.request(options, (res) => {
        callback(res.statusCode === 200)
    });

    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
        // this.emit(':tell', 'error during request');
        callback(false);
    });

    var content = JSON.stringify(input);
    console.log("Sending request for: " + content);
    req.write(content);
    req.end();
} 

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
