// The component for when you click 'More information' on a specific restaurant.

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel, Card, Tab, Tabs } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import axios from 'axios';
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from 'react-icons/io';


const anywhere = 'https://cors-anywhere.herokuapp.com/';

// Enter your own Yelp Fusion API key here
const API_KEY = 'yR15w8bu1wHsBvCaLBOTjSE19XdcT0rwnd9CUAkRENxiBHBqkfNj2sAkTx-yzkY4n146e_nXFAo43nQlwWSp3xxCHpoO8kzwBY_aE9OklcwvTEc3x3zEdUdP-epSXnYx';

const Details = (props) => {

  // Create location object
  let location = useLocation();
  // Restaurant is the prop of location.state - contains the specific restaurant that was clicked on  
  let [restaurant, setRestaurant] = useState(location.state.detailsObject);
  let [showingInfoWindow, setShowInfoWindow] = useState(false); //Hides or the shows the infoWindow
  let [activeMarker, setActiveMarker] = useState({}); //Shows the active marker upon click
  let [selectedPlace, setSelectedPlace] = useState({}); //Shows the infoWindow to the selected place upon a marker


  useEffect(() => {
    axios.get(`${anywhere}https://api.yelp.com/v3/businesses/${restaurant.id}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`
      }
    }).then((res) => {
      // Set business array in restaurant state
      console.log("Restaurant data: ", res.data);
      setRestaurant(res.data);
    }).catch((err) => {
      // Otherwise catch error and log it to console
      console.log("Error occured: ", err);
    })
  }, []);

  console.log("Restaurant: ", restaurant);
  // Map function to loop through sub-array categories to find type of cuisines
  let Cuisines = restaurant.categories.map((item, key) =>
    <span key={key}>{item.title}, </span>
  );

  // make sure photos exist before get request
  let ImageSlide = restaurant.photos && restaurant.photos.map((item, key) =>
    <Carousel.Item>
      <div style={{
        overflow: 'hidden',
        height: '400px'

      }}>
        <img
          className="d-block w-100"
          src={item}
          alt="Restaurant"
          key={key}
        />
      </div>
    </Carousel.Item>
  );

  const onMarkerClick = (props, marker, e) => {
    setSelectedPlace(props);
    setActiveMarker(marker);
    setShowInfoWindow(true);
  }

  const onClose = props => {
    if (showingInfoWindow) {
      setActiveMarker(null);
      setShowInfoWindow(false);
    }
  };

  const mapStyles2 = {
    width: '100%',
    height: "400px",
    position: "relative"
  };

  function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }


  const displayRating = () => {
    const max = restaurant.rating;
    const emptyStars = 5 - Math.ceil(max);
    let stars = [];
    if (isFloat(max)) {
      const floor = Math.floor(max);
      for (let i = 1; i <= floor; i++) {
        stars.push(<IoIosStar color="orange" />);
      }
      stars.push(<IoIosStarHalf color="orange" />);
    } else {
      for (let i = 1; i <= max; i++) {
        stars.push(<IoIosStar color="orange" />);
      }
    }

    let j = 1;
    while (j <= emptyStars) {
      stars.push(<IoIosStarOutline color="orange" />);
      j++;
    }
    console.log("Stars ", stars);
    return stars;
  }

  let displayHours = () => {
    if (restaurant.hours && restaurant.hours[0].open) {
      const hours = restaurant.hours[0].open;
      console.log("Hours", (hours.filter(item => item.day === 0)).length > 0);
      if ((hours.filter(item => item.day === 0)).length > 0) {
        console.log("Monday");
      } else {
        console.log("Not Monday");
      }
      if ((hours.filter(item => item.day === 6)).length > 0) {
        console.log("Sunday");
      } else {
        console.log("Closed Sunday");
      }
    }
  };

  return (
    <div>
      <Container>
        {/* Restaurant Images */}
        <Row className="justify-content-md-center">
          <Carousel>{ImageSlide}</Carousel>
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
            initialCenter={{
              lat: restaurant.coordinates.latitude,
              lng: restaurant.coordinates.longitude
            }}
          >
            <Marker
              title={'The marker`s title will appear as a tooltip.'} //mouse over
              name={'SOMA'}
              onClick={onMarkerClick}
              position={{ lat: restaurant.coordinates.latitude, lng: restaurant.coordinates.longitude }}
            />
            <InfoWindow
              marker={activeMarker}
              visible={showingInfoWindow}
              onClose={onClose}
            >
              <h4>{restaurant.name}</h4>

            </InfoWindow>
          </Map>
        </Row>

        <Row>
          <p className="text">Open Hours:</p>
        </Row>

        <Row>
          <Card style={{
            width: '100%'
          }}>
            <Card.Header>Restaurant Details</Card.Header>

            <Card.Body>
              <Tabs defaultActiveKey="general" id="uncontrolled-tab-example">
                <Tab eventKey="general" title="General">
                  <p>Cuisines: {Cuisines}</p>
                  {/* Some restaurants don't have price value, so don't display if this is the case */}
                  <p>{restaurant.price != null ? `Price: ${restaurant.price}` : null}</p>
                  <p>Rating: {displayRating()}</p>
                  <a href={restaurant.url}>Yelp Link</a>
                </Tab>
                <Tab eventKey="address" title="Address/Contact">
                  <p>Address: {restaurant.location.address1}, {restaurant.location.city}, {restaurant.location.state} {restaurant.location.zip_code}</p>
                  <p>Phone number: {restaurant.display_phone}</p>
                </Tab>
                <Tab eventKey="hours" title="Open Hours">
                  <h1>{displayHours()}</h1>
                </Tab>
              </Tabs>

            </Card.Body>
          </Card>
        </Row>
      </Container>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBKkqON7yV0e9pLsxgZeoR8l917lbOEOrU'
})(Details);