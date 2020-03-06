// The component for when you click 'More information' on a specific restaurant.
/* 
// Put all the details from business in the Details page
// Add the Star ratings and Price, address, location icons to the Search Results Cards
// Add the Input fields for the filters. 
*/

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Carousel, Container, Row, Tab, Table, Tabs } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { GoogleApiWrapper, InfoWindow, Marker, Map } from 'google-maps-react';
import { IoIosStarHalf, IoIosStarOutline, IoIosStar } from 'react-icons/io';
import { FaDollarSign } from 'react-icons/fa';
import { MdLocalPhone, MdLocationOn } from 'react-icons/md';


const anywhere = 'https://cors-anywhere.herokuapp.com/';

// Enter your own Yelp Fusion API key here
const YELP_API_KEY = 'n4723HjFL6HV_NnAtILXkWEOstIKOV_Z7A6hpvtqsej5ivj7mWpHALmE8IDyimva1SElkUAnK4XNUa1qzRLQv7xaj3a2crW1jfP-1eteel6v9JaQcO838gpwXcRhXnYx';

// Enter your own Google Maps API key here
const MAPS_API_KEY = 'AIzaSyBKkqON7yV0e9pLsxgZeoR8l917lbOEOrU';

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
        Authorization: `Bearer ${YELP_API_KEY}`
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
          style={{
            backgroundPosition: 'center center'
          }}
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

  /* Function that takes the rating and converts it to stars.
     Accounts for if the rating is between a whole number and that plus 0.5,
     but may not be necessary for the Yelp API.
  */
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
    return stars;
  }

  let displayHours = () => {
    let hourList = [];
    let day = "";
    if (restaurant.hours && restaurant.hours[0].open) {
      const hours = restaurant.hours[0].open;
      if ((hours.filter(item => item.day === 0)).length > 0) {
        // checking the day
        day = hours.filter(item => item.day === 0);
        hourList.push(
          <tr>
            <td>Monday</td>
            <td>{timeConvert(day[0].start)} - {timeConvert(day[0].end)}</td>
          </tr>
        );
      } else {
        hourList.push(
          <tr>
            <td>Monday</td>
            <td style={{
              color: 'red'
            }}>Closed</td>
          </tr>
        );
      }
      if ((hours.filter(item => item.day === 1)).length > 0) {
        day = hours.filter(item => item.day === 1);
        hourList.push(
          <tr>
            <td>Tuesday</td>
            <td>{timeConvert(day[0].start)} - {timeConvert(day[0].end)}</td>
          </tr>
        );
      } else {
        hourList.push(
          <tr>
            <td>Tuesday</td>
            <td style={{
              color: 'red'
            }}>Closed</td>
          </tr>
        );
      }
      if ((hours.filter(item => item.day === 2)).length > 0) {
        day = hours.filter(item => item.day === 2);
        hourList.push(
          <tr>
            <td>Wednesday</td>
            <td>{timeConvert(day[0].start)} - {timeConvert(day[0].end)}</td>
          </tr>
        );
      } else {
        hourList.push(
          <tr>
            <td>Wednesday</td>
            <td style={{
              color: 'red'
            }}>Closed</td>
          </tr>
        );
      }
      if ((hours.filter(item => item.day === 3)).length > 0) {
        day = hours.filter(item => item.day === 3);
        hourList.push(
          <tr>
            <td>Thursday</td>
            <td>{timeConvert(day[0].start)} - {timeConvert(day[0].end)}</td>
          </tr>
        );
      } else {
        hourList.push(
          <tr>
            <td>Thursday</td>
            <td style={{
              color: 'red'
            }}>Closed</td>
          </tr>
        );
      }
      if ((hours.filter(item => item.day === 4)).length > 0) {
        day = hours.filter(item => item.day === 4);
        hourList.push(
          <tr>
            <td>Friday</td>
            <td>{timeConvert(day[0].start)} - {timeConvert(day[0].end)}</td>
          </tr>
        );
      } else {
        hourList.push(
          <tr>
            <td>Friday</td>
            <td style={{
              color: 'red'
            }}>Closed</td>
          </tr>
        );
      }
      if ((hours.filter(item => item.day === 5)).length > 0) {
        day = hours.filter(item => item.day === 5);
        hourList.push(
          <tr>
            <td>Saturday</td>
            <td>{timeConvert(day[0].start)} - {timeConvert(day[0].end)}</td>
          </tr>
        );
      } else {
        hourList.push(
          <tr>
            <td>Saturday</td>
            <td style={{
              color: 'red'
            }}>Closed</td>
          </tr>
        );
      }
      if ((hours.filter(item => item.day === 6)).length > 0) {
        day = hours.filter(item => item.day === 6);
        hourList.push(
          <tr>
            <td>Sunday</td>
            <td>{timeConvert(day[0].start)} - {timeConvert(day[0].end)}</td>
          </tr>
        );
      } else {
        hourList.push(
          <tr>
            <td>Sunday</td>
            <td style={{
              color: 'red'
            }}>Closed</td>
          </tr>
        );
      }
    }
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Day</th>
            <th>Hours</th>
          </tr>
        </thead>
        <tbody>
          {hourList}
        </tbody>
      </Table>
    );
  };

  const timeConvert = (time) => {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])([0-5]\d)/);
    let formatedTime = '';
    if (time.length > 1) { // If time format correct
      formatedTime = (time[1] % 12 || 12) + ":" + time[2] + (time[1] < 12 ? ' AM' : ' PM')
    }
    return formatedTime; // return adjusted time or original string
  }

  const displayPrice = () => {
    const price = restaurant.price;
    let prices = [];
    if (price != null) {
      prices.push(<span>Price: </span>);
      for (let i = 0; i < price.length; i++) {
        prices.push(<FaDollarSign color="green" />);
      }
    }
    return prices;
  }

  // Actual return of Details component
  return (
    <div>
      <Container>
        {/* Restaurant Images */}
        <Row className="justify-content-md-center">
          <Card style={{
            width: '100%'
          }}>
            <Card.Body style={{
              padding: '0.5rem'
            }}>
              <Carousel>{ImageSlide}</Carousel>
            </Card.Body>
          </Card>
        </Row>
        <br />

        {/* Google Maps */}
        <Row className="justify-content-md-center">
          <Card style={{
            width: '100%'
          }}>
            <Card.Header>
              <center><h1>{restaurant.name}</h1></center>
            </Card.Header>
            <Card.Body style={{
              padding: '0rem'
            }}>
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
                  title={`${restaurant.name}`} //mouse over
                  name={`${restaurant.name}`}
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
            </Card.Body>
          </Card>
        </Row>

        <Row style={{
          marginTop: '16px'
        }}>
          <Card style={{
            width: '100%'
          }}>
            <Card.Header>Restaurant Details</Card.Header>
            <Card.Body>
              <Tabs defaultActiveKey="general" id="uncontrolled-tab-example">
                <Tab style={{
                  padding: '16px'
                }} eventKey="general" title="General">
                  <p>Cuisines: {Cuisines}</p>
                  {/* Some restaurants don't have price value, so don't display if this is the case */}
                  <p>
                    {displayPrice()}
                  </p>
                  <p>Rating: {displayRating()} {restaurant.review_count} reviews</p>
                  <a variant="outline-primary" target="_blank" rel="noopener noreferrer" href={restaurant.url}><Button variant="outline-primary">Yelp Link</Button></a>
                </Tab>
                <Tab style={{
                  padding: '16px'
                }} eventKey="address" title="Address/Contact">
                  <p><MdLocationOn color="#e53935" /> {restaurant.location.address1 !== "" ? `${restaurant.location.address1}, ${restaurant.location.city}, ${restaurant.location.state} ${restaurant.location.zip_code}` : `${restaurant.location.city}, ${restaurant.location.state} ${restaurant.location.zip_code}`}</p>
                  <p><MdLocalPhone color="#e53935" /> <a href={`tel:${restaurant.phone}`}>{restaurant.display_phone}</a></p>
                </Tab>
                <Tab style={{
                  padding: '16px'
                }} eventKey="hours" title="Open Hours">
                  <p>{displayHours()}</p>
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
  apiKey: `${MAPS_API_KEY}`
})(Details);