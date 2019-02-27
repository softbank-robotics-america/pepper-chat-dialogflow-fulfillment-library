# pepper-chat-dialogflow-fulfillment-library
A Javascript Node.JS library for the easy creation of valid responses for the Pepper robot running the Host / Pepper Chat software and using Dialogflow's Fulfillment (Google Cloud Functions) engine. More info about the responses is available at the official documentation site: https://softbankroboticstraining.github.io/pepper-chatbot-api/#types-of-responses


# Pepper Chat Responses Dialogflow Fulfillment Library    
We recommend you use the included example project, located in the 'Example' folder: 
- Agent zip file: PepperFulfillmentExampleAgent.zip
- Fulfillment code: index.js, package.json <br><br>
to get started with using this library. <br><br>

If you choose to work from an existing project, the key ingredient to using this library is simply including the library in your fulfillment in-line editor's (or webhook's) 'package.json' file:

    "dependencies": {
      ...
      "pepper-chat-dialogflow": "softbank-robotics-america/pepper-chat-dialogflow-fulfillment-library#master"
      ...
    }

... then, in your main (presumably 'index.js') file, include any response types you wish to include in your fulfillment code using destructured assignment as shown below:

    const {BasicCard, CarouselImage, Carousel, PepperResponse} = require('pepper-chat-dialogflow');

You're ready to go! You should now be able to use the library according to the documentation provided below.



# PepperResponse( { any valid Pepper response } )
All Pepper responses below must be wrapped by a PepperResponse in order to work.

## Parameter(s):
  { any valid Pepper response } - any of: BasicCard, Carousel, CarouselNoTitles, FullScreenImage, BackgroundImage, Icons, Style, Text, TextBubbles, TriggerIntent, Video, Website;

## Ex. Usage:
    let card = new BasicCard("A beautiful, basic image card:", "https://basic-image/basic-card.jpg")
    let responseToPepper = new PepperResponse(card);
    responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter

  or for multiple:

    let card = new BasicCard("A beautiful, basic image card:", "https://basic-image/basic-card.jpg")
    let website = new Website("Here is a website", "http://website.html", "Website exited");
    let responseToPepper = new PepperResponse(card, website);
    responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter    

## Setting Context:
 To set context with a Pepper response, use the setContext method which is available to any valid instantiated PepperResponse object. The 'setContext' function requires an object with 3 properties to be valid: 'name', 'lifespan', & 'parameters'.

### Method definition:
setContext(contextObj) <br>
where contextObj is a simple object containing 3 properties:
  - name = name of the context
  - lifespan = duration/expiration of the context, once set
  - parameters = an object containing a comma-separated list of key-value pairs


### Example of usage:
    let urlOfBat = generateRandomUrlOfBat()
    let basicCard = new BasicCard("Random picture of a bat", urlOfBat)
    let pepperResponse = new PepperResponse(basicCard);
    pepperResponse.setContext({name: "batImage", lifespan: 3, parameters: { whichImageSeen: urlOfBat }} )
    pepperResponse.send(response); // <-- send() takes the webhook response object as a parameter  

# BackgroundImage(speech, url)
### https://softbankroboticstraining.github.io/pepper-chatbot-api/#image-background-image
where:

## Parameter(s):
      speech - what is to be spoken
      url - url of the image to display in fullscreen mode
 
## Ex. usage:
      let speech = "Look at this beautiful vista."
      let landscapeImageUrl = "https://travel-photography-company/img/beautiful-images.jpg";
      let backgroundImage = new BackgroundImage(speech, landscapeImageUrl);
      let responseToPepper = new PepperResponse(backgroundImage);
      responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter      

# BasicCard(title, url)
### https://softbankroboticstraining.github.io/pepper-chatbot-api/#image-basic-card
where:

## Parameter(s):
      title - what is to be spoken/displayed as title
      url - url of the image to display
 
## Ex. usage:
      let title = "Employee of the Month";
      let employeeOfMonthImageUrl = "https://companywebsite.com/employee-of-month/jan-2018.jpg";
      let basicCard = new BasicCard(title, employeeOfMonthImageUrl);
      let responseToPepper = new PepperResponse(basicCard);
      responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter        


# BasicText(simpleText)
### https://softbankroboticstraining.github.io/pepper-chatbot-api/#text-only
where:

