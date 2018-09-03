/*************************************************************/
/*  Begin Pepper Chat Fulfillment Library                    */
/*************************************************************/

/***********************
 *  Base Class:        *
 ***********************/

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

/***************************************************************************
 * BackgroundImage(speech, url):
 * 
 * Parameters:
 *      speech = what is to be spoken
 *      url = url of the image to display in fullscreen mode
 * 
 * Ex. usage:
 *  let speech = "Look at this beautiful vista."
 *  let landscapeImageUrl = "https://travel-photography-company/img/beautiful-images.jpg";
 *  let backgroundImage = new BackgroundImage(speech, landscapeImageUrl);
 *  sendResponse(PepperResponse(backgroundImage));
 **************************************************************************/
class BackgroundImage extends BasicResponse {
    constructor(speech, url) {
        super();
        this.type = 4;
        this.payload = {    title : speech, 
                            backgroundImage : url   };
    }
}

/***************************************************************************
 * BasicCard(title, url):
 * 
 * Parameters:
 *      title = what is to be spoken/displayed as title
 *      url = url of the image to display
 * 
 * Ex. usage:
 *  let title = "Employee of the Month";
 *  let employeeOfMonthImageUrl = "https://companywebsite.com/employee-of-month/jan-2018.jpg";
 *  let basicCard = new BasicCard(title, employeeOfMonthImageUrl);
 *  sendResponse(PepperResponse(basicCard));
 **************************************************************************/
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

/***************************************************************************
 * CarouselImage(titleOrObj, url, triggerUtterance):
 * 
 * Parameters:
 *      titleOrObj = what is displayed under the image; ALTERNATIVELY, when over-
 *          loaded as an object (as the sole parameter passed), the object must 
 *          contain "title", "url", & "triggerUtterance" properties
 *      url = the image to be displayed
 *      triggerUtterance = the utterance that will be triggered upon selecting
 *          the carousel image
 * 
 * Ex. usage:  
 *  let carouselArray = [];
 *  for (var name in list) {
 *      var carouselImage = new CarouselImage(name, "https://pepper-img-server/"+name+".jpg", "trigger " + name)
 *      carouselArray.push(carouselImage);
 *  }
 *  let carousel = new Carousel("Check out these options:", carouselArray);
 * 
 * Note: Cannot be used standalone with PepperResponse!
 **************************************************************************/
class CarouselImage {
    constructor(titleOrObj, url, triggerUtterance) {
        // If passes as three string parameters:
        if (typeof titleOrObj == "string"){
            this.title = titleOrObj;
            this.url = url;
            this.triggerUtterance = triggerUtterance;
            // If passed as an object
        } else if (typeof titleOrObj == "object") {
            // Validate
            let validKeys = {"title" : 0, "url": 1, "triggerUtterance": 2};
            let objKeys = Object.keys(titleOrObj);
            console.log("object keys: ", objKeys);
            for (let key in validKeys) {
                if (objKeys.indexOf(key) == -1){
                    throw "Error: the '" + key + "' property is missing from the CarouselImage object parameter.";
                }
            }
            this.title = titleOrObj.title;
            this.url = titleOrObj.url;
            this.triggerUtterance = titleOrObj.triggerUtterance;
        } else {
            throw "Error: You must initialize a CarouselImage with values.";
        }
    }
}

/***************************************************************************
 * Carousel(title, carouselImageArray):
 * 
 * Parameters:
 *      title = what is to be spoken/displayed as title
 *      carouselImageArray = array of CarouselImage objects
 * 
 * Ex. usage:
 *  let carouselDog = new CarouselImage("Dog","http://animal-images/dog.jpg", "Dog image");
 *  let carouselCat = new CarouselImage("Cat","http://animal-images/cat.jpg", "Cat image");
 *  let carouselBird = new CarouselImage("Bird","http://animal-images/bird.jpg", "Bird image");
 *  let carouselArray = [carouselDog, carouselCat, carouselArray];
 *  let carousel = new Carousel("Look at this beautiful carousel", carouselArray);
 *  sendResponse(PepperResponse(carousel));
 **************************************************************************/
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

/***************************************************************************
 * CarouselImageNoTitle(speak, url, triggerUtterance):
 * 
 * Parameters:
 *      speak = what the robot says when you click a button
 *      url = the image to be displayed
 *      triggerUtterance = the utterance that will be triggered upon selecting
 *          the carousel image
 * 
 * Ex. usage:  
 *  let carouselArray = [];
 *  for (var name in list) {
 *      var carouselImage = new CarouselImageNoTitle("https://pepper-img-server/"+name+".jpg", "trigger " + name);
 *      carouselArray.push(carouselImage);
 *  }
 *  let carousel = new Carousel("Check out these options:", carouselArray);
 * 
 * Note: Cannot be used standalone with PepperResponse!
 **************************************************************************/
