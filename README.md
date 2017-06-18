# Alexa BrowserHelp

BrowserHelp allows you to control your browser and navigate solely by voice, using Amazon Alexa (e.g. via one of your Echo devices). This POC consists of an Alexa skill, Chrome browser extension, and server that relays the skill's restful requests to the plugin over a websocket connection. Actions already implemented include:
- google voice search
- tab history traversal
- link highlighting
- selecting and following any link on the page
- opening and closing of tabs	
- scrolling
- directly loading popular websites
- refreshing
- simulate relevant button presses, such as enter or spacebar

## Demo
View the demo here:
https://www.youtube.com/watch?v=EWi6ej_2dp4


## Setup

**UPDATE: The skill and Chrome extension are currently live. Download the [BrowserHelp Skill](https://www.amazon.com/dp/B0711BN7SG/ref=sr_1_1?s=digital-skills&ie=UTF8&qid=1497191443&sr=1-1&keywords=browserhelp) from Amazon's Alexa Skills Marketplace and the [Alexa BrowserHelp](https://chrome.google.com/webstore/detail/alexa-browserhelp/jjjjekfmojknabiflakbmnmapkkmefbe) extension via the Chrome Web Store**

To install the skill, follow the following steps:
1. Deploy the server on any platform, and enable https
2. Update all occurrences of the "serene-harbor-37271.herokuapp.com" URL to the baseUrl of your own server
3. Install the chrome extension found in the extension folder as described in https://developer.chrome.com/extensions/getstarted#unpacked
4. Create a new Skill for Alexa, and when configuring the Interaction Model use the settings stored in intentScheme.json, LIST_OF_ITEMS.txt, and sampleUtterances.txt from the skill directory to define the allowed voice interactions
5. Configure and upload your skill via the AWS CLI as described in this link: https://developer.amazon.com/blogs/post/Tx1UE9W1NQ0GYII/publishing-your-skill-code-to-lambda-via-the-command-line-interface  and use the already included publish.sh to re-upload
6. The setup should now be complete, and if the skill was uploaded correctly it has been automatically made available for usage on Alexa devices on which you are logged in with your Amazon account. Test the skill by asking 'Alexa, start BrowserHelp'



## Sample Utterances
For a more detailed view of all allowed commands and variations in wording for these commands, view the sampleUtterances.txt and recipes.js files in the skill directory. These files, combined with intentScheme.json and LIST_OF_ITEMS.txt, are used to define the [Interaction Model](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interaction-model-reference) for BrowserHelp. Some currently recognized phrases are:

- Search with Google
- Highlight links
- Open link {number}
- Remove highlighting
- Navigate {back/forward}
- Scroll {up/down}
- Reload page
- {Open/close} tab
- Show news
- Open {Youtube/Google/Facebook/Twitter/Hacker News}
- Press {Spacebar/Enter}


## Future Goals / TODO

- Include login by amazon account ID on plugin side, to match installed skills to installed plugins and enable a single server to manage communications for all users
- Optionally use AWS IoT Pub/Sub service for all Lambda / Extension communication, which would allow removal of the server and replace socket&#46;&#8203;io with [MQTT](https://github.com/jimmyn/aws-mqtt-client)
- End-to-end feedback of failing actions
- Inject [Web Speech API](https://developers.google.com/web/updates/2013/01/Voice-Driven-Web-Apps-Introduction-to-the-Web-Speech-API) for filling in forms or search boxes
- Expand intents and sample utterances for better and more natural query recognition
- Web dashboard for users to add their own preferred sites as shortcuts
- Implement additional features such as opening favourites and filling in search boxes