## Parameter(s):
      simpleText - what is to be spoken/display by Pepper
 
## Ex. usage:
      let simpleText = "Why, hello! Hello there! || Hello.";
      let responseToPepper = new PepperResponse(new BasicText(simpleText)); // ** see note below
      responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter

~ Or ~ 

      // ** You can also just pass a simple string to PepperResponse)
      let simpleText = "Why, hello! Hello there! || Hello.";
      let responseToPepper = new PepperResponse(simpleText);
      responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter      


# CarouselImage(title, url, triggerUtterance)
where:

## Parameter(s):
      title - what is displayed under the image
      url - the image to be displayed 
      triggerUtterance - the utterance that will be triggered upon selecting
	      the carousel image
 
## Ex. usage:  
      let carouselArray = []; 
      for (var name in list) { 
      	 let carouselImage = new CarouselImage(name, "https://pepper-img-server/"+name+".jpg", "trigger " + name);
      	 carouselArray.push(carouselImage); 
      }
      let carousel = new Carousel("Check out these options:", carouselArray);
      
 Note: Cannot be used standalone with PepperResponse; must use with Carousel!


# Carousel(title, carouselImageArray)
### https://softbankroboticstraining.github.io/pepper-chatbot-api/#image-carousel-captioned
where:

## Parameter(s):
      title - what is to be spoken/displayed as title
      carouselImageArray - array of CarouselImage objects
 
## Ex. usage:
      let carouselDog = new CarouselImage("Dog","http://animal-images/dog.jpg", "Dog image");
      let carouselCat = new CarouselImage("Cat","http://animal-images/cat.jpg", "Cat image");
      let carouselBird = new CarouselImage("Bird","http://animal-images/bird.jpg", "Bird image");
      let carouselArray = [carouselDog, carouselCat, carouselArray];
      let carousel = new Carousel("Look at this beautiful carousel", carouselArray);
      let responseToPepper = new PepperResponse(carousel);
      responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter        


# CarouselImageNoTitle(speak, url, triggerUtterance)
where:

## Parameter(s):
      speak - what the robot says when you click a button
      url - the image to be displayed
      triggerUtterance - the utterance that will be triggered upon selecting
          the carousel image
 
## Ex. usage:  
      let carouselArray = [];
      for (var name in list) {
      	  var carouselImage = new CarouselImageNoTitle("https://pepper-img-server/"+name+".jpg", "trigger " + name);
          carouselArray.push(carouselImage);
      }
      let carousel = new CarouselNoTitles("Check out these options:", carouselArray);
 
 Note: Cannot be used standalone with PepperResponse; must be used with CarouselNoTitles!


# CarouselNoTitles(title, carouselImageArray)
### https://softbankroboticstraining.github.io/pepper-chatbot-api/#image-carousel-uncaptioned
where:

## Parameter(s):
      title - what is to be spoken/displayed as title
      carouselImageArray - array of CarouselImage objects
 
## Ex. usage:
      let carouselDog = new CarouselImageNoTitle("Dog","http://animal-images/dog.jpg", "Dog image");
      let carouselCat = new CarouselImageNoTitle("Cat","http://animal-images/cat.jpg", "Cat image");
      let carouselBird = new CarouselImageNoTitle("Bird","http://animal-images/bird.jpg", "Bird image");
      let carouselArray = [carouselDog, carouselCat, carouselArray];
      let carousel = new CarouselNoTitles("Look at this beautiful carousel", carouselArray);
      let responseToPepper = new PepperResponse(carousel);
      responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter        


# FullScreenImage(speech, url, delay)
### https://softbankroboticstraining.github.io/pepper-chatbot-api/#image-fullscreen-image
where:

## Parameter(s):
      speech - what is to be spoken
      url - url of the image to display in fullscreen mode
      delay - (optional) the amount of time after the speech finishes for the image to be displayed
 
## Ex. usage:
      let speech = "Look at this beautiful vista."
      let landscapeImageUrl = "https://travel-photography-company/img/beautiful-images.jpg";
      let fullScreenImg = new FullScreenImage(speech, landscapeImageUrl);
      let responseToPepper = new PepperResponse(fullScreenImg);
      responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter    


# Icon(url, triggerUtterance, speech, iconTitle)
where:

