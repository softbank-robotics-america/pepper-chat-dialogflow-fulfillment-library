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
    setContext(name, lifespan, parameters){
        if (!this.contextOut)
            this.contextOut = [];
        this.contextOut.push({ 
            name : name, 
            lifespan : lifespan,
            parameters : parameters
        });
    }
    addStyle(styleConfig) {
        // Only allow the addition of styling to Custom Payload types
        if (this.type == 4) {
            let validStyles = this._getValidStyles();
            let styleConfigKeys = Object.keys(styleConfig);
            for (let styleKey in styleConfigKeys) {
                if (validStyles.indexOf(styleKey) == -1) {
                    throw styleKey + " is not a valid style key (" + validStyles.join(", ") + ").";
                } else {
                    this.payload[styleKey] = styleConfig[styleKey];
                }
            }
        } else {
            // For Google Assistant types (and any other objects), do not allow the addition of styling
            throw "Unfortunately, you are not able to add style to this type of response (" + this.constructor.name +
                "). Please add the styling to a previous response or choose a different response type.";
        }
    }
    _getValidStyles() {
        return [    'backgroundColor', 'backgroundImage','textColor',
                    'font','bubbleColor','bubbleTextColor','bubbleFont'];
    }
}

/**
 * BackgroundImage(title, url) -- sets a background image (persistently) to Pepper's tablet; 
 * https://softbankroboticstraining.github.io/pepper-chatbot-api/#image-fullscreen-image
 * 
 * @param {string} title = what is to be spoken/displayed by Pepper
 * @param {string} url = the URL of the image to add persistently as the background
 * @return {object} The correctly formatted JSON object to pass to the PepperResponse object
 * 
 * @example
 *  let title = "Look at this beautiful vista."
 *  let landscapeImageUrl = "https://travel-photography-company/img/beautiful-images.jpg";
 *  let backgroundImage = new BackgroundImage(title, landscapeImageUrl);
 *  sendResponse(PepperResponse(backgroundImage));
 */
class BackgroundImage extends BasicResponse {
    constructor(title, url) {
        super();
        this.type = 4;
        this.payload = {    title : title, 
                            backgroundImage : url   };
    }
}

/**
 * BasicCard(title, url) -- creates a basic image card on Pepper's tablet
 * 
 * @param {string} title = what is to be spoken/displayed as the title on Pepper's tablet
 * @param {string} url = the URL of the image to display as a basic image card
 * @return {object} The correctly formatted JSON object to pass to the PepperResponse object
 * 
 * @example
 *  let title = "Employee of the Month";
 *  let employeeOfMonthImageUrl = "https://companywebsite.com/employee-of-month/jan-2018.jpg";
 *  let basicCard = new BasicCard(title, employeeOfMonthImageUrl);
 *  sendResponse(PepperResponse(basicCard));
 */
class BasicCard extends BasicResponse {
    constructor(title, url) {
        super();
        this.type = "basic_card";
        this.platform = "google";
        this.title = title;
        this.image = { "url" : url };
        this.buttons = [];
    }
}

/**
 * CarouselImage(title, url, triggerUtterance) - must be used in conjunction with the Carousel class
 * to create a carousel; the relationship is that a Carousel is composed of CarouselImage objects.
 * 
 * @param {string} title = what is displayed under this Carousel image
 * @param {string} url = the image to be created as an item within a Carousel
 * @param {string} triggerUtterance = the utterance that will be triggered upon selecting
 *          this carousel image
 * @return {object} The correctly formatted JSON to pass in an array to a Carousel object
 * 
 * @example  
 *  let carouselArray = [];
 *  for (var name in list) {
 *      var carouselImage = new CarouselImage(name, "https://pepper-img-server/"+name+".jpg", "trigger " + name)
 *      carouselArray.push(carouselImage);
 *  }
 *  let carousel = new Carousel("Check out these options:", carouselArray);
 * 
 * Note: Cannot be used standalone with PepperResponse!
 */
class CarouselImage {
    constructor(title, url, triggerUtterance) {
        this.title = title;
        this.url = url;
        this.triggerUtterance = triggerUtterance;
    }
}

