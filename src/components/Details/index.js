// The component for when you click 'More information' on a specific restaurant.
// Need Map, Hours, Geolocation

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import axios from 'axios';

const anywhere = 'https://cors-anywhere.herokuapp.com/';

// Enter your own Yelp Fusion API key here
const API_KEY = 'yR15w8bu1wHsBvCaLBOTjSE19XdcT0rwnd9CUAkRENxiBHBqkfNj2sAkTx-yzkY4n146e_nXFAo43nQlwWSp3xxCHpoO8kzwBY_aE9OklcwvTEc3x3zEdUdP-epSXnYx';

const Details = (props) => {
  let state = {
    showingInfoWindow: false,  //Hides or the shows the infoWindow
    activeMarker: {},          //Shows the active marker upon click
    selectedPlace: {}          //Shows the infoWindow to the selected place upon a marker
  };

  let onMarkerClick = (props, marker, e) =>
    state.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  let onClose = props => {
    if (state.showingInfoWindow) {
      state.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };
  // Create location object
  let location = useLocation();

  // Restaurant is the prop of location.state - contains the specific restaurant that was clicked on

  let [restaurant, setRestaurant] = useState(location.state.detailsObject);
  useEffect(() => {
    axios.get(`${anywhere}https://api.yelp.com/v3/businesses/${restaurant.id}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`
      }
    }).then((res) => {
      // Set detailed business info in restaurant state
      setRestaurant(res.data);
    }).catch((err) => {
      // Otherwise catch error and log it to console
      console.log("Error occured: ", err);
    })
  }, []);

  console.log("Restaurant data: ", restaurant);
  // Map function to loop through sub-array categories to find type of cuisines
  let Cuisines = restaurant.categories.map((item, key) =>
    <span key={key}>{item.title}, </span>
  );

  const mapStyles2 = {
    width: '100%',
    height: "400px",
    position: "relative"
  };

  return (
    <div>
      <Container>
        {/* Restaurant Images */}
        <Row className="justify-content-md-center">
          <img alt="restaurant" src={restaurant.image_url} height="400" width="700" />
        </Row>
        <br />

        {/* Restaurant Title */}
        <Row className="justify-content-md-center">
          <h1 className="heading">{restaurant.name}</h1>
        </Row>

        {/* Google Maps */}
        <Row className="justify-content-md-center">
          <Map
            google={props.google}
            style={mapStyles2}
            containerStyle={mapStyles2}
            zoom={20}
            mapCenter={{

            }}
            initialCenter={{
              lat: restaurant.coordinates.latitude,
              lng: restaurant.coordinates.longitude
            }}
          />
          <Marker
            title={'The marker`s title will appear as a tooltip.'}
            name={'SOMA'}
            onClick={onMarkerClick}
            position={{ lat: restaurant.coordinates.latitude, lng: restaurant.coordinates.longitude }}
          />
          <InfoWindow
            marker={state.activeMarker}
            visible={state.showingInfoWindow}
            onClose={onClose}
          ></InfoWindow>
        </Row>

        {/* Cuisines */}
        <Row className="justify-content-md-center">
          <p className="text">Cuisines: {Cuisines}</p>
        </Row>

        {/* General Information */}
        <Row className="justify-content-md-center">
          <Col xs lg="9">
            {/* Display Closed or Open depending on restaurant.is_closed */}
            <p className="text">{restaurant.is_closed ? "Closed" : "Open"}</p>
            {/* Some restaurants don't have price value, so don't display if this is the case */}
            <p className="text">{restaurant.price != null ? `Price: ${restaurant.price}` : null}</p>
            <p className="text">Rating: {restaurant.rating} / 5</p>
          </Col>

          <Col>
            <p className="text">Address: {restaurant.location.address1}, {restaurant.location.city}, {restaurant.location.state} {restaurant.location.zip_code}</p>
            <p className="text">Phone number: {restaurant.display_phone}</p>
            <a href={restaurant.url}>Yelp Link</a>
          </Col>
        </Row>

        <Row>
          <p className="text">Open Hours:</p>
          <p className="text">Open Hours:</p>
        </Row>
      </Container>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBKkqON7yV0e9pLsxgZeoR8l917lbOEOrU'
})(Details);