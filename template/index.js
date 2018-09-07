'use strict';
/**********************************************/
// DF Webhook Setup:
/**********************************************/
const { DialogflowApp } = require('actions-on-google');
const { WebhookClient } = require('dialogflow-fulfillment');
const functions = require('firebase-functions');
const {BackgroundImage, BasicCard, CarouselImage, Carousel, CarouselImageNoTitle, CarouselNoTitles, FullScreenImage, Icon, Icons, 
Style, TextBubble, TextBubbles, TriggerIntent, Video, Website, PepperResponse} = require('sbra-pepper-chat-markup');

/**
 * The entry point to handle a http request
 * @param {Request} request An Express like Request object of the HTTP request
 * @param {Response} response An Express like Response object to send back data
 */
 exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  if (request.body.result) {
    processV1Request(request, response);
  } else if (request.body.queryResult) {
    processV2Request(request, response);
  } else {
    console.log('Invalid Request');
    return response.status(400).end('Invalid Webhook Request (expecting v1 or v2 webhook request)');
  }
});

/**********************************************/
// Begin Agent-specific code:
/**********************************************/
// Handles all V2 requests
const processV2Request = (request, response) => {
    const agent = new WebhookClient({ request, response });
    agent.add("This agent's fulfillment code is not set up for V2 Dialogflow requests.");
};


// Define all the content in objects for easy 
const MEDIA = {
    basic_card: "https://pepperstorageprod.blob.core.windows.net/pepperdrive/6bb74073-3661-4588-81fd-d4484e9e01daeae1145b-8dd1-4ac7-a0ff-ca1063f89d9a.png", // Star Wars Robots
    full_screen_image: "https://pepperstorageprod.blob.core.windows.net/pepperdrive/6bb74073-3661-4588-81fd-d4484e9e01da4b1508af-4e76-4c6d-a794-fa7f741ccc7b.png", // Pepper Human Friends Moon fullscreen
    full_screen_image2: "https://pepperstorageprod.blob.core.windows.net/pepperdrive/6bb74073-3661-4588-81fd-d4484e9e01da718aee0e-a1b5-4ffe-aed1-caa0c282e1e8.jpg", // Woman in Code fullscreen
    background_image: "https://pepperstorageprod.blob.core.windows.net/pepperdrive/6bb74073-3661-4588-81fd-d4484e9e01da932a048b-467d-4047-916b-a0575c2dd247.png", // Three Peppers nearly transparent
    carousel: { 
        pepper: "https://pepperstorageprod.blob.core.windows.net/pepperdrive/6bb74073-3661-4588-81fd-d4484e9e01dabe3e29b0-d44f-499c-9a14-1e38aefd05c1.jpg",
        nao: "https://pepperstorageprod.blob.core.windows.net/pepperdrive/6bb74073-3661-4588-81fd-d4484e9e01daebc25395-7089-4fe4-8821-f3604fb709c8.jpg",
        romeo: "https://pepperstorageprod.blob.core.windows.net/pepperdrive/6bb74073-3661-4588-81fd-d4484e9e01da9e6ac746-976c-4cfd-a17b-76f849a513f6.jpg",
        atlas: "https://pepperstorageprod.blob.core.windows.net/pepperdrive/6bb74073-3661-4588-81fd-d4484e9e01dabac8103c-45c7-4643-86b2-48f1666d2982.jpg",
        spot_mini: "https://pepperstorageprod.blob.core.windows.net/pepperdrive/6bb74073-3661-4588-81fd-d4484e9e01da9f384f7f-699f-4b40-96a3-19a52a8a0566.jpg"   },
    icons: {    
        dance: "https://pepperstorageprod.blob.core.windows.net/pepperdrive/6bb74073-3661-4588-81fd-d4484e9e01da32fd87f5-d314-447f-8323-e56e194344fd.png",
        selfie: "https://pepperstorageprod.blob.core.windows.net/pepperdrive/6bb74073-3661-4588-81fd-d4484e9e01da2bf6ebbf-f8aa-4da4-b32e-1c50bfec5532.png",
        photo_booth: "https://pepperstorageprod.blob.core.windows.net/pepperdrive/6bb74073-3661-4588-81fd-d4484e9e01da25f2cabf-2686-45b4-b731-b9bcb9d65aac.png"  },
    video: "https://pepperstorageprod.blob.core.windows.net/pepperdrive/6bb74073-3661-4588-81fd-d4484e9e01da55dba592-8209-46ff-922d-b7f83773dafa.mp4",
    website: "https://www.softbankrobotics.com/us/" };
                        