/**
 * Carousel(title, carouselImageArray) - creates a carousel of images as a response to an intent; 
 * must be used in conjunction with the CarouselImage class to create a carousel; the relationship 
 * is that a Carousel is composed of CarouselImage objects.
 * 
 * @param {string} title = what is to be spoken/displayed as title
 * @param {object} carouselImageArray = an array of CarouselImage objects
 * @return {object} returns the correctly formatted JSON object to pass to the PepperResponse object
 * 
 * @example
 *  let carouselDog = new CarouselImage("Dog","http://animal-images/dog.jpg", "Dog image");
 *  let carouselCat = new CarouselImage("Cat","http://animal-images/cat.jpg", "Cat image");
 *  let carouselBird = new CarouselImage("Bird","http://animal-images/bird.jpg", "Bird image");
 *  let carouselArray = [carouselDog, carouselCat, carouselArray];
 *  let carousel = new Carousel("Look at this beautiful carousel", carouselArray);
 *  sendResponse(PepperResponse(carousel));
 */
class Carousel extends BasicResponse {
    constructor(title, carouselImagesArray) {
        super();
        this.type = "list_card";
        this.platform = "google";
        this.title = title;
        this.items = carouselImagesArray.map(carouselImage => {
            console.log("Map --> carouselImage: ", carouselImage);
            if (carouselImage instanceof CarouselImage) {
                return { 
                    "optionInfo": {
                        "key": carouselImage.triggerUtterance,
                        "synonyms": []  },
                    "title" : carouselImage.title,
                    "image" : { "url" : carouselImage.url } };
            } else {
                throw "A Carousel object must take an array of CarouselImage objects";
            }
        });
    }
}

/**
 * CarouselImageNoTitle(speak, url, triggerUtterance):
 * 
 * @param {string} speak = what the robot says when a user selects this carousel item
 * @param {string} url = the image to be displayed for this carousel item
 * @param {string} triggerUtterance = the utterance that will be triggered upon selecting
 *          the carousel image
 * @return {object} The correctly formatted JSON to pass in an array to a CarouselNoTitles object
 * 
 * @example  
 *  let carouselArray = [];
 *  for (var name in list) {
 *      var carouselImage = new CarouselImageNoTitle("https://pepper-img-server/"+name+".jpg", "trigger " + name);
 *      carouselArray.push(carouselImage);
 *  }
 *  let carousel = new Carousel("Check out these options:", carouselArray);
 * 
 * Note: Cannot be used standalone with PepperResponse!
 */
class CarouselImageNoTitle {
    constructor(speak, url, triggerUtterance) {
        if (speak) { this.speak = speak }
        this.contentURL = url;
        this.value = triggerUtterance;
    }
}

/**
 * CarouselNoTitles(title, carouselImageArray):
 * 
 * @param {string} title = what is to be spoken/displayed as title
 * @param {object} carouselImageArray = an array of CarouselImageNoTitle objects
 * @return {object} The correctly formatted JSON object to pass to the PepperResponse object
 * 
 * @example
 *  let carouselDog = new CarouselImageNoTitle("Dog","http://animal-images/dog.jpg", "Dog image");
 *  let carouselCat = new CarouselImageNoTitle("Cat","http://animal-images/cat.jpg", "Cat image");
 *  let carouselBird = new CarouselImageNoTitle("Bird","http://animal-images/bird.jpg", "Bird image");
 *  let carouselArray = [carouselDog, carouselCat, carouselArray];
 *  let carousel = new CarouselNoTitles("Look at this beautiful carousel", carouselArray);
 *  sendResponse(PepperResponse(carousel));
 */
class CarouselNoTitles extends BasicResponse {
    constructor(title, carouselImagesNoTitlesArray) {
        super();
        this.type = 4;
        this.payload = {};
        this.payload.title = title;
        this.payload.imageCards = carouselImagesNoTitlesArray.map(carouselImage => {
            if (carouselImage instanceof CarouselImageNoTitle) {
                return carouselImage;
            } else {
                throw "A Carousel object must take an array of CarouselImageNoTitle objects";
            }
        });
    }
}

