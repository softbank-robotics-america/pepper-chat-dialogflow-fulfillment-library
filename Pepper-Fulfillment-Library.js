/*************************************************************/
/*  Begin Pepper Chat Fulfillment Library                    */
/*************************************************************/

/**
 * BasicResponse() -- the base class from which all other valid Pepper response types inherit; 
 * this class has two helper methods to set Context and Style to the response. This design 
 * enables using these methods on (nearly**) any response of your choice. 
 * ** Some response types do not allow styling to be added to them directly. In these cases, 
 *    the styling must be applied either before or after such a response type.
 * 
 * @return {object} DO NOT INSTANTIATE THIS OBJECT; IT IS JUST A BASE CLASS
 */
 class BasicResponse {
     constructor() {
     }
     setStyle(styleConfig) {
        // Only allow the addition of styling to Custom Payload types
        let validStyles = ['backgroundColor', 'backgroundImage','textColor',
        'font','bubbleColor','bubbleTextColor','bubbleFont', 'randomize'];
        let styleConfigKeys = Object.keys(styleConfig);
        
        for (let x = 0; x < styleConfigKeys.length; x++) {
            let styleKey = styleConfigKeys[x];
            if (validStyles.indexOf(styleKey) == -1) {
                throw styleKey + " is not a valid style key (" + validStyles.join(", ") + ").";
            } else {
                this.payload[styleKey] = styleConfig[styleKey];
            }
        }
    }
}

/**
 * BackgroundImage(spokenAndDisplayedText, url) -- sets a background image (persistently) to Pepper's tablet; 
 * https://softbankroboticstraining.github.io/pepper-chatbot-api/#image-fullscreen-image
 * 
 * @param {string} spokenAndDisplayedText - what is to be spoken/displayed by Pepper
 * @param {string} url - the URL of the image to add persistently as the background
 * @return {object} The correctly formatted JSON object to pass to the PepperResponse object
 * 
 * @example
 *  let spokenAndDisplayedText = "Look at this beautiful vista."
 *  let landscapeImageUrl = "https://travel-photography-company/img/beautiful-images.jpg";
 *  let backgroundImage = new BackgroundImage(spokenAndDisplayedText, landscapeImageUrl);
 *  let responseToPepper = new PepperResponse(backgroundImage);
 *  responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter      
 */
 class BackgroundImage extends BasicResponse {
     constructor(spokenAndDisplayedText, url) {
         super();
         this.payload = {    speak : spokenAndDisplayedText, 
                             backgroundImage : url    };
     }
     setStyle(styleConfig) {
         super.setStyle(styleConfig);
     }
}

/**
 * BasicCard(title, url) -- creates a basic image card on Pepper's tablet
 * 
 * @param {string} title - what is to be displayed and spoken as the title on Pepper's tablet 
 * @param {string} url - the URL of the image to display as a basic image card
 * @return {object} The correctly formatted JSON object to pass to the PepperResponse object
 * 
 * @example
 *  let title = "Employee of the Month || Guess who won Employee of the Month!";
 *  let employeeOfMonthImageUrl = "https://companywebsite.com/employee-of-month/jan-2018.jpg";
 *  let basicCard = new BasicCard(title, speech, employeeOfMonthImageUrl);
 *  let responseToPepper = new PepperResponse(basicCard);
 *  responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter      
 */
 class BasicCard extends BasicResponse {
    constructor(title, url) {
        super();
        this.payload = { 
            basicCard : {
                contentURL: url,
                text: title    } };
    }
    setStyle(styleConfig) {
        super.setStyle(styleConfig);
    }
 }

/**
 * BasicText(spokenAndDisplayedText) - a simple text-based response
 * 
 * @param {string} spokenAndDisplayedText - what is to be spoken by Pepper/displayed on Pepper's tablet
 * @return {object} The correctly formatted JSON to pass to the PepperResponse object
 * 
 * @example
 *  let spokenAndDisplayedText = "Why, hello! Hello there! || Hello.";
 *  let responseToPepper = new PepperResponse(new BasicText(spokenAndDisplayedText));
 *  responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter       
 *  (Output: Pepper's voice: 'Why, hello! Hello there!' || Pepper's tablet: 'Hello.')
 *
 * @example
 *  let spokenAndDisplayedText = "Why, hello! Hello there! || Hello.";
 *  let responseToPepper = new PepperResponse(spokenAndDisplayedText); // <-- You can also just pass text directly to create a Basic Text response
 *  responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter       
 */
 class BasicText extends BasicResponse {
     constructor(spokenAndDisplayedText) {
         super();
         this.payload = { speak : spokenAndDisplayedText }
     }
     setStyle(styleConfig) {
         super.setStyle(styleConfig);
     }
 }

