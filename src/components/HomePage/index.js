// The component for the home page.
// Loading screen
// Search for one restaurant - don't show others
// Instructions
// Geolocation only if press button
import axios from 'axios';
import './style.css';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, FormControl, InputGroup, Modal, Row } from 'react-bootstrap';
import SearchResults from './SearchResults';
import { MdLocationCity, MdRestaurant } from "react-icons/md";

const anywhere = 'https://cors-anywhere.herokuapp.com/';

// Enter your own Yelp Fusion API key here
const API_KEY = 'n4723HjFL6HV_NnAtILXkWEOstIKOV_Z7A6hpvtqsej5ivj7mWpHALmE8IDyimva1SElkUAnK4XNUa1qzRLQv7xaj3a2crW1jfP-1eteel6v9JaQcO838gpwXcRhXnYx';

function MyVerticallyCenteredModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Cannot find user location
          </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Make sure your browser supports HTML5 Geolocation and that the Location permission is set to 'Allow' for this site.
          </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

// Function for the homepage
const HomePage = (props) => {
    // Define states
    let [restaurant, setRestaurant] = useState("");
    let [location, setLocation] = useState("");
    let [restaurantsList, setRestaurantsList] = useState([]);
    let [geoLocation, setGeoLocation] = useState({});
    const [priceFilter, setPriceFilter ] = useState({ check1: 0, check2: 0, check3: 0, check4: 0 });
    const [modalShow, setModalShow] = useState(false);

    let getLocation = () => {
        const geo = navigator.geolocation;
        if (!geo) {
            console.log("Location API is not supported/available");
        } else {
            geo.getCurrentPosition((position) => {
                // success callback
                console.log("Location: ", position.coords.latitude, position.coords.longitude);
                setGeoLocation(position.coords);
                axios.get(`${anywhere}https://api.yelp.com/v3/businesses/search?term=${restaurant}&categories=food&latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&radius=15000`, {
                    headers: {
                        Authorization: `Bearer ${API_KEY}`
                    }
                }).then((res) => {
                    // Set business array in restaurantsList state
                    setRestaurantsList(res.data.businesses);
                }).catch((err) => {
                    // Otherwise catch error and log it to console
                    console.log("Error occured: ", err);
                })
            }, (err) => {
                setModalShow(true);
            })
        }
    };

    // useEffect(() => {
    //     getLocation();
    // }, []);

    // Set the restaurant text in the restaurant state
    const onChangeRestaurant = (event) => {
        setRestaurant(event.target.value);
    }

    // Set the location text in the location state
    const onChangeLocation = (event) => {
        setLocation(event.target.value);
    }

    const onChangePrice = (event) => {
        let filter = priceFilter;
        filter.check1 = event.target.checked;
        filter.check2 = event.target.checked;
        filter.check3 = event.target.checked;
        filter.check4 = event.target.checked;
        console.log(event);
    }

    const searchRestaurant = (event) => {
        // Send a GET request to the Yelp API and filter businesses to food
        axios.get(`${anywhere}https://api.yelp.com/v3/businesses/search?term=${restaurant}&categories=food&location=${location}`, {
            headers: {
                Authorization: `Bearer ${API_KEY}`
            }
        }).then((res) => {
            // Set business array in restaurantsList state
            setRestaurantsList(res.data.businesses);
        }).catch((err) => {
            // Otherwise catch error and log it to console
            console.log("Error occured: ", err);
        })
    }
    return (
        <div>
            <Container>
                <Card className="justify-content-md-center" style={{
                    width: '75%',
                    marginTop: '16px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                    <Card.Body>
                        <Row className="justify-content-md-center">

                            <Col>
                                <h1><center>Restaurant Searcher</center></h1>
                                <p>Enter the restaurant type/name and location and click Submit, or enter just the restaurant and click Submit with Your Location.</p>
                                {/* Form for entering Restaurant Name and Location */}
                                <Form>
                                    <Form.Group controlId="basic">
                                        <Form.Label>Enter Restaurant Name/Type</Form.Label>
                                        {/* When Form text changes, call onChangeRestaurant() */}
                                        <InputGroup>
                                            <InputGroup.Prepend>
                                                <InputGroup.Text id="inputGroupPrepend"><MdRestaurant /></InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control onChange={onChangeRestaurant} placeholder="Restaurant" />
                                        </InputGroup>
                                    </Form.Group>

                                    <Form.Group controlId="basic">
                                        <Form.Label>Enter Location</Form.Label>
                                        {/* When Form text changes, call onChangeLocation() */}
                                        <InputGroup>
                                            <InputGroup.Prepend>
                                                <InputGroup.Text id="inputGroupPrepend"><MdLocationCity /></InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control onChange={onChangeLocation} placeholder="Location (i.e. Atlanta, GA)" />
                                        </InputGroup>
                                    </Form.Group>
                                </Form>

                            </Col>

                        </Row>
                        <Row style={{
                            marginTop: '4px'
                        }}>
                            <Col>
                                <p>Check the price range boxes to filter the search results.</p>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend style={{
                                        marginRight: '16px',
                                    }}>
                                        <InputGroup.Text>
                                            $
                                </InputGroup.Text>
                                        <InputGroup.Checkbox onChange={onChangePrice} aria-label="Checkbox for following text input" />
                                    </InputGroup.Prepend>

                                    <InputGroup.Prepend style={{
                                        marginRight: '16px',
                                    }}>
                                        <InputGroup.Text>
                                            $$
                                </InputGroup.Text>
                                        <InputGroup.Checkbox onChange={onChangePrice} aria-label="Checkbox for following text input" />
                                        {/* <Form.Check label="label" type="checkbox" /> */}
                                    </InputGroup.Prepend>

                                    <InputGroup.Prepend style={{
                                        marginRight: '16px',
                                    }}>
                                        <InputGroup.Text>
                                            $$$
                                </InputGroup.Text>
                                        <InputGroup.Checkbox onChange={onChangePrice} aria-label="Checkbox for following text input" />
                                        {/* <Form.Check label="label" type="checkbox" /> */}
                                    </InputGroup.Prepend>

                                    <InputGroup.Prepend style={{
                                        marginRight: '16px',
                                    }}>
                                        <InputGroup.Text>
                                            $$$$
                                </InputGroup.Text>
                                        <InputGroup.Checkbox onChange={onChangePrice} aria-label="Checkbox for following text input" />
                                        {/* <Form.Check label="label" type="checkbox" /> */}
                                    </InputGroup.Prepend>
                                </InputGroup>
                            </Col>
                        </Row>
                        {/* When button is pressed, call searchRestaurant() */}
                        <Button variant="dark" onClick={searchRestaurant}>Submit</Button>
                        <Button variant="dark" onClick={getLocation} className="float-right">Submit with Your Location</Button>
                        <MyVerticallyCenteredModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                        />
                    </Card.Body>
                </Card>
                {/* If restaurantsList length > 0, show SearchResults component, otherwise don't show */}
                {restaurantsList.length > 0 ? <SearchResults restaurantsList={restaurantsList} /> : null}
            </Container>
        </div>
    );
}

export default HomePage;