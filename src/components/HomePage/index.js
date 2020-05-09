// The component for the home page.
// TODO: Loading screen

import axios from 'axios'
import './style.css'
import React, { useState } from 'react'
import { Button, Card, Col, Container, Form, InputGroup, Modal, Row } from 'react-bootstrap'
import SearchResults from './SearchResults'
import { MdLocationCity, MdRestaurant } from 'react-icons/md'

// CORS-Anywhere policy - Do not change
const anywhere = 'https://cors-anywhere.herokuapp.com/'

// Enter your own Yelp Fusion API key here
const API_KEY = ''

// Made only one Modal (alert box) for all alerts to increase readability
function ErrorModal(props) {
  return (
    <Modal
      {...props}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {props.description}
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
  const [modalState, setModalState] = useState({ title: '', description: '' })

  const searchRestaurant = (event) => {
    // If restaurant and location aren't entered
    if (restaurant.length === 0 && location.length === 0) {
      setModalState({
        title: 'Enter a restaurant and location',
        description: 'Please enter both a restaurant and a location.'
      })
      setModalShow(true)
      return
    }
    // If restaurant is entered but location isn't
    if (location.length === 0) {
      setModalState({
        title: 'Enter a location',
        description: 'Please enter a location in addition to the restaurant.'
      })
      setModalShow(true)
      return
    }
    /* Send a GET request to the Yelp API and filter businesses to food, pass
        in price filter and restaurant name */
    axios.get(`${anywhere}https://api.yelp.com/v3/businesses/search?term=${restaurant}&categories=food&location=${location}&price=${priceFilter}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`
      }
    }).then((res) => {
      // Show Modal if no businesses are found so the user knows something happened
      if (res.data.businesses.length === 0) {
        setModalState({
          title: 'No results found',
          description: 'No results were found. Please try a different search option.'
        })
        setModalShow(true)
      } else {
        // Set business array in restaurantsList state
        setRestaurantsList(res.data.businesses)
      }
    }).catch((err) => {
      // If there's a problem with API/CORS (429: Too Many Requests)
      setModalState({
        title: 'Error with API',
        description: 'There seems to be a problem with the API. Please try again later.'
      })
      setModalShow(true)
      console.log('Error occured: ', err)
    })
  }

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
          // Show Modal if no businesses are found so the user knows something happened
          if (res.data.businesses.length === 0) {
            setModalState({
              title: 'No results found',
              description: 'No results were found. Please try a different search option.'
            })
            setModalShow(true)
          } else {
            // Set business array in restaurantsList state
            setRestaurantsList(res.data.businesses)
          }
        }).catch((err) => {
          // Otherwise catch error and log it to console
          console.log('Error occured: ', err)
          setModalState({
            title: 'Error with API',
            description: 'There seems to be a problem with the API. Please try again later.'
          })
          setModalShow(true)
        })
      }, (err) => {
        // Show error modal if location cannot be obtained
        setModalState({
          title: 'Cannot find user location',
          description: 'Make sure your browser supports HTML5 Geolocation and that the Location permission is set to \'Allow\' for this site.'
        })
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
                {/* Form for entering Restaurant Name and Location */}
                <Form>
                  <Form.Group controlId='basic'>
                    <Form.Label>Enter Restaurant Name/Food Style</Form.Label>
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
            <Button variant='dark' onClick={searchGeoRestaurant} className='float-right'>Restaurants Near Me</Button>
          </Card.Body>
        </Card>
        {/* If there are restaurants, show SearchResults component, otherwise don't show anything */}
        {restaurantsList.length > 0 ? <SearchResults restaurantsList={restaurantsList} /> : null}
        <ErrorModal
          title={modalState.title}
          description={modalState.description}
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </Container>
    </div>
  )
}

export default HomePage