/**
 * CarouselImageUncaptioned(speak, contentURL, value) - must be used in conjunction with the Carousel class
 * to create a carousel; the relationship is that a Carousel is composed of CarouselImage objects.
 * 
 * @param {string} speak - what is displayed under this Carousel image
 * @param {string} contentURL - the image to be created as an item within a Carousel
 * @param {string} value - the utterance that will be triggered upon selecting
 *          this carousel image
 * @return {object} The correctly formatted JSON to pass in an array to a Carousel object
 * 
 * @example  
 *  let carouselArray = [];
 *  for (var name in list) {
 *      var carouselImage = new CarouselImageUncaptioned(name, "https://pepper-img-server/"+name+".jpg", "trigger " + name)
 *      carouselArray.push(carouselImage);
 *  }
 *  let carousel = new Carousel("Check out these options:", carouselArray);
 *  let responseToPepper = new PepperResponse(carousel);
 *  responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter 
 * 
 * Note: Cannot be used standalone with PepperResponse!
 */
 class CarouselImageUncaptioned {
     constructor(speech, url, value) {
         this.speak = speech;
         this.contentURL = url;
         this.value = value;
     }
 }

 /**
 * CarouselImageCaptioned(speak, contentURL, caption, value) - must be used in conjunction with the Carousel class
 * to create a carousel; the relationship is that a Carousel is composed of CarouselImage objects.
 * 
 * @param {string} speak - what is displayed under this Carousel image
 * @param {string} contentURL - the image to be created as an item within a Carousel
 * @param {string} caption - the caption under the image
 * @param {string} value - the utterance that will be triggered upon selecting
 *          this carousel image
 * @return {object} The correctly formatted JSON to pass in an array to a Carousel object
 * 
 * @example  
 *  let carouselArray = [];
 *  for (var name in list) {
 *      var carouselImage = new CarouselImageCaptioned(name, "https://pepper-img-server/"+name+".jpg", caption, "trigger " + name)
 *      carouselArray.push(carouselImage);
 *  }
 *  let carousel = new Carousel("Check out these options:", carouselArray);
 *  let responseToPepper = new PepperResponse(carousel);
 *  responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter 
 * 
 * Note: Cannot be used standalone with PepperResponse!
 */
 class CarouselImageCaptioned {
     constructor(speech, url, caption, value) {
         this.speak = speech;
         this.contentURL = url;
         this.value = value;
         this.text = caption;
     }  
 }


/**
 * Carousel(title, carouselImageArray):
 * 
 * @param {string} title - what is to be spoken/displayed as title
 * @param {object} carouselImageArray - an array of CarouselImageNoTitle objects
 * @return {object} The correctly formatted JSON object to pass to the PepperResponse object
 * 
 * @example
 *  let carouselDog = new CarouselImageNoTitle("Dog","http://animal-images/dog.jpg", "Dog image");
 *  let carouselCat = new CarouselImageNoTitle("Cat","http://animal-images/cat.jpg", "Cat image");
 *  let carouselBird = new CarouselImageNoTitle("Bird","http://animal-images/bird.jpg", "Bird image");
 *  let carouselArray = [carouselDog, carouselCat, carouselArray];
 *  let carousel = new Carousel("Look at this beautiful carousel", carouselArray);
 *  let responseToPepper = new PepperResponse(carousel);
 *  responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter  
 */
 class Carousel extends BasicResponse {
     constructor(title, carouselImagesArray) {
         super();
         this.payload = {};
         this.payload.title = title;
         this.payload.imageCards = carouselImagesArray.map(carouselImage => {
             if (carouselImage instanceof CarouselImageUncaptioned || carouselImage instanceof CarouselImageCaptioned) {
                 return carouselImage;
             } else {
                 throw "A Carousel object must take an array of CarouselImageNoTitle objects";
             }
         });
     }
     setStyle(styleConfig) {
         super.setStyle(styleConfig);
     }
 }

/**
 * FullScreenImage(speech, url, delay):
 * 
 * @param {string} speech - what is to be spoken
 * @param {string} url - the URL of the image to display in fullscreen mode
 * @param {number} delay - (optional) the amount of time after the speech finishes for the image to be displayed
 * @return {object} The correctly formatted JSON to pass to the PepperResponse object
 * 
 * @example
 *  let speech = "Look at this beautiful vista."
 *  let landscapeImageUrl = "https://travel-photography-company/img/beautiful-images.jpg";
 *  let fullScreenImg = new FullScreenImage(speech, landscapeImageUrl);
 *  let responseToPepper = new PepperResponse(fullScreenImg);
 *  responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter 
 */
 class FullScreenImage extends BasicResponse {
     constructor(speech, url, delay) {
         super();
         this.payload = {    speak : speech,
             imageURL : url      };
             if (delay)
                 this.payload.delay = delay;
         }
         setStyle(styleConfig) {
             super.setStyle(styleConfig);
         }
     }

