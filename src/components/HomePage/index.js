// The component for the home page.
// TODO: add navbar, about, add icons, icon to search

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import SearchResults from './SearchResults';
import { MdRestaurant, MdLocationCity } from "react-icons/md";
import axios from 'axios';
import './style.css';

const anywhere = 'https://cors-anywhere.herokuapp.com/';

// Enter your own Yelp Fusion API key here
const API_KEY = 'yR15w8bu1wHsBvCaLBOTjSE19XdcT0rwnd9CUAkRENxiBHBqkfNj2sAkTx-yzkY4n146e_nXFAo43nQlwWSp3xxCHpoO8kzwBY_aE9OklcwvTEc3x3zEdUdP-epSXnYx';

// Function for the homepage
const HomePage = (props) => {
    // Define states
    let [restaurant, setRestaurant] = useState("");
    let [location, setLocation] = useState("");
    let [restaurantsList, setRestaurantsList] = useState([]);
    let [geoLocation, setGeoLocation] = useState({});
    const geo = navigator.geolocation;
    let getLocation = () => {
        if (!geo) {
            console.log("Location API is not supported/available");
        } else {
            geo.getCurrentPosition((position) => {
                // success callback
                console.log("Location: ", position.coords.latitude, position.coords.longitude);
                setGeoLocation(position.coords);
            }, (err) => {

            })
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    // Set the restaurant text in the restaurant state
    const onChangeRestaurant = (event) => {
        setRestaurant(event.target.value);
    }

    // Set the location text in the location state
    const onChangeLocation = (event) => {
        setLocation(event.target.value);
    }

    const searchGeoRestaurant = (event) => {
        // Send a GET request to the Yelp API and filter businesses to food
        axios.get(`${anywhere}https://api.yelp.com/v3/businesses/search?term=${restaurant}&categories=food&latitude=${geoLocation.latitude}&longitude=${geoLocation.longitude}&radius=15000`, {
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

    const searchRestaurant = (event) => {
        // Send a GET request to the Yelp API and filter businesses to food
        axios.get(`${anywhere}https://api.yelp.com/v3/businesses/search?term=${restaurant}&categories=food&location=${location}&offset=51&limit=50`, {
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
                <Row className="justify-content-md-center">
                    <Col xs="6">
                        <h1 className="heading">Restaurant-Searcher</h1>
                        {/* Form for entering Restaurant Name and Location */}
                        <Form>
                            <Form.Group controlId="basic">
                                <Form.Label className="text">Enter Restaurant</Form.Label>
                                {/* When Form text changes, call onChangeRestaurant() */}
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroupPrepend"><MdRestaurant /></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control onChange={onChangeRestaurant} placeholder="Restaurant" />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="basic">
                                <Form.Label className="text">Enter Location</Form.Label>
                                {/* When Form text changes, call onChangeLocation() */}
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="inputGroupPrepend"><MdLocationCity /></InputGroup.Text>
                                    </InputGroup.Prepend>
                                <Form.Control onChange={onChangeLocation} placeholder="Location (i.e. Atlanta, GA)" />
                            </InputGroup>
                            </Form.Group>
                        </Form>

                        {/* When button is pressed, call searchRestaurant() */}
                        <Button variant="light" onClick={searchRestaurant}>Submit</Button>
                        <Button variant="light" onClick={searchGeoRestaurant} className="float-right">Submit with Your Location</Button>
                    </Col>
                </Row>

                {/* If restaurantsList length > 0, show SearchResults component, otherwise don't show */}
                {restaurantsList.length > 0 ? <SearchResults restaurantsList={restaurantsList} /> : null}
            </Container>
        </div>
    );
}

export default HomePage;