class CarouselImageNoTitle {
    constructor(url, triggerUtterance, speak) {
        if (speak) { this.speak = speak }
        this.contentURL = url;
        this.value = triggerUtterance;
    }
}

/***************************************************************************
 * CarouselNoTitles(title, carouselImageArray):
 * 
 * Parameters:
 *      title = what is to be spoken/displayed as title
 *      carouselImageArray = array of CarouselImage objects
 * 
 * Ex. usage:
 *  let carouselDog = new CarouselImageNoTitle("Dog","http://animal-images/dog.jpg", "Dog image");
 *  let carouselCat = new CarouselImageNoTitle("Cat","http://animal-images/cat.jpg", "Cat image");
 *  let carouselBird = new CarouselImageNoTitle("Bird","http://animal-images/bird.jpg", "Bird image");
 *  let carouselArray = [carouselDog, carouselCat, carouselArray];
 *  let carousel = new CarouselNoTitles("Look at this beautiful carousel", carouselArray);
 *  sendResponse(PepperResponse(carousel));
 **************************************************************************/
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

/***************************************************************************
 * FullScreenImage(speech, url):
 * 
 * Parameters:
 *      speech = what is to be spoken
 *      url = url of the image to display in fullscreen mode
 * 
 * Ex. usage:
 *  let speech = "Look at this beautiful vista."
 *  let landscapeImageUrl = "https://travel-photography-company/img/beautiful-images.jpg";
 *  let fullScreenImg = new FullScreenImage(speech, landscapeImageUrl);
 *  sendResponse(PepperResponse(fullScreenImg));
 **************************************************************************/
class FullScreenImage extends BasicResponse {
    constructor(speech, url) {
        super();
        this.type = 4;
        this.payload = {    speak : speech,
                            imageUrl : url      };
    }
}

/***************************************************************************
 * Icon(url, triggerUtterance, speech, iconTitle):
 * 
 * Parameters:
 *      url = the url of the icon image
 *      triggerUtterance = the utterance that will be triggered if icon is pressed
 *      speech = (optional) the speak string that will be spoken if the icon is pressed
 *      iconTitle = (optional) the text string that is displayed over the icon
 * 
 * Ex. usage:
 *  let urlBase = "https://icon-library/best-icons/icon-"
 *  let iconOne = [new Icon(urlBase + "1.jpg", "Icon 1", "Great choice!")
 *  let iconTwo = new Icon(urlBase + "2.jpg", "Icon 2", "Wonderful selection!")]
 *  let iconArray = [iconOne, iconTwo];
 *  let mainSpeech = "Select from one of these options"
 *  let titleText = "Select an option:"
 *  let icons = new Icons(mainSpeech, titleText, iconArray);
 *  sendResponse(PepperResponse(icons));
 **************************************************************************/
class Icon {
    constructor(url, triggerUtterance, speech, iconTitle) {
        this.iconUrl = url;
        this.value = triggerUtterance;
        if (speech) { this.speak = speech;    }        
        if (iconTitle) { this.text = iconTitle;       }
    }
}

/***************************************************************************
 * Icons(speech, titleText, iconArray):
 * 
 * Parameters:
 *      speech = what is to be spoken
 *      titleText = the text that is to be displayed
 *      iconArray = array of Icon objects
 * 
 * Ex. usage:
 *  let speech = "Select from one of these options"
 *  let titleText = "Select an option:"
 *  let urlBase = "https://icon-library/best-icons/icon-"
 *  let iconArray = [new Icon(urlBase + "1.jpg", "Icon 1"), new Icon(urlBase + "2.jpg", "Icon 2")]
 *  let icons = new Icons(speech, titleText, iconArray);
 *  sendResponse(PepperResponse(icons));
 **************************************************************************/
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
/***************************************************************************
 * Style(title, url):
 * 
 * Parameters:
 *      title = what is to be spoken
 *      url = url of the image to display in fullscreen mode
 * 
 * Ex. usage:
 *  let title = "Look at this beautiful vista."
 *  let landscapeImageUrl = "https://travel-photography-company/img/beautiful-images.jpg";
 *  let fullScreenImg = new FullScreenImage(title, landscapeImageUrl);
 *  sendResponse(PepperResponse(basicCard));
 **************************************************************************/
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

