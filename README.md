# pepper-dialogflow-markup-library
A Javascript library for the easy creation of valid responses for the Pepper robot using Dialogflow's Fulfillment engine. More info about the responses is available at the official documentation site: https://softbankroboticstraining.github.io/pepper-chatbot-api/


# Begin Pepper Chat Fulfillment Library                    

#  Base Class: 

 The base class from which all of Pepper's Responses inherit, has some handy helper functions to set Context and Style to the response. This design enables using these methods on (nearly**) any response of your choice.

## Setting Context:
 To set context with a response, use the setContext function which is available to any response type. The 'setContext' function requires 3 values to be valid, 'name', 'parameters'.

### Method definition:
setContext(name, lifespan, parameters) <br>
where:
  - name = name of the context
  - lifespan = duration/expiration of the context, once set
  - parameters = an object containing a comma-separated list of key-value pairs


### Example of usage:
	let urlOfBat = generateRandomUrlOfBat()
	let basicCard = new BasicCard("Random picture of a bat", urlOfBat)
	basicCard.setContext("batImage", 3, { whichImageSeen: urlOfBat } )
 

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

# BackgroundImage(speech, url)

## Usage:

### BackgroundImage(speech, url)
where:

## Parameters:
      speech = what is to be spoken
      url = url of the image to display in fullscreen mode
 
## Ex. usage:
      let speech = "Look at this beautiful vista."
      let landscapeImageUrl = "https://travel-photography-company/img/beautiful-images.jpg";
      let backgroundImage = new BackgroundImage(speech, landscapeImageUrl);
      sendResponse(PepperResponse(backgroundImage));

# BasicCard(title, url)
## BasicCard(title, url)
where:

## Parameters:
      title = what is to be spoken/displayed as title
      url = url of the image to display
 
## Ex. usage:
      let title = "Employee of the Month";
      let employeeOfMonthImageUrl = "https://companywebsite.com/employee-of-month/jan-2018.jpg";
      let basicCard = new BasicCard(title, employeeOfMonthImageUrl);
      sendResponse(PepperResponse(basicCard));


# CarouselImage(titleOrObj, url, triggerUtterance)

## Parameters:
      titleOrObj = what is displayed under the image; ALTERNATIVELY, when over-
	      loaded as an object (as the sole parameter passed), the object must
	      contain "title", "url", & "triggerUtterance" properties
      url = the image to be displayed 
      triggerUtterance = the utterance that will be triggered upon selecting
	      the carousel image
 
## Ex. usage:  
      let carouselArray = []; 
      for (var name in list) { 
      	 let carouselImage = new CarouselImage(name, "https://pepper-img-server/"+name+".jpg", "trigger " + name);
      	 carouselArray.push(carouselImage); 
      }
      let carousel = new Carousel("Check out these options:", carouselArray);
      
 Note: Cannot be used standalone with PepperResponse!


# Carousel(title, carouselImageArray)

## Parameters:
      title = what is to be spoken/displayed as title
      carouselImageArray = array of CarouselImage objects
 
## Ex. usage:
      let carouselDog = new CarouselImage("Dog","http://animal-images/dog.jpg", "Dog image");
      let carouselCat = new CarouselImage("Cat","http://animal-images/cat.jpg", "Cat image");
      let carouselBird = new CarouselImage("Bird","http://animal-images/bird.jpg", "Bird image");
      let carouselArray = [carouselDog, carouselCat, carouselArray];
      let carousel = new Carousel("Look at this beautiful carousel", carouselArray);
      sendResponse(PepperResponse(carousel));


# CarouselImageNoTitle(speak, url, triggerUtterance)

## Parameters:
      speak = what the robot says when you click a button
      url = the image to be displayed
      triggerUtterance = the utterance that will be triggered upon selecting
          the carousel image
 
## Ex. usage:  
      let carouselArray = [];
      for (var name in list) {
      	  var carouselImage = new CarouselImageNoTitle("https://pepper-img-server/"+name+".jpg", "trigger " + name);
          carouselArray.push(carouselImage);
      }
      let carousel = new Carousel("Check out these options:", carouselArray);
 
 Note: Cannot be used standalone with PepperResponse!


# CarouselNoTitles(title, carouselImageArray)

## Parameters:
      title = what is to be spoken/displayed as title
      carouselImageArray = array of CarouselImage objects
 
## Ex. usage:
      let carouselDog = new CarouselImageNoTitle("Dog","http://animal-images/dog.jpg", "Dog image");
      let carouselCat = new CarouselImageNoTitle("Cat","http://animal-images/cat.jpg", "Cat image");
      let carouselBird = new CarouselImageNoTitle("Bird","http://animal-images/bird.jpg", "Bird image");
      let carouselArray = [carouselDog, carouselCat, carouselArray];
      let carousel = new CarouselNoTitles("Look at this beautiful carousel", carouselArray);
      sendResponse(PepperResponse(carousel));


# FullScreenImage(speech, url)

## Parameters:
      speech = what is to be spoken
      url = url of the image to display in fullscreen mode
 
## Ex. usage:
	let speech = "Look at this beautiful vista."
	let landscapeImageUrl = "https://travel-photography-company/img/beautiful-images.jpg";
	let fullScreenImg = new FullScreenImage(speech, landscapeImageUrl);
	sendResponse(PepperResponse(fullScreenImg));


# Icon(url, triggerUtterance, speech, iconTitle)

## Parameters:
      url = the url of the icon image
      triggerUtterance = the utterance that will be triggered if icon is pressed
      speech = (optional) the speak string that will be spoken if the icon is pressed
      iconTitle = (optional) the text string that is displayed over the icon
 
