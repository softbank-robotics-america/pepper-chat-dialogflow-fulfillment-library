'use strict';
/**********************************************/
// DF Webhook Setup:
/**********************************************/
const { WebhookClient } = require('dialogflow-fulfillment');
const functions = require('firebase-functions');
const {BackgroundImage, BasicCard, BasicText, CarouselImage, Carousel, CarouselImageNoTitle, CarouselNoTitles, FullScreenImage, Icon, Icons, 
Style, TextBubble, TextBubbles, TriggerIntent, Video, Website, PepperResponse} = require('pepper-chat-dialogflow');

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
        photo_booth: "https://pepperstorageprod.blob.core.windows.net/pepperdrive/6bb74073-3661-4588-81fd-d4484e9e01da150ff583-e8fc-4e0b-97ce-da3810c0ecc8.png"  },
    video: "https://pepperstorageprod.blob.core.windows.net/pepperdrive/6bb74073-3661-4588-81fd-d4484e9e01da55dba592-8209-46ff-922d-b7f83773dafa.mp4",
    website: "https://softbankroboticstraining.github.io/pepper-chatbot-api/#pepper-chat" };
                        
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
             photo_booth: { onSelected: "On social media, are we? \\pau=500\\ Well you look gorgeous today!", 
                                nextIntent: "Launch Photo Booth" } },
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
    const agent = new WebhookClient({ request, response });
    const Actions = { 
        background_image: "BackgroundImage.ThreePeppers",
        basic_card: 'BasicCard.StarWars',
        full_screen_image: "FullScreenImage.RobotsHumansRelationship",
        carousel: "Carousel.FavoriteRobot",
        icons: "Icons.Entertainment",
        text_bubbles: "TextBubbles.FavoriteColor",
        text_bubbles_set_color: "TextBubbles.SetColor",
        video: "Video.PepperPromo",
        website: "Website.SBRA",
        trigger_intent: "TriggerIntent.TriggerStarWars",
        chained_responses: "ChainedResponses.SlideShowThenTriggerWebsite"
    };
    const Contexts = { user_name: "username" };
    const Parameters = { user_name: "firstName", color: "color"};
    let firstName = '';
    try {  
        firstName = agent.contexts.filter(context => { return context.name === Contexts.user_name; })[0].parameters[Parameters.user_name];
    } catch (err) {
        console.log("Error retrieving username: ", err);
    }
    function showBasicCard() {
        console.log(BasicCard);
        let basicCard = new BasicCard(COPY.basic_card, MEDIA.basic_card);
        let basicCardResponse = new PepperResponse(basicCard);
        basicCardResponse.send(response);
    }
    function showFullScreenImage() {
        let fullScreen = new FullScreenImage(COPY.full_screen_image, MEDIA.full_screen_image);
        let fullScreenResponse = new PepperResponse(fullScreen);
        fullScreenResponse.send(response);
    }
    function setBackgroundImage() {
        let background = new BackgroundImage(COPY.background_image, MEDIA.background_image);
        let backgroundResponse = new PepperResponse(background);
        backgroundResponse.send(response);        
    }
    function showCarousel() {
        let carouselArray = [];
        for (let carouselItem in COPY.carousel) {
            if (carouselItem == "title") { continue; }
            carouselArray.push( new CarouselImageNoTitle(
                COPY.carousel[carouselItem].speech.replace("Yay!", "Yay, " + firstName + "!"),
                MEDIA.carousel[carouselItem],
                COPY.carousel[carouselItem].nextIntent));
        }
        let carousel = new CarouselNoTitles(COPY.carousel.title, carouselArray);
        let carouselResponse = new PepperResponse(carousel);
        carouselResponse.send(response);        
    }
    function showIcons() {
        let iconArray = [];
        for (let icon in COPY.icons) {
            if (icon == "title") { continue; }
            iconArray.push( new Icon(
                MEDIA.icons[icon],
                COPY.icons[icon].nextIntent,
                COPY.icons[icon].onSelected )   );
        }
        let icons = new Icons(COPY.icons.title, COPY.icons.title, iconArray);
        let iconsResponse = new PepperResponse(icons);
        iconsResponse.send(response);        
    }
    function showTextBubbles() {
        let bubblesArray = [];
        for (let bubble in COPY.text_bubbles) {
            if (bubble == "title") { continue; }
            bubblesArray.push( new TextBubble( COPY.text_bubbles[bubble].display, COPY.text_bubbles[bubble].nextIntent));  
        }
        let textBubbles = new TextBubbles(COPY.text_bubbles.title, bubblesArray);
        let textBubblesResponse = new PepperResponse(textBubbles);
        textBubblesResponse.send(response);            
    }
    function setTextColor() {
        let color = "I'm not sure what you said, but I'm sure your favorite color";
        try {
            color = agent.parameters[Parameters.color].toLowerCase();
        } catch (err) {
            console.log("Error retrieving user-selected color.");
        }
        let text1 = new BasicText(color + " is a nice color indeed!");
        console.log(text1);
        text1.setStyle({textColor : color.length > 20 ? "blue" : color});
        let text2 = new BasicText("And now. \\pau=300\\ Please ask me to show you another response type. || Please ask me to show you another response type.");
        let textStyleResponse = new PepperResponse(text1, text2);
        textStyleResponse.send(response);            
    }
    function showVideo() {
        let video = new Video(COPY.video, MEDIA.video);
        let videoResponse = new PepperResponse(video);
        videoResponse.send(response);          
    }
    function showWebsite() {
        let website = new Website( COPY.website.speech, MEDIA.website, COPY.website.onExit );
        let websiteResponse = new PepperResponse(website);
        websiteResponse.send(response);           
    }
    function triggerIntent() {
        let text = new BasicText("Ok, I will now trigger the Star Wars basic card intent.");
        let nextIntent = new TriggerIntent("Show Me Star Wars Droids");
        nextIntent.speech = COPY.trigger_intent;
        let nextIntentResponse = new PepperResponse(nextIntent);
        nextIntentResponse.send(response);         
    }
    function showChainedResponses() {
        let fullScreen = new FullScreenImage(COPY.full_screen_image, MEDIA.full_screen_image);
        let fullScreen2 = new FullScreenImage("And " + COPY.full_screen_image2, MEDIA.full_screen_image2);
        let website = new Website("And " + COPY.website.speech, MEDIA.website, COPY.website.onExit);
        let chainedResponse = new PepperResponse ( fullScreen, fullScreen2, website );
        chainedResponse.send(response);         
    }
    const actionMap = {};
    actionMap[Actions.basic_card].            = showBasicCard;
    actionMap[Actions.full_screen_image]      = showFullScreenImage;
    actionMap[Actions.background_image]       = setBackgroundImage;
    actionMap[Actions.carousel]               = showCarousel;
    actionMap[Actions.icons]                  = showIcons;
    actionMap[Actions.text_bubbles]           = showTextBubbles;
    actionMap[Actions.text_bubbles_set_color] = setTextColor;
    actionMap[Actions.video]                  = showVideo;
    actionMap[Actions.website]                = showWebsite;
    actionMap[Actions.trigger_intent]         = triggerIntent;
    actionMap[Actions.chained_responses]      = showChainedResponses;
  
    console.log("Handling request");
    actionMap[agent.action]();
}