/***************************************************************************
 * Text(simpleText):
 * 
 * Parameters:
 *      simpleText = what is to be spoken/display by Pepper
 * 
 * Ex. usage:
 *  let simpleText = "Why, hello! Hello there! || Hello.";
 *  sendResponse(PepperResponse(new Text(simpleText)));
 **************************************************************************/
class Text extends BasicResponse {
    constructor(simpleText) {
        super();
        this.type = 0;
        this.speech = simpleText;
    }
}

/***************************************************************************
 * TextBubble(textValue, triggerUtterance, speech):
 * 
 * Parameters:
 *    textValue = what displays on Pepper inside the bubble
 *    triggerUtterance = the utterance triggered if a user selects this text bubble
 *    speech = (optional) what Pepper says if a user selects this text bubble
 * 
 * Ex. usage:
 *  let bubbleOne = new TextBubble("First Time Visit", "Registration Sign-Up", "Welcome! Let's get you registered!");
 *  let bubbleTwo = new TextBubble("Returning Customer", "Schedule Appointment", "Welcome back. Pulling up the available time slots now");
 *  let textBubbles = new TextBubbles("Please choose the option that applies to you", [bubbleOne, bubbleTwo]);
 *  sendResponse(PepperResponse(textBubbles));
 * 
 * Note: Cannot be used standalone with PepperResponse!
 **************************************************************************/
class TextBubble {
    constructor(title, url, randomBoolean) {
        this.type = 4;
        this.payload = {    title : title,
                            imageUrl : url      };
    }
}

/***************************************************************************
 * TextBubbles(title, bubblesArray, randomize):
 * 
 * Parameters:
 *    title = the title that displays on Pepper's tablet / what Pepper speaks
 *    bubblesArray = an array of TextBubble objects
 *    randomize = (optional) a boolean value of whether or not to randomize the bubbles
 * 
 * Ex. usage:
 *  let bubbleOne = new TextBubble("First Time Visit", "Registration Sign-Up", "Welcome! Let's get you registered!");
 *  let bubbleTwo = new TextBubble("Returning Customer", "Schedule Appointment", "Welcome back. Pulling up the available time slots now");
 *  let textBubbles = new TextBubbles("Please choose the option that applies to you", [bubbleOne, bubbleTwo]);
 *  sendResponse(PepperResponse(textBubbles));
 **************************************************************************/
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
        
/***************************************************************************
 * TriggerIntent(triggerUtterance):
 * 
 * Parameters:
 *      triggerUtterance = the utterance string to trigger
 * 
 * Ex. usage:
 *  let returnToMainMenu = new TriggerIntent("Main Menu");
 *  sendResponse(PepperResponse(returnToMainMenu));
 * 
 * Note: can't be chained together with a Style object
 **************************************************************************/
class TriggerIntent extends BasicResponse {
    constructor(triggerUtterance) {
        super();
        this.type = 4;
        this.payload = { action : "setStyle",
                         action_parameters : { nextUtterance : triggerUtterance } };
    }
}
/***************************************************************************
 * Video(speech, url, contentType):
 * 
 * Parameters:
 *      speech = what is to be spoken
 *      url = url of the video to display (FYI: Pepper Chat caches the video after the first play)
 *      contentType = (optional) If the video file's url ends in the filetype, this field is optional;
 *          otherwise specify the content type with the syntax "video/{file-type}", e.g. "video/mp4"
 * Ex. usage:
 *  let speech = "Watch this product video to understand our latest new features:"
 *  let landscapeImageUrl = "https://travel-photography-company/img/beautiful-images.jpg";
 *  let fullScreenImg = new FullScreenImage(speech, landscapeImageUrl);
 *  sendResponse(PepperResponse(basicCard));
 **************************************************************************/
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


/***************************************************************************
 * Website(speech, url):
 * 
 * Parameters:
 *      speech = what is to be spoken
 *      url = url of the image to display in fullscreen mode
 * 
 * Ex. usage:
 *  let speech = "You can see our current mortgage rates in the table displayed on my tablet"
 *  let mortgageRatesUrl = "https://robotbank/us/mortgage-rates.html";
 *  let mortgageRatesWebsite = new Website(speech, mortgageRatesUrl);
 *  sendResponse(PepperResponse(mortgageRatesWebsite));
 **************************************************************************/
class Website extends BasicResponse {
    constructor(speech, url, triggerUtteranceOnClose) {
        super();
        this.type = 4;
        this.payload = {    speak : speech,
                            action: "showWebpage",
                            action_parameters: {
                                url : url,
                                onClose : triggerUtteranceOnClose   }   };
    }
}


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