## Ex. usage:
	let urlBase = "https://icon-library/best-icons/icon-"
	let iconOne = [new Icon(urlBase + "1.jpg", "Icon 1", "Great choice!")
	let iconTwo = new Icon(urlBase + "2.jpg", "Icon 2", "Wonderful selection!")]
	let iconArray = [iconOne, iconTwo];
	let mainSpeech = "Select from one of these options"
	let titleText = "Select an option:"
	let icons = new Icons(mainSpeech, titleText, iconArray);
	sendResponse(PepperResponse(icons));


# Icons(speech, titleText, iconArray)

## Parameters:
      speech = what is to be spoken
      titleText = the text that is to be displayed
      iconArray = array of Icon objects
 
## Ex. usage:
	let speech = "Select from one of these options"
	let titleText = "Select an option:"
	let urlBase = "https://icon-library/best-icons/icon-"
	let iconArray = [new Icon(urlBase + "1.jpg", "Icon 1"), new Icon(urlBase + "2.jpg", "Icon 2")]
	let icons = new Icons(speech, titleText, iconArray);
	sendResponse(PepperResponse(icons));


# Style(title, url)

## Parameters:
      title = what is to be spoken
      url = url of the image to display in fullscreen mode
 
## Ex. usage:
	let title = "Look at this beautiful vista."
	let landscapeImageUrl = "https://travel-photography-company/img/beautiful-images.jpg";
	let fullScreenImg = new FullScreenImage(title, landscapeImageUrl);
	sendResponse(PepperResponse(basicCard));


# Text(simpleText)

## Parameters:
      simpleText = what is to be spoken/display by Pepper
 
## Ex. usage:
	let simpleText = "Why, hello! Hello there! || Hello.";
	sendResponse(PepperResponse(new Text(simpleText)));


# TextBubble(textValue, triggerUtterance, speech)

## Parameters:
    textValue = what displays on Pepper inside the bubble
    triggerUtterance = the utterance triggered if a user selects this text bubble
    speech = (optional) what Pepper says if a user selects this text bubble
 
## Ex. usage:
	let bubbleOne = new TextBubble("First Time Visit", "Registration Sign-Up", "Welcome! Let's get you registered!");
	let bubbleTwo = new TextBubble("Returning Customer", "Schedule Appointment", "Welcome back. Pulling up the available time slots now");
	let textBubbles = new TextBubbles("Please choose the option that applies to you", [bubbleOne, bubbleTwo]);
	sendResponse(PepperResponse(textBubbles));

Note: Cannot be used standalone with PepperResponse!


# TextBubbles(title, bubblesArray, randomize)

## Parameters:
    title = the title that displays on Pepper's tablet / what Pepper speaks
    bubblesArray = an array of TextBubble objects
    randomize = (optional) a boolean value of whether or not to randomize the bubbles
 
## Ex. usage:
	let bubbleOne = new TextBubble("First Time Visit", "Registration Sign-Up", "Welcome! Let's get you registered!");
	let bubbleTwo = new TextBubble("Returning Customer", "Schedule Appointment", "Welcome back. Pulling up the available time slots now");
	let textBubbles = new TextBubbles("Please choose the option that applies to you", [bubbleOne, bubbleTwo]);
	sendResponse(PepperResponse(textBubbles));

        
# TriggerIntent(triggerUtterance)

## Parameters:
      triggerUtterance = the utterance string to trigger
 
## Ex. usage:
	let returnToMainMenu = new TriggerIntent("Main Menu");
	sendResponse(PepperResponse(returnToMainMenu));
 
 Note: can't be chained together with a Style response object


# Video(speech, url, contentType)

## Parameters:
      speech = what is to be spoken
      url = url of the video to display (FYI: Pepper Chat caches the video after the first play)
      contentType = (optional) If the video file's url ends in the filetype, this field is optional;
          otherwise specify the content type with the syntax "video/{file-type}", e.g. "video/mp4"
## Ex. usage:
	let speech = "Watch this product video to understand our latest new features:"
	let landscapeImageUrl = "https://travel-photography-company/img/beautiful-images.jpg";
	let fullScreenImg = new FullScreenImage(speech, landscapeImageUrl);
	sendResponse(PepperResponse(basicCard));



# Website(speech, url)

## Parameters:
      speech = what is to be spoken
      url = url of the image to display in fullscreen mode
 
## Ex. usage:
	let speech = "You can see our current mortgage rates in the table displayed on my tablet"
	let mortgageRatesUrl = "https://robotbank/us/mortgage-rates.html";
	let mortgageRatesWebsite = new Website(speech, mortgageRatesUrl);
	sendResponse(PepperResponse(mortgageRatesWebsite));


# PepperResponse(anyValidPepperResponseAbove)
All Pepper responses must be wrapped by a PepperResponse in order to work.

## Parameters:
	anyValidPepperResponseAbove = ["BasicCard","Carousel","CarouselNoTitles","FullScreenImage","BackgroundImage","Icons","Style","Text","TriggerIntent","Video","Website"];

## Ex. Usage:
	let card = new BasicCard("A beautiful, basic image card:", "https://basic-image/basic-card.jpg")
	sendResponse(PepperResponse(card));



# Helper functions
Included in the library are two useful helper functions, toTitleCase(str) and randomlyChoose(array)

## toTitleCase(str)
Takes a string as input ("title case") and returns the title-cased ("Title Case") version of the string as output

## randomlyChoose(array)
Takes an array as input and returns one of the arrays elements at random as the output