const COPY = {  
    basic_card: "Check out this beautiful basic card of a few of my heroes: || A few of my heroes:",
    full_screen_image: "Here is a beautiful image that I think is metaphorical of the relationship between humans and robots. Isn't it beautiful?",
    full_screen_image2: "Here is another beautiful image that I really like.",
    background_image: "I am now featured on your background!",
    carousel: { 
        title: "Which of these is your favorite robot?",
        pepper: {   speech: "Yay! You picked me! I would pick you too!", 
                        nextIntent: "Pepper is my favorite robot"   },
        nao: {      speech: "Yay! You picked Nao! I love Nao. He's like a brother to me!", 
                        nextIntent: "Nao is my favorite robot" },
        romeo: {    speech: "Yay! You picked Romeo! He's like a brother to me!", 
                        nextIntent: "Romeo is my favorite robot." },
        atlas: {    speech: "Yay! You picked Atlas! He's like a cousin to me!", 
                        nextIntent: "Atlas is my favorite robot." },
        spot_mini: {speech: "Yay! You picked Spot Mini. I've always wanted a pet dog! He seems perfect!", 
                        nextIntent: "Spot Mini is my favorite robot."   } },
    icons: { title: "Look at my excellent entertainment selection!",
             dance: {       onSelected: "Great choice!", 
                                nextIntent: "Launch Dance application" },
             selfie: {      onSelected: "I love taking pictures!", 
                                nextIntent: "Launch Selfie application" },
             music_boxes: { onSelected: "A musician, are we? \\pau=500\\ Ok. Let's make some music!", 
                                nextIntent: "Launch Music Boxes" } },
    text_bubbles: { title: "What's your favorite color?",
                    orange: {   display: "Orange", nextIntent: "My favorite color is orange" },
                    yellow: {   display: "Yellow", nextIntent: "My favorite color is yellow" },
                    green: {    display: "Green", nextIntent: "My favorite color is green" },
                    purple: {   display: "Purple", nextIntent: "My favorite color is purple" }},
    video: "Please watch this great video of me!",
    website: {speech: "You can find out more information about me on our website!", onExit: "Exited website"},
    trigger_intent: "Triggering the Star Wars intent!"
};
                                