/**
 * Icon(speech, url, triggerUtterance, iconTitle):
 * 
 * @param {string} speech - (optional) if provided, what Pepper will speak if 
 *      the icon is pressed; pass an empty string ("") if no speech is desired
 * @param {string} url - the url of the icon image
 * @param {string} triggerUtterance - the utterance that will be triggered if icon is pressed
 * @param {string} iconTitle - (optional) the text string that is displayed over the icon
 * @return {object} The correctly formatted JSON to pass in an array to an Icons object
 * 
 * @example
 *  let urlBase = "https://icon-library/best-icons/icon-"
 *  let iconOne = [new Icon(urlBase + "1.jpg", "Icon 1", "Great choice!")
 *  let iconTwo = new Icon(urlBase + "2.jpg", "Icon 2", "Wonderful selection!")]
 *  let iconArray = [iconOne, iconTwo];
 *  let mainSpeech = "Select from one of these options"
 *  let titleText = "Select an option:"
 *  let icons = new Icons(mainSpeech, titleText, iconArray);
 *  let responseToPepper = new PepperResponse(icons);
 *  responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter 
 *
 * Note: Cannot be used standalone with PepperResponse; it must be used with Icons (plural)!
 */
 class Icon {
     constructor(url, triggerUtterance, speech, iconTitle) {
         this.iconUrl = url;
         this.value = triggerUtterance;
         if (speech) { this.speak = speech;    }        
         if (iconTitle) { this.text = iconTitle;       }
     }
 }

/**
 * Icons(speech, titleText, iconArray) - a response of icons (1-6 menu layout)
 * 
 * @param {string} speech - what is to be spoken
 * @param {string} titleText - the text that is to be displayed
 * @param {object} iconArray - array of Icon objects
 * @return {object} The correctly formatted JSON to pass to the PepperResponse object
 * 
 * @example
 *  let speech = "Select from one of these options"
 *  let titleText = "Select an option:"
 *  let urlBase = "https://icon-library/best-icons/icon-"
 *  let iconArray = [new Icon(urlBase + "1.jpg", "Icon 1"), new Icon(urlBase + "2.jpg", "Icon 2")]
 *  let icons = new Icons(speech, titleText, iconArray);
 *  let responseToPepper = new PepperResponse(icons);
 *  responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter 
 */
 class Icons extends BasicResponse {
     constructor(speech, titleText, customIconsArray) {
         super();
         this.payload = {    speak : speech,
             text : titleText,
                            // Check to make sure the icons are valid:
                            customIcons : customIconsArray.map(icon => {
                                if (icon instanceof Icon) {
                                    return icon;
                                } else {
                                    throw "Icons' 3rd parameter must be an array of Icon objects!";
                                }
                            })};
                        }
                        setStyle(styleConfig) {
                            super.setStyle(styleConfig);
                        }
                    }

/**
 * Style(title, styleConfig) - a simple Style object response
 * 
 * @param {string} title - what is to be spoken/displayed on Pepper's tablet
 * @param {object} styleConfig - an object containing valid style configuration key:value pairs
 * @return {object} The correctly formatted JSON to pass to the PepperResponse object
 * 
 * @example
 *  let title = "Look at this beautiful styling."
 *  let styleConfigObj = {  backgroundColor: "grey", textColor: "black"  };
 *  let style = new Style(title, styleConfigObj);
 *  let responseToPepper = new PepperResponse(style);
 *  responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter 
 */
 class Style extends BasicResponse {
     constructor(title, styleConfig) {
         super();
         this.payload = {};
         let validStyles = this._getValidStyles();
         let styleConfigKeys = Object.keys(styleConfig);
         for (let styleKey in styleConfigKeys) {
             if (validStyles.indexOf(styleKey) == -1) {
                 throw styleKey + " is not a valid style key (" + validStyles.join(", ") + ").";
             } else {
                 this.payload[styleKey] = styleConfig[styleKey];
             }
         }
         this.payload.speak = title || " ";
     }
 }

