# Yelper

A ReactJS web application that utilizes the [Yelp Fusion API](https://www.yelp.com/fusion "Yelp Fusion API") and the [Google Maps API](https://cloud.google.com/maps-platform/ "Google Maps API") to display restaurant details.

This project is currently deployed at [https://pranavmahesh.com/yelper/](https://pranavmahesh.com/yelper/).

![Main Screen](https://image.prntscr.com/image/j9qzbbezTvuT8I1A7sCfNg.png)
![Restaurants Displayed](https://image.prntscr.com/image/xQreGGjrRh24MaSbpKnn0Q.png)
![Detailed Restaurant Information](https://image.prntscr.com/image/Z4B3qELnQvC5ON_MPNAkxA.png)

## Usage

Enter the restaurant name/type and a location and click ```Submit```, or just fill out the restaurant name and click ```Restaurants Near Me```. You can also filter search results by the price.

**NOTE: Your browser must support HTML5 Geolocation and have the browser Location permission set to allow to use the 'Restaurants Near Me' function.**

The application will retrieve 20 restaurants at most with some details. Click ```More information``` to learn more about them, see their open hours, images, and their map location.

## Installation

If you would like to run this app locally, clone the repo and run ```npm install``` in the terminal to install all the dependencies needed. You must also put your own Yelp Fusion API and Google Maps API keys in the ```index.js``` files in the ```HomePage``` and ```Details``` components. Afterwards, run ```yarn start``` to start the application.

## TODO 

 - ~~Add alert box when no results are displayed~~ (Finished 5/8/20)
 - Add loading screen when returning results? May not be necessary given how quick it is most of the time but sometimes it can be slow
