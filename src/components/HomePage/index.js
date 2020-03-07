// The component for the home page.
// TODO: Loading screen, Modal for if you didn't enter name and pressed Submit?

import axios from 'axios'
import './style.css'
import React, { useState } from 'react'
import { Button, Card, Col, Container, Form, InputGroup, Modal, Row } from 'react-bootstrap'
import SearchResults from './SearchResults'
import { MdLocationCity, MdRestaurant } from 'react-icons/md'

// CORS-Anywhere policy - Do not change
const anywhere = 'https://cors-anywhere.herokuapp.com/'

// Enter your own Yelp Fusion API key here
const API_KEY = 'n4723HjFL6HV_NnAtILXkWEOstIKOV_Z7A6hpvtqsej5ivj7mWpHALmE8IDyimva1SElkUAnK4XNUa1qzRLQv7xaj3a2crW1jfP-1eteel6v9JaQcO838gpwXcRhXnYx'

/* Modal (alert box) for when user does not set location to allow and
tries to click 'Submit with your Location' */

function MyVerticallyCenteredModal (props) {
  return (
    <Modal
      {...props}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>
                    Cannot find user location
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
                    Make sure your browser supports HTML5 Geolocation and that the
                    Location permission is set to 'Allow' for this site.
        </p>
      </Modal.Body>
      <Modal.Footer>
        {/* Hides Modal when close is clicked */}
        <Button variant='danger' onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

// Function for the homepage
const HomePage = (props) => {
  // Define states
  const [restaurant, setRestaurant] = useState('')
  const [location, setLocation] = useState('')
  const [restaurantsList, setRestaurantsList] = useState([])
  const [geoLocation, setGeoLocation] = useState({})
  const [checkFilter, setCheckFilter] = useState([1, 1, 1, 1])
  const [priceFilter, setPriceFilter] = useState('1,2,3,4')
  const [modalShow, setModalShow] = useState(false)

  // Gets user location when button is pressed
  const searchGeoRestaurant = () => {
    const geo = navigator.geolocation
    if (!geo) {
      console.log('Location API is not supported/available')
    } else {
      geo.getCurrentPosition((position) => {
        // success callback
        setGeoLocation(position.coords)
        // Send a GET request to Yelp API containing restaurant name and user location
        axios.get(`${anywhere}https://api.yelp.com/v3/businesses/search?term=${restaurant}&categories=food&latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&radius=15000&price=${priceFilter}`, {
          headers: {
            Authorization: `Bearer ${API_KEY}`
          }
        }).then((res) => {
          // Set business array in restaurantsList state
          setRestaurantsList(res.data.businesses)
        }).catch((err) => {
          // Otherwise catch error and log it to console
          console.log('Error occured: ', err)
        })
      }, (err) => {
        // Show error modal if location cannot be obtained
        setModalShow(true)
      })
    }
  }

  // useEffect(() => {
  //     getLocation();
  // }, []);

  // Set the restaurant text in the restaurant state
  const onChangeRestaurant = (event) => {
    setRestaurant(event.target.value)
  }

  // Set the location text in the location state
  const onChangeLocation = (event) => {
    setLocation(event.target.value)
  }

  // Function when price filter checkboxes change
  const onChangePrice = (event, checkbox) => {
    const filter = checkFilter
    // Checked = 1, unchecked = 0
    const checkedStatus = event.target.checked ? 1 : 0

    switch (checkbox) {
      case 0:
        filter[0] = checkedStatus
        break
      case 1:
        filter[1] = checkedStatus
        break
      case 2:
        filter[2] = checkedStatus
        break
      case 3:
        filter[3] = checkedStatus
        break
      default:
        break
    }
    const result = []
    filter.forEach((item, index) => {
      // checkbox 0 -> return price 1, checkbox 1 -> return price 2, etc
      return item === 1 ? result.push(index + 1) : null
    })

    setCheckFilter(filter)
    // If no checkboxes are checked, display all results
    if (result.toString().length === 0) {
      setPriceFilter('1,2,3,4')
    } else {
      setPriceFilter(result.toString()) // [2,3,4] "2,3,4"
    }
  }

  const searchRestaurant = (event) => {
    /* Send a GET request to the Yelp API and filter businesses to food, pass
        in price filter and restaurant name */
    axios.get(`${anywhere}https://api.yelp.com/v3/businesses/search?term=${restaurant}&categories=food&location=${location}&price=${priceFilter}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`
      }
    }).then((res) => {
      // Set business array in restaurantsList state
      setRestaurantsList(res.data.businesses)
    }).catch((err) => {
      // Otherwise catch error and log it to console
      console.log('Error occured: ', err)
    })
  }
  return (
  // All the stuff to display on home page
    <div>
      <Container>
        <Card
          className='justify-content-md-center' style={{
            width: '75%',
            marginTop: '16px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          <Card.Body>
            <Row className='justify-content-md-center'>
              <Col>
                <h1><center>Yelper</center></h1>
                <p>Enter the restaurant type/name and location and click Submit, or enter just the restaurant and click Submit with Your Location.</p>
                {/* Form for entering Restaurant Name and Location */}
                <Form>
                  <Form.Group controlId='basic'>
                    <Form.Label>Enter Restaurant Name/Type</Form.Label>
                    {/* When Form text changes, call onChangeRestaurant() */}
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id='inputGroupPrepend'><MdRestaurant /></InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control onChange={onChangeRestaurant} placeholder='Restaurant' />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group controlId='basic'>
                    <Form.Label>Enter Location</Form.Label>
                    {/* When Form text changes, call onChangeLocation() */}
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id='inputGroupPrepend'><MdLocationCity /></InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control onChange={onChangeLocation} placeholder='Location (i.e. Atlanta, GA)' />
                    </InputGroup>
                  </Form.Group>
                </Form>
              </Col>
            </Row>

            <Row style={{
              marginTop: '4px'
            }}
            >
              <Col>
                <p>Check the price range boxes to filter the search results.</p>
                {/* Price Filters */}
                <InputGroup className='mb-3'>
                  <InputGroup.Prepend style={{
                    marginRight: '16px'
                  }}
                  >
                    <InputGroup.Text>
                                            $
                    </InputGroup.Text>

                    <InputGroup.Checkbox
                      onChange={(event) => {
                      // Call onChangePrice() for each checkbox when checked/unchecked
                        onChangePrice(event, 0)
                      }} aria-label='Checkbox for following text input' checked={checkFilter[0] === 1 ? 'checked' : null}
                    />
                  </InputGroup.Prepend>

                  <InputGroup.Prepend style={{
                    marginRight: '16px'
                  }}
                  >
                    <InputGroup.Text>
                                            $$
                    </InputGroup.Text>

                    <InputGroup.Checkbox
                      onChange={(event) => {
                        onChangePrice(event, 1)
                      }} aria-label='Checkbox for following text input' checked={checkFilter[1] === 1 ? 'checked' : null}
                    />
                    {/* <Form.Check label="label" type="checkbox" /> */}
                  </InputGroup.Prepend>

                  <InputGroup.Prepend style={{
                    marginRight: '16px'
                  }}
                  >
                    <InputGroup.Text>
                                            $$$
                    </InputGroup.Text>

                    <InputGroup.Checkbox
                      onChange={(event) => {
                        onChangePrice(event, 2)
                      }} aria-label='Checkbox for following text input' checked={checkFilter[2] === 1 ? 'checked' : null}
                    />
                  </InputGroup.Prepend>

                  <InputGroup.Prepend style={{
                    marginRight: '16px'
                  }}
                  >
                    <InputGroup.Text>
                                            $$$$
                    </InputGroup.Text>

                    <InputGroup.Checkbox
                      onChange={(event) => {
                        onChangePrice(event, 3)
                      }} aria-label='Checkbox for following text input' checked={checkFilter[3] === 1 ? 'checked' : null}
                    />
                  </InputGroup.Prepend>
                </InputGroup>
              </Col>
            </Row>

            {/* When button is pressed, call searchRestaurant() */}
            <Button variant='dark' onClick={searchRestaurant}>Submit</Button>
            {/* When button is pressed, call searchGeoRestaurant() and get user location */}
            <Button variant='dark' onClick={searchGeoRestaurant} className='float-right'>Submit with Your Location</Button>
            {/* Modal hidden and will show if location cannot be found */}
            <MyVerticallyCenteredModal
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
          </Card.Body>
        </Card>
        {/* If there are restaurants, show SearchResults component, otherwise don't show anything */}
        {restaurantsList.length > 0 ? <SearchResults restaurantsList={restaurantsList} /> : null}
      </Container>
    </div>
  )
}

export default HomePage