/**
 * TextBubble(textValue, triggerUtterance, speech) - creates a basic Text Bubble object; must be
 * used in conjunction with a TextBubbles object; the relationship is that a TextBubbles object takes
 * an array of TextBubble objects.
 * 
 * @param {string} textValue - what displays on Pepper inside the bubble
 * @param {string} triggerUtterance - the utterance triggered if a user selects this text bubble
 * @param {string} speech - (optional) what Pepper says if a user selects this text bubble
 * @return {object} The correctly formatted JSON to pass as an array to a TextBubbles object
 * 
 * @example
 *  let bubbleOne = new TextBubble("First Time Visit", "Registration Sign-Up", "Welcome! Let's get you registered!");
 *  let bubbleTwo = new TextBubble("Returning Customer", "Schedule Appointment", "Welcome back. Pulling up the available time slots now");
 *  let textBubbles = new TextBubbles("Please choose the option that applies to you", [bubbleOne, bubbleTwo]);
 *  let responseToPepper = new PepperResponse(textBubbles);
 *  responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter 
 * 
 * Note: Cannot be used standalone with PepperResponse; it must be used with TextBubbles (plural)!
 */
 class TextBubble {
     constructor(textValue, triggerUtterance, speech) {
         this.title = textValue;
         this.value = triggerUtterance;
         this.speak = speech;
     }
 }

/**
 * TextBubbles(title, bubblesArray, randomize):
 * 
 * @param {string} title - the title that displays on Pepper's tablet / what Pepper speaks
 * @param {object} bubblesArray - an array of TextBubble objects
 * @param {boolean} randomize - (optional) a boolean value of whether or not to randomize the bubbles
 * @return {object} The correctly formatted JSON to pass to the PepperResponse object
 * 
 * @example
 *  let bubbleOne = new TextBubble("First Time Visit", "Registration Sign-Up", "Welcome! Let's get you registered!");
 *  let bubbleTwo = new TextBubble("Returning Customer", "Schedule Appointment", "Welcome back. Pulling up the available time slots now");
 *  let textBubbles = new TextBubbles("Please choose the option that applies to you", [bubbleOne, bubbleTwo]);
 *  let responseToPepper = new PepperResponse(textBubbles);
 *  responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter 
 */
 class TextBubbles extends BasicResponse {
     constructor(title, textBubbleArray, randomize) {
         super();
         this.payload = {    title : title,
             randomBubbles : textBubbleArray      };
             if (randomize)
                 this.payload.randomize = true;
         }
         setStyle(styleConfig) {
             super.setStyle(styleConfig);
         }
     }

/**
 * TriggerIntent(triggerUtterance, title) - triggers another intent; cannot be used in conjunction 
 * with a Style response object. 
 * 
 * @param {string} triggerUtterance - the utterance string to trigger
 * @param {string} title - (optional) The speech for pepper to display
 * @return {object} The correctly formatted JSON to pass to the PepperResponse object
 * 
 * @example
 *  let returnToMainMenu = new TriggerIntent("Main Menu");
 *  let responseToPepper = new PepperResponse(returnToMainMenu);
 *  responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter 
 */
 class TriggerIntent extends BasicResponse {
     constructor(triggerUtterance, title) {
         super();
         this.payload = { action : "setStyle",
         action_parameters : { nextUtterance : triggerUtterance } };
         if (title)
             this.payload.speak = title;
     }
     setStyle(styleConfig) {
         super.setStyle(styleConfig);
     }

 }

/**
 * Video(speech, url, contentType):
 * 
 * @param {string} speech - what is to be spoken
 * @param {string} url - the URL of the video to display (FYI: Pepper Chat then caches the video)
 * @param {string} contentType - (optional) If the video file's url ends in the filetype, this field is optional;
 *          otherwise specify the content type with the syntax "video/{file-type}", e.g. "video/mp4"
 * @return {object} The correctly formatted JSON to pass to the PepperResponse object
 *
 * @example
 *  let speech = "Watch this product video to understand our latest new features:"
 *  let url = "https://pepper-promo-videos/vid/pepper-promo-1.mp4";
 *  let video = new Video(speech, url);
 *  let responseToPepper = new PepperResponse(video);
 *  responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter 
 */
 class Video extends BasicResponse {
     constructor(speech, url, contentType) {
         super();
         try {
             contentType = contentType ? contentType : "video/" + url.split('.').pop();
         } catch (err) {
             throw "ERROR: Content type was not specified and could not be extracted from the video's URL.";
         }
         this.payload = {    videoURL : url,
             contentType : contentType,
             speak : speech              };
         }
         setStyle(styleConfig) {
             super.setStyle(styleConfig);
         }
     }