## Parameter(s):
      url - the url of the icon image
      triggerUtterance - the utterance that will be triggered if icon is pressed
      speech - (optional) the speak string that will be spoken if the icon is pressed
      iconTitle - (optional) the text string that is displayed over the icon
 
## Ex. usage:
    	let urlBase = "https://icon-library/best-icons/icon-"
    	let iconOne = [new Icon(urlBase + "1.jpg", "Icon 1", "Great choice!")
    	let iconTwo = new Icon(urlBase + "2.jpg", "Icon 2", "Wonderful selection!")]
    	let iconArray = [iconOne, iconTwo];
    	let mainSpeech = "Select from one of these options"
    	let titleText = "Select an option:"
    	let icons = new Icons(mainSpeech, titleText, iconArray);
      let responseToPepper = new PepperResponse(icons);
      responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter      

 Note: Cannot be used standalone with PepperResponse; must be used with Icons (plural)!



# Icons(speech, titleText, iconArray)
### https://softbankroboticstraining.github.io/pepper-chatbot-api/#image-1-6-icon-layouts
where:

## Parameter(s):
      speech - what is to be spoken
      titleText - the text that is to be displayed
      iconArray - array of Icon objects
 
## Ex. usage:
      let speech = "Select from one of these options"
      let titleText = "Select an option:"
      let urlBase = "https://icon-library/best-icons/icon-"
      let iconArray = [new Icon(urlBase + "1.jpg", "Icon 1"), new Icon(urlBase + "2.jpg", "Icon 2")]
      let icons = new Icons(speech, titleText, iconArray);
      let responseToPepper = new PepperResponse(icons);
      responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter 


# Style(title, styleConfig)
### https://softbankroboticstraining.github.io/pepper-chatbot-api/#styling
where:

## Parameter(s):
      title - what is to be spoken/displayed on Pepper's tablet
      styleConfig - an object containing valid style configuration key:value pairs

## Ex. usage:
    let title = "Look at this beautiful styling."
    let styleConfig = {  backgroundColor: "grey", textColor: "black"  };
    let style = new Style(title, styleConfigObj);
    let responseToPepper = new PepperResponse(style);
    responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter   


# TextBubble(textValue, triggerUtterance, speech)
where:

## Parameter(s):
    textValue - what displays on Pepper inside the bubble
    triggerUtterance - the utterance triggered if a user selects this text bubble
    speech - (optional) what Pepper says if a user selects this text bubble
 
## Ex. usage:
      let bubbleOne = new TextBubble("First Time Visit", "Registration Sign-Up", "Welcome! Let's get you registered!");
      let bubbleTwo = new TextBubble("Returning Customer", "Schedule Appointment", "Welcome back. Pulling up the available time slots now");
      let textBubbles = new TextBubbles("Please choose the option that applies to you", [bubbleOne, bubbleTwo]);
      let responseToPepper = new PepperResponse(textBubbles);
      responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter   

Note: Cannot be used standalone with PepperResponse; must be used with TextBubbles (plural)!


# TextBubbles(title, bubblesArray, randomize)
### https://softbankroboticstraining.github.io/pepper-chatbot-api/#text-bubbles
where:

## Parameter(s):
    title - the title that displays on Pepper's tablet / what Pepper speaks
    bubblesArray - an array of TextBubble objects
    randomize - (optional) a boolean value of whether or not to randomize the bubbles
 
## Ex. usage:
      let bubbleOne = new TextBubble("First Time Visit", "Registration Sign-Up", "Welcome! Let's get you registered!");
      let bubbleTwo = new TextBubble("Returning Customer", "Schedule Appointment", "Welcome back. Pulling up the available time slots now");
      let textBubbles = new TextBubbles("Please choose the option that applies to you", [bubbleOne, bubbleTwo]);
      let responseToPepper = new PepperResponse(textBubbles);
      responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter 

        
# TriggerIntent(triggerUtterance, title)
### https://softbankroboticstraining.github.io/pepper-chatbot-api/#actions-trigger-an-intent
where:

## Parameter(s):
      triggerUtterance - the utterance string to trigger
      title - (optional) what Pepper will display on its
 
