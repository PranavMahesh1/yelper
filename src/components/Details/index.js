// The component for the restaurant details when you click 'More information' on a specific restaurant.

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Card, Carousel, Container, Row, Tab, Table, Tabs } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { GoogleApiWrapper, InfoWindow, Marker, Map } from 'google-maps-react'
import { IoIosStarHalf, IoIosStarOutline, IoIosStar } from 'react-icons/io'
import { FaDollarSign } from 'react-icons/fa'
import { MdLocalPhone, MdLocationOn } from 'react-icons/md'

const anywhere = 'https://nameless-scrubland-76048.herokuapp.com/'

// Enter your own Yelp Fusion API key here
const YELP_API_KEY = ''

// Enter your own Google Maps API key here
const MAPS_API_KEY = ''

const Details = (props) => {
  // Create location object
  const location = useLocation()

  // Restaurant is the prop of location.state - contains the specific restaurant that was clicked on
  const [restaurant, setRestaurant] = useState(location.state.detailsObject)

  // Map stuff
  const [showingInfoWindow, setShowInfoWindow] = useState(false) // Hides or shows the infoWindow
  const [activeMarker, setActiveMarker] = useState({}) // Shows the active marker upon click
  const [selectedPlace, setSelectedPlace] = useState({}) // Shows the infoWindow to the selected place upon a marker

  // Execute this when site loads
  useEffect(() => {
    // Make a request to businesses/id to retrieve more detailed information
    axios.get(`${anywhere}https://api.yelp.com/v3/businesses/${restaurant.id}`, {
      headers: {
        Authorization: `Bearer ${YELP_API_KEY}`
      }
    }).then((res) => {
      // Set business array in restaurant state
      setRestaurant(res.data)
    }).catch((err) => {
      // Otherwise catch error and log it to console
      console.log('Error occured: ', err)
    })
  }, []) // [] is an important parameter so that it doesn't do this forever

  // Map function to loop through sub-array categories to find type of cuisines
  const Cuisines = restaurant.categories.map((item, key) =>
    <span key={key}>{item.title}, </span>
  )

  // Make sure photos exist before get request
  const ImageSlide = restaurant.photos && restaurant.photos.map((item, key) =>
    <Carousel.Item>
      <div style={{
        overflow: 'hidden',
        height: '400px'
      }}
      >
        <img
          className='d-block w-100'
          src={item}
          alt='Restaurant'
          key={key}
          style={{
            backgroundPosition: 'center center'
          }}
        />
      </div>
    </Carousel.Item>
  )

  // When map marker is clicked
  const onMarkerClick = (props, marker, e) => {
    setSelectedPlace(props)
    setActiveMarker(marker)
    setShowInfoWindow(true)
  }

  // When map infoWindow is closed
  const onClose = props => {
    if (showingInfoWindow) {
      setActiveMarker(null)
      setShowInfoWindow(false)
    }
  }

  // Style for map
  const mapStyle = {
    width: '100%',
    height: '400px',
    position: 'relative'
  }

  // Find whether number is float or not
  function isFloat (n) {
    return Number(n) === n && n % 1 !== 0
  }

  /* Function that takes the rating and displays that many stars.
     If number is a float, round to the .5 - may not be necessary for the Yelp API.
  */
  const displayRating = () => {
    const max = restaurant.rating
    const emptyStars = 5 - Math.ceil(max)
    const stars = []
    if (isFloat(max)) {
      // 3.2 -> push 3 full stars
      const floor = Math.floor(max)
      for (let i = 1; i <= floor; i++) {
        stars.push(<IoIosStar color='orange' />)
      }
      // push a half star
      stars.push(<IoIosStarHalf color='orange' />)
    } else {
      // If whole number, just push that many full stars
      for (let i = 1; i <= max; i++) {
        stars.push(<IoIosStar color='orange' />)
      }
    }

    let j = 1
    while (j <= emptyStars) {
      // push remaining empty stars
      stars.push(<IoIosStarOutline color='orange' />)
      j++
    }
    return stars
  }

  // Displays open hours of restaurant
  const displayHours = () => {
    const hourList = []
    let day = ''
    // If hours exist
    if (restaurant.hours && restaurant.hours[0].open) {
      const hours = restaurant.hours[0].open // all the hours
      // Filter if hours are there
      if ((hours.filter(item => item.day === 0)).length > 0) {
        // checking the day
        day = hours.filter(item => item.day === 0)
        hourList.push(
          <tr>
            <td>Monday</td>
            <td>{timeConvert(day[0].start)} - {timeConvert(day[0].end)}</td>
          </tr>
        )
      } else {
        // Else the business is closed on that day
        hourList.push(
          <tr>
            <td>Monday</td>
            <td style={{
              color: 'red'
            }}
            >Closed
            </td>
          </tr>
        )
      }
      if ((hours.filter(item => item.day === 1)).length > 0) {
        day = hours.filter(item => item.day === 1)
        hourList.push(
          <tr>
            <td>Tuesday</td>
            <td>{timeConvert(day[0].start)} - {timeConvert(day[0].end)}</td>
          </tr>
        )
      } else {
        hourList.push(
          <tr>
            <td>Tuesday</td>
            <td style={{
              color: 'red'
            }}
            >Closed
            </td>
          </tr>
        )
      }
      if ((hours.filter(item => item.day === 2)).length > 0) {
        day = hours.filter(item => item.day === 2)
        hourList.push(
          <tr>
            <td>Wednesday</td>
            <td>{timeConvert(day[0].start)} - {timeConvert(day[0].end)}</td>
          </tr>
        )
      } else {
        hourList.push(
          <tr>
            <td>Wednesday</td>
            <td style={{
              color: 'red'
            }}
            >Closed
            </td>
          </tr>
        )
      }
      if ((hours.filter(item => item.day === 3)).length > 0) {
        day = hours.filter(item => item.day === 3)
        hourList.push(
          <tr>
            <td>Thursday</td>
            <td>{timeConvert(day[0].start)} - {timeConvert(day[0].end)}</td>
          </tr>
        )
      } else {
        hourList.push(
          <tr>
            <td>Thursday</td>
            <td style={{
              color: 'red'
            }}
            >Closed
            </td>
          </tr>
        )
      }
      if ((hours.filter(item => item.day === 4)).length > 0) {
        day = hours.filter(item => item.day === 4)
        hourList.push(
          <tr>
            <td>Friday</td>
            <td>{timeConvert(day[0].start)} - {timeConvert(day[0].end)}</td>
          </tr>
        )
      } else {
        hourList.push(
          <tr>
            <td>Friday</td>
            <td style={{
              color: 'red'
            }}
            >Closed
            </td>
          </tr>
        )
      }
      if ((hours.filter(item => item.day === 5)).length > 0) {
        day = hours.filter(item => item.day === 5)
        hourList.push(
          <tr>
            <td>Saturday</td>
            <td>{timeConvert(day[0].start)} - {timeConvert(day[0].end)}</td>
          </tr>
        )
      } else {
        hourList.push(
          <tr>
            <td>Saturday</td>
            <td style={{
              color: 'red'
            }}
            >Closed
            </td>
          </tr>
        )
      }
      if ((hours.filter(item => item.day === 6)).length > 0) {
        day = hours.filter(item => item.day === 6)
        hourList.push(
          <tr>
            <td>Sunday</td>
            <td>{timeConvert(day[0].start)} - {timeConvert(day[0].end)}</td>
          </tr>
        )
      } else {
        hourList.push(
          <tr>
            <td>Sunday</td>
            <td style={{
              color: 'red'
            }}
            >Closed
            </td>
          </tr>
        )
      }
    }
    return (
      // Display this all in a table
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Day</th>
            <th>Hours</th>
          </tr>
        </thead>
        <tbody>
          {hourList} {/* The resulting array of all hours */}
        </tbody>
      </Table>
    )
  }

  const timeConvert = (time) => {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])([0-5]\d)/)
    let formatedTime = ''
    if (time.length > 1) { // If time format correct
      formatedTime = (time[1] % 12 || 12) + ':' + time[2] + (time[1] < 12 ? ' AM' : ' PM')
    }
    return formatedTime // return adjusted time or original string
  }

  // Take the price value and display as the dollar signs
  const displayPrice = () => {
    const price = restaurant.price
    const prices = []
    if (price != null) {
      prices.push(<span>Price: </span>)
      for (let i = 0; i < price.length; i++) {
        prices.push(<FaDollarSign color='green' />)
      }
    }
    return prices
  }

  // Actual return of Details component
  return (
    <div>
      <Container>
        {/* Restaurant Images */}
        <Row className='justify-content-md-center'>
          <Card style={{
            width: '100%'
          }}
          >
            <Card.Body style={{
              padding: '0.5rem'
            }}
            >
              <Carousel>{ImageSlide}</Carousel>
            </Card.Body>
          </Card>
        </Row>
        <br />

        {/* Google Maps */}
        <Row className='justify-content-md-center'>
          <Card style={{
            width: '100%'
          }}
          >
            <Card.Header>
              <center><h1>{restaurant.name}</h1></center>
            </Card.Header>
            <Card.Body style={{
              padding: '0rem'
            }}
            >
              {/* Display Map */}
              <Map
                google={props.google}
                style={mapStyle}
                containerStyle={mapStyle}
                zoom={20}
                initialCenter={{
                  lat: restaurant.coordinates.latitude,
                  lng: restaurant.coordinates.longitude
                }}
              >
                {/* Marker for map */}
                <Marker
                  title={`${restaurant.name}`} // mouse over
                  name={`${restaurant.name}`}
                  onClick={onMarkerClick}
                  position={{ lat: restaurant.coordinates.latitude, lng: restaurant.coordinates.longitude }}
                />

                {/* Info Window for when marker is clicked */}
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

        {/* Restaurant Details */}
        <Row style={{
          marginTop: '16px'
        }}
        >
          <Card style={{
            width: '100%'
          }}
          >
            <Card.Header>Restaurant Details</Card.Header>
            <Card.Body>
              {/* Different tabs for different information */}
              <Tabs defaultActiveKey='general' id='uncontrolled-tab-example'>
                {/* General */}
                <Tab
                  style={{
                    padding: '16px'
                  }} eventKey='general' title='General'
                >
                  <p>Cuisines: {Cuisines}</p>
                  <p>{displayPrice()}</p>
                  <p>Rating: {displayRating()} {restaurant.review_count} reviews</p>
                  <a variant='outline-primary' target='_blank' rel='noopener noreferrer' href={restaurant.url}><Button variant='outline-primary'>Yelp Link</Button></a>
                </Tab>

                {/* Address/Contact */}
                <Tab
                  style={{
                    padding: '16px'
                  }} eventKey='address' title='Address/Contact'
                >
                  {/* If it doesn't have address1, don't display the comma */}
                  <p><MdLocationOn color='#e53935' /> {restaurant.location.address1 !== '' ? `${restaurant.location.address1}, ${restaurant.location.city}, ${restaurant.location.state} ${restaurant.location.zip_code}` : `${restaurant.location.city}, ${restaurant.location.state} ${restaurant.location.zip_code}`}</p>
                  <p><MdLocalPhone color='#e53935' /> <a href={`tel:${restaurant.phone}`}>{restaurant.display_phone}</a></p>
                </Tab>

                {/* Open Hours */}
                <Tab
                  style={{
                    padding: '16px'
                  }} eventKey='hours' title='Open Hours'
                >
                  <p>{displayHours()}</p>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </div>
  )
}

export default GoogleApiWrapper({
  apiKey: `${MAPS_API_KEY}`
})(Details)
