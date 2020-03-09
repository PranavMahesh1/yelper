## Yelper

This is a React web application that utilizes the [Yelp Fusion API](https://www.yelp.com/fusion "Yelp Fusion API") and the [Google Maps API](https://cloud.google.com/maps-platform/ "Google Maps API") to display restaurant details.

Enter the restaurant name/type and a location and click ```Submit```, or just fill out the restaurant name and click ```Submit with your Location```. You can also filter search results by the price.

**NOTE: Your browser must support HTML5 Geolocation and have the browser Location permission set to allow to use this feature.**

The application will retrieve 20 restaurants at most with some details. Click ```More details``` to learn more about them, see their open hours, images, and their map location.

The project is currently deployed at [https://pranavmahesh1.github.io/yelper/](https://pranavmahesh1.github.io/yelper/ "https://pranavmahesh1.github.io/yelper/").

If you would like to run this locally, clone the repo and run ```npm install``` to install all the dependencies needed. You must also put your own Yelp Fusion API and Google Maps API keys in the ```index.js``` files in the ```HomePage``` and ```Details``` components. Afterwards, run ```yarn start``` to start the application.