## Ex. usage:
      let returnToMainMenu = new TriggerIntent("Main Menu");
      let responseToPepper = new PepperResponse(returnToMainMenu);
      responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter   
 
 Note: There is a known issue with following certain payload types directly with TriggerIntent. Additionally, TriggerIntents will not be reflected in the Dialogflow or Pepper Chat test simulators; they only function on Pepper.


# Video(speech, url, contentType)
### https://softbankroboticstraining.github.io/pepper-chatbot-api/#video-fullscreen-video
where:

## Parameter(s):
      speech - what is to be spoken
      url - url of the video to display (FYI: Pepper Chat caches the video after the first play)
      contentType - (optional) If the video file's url ends in the filetype, this field is optional;
          otherwise specify the content type with the syntax "video/{file-type}", e.g. "video/mp4"
## Ex. usage:
      let speech = "Watch this product video to understand our latest new features:"
      let url = "https://pepper-promo-videos/vid/pepper-promo-1.mp4";
      let video = new Video(speech, url);
      let responseToPepper = new PepperResponse(video);
      responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter     



# Website(speech, url, onClose)
### https://softbankroboticstraining.github.io/pepper-chatbot-api/#webpage-show-webpage
where:

## Parameter(s):
      speech - what is to be spoken
      url - url of the image to display in fullscreen mode
      onClose - the utterance string to trigger when the user exits
 
## Ex. usage:
      let speech = "You can see our current mortgage rates in the table displayed on my tablet"
      let mortgageRatesUrl = "https://robotbank/us/mortgage-rates.html";
      let finishedBrowsing = "Website exited";  
      let mortgageRatesWebsite = new Website(speech, mortgageRatesUrl, finishedBrowsing);
      let responseToPepper = new PepperResponse(mortgageRatesWebsite);
      responseToPepper.send(response); // <-- send() takes the webhook response object as a parameter     



#  Base Class: 

 The base class from which all of Pepper's Responses inherit, has a handy helper method to set Style to the response. This design enables using this method on (nearly**) any response of your choice.
 

## Setting Style:
 Style options include:  'backgroundColor', 'backgroundImage', 'textColor', 'font', 'bubbleColor', 'bubbleTextColor', 'bubbleFont'. 

### Method definition:
setStyle(styleObj) <br>
where:
  - styleObj = an object containing a comma-separated list of any number of key-value pairs of style configurations (see above list)

### Example of usage:
    // Commented out Style #1 after having decided to go with Style #2
    // Style #1:
    // let styleObj = {}
    // styleObj.backgroundColor = '#49F420'; <-- Color codes can be HTML color codes or accepted HTML color names
    // styleObj.textColor = 'black';  <-- Color codes can be HTML color codes or accepted HTML color names
    // styleObj.font = 'Times New Roman';

    // Style #2
    let styleObj2 = {}
    styleObj.backgroundColor = 'grey';
    styleObj2.backgroundImage = 'https://best-bat-background-images/not-quite-fullscreen.jpg';
    styleObj2.textColor = '#ffffff';
    styleObj2.font' = 'Sans-Serif';
    styleObj2.bubbleColor = 'black';
    styleObj2.bubbleTextColor = '#42A3B2C';
    styleObj2.bubbleFont = 'white';

    let loveBatsIcon = new Icon("https://icon-of-check-mark.jpg", "Love Bats", "Great! I'm glad you love bats!");
    let dislikeBatsIcon = new Icon("https://icon-of-x.jpg", "Dislike Bats", "Oh! I'm sorry to hear you don't like bats!");
    let batIcons = new Icons("Do you love bats?", [loveBatsIcon, dislikeBatsIcon]);

    // batIcons.setStyle(styleObj); 
    batIcons.setStyle(styleObj2);
 <br>

** Some response types do not allow styling to be added to them directly. In these cases, the styling must be applied either before or after such a response type.

# Follow-up Events
Followup events can be added to any response. After the response has been formed, 
``` 
e.g. 
let video = new Video(speech, url);
video.followupEvent = {
	  "name": "event name",
	  "parameters": {
	    "param": "param value"
	  }
	}
let responseToPepper = new PepperResponse(video);
```


# Helper functions
Included in the library are two useful helper functions, toTitleCase(str) and randomlyChoose(array)

## toTitleCase(str)
Takes a string as input ("title case") and returns the title-cased ("Title Case") version of the string as output

## randomlyChoose(array)
Takes an array as input and returns one of the arrays elements at random as the output