/**
 * Website(speech, url, onClose) - creates a valid website response object for Pepper
 * 
 * @param {string} speech - what is to be spoken by Pepper
 * @param {string} url - the URL of the image to display in fullscreen mode
 * @param {string} onClose - the utterance string that triggers when the website is closed
 * @return {object} The correctly formatted JSON to pass to the PepperResponse object
 * 
 * @example
 *  let speech = "You can see our current mortgage rates in the table displayed on my tablet"
 *  let mortgageRatesUrl = "https://robotbank/us/mortgage-rates.html";
 *  let mortgageRatesWebsite = new Website(speech, mortgageRatesUrl);
 *  let responseToPepper = new PepperResponse(mortgageRatesWebsite);
 *  responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter 
 */
 class Website extends BasicResponse {
     constructor(speech, url, onClose) {
         super();
         this.payload = {    speak : speech,
             action: "showWebpage",
             action_parameters: {
                 url : url,
                 onClose : onClose   }   };
             }
             setStyle(styleConfig) {
                 super.setStyle(styleConfig);
             }
         }

/**
 * PepperResponse() - wraps any number of Pepper response objects with the appropriate JSON metadata 
 * in order to pass the response back to Dialogflow and then on to Pepper
 * 
 * @return {object} The correctly formatted JSON to pass to the PepperResponse object
 * 
 * @example
 *  let speech = "You can see our current mortgage rates in the table displayed on my tablet"
 *  let mortgageRatesUrl = "https://robotbank/us/mortgage-rates.html";
 *  let mortgageRatesWebsite = new Website(speech, mortgageRatesUrl);
 *  let followUp = new Text("I hope you enjoyed learning about our mortgage rates!")
 *  let responseToPepper = new PepperResponse(mortgageRatesWebsite, followUp);
 *  responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter 
 */
 class PepperResponse {
     constructor(){
         this.fulfillmentMessages = [];
         let validResponses = ["BackgroundImage","BasicCard","BasicText","Carousel","CarouselNoTitles","FullScreenImage","Icons","Style","Text","TextBubbles","TriggerIntent","Video","Website"];
         for (let x = 0; x < arguments.length; x++) {
            // If simple text is passed to PepperResponse, convert it into a BasicText object before processing;
            if (typeof arguments[x] == "string"){
                arguments[x] = new BasicText(arguments[x]);
            }
            // Validate that the response objects are valid
            let messageType = arguments[x].constructor.name.toString();
            if ( !validResponses.includes(messageType) ) {
                throw "Error: " + messageType + " is not a valid Pepper response type.";
            }
            //this.payload = arguments[x];
            console.log("---this---");
            console.log(JSON.stringify(this));
            
            /*
                // For simple text object types:
                textResponses.push(x);
                break;
                default:
                throw "Error 2: " + messageType + " is not a valid Pepper response object.";
                // If it made it this far, it should be a valid chain of messages
            */
            this.fulfillmentMessages.push(arguments[x]);
        }
    }
    setContext(contextObj){
        if (!this.contextOut) {
            this.contextOut = [];
        }
        if (Array.isArray(contextObj)) {
            this.contextOut = [...contextObj, ...this.contextOut];
        } else {
            if (typeof contextObj === "string") {
                throw "Error: Context must be of type 'Object', not 'String'"
            }
            this.contextOut.push({ 
                name : contextObj.name, 
                lifespan : contextObj.lifespan || 5,
                parameters : contextObj.parameters
            });
        }
    }
    send(webhookResponse) {
      let responseToUser = this;
      // If the response to the user includes rich responses or contexts send them to Dialogflow
      let responseJson = {};
      // If speech or displayText is defined, use it to respond (if one isn't defined use the other's value)
      //responseJson.speech = responseToUser.speech || responseToUser.displayText || "";
      //responseJson.displayText = responseToUser.displayText || responseToUser.speech;
      responseJson = responseToUser;
      // Optional: add contexts (https://dialogflow.com/docs/contexts)
      if (responseToUser.contextOut)
          responseJson.contextOut = responseToUser.contextOut;
      if (responseToUser.followupEvent)
          responseJson.followupEvent = responseToUser.followupEvent;
      responseJson.data = responseToUser.data;
      console.log("Finished using library");
      console.log("RESPONSE TO DIALOGFLOW COMPLETE: ", JSON.stringify(responseJson));
      webhookResponse.json(responseJson); // Send response to Dialogflow
  }
}


function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
        );
}

function randomlyChoose(array){
    return array[Math.floor(Math.random() * array.length)];
}


module.exports = { BackgroundImage, BasicCard, BasicText, Carousel, CarouselImageUncaptioned, CarouselImageCaptioned, FullScreenImage, 
    Icon, Icons, Style, TextBubble, TextBubbles, TriggerIntent, Video, Website, PepperResponse, toTitleCase, randomlyChoose };