// Handles all V1 requests
function processV1Request(request, response) {
    const app = new DialogflowApp({ request, response });
    const Actions = { 
        background_image: "BackgroundImage.ThreePeppers",
        basic_card: 'BasicCard.StarWars',
        full_screen_image: "FullScreenImage.RobotsHumansRelationship",
        carousel: "Carousel.FavoriteRobot",
        icons: "Icons.Entertainment",
        text_bubbles: "TextBubbles.FavoriteColor",
        video: "Video.PepperPromo",
        website: "Website.SBRA",
        trigger_intent: "TriggerIntent.TriggerStarWars",
        chained_responses: "ChainedResponses.SlideShowThenTriggerWebsite"
    };
    const Contexts = { user_name: "userName" };
    const Parameters = { user_name: "firstName" };
    let firstName = '';
    try {
        firstName = app.getContextArgument(Contexts.user_name, Parameters.user_name).value;
    } catch (err) {
        console.log("Error retrieving username: ", err);
    }
    const showBasicCard = () => {
        console.log(BasicCard);
        let basicCard = new BasicCard(COPY.basic_card, MEDIA.basic_card);
        sendResponse(new PepperResponse(basicCard));
    };
    const showFullScreenImage = () => {
        let fullScreen = new FullScreenImage(COPY.full_screen_image, MEDIA.full_screen_image);
        sendResponse(new PepperResponse(fullScreen));
    };
    const setBackgroundImage = () => {
        let background = new BackgroundImage(COPY.background_image, MEDIA.background_image);
        sendResponse(new PepperResponse(background));
    };
    const showCarousel = () => {
        let carouselArray = [];
        for (let carouselItem in COPY.carousel) {
            if (carouselItem == "title") { continue }
            carouselArray.push( new CarouselImageNoTitle(
                COPY.carousel[carouselItem].speech.replace("Yay!", "Yay, " + firstName + "!"),
                MEDIA.carousel[carouselItem],
                COPY.carousel[carouselItem].nextIntent));
        }
        let carousel = new CarouselNoTitles(COPY.carousel.title, carouselArray);
        sendResponse(new PepperResponse(carousel));
    };
    const showIcons = () => {
        let iconArray = [];
        for (let icon in COPY.icons) {
            if (icon == "title") { continue }
            iconArray.push( new Icon(
                MEDIA.icons[icon],
                COPY.icons[icon].nextIntent,
                COPY.icons[icon].onSelected )   );
        }
        let icons = new Icons(COPY.icons.title, iconArray);
        sendResponse(new PepperResponse(icons));
    };
    const showTextBubbles = () => {
        let bubblesArray = [];
        for (let bubble in COPY.text_bubbles) {
            if (bubble == "title") { continue }
            bubblesArray.push( new TextBubble( COPY.display, COPY.nextIntent));  
        }
        let textBubbles = new TextBubbles(COPY.text_bubbles.title, bubblesArray);
        sendResponse(new PepperResponse(textBubbles));
    };
    const showVideo = () => {
        let video = new Video(COPY.video, MEDIA.video);
        sendResponse(new PepperResponse(video));
    };
    const showWebsite = () => {
        let website = new Website( COPY.website.speech, MEDIA.website, COPY.website.onExit );
        sendResponse(new PepperResponse(website));
    };
    const triggerIntent = () => {
        let nextIntent = new TriggerIntent("Show Me Star Wars Droids");
        nextIntent.speech = COPY.trigger_intent;
        sendResponse(new PepperResponse(nextIntent));
    };
    const showChainedResponses = () => {
        let fullScreen = new FullScreenImage(COPY.full_screen_image, MEDIA.full_screen_image);
        let fullScreen2 = new FullScreenImage("And " + COPY.full_screen_image2, MEDIA.full_screen_image2);
        let website = new Website("And " + COPY.website, MEDIA.website);
        sendResponse(new PepperResponse( fullScreen, fullScreen2, website ));
    };
    const actionMap = new Map();
    actionMap.set(  Actions.basic_card,           showBasicCard       );
    actionMap.set(  Actions.full_screen_image,    showFullScreenImage );
    actionMap.set(  Actions.background_image,     setBackgroundImage  );
    actionMap.set(  Actions.carousel,             showCarousel        );
    actionMap.set(  Actions.icons,                showIcons           );
    actionMap.set(  Actions.text_bubbles,         showTextBubbles     );
    actionMap.set(  Actions.video,                showVideo           );
    actionMap.set(  Actions.website,              showWebsite         );
    actionMap.set(  Actions.trigger_intent,       triggerIntent       );
    actionMap.set(  Actions.chained_responses,    showChainedResponses);
    app.handleRequest(actionMap);
    
    
    // Nest the sendResponse helper function inside the scope of the V1 response function, 
    // because it uses the 'response' variable in order to return a webhook response
    function sendResponse(responseToUser) {
        console.log('responseToUser  : ' + JSON.stringify(responseToUser));
        if (typeof responseToUser === 'string') {
            let responseJson = {};
            responseJson.speech = responseToUser.speech; // spoken response
            responseJson.displayText = responseToUser.displayText; // displayed response
            return responseJson; // Send response to Dialogflow
        } else {
            // If the response to the user includes rich responses or contexts send them to Dialogflow
            let responseJson = {};
            // If speech or displayText is defined, use it to respond (if one isn't defined use the other's value)
            responseJson.speech = responseToUser.speech || responseToUser.displayText || "";
            responseJson.displayText = responseToUser.displayText || responseToUser.speech;
            responseJson.messages = responseToUser.messages;
            if (responseToUser.contextOut){
                //console.log("Setting the context ", responseToUser.contextOut.name);
                responseJson.contextOut = responseToUser.contextOut;
            }
            // Optional: add rich messages for integrations (https://dialogflow.com/docs/rich-messages)
            responseJson.data = responseToUser.data;
            // Optional: add contexts (https://dialogflow.com/docs/contexts)
            console.log("RESPONSE TO DIALOGFLOW COMPLETE: ", JSON.stringify(responseJson));
            response.json(responseJson); // Send response to Dialogflow
        }
    }
}
