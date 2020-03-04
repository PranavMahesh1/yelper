// The component for when you click 'More information' on a specific restaurant.
// alphabetical order
import React, { useState, useEffect } from 'react';
import { Container, Row, Carousel, Card, Tab, Tabs, Table, Button } from 'react-bootstrap';
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
        <Card style={{
            width: '100%'
          }}>
            <Card.Body>
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
                  <p>{restaurant.price != null ? `Price: ${restaurant.price}` : null}</p>
                  <p>Rating: {displayRating()}</p>
                  <a variant="outline-primary" target="_blank" rel="noopener noreferrer" href={restaurant.url}><Button variant="outline-primary">Primary</Button></a>
                </Tab>
                <Tab style={{
                  padding: '16px'
                }} eventKey="address" title="Address/Contact">
                  <p>Address: {restaurant.location.address1}, {restaurant.location.city}, {restaurant.location.state} {restaurant.location.zip_code}</p>
                  <p>Phone number: {restaurant.display_phone}</p>
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
  apiKey: 'AIzaSyBKkqON7yV0e9pLsxgZeoR8l917lbOEOrU'
})(Details);