/**
 * FullScreenImage(speech, url):
 * 
 * @param {string} speech = what is to be spoken
 * @param {string} url = the URL of the image to display in fullscreen mode
 * @return {object} The correctly formatted JSON to pass to the PepperResponse object
 * 
 * @example
 *  let speech = "Look at this beautiful vista."
 *  let landscapeImageUrl = "https://travel-photography-company/img/beautiful-images.jpg";
 *  let fullScreenImg = new FullScreenImage(speech, landscapeImageUrl);
 *  sendResponse(PepperResponse(fullScreenImg));
 */
class FullScreenImage extends BasicResponse {
    constructor(speech, url) {
        super();
        this.type = 4;
        this.payload = {    speak : speech,
                            imageURL : url      };
    }
}

/**
 * Icon(speech, url, triggerUtterance, iconTitle):
 * 
 * @param {string} speech = (optional) if provided, what Pepper will speak if 
 *      the icon is pressed; pass an empty string ("") if no speech is desired
 * @param {string} url = the url of the icon image
 * @param {string} triggerUtterance = the utterance that will be triggered if icon is pressed
 * @param {string} iconTitle = (optional) the text string that is displayed over the icon
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
 *  sendResponse(PepperResponse(icons));
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
 * @param {string} speech = what is to be spoken
 * @param {string} titleText = the text that is to be displayed
 * @param {object} iconArray = array of Icon objects
 * @return {object} The correctly formatted JSON to pass to the PepperResponse object
 * 
 * @example
 *  let speech = "Select from one of these options"
 *  let titleText = "Select an option:"
 *  let urlBase = "https://icon-library/best-icons/icon-"
 *  let iconArray = [new Icon(urlBase + "1.jpg", "Icon 1"), new Icon(urlBase + "2.jpg", "Icon 2")]
 *  let icons = new Icons(speech, titleText, iconArray);
 *  sendResponse(PepperResponse(icons));
 */
class Icons extends BasicResponse {
    constructor(speech, titleText, customIconsArray) {
        super();
        this.type = 4;
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
}

/**
 * Style(title, styleConfig) - a simple Style object response
 * 
 * @param {string} title = what is to be spoken/displayed on Pepper's tablet
 * @param {object} styleConfigurl = url of the image to display in fullscreen mode
 * @return {object} The correctly formatted JSON to pass to the PepperResponse object
 * 
 * @example
 *  let title = "Look at this beautiful styling."
 *  let styleConfigObj = {  backgroundColor: "grey", textColor: "black"  };
 *  let style = new Style(title, styleConfigObj);
 *  sendResponse(PepperResponse(style));
 */
class Style extends BasicResponse {
    constructor(title, styleConfig) {
        super();
        this.type = 4;
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
 * Text(title) - a simple text-based response
 * 
 * @param {string} title = what is to be spoken by Pepper/displayed on Pepper's tablet
 * @return {object} The correctly formatted JSON to pass to the PepperResponse object
 * 
 * @example
 *  let title = "Why, hello! Hello there! || Hello.";
 *  sendResponse(PepperResponse(new Text(title)));
 *  (Output: Pepper's tablet: 'Hello.' || Pepper's voice: 'Why, hello! Hello there!')
 */
class Text extends BasicResponse {
    constructor(title) {
        super();
        this.type = 0;
        this.speech = title;
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
 *  sendResponse(PepperResponse(textBubbles));
 * 
 * Note: Cannot be used standalone with PepperResponse!
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
 * @param {string} title = the title that displays on Pepper's tablet / what Pepper speaks
 * @param {object} bubblesArray = an array of TextBubble objects
 * @param {boolean} randomize = (optional) a boolean value of whether or not to randomize the bubbles
 * @return {object} The correctly formatted JSON to pass to the PepperResponse object
 * 
 * @example
 *  let bubbleOne = new TextBubble("First Time Visit", "Registration Sign-Up", "Welcome! Let's get you registered!");
 *  let bubbleTwo = new TextBubble("Returning Customer", "Schedule Appointment", "Welcome back. Pulling up the available time slots now");
 *  let textBubbles = new TextBubbles("Please choose the option that applies to you", [bubbleOne, bubbleTwo]);
 *  sendResponse(PepperResponse(textBubbles));
 */
class TextBubbles extends BasicResponse {
    constructor(title, textBubbleArray, randomize) {
        super();
        this.type = 4;
        this.payload = {    title : title,
                            randomBubbles : textBubbleArray      };
        if (randomize)
            this.payload.randomize = true;
    }
}
        
/**
 * TriggerIntent(triggerUtterance) - triggers another intent; cannot be used in conjunction 
 * with a Style response object. 
 * 
 * @param {string} triggerUtterance - the utterance string to trigger
 * @return {object} The correctly formatted JSON to pass to the PepperResponse object
 * 
 * @example
 *  let returnToMainMenu = new TriggerIntent("Main Menu");
 *  sendResponse(PepperResponse(returnToMainMenu));
 */
class TriggerIntent extends BasicResponse {
    constructor(triggerUtterance) {
        super();
        this.type = 4;
        this.payload = { action : "setStyle",
                         action_parameters : { nextUtterance : triggerUtterance } };
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
 *  sendResponse(PepperResponse(video));
 */
class Video extends BasicResponse {
    constructor(speech, url, contentType) {
        super();
        this.type = 4;
        try {
            contentType = contentType ? contentType : "video/" + url.split('.').pop();
        } catch (err) {
            throw "ERROR: Content type was not specified and could not be extracted from the video's URL.";
        }
        this.payload = {    videoURL : url,
                            contentType : contentType,
                            speak : speech              };
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
 *  sendResponse(PepperResponse(mortgageRatesWebsite));
 */
class Website extends BasicResponse {
    constructor(speech, url, onClose) {
        super();
        this.type = 4;
        this.payload = {    speak : speech,
                            action: "showWebpage",
                            action_parameters: {
                                url : url,
                                onClose : onClose   }   };
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
 *  sendResponse(PepperResponse(mortgageRatesWebsite, followUp));
 */
class PepperResponse {
    constructor(){
        this.speech = "";
        this.messages = [];
        let googleAssistant = [];
        let customPayloads = [];
        let textResponses = [];
        let validResponses = ["BasicCard","Carousel","CarouselNoTitles","FullScreenImage","BackgroundImage","Icons","Style","Text","TriggerIntent","Video","Website"];
        for (let x = 0; x < arguments.length; x++) {
            console.log("Argument: ", x+1);
            let messageType = arguments[x].constructor.name.toString();
            console.log("messageType: ", messageType);
            if ( validResponses.indexOf(messageType) === -1) {
                throw "Error: " + messageType + " is not a valid Pepper response type.";
            }
            switch (arguments[x].type) {
                // For Google Assistant message types:
                case "list_card":
                case "basic_card":
                    if (customPayloads.length === 0)
                        googleAssistant.push(x);
                    else
                        throw "Error: You cannot combine a " + messageType +
                            " object with a " + arguments[customPayloads[0]] + " object.";
                    break;
                // For Custom Payload message types:
                case 4:
                    // Make sure we're not mixing Custom Payload responses with Google Assistant responses
                    if (googleAssistant.length === 0)
                        customPayloads.push(x);
                    else
                        throw "Error: You cannot combine a " + messageType + " object with a " + 
                             arguments[googleAssistant[0]] + " object.";                    
                    customPayloads.push(x);
                    break;
                // For simple text object types:
                case 0:
                    textResponses.push(x);
                    break;
                default:
                    throw "Error: " + messageType + " is not a valid Pepper response object.";
            }
            // If it made it this far, it should be a valid chain of messages
            this.messages.push(arguments[x]);
        }
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

module.exports = { BackgroundImage, BasicCard, CarouselImage, Carousel, CarouselImageNoTitle, CarouselNoTitles, FullScreenImage, 
    Icon, Icons, Style, Text, TextBubble, TextBubbles, TriggerIntent, Video, Website, PepperResponse, toTitleCase, randomlyChoose };
