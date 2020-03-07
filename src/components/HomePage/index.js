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
    const [checkFilter, setCheckFilter ] = useState([ 1, 1, 1, 1 ]);
    const [priceFilter, setPriceFilter ] = useState("1,2,3,4");
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
                axios.get(`${anywhere}https://api.yelp.com/v3/businesses/search?term=${restaurant}&categories=food&latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&radius=15000&price=${priceFilter}`, {
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

    const onChangePrice = (event, checkbox) => {
        let filter = checkFilter;
        const checkedStatus = event.target.checked ? 1 : 0
        
        switch(checkbox){
            case 0:
                filter[0] = checkedStatus;
                break;
            case 1:
                filter[1] = checkedStatus;
                break;    
            case 2:
                filter[2] = checkedStatus;
                break;    
            case 3:
                filter[3] = checkedStatus;
                break;  
            default:
                break;
        }
        const result = [];
        filter.forEach((item, index) => {
            return item === 1 ? result.push(index + 1) : null
        });

        setCheckFilter(filter);
        if (result.toString().length === 0) {
            setPriceFilter("1,2,3,4");
        } else {
            setPriceFilter(result.toString()); // [2,3,4] "2,3,4"
        }
        console.log(filter, checkbox);
        console.log(result.toString(), checkbox);
    }

    const searchRestaurant = (event) => {
        // Send a GET request to the Yelp API and filter businesses to food
        axios.get(`${anywhere}https://api.yelp.com/v3/businesses/search?term=${restaurant}&categories=food&location=${location}&price=${priceFilter}`, {
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
                                        <InputGroup.Checkbox onChange={(event)=>{
                                            onChangePrice(event, 0);
                                        }} aria-label="Checkbox for following text input" checked={ checkFilter[0]===1? "checked" : null} />
                                    </InputGroup.Prepend>

                                    <InputGroup.Prepend style={{
                                        marginRight: '16px',
                                    }}>
                                        <InputGroup.Text>
                                            $$
                                </InputGroup.Text>
                                        <InputGroup.Checkbox onChange={(event)=>{
                                            onChangePrice(event, 1);
                                        }} aria-label="Checkbox for following text input" checked={ checkFilter[1]===1? "checked" : null} />
                                        {/* <Form.Check label="label" type="checkbox" /> */}
                                    </InputGroup.Prepend>

                                    <InputGroup.Prepend style={{
                                        marginRight: '16px',
                                    }}>
                                        <InputGroup.Text>
                                            $$$
                                </InputGroup.Text>
                                        <InputGroup.Checkbox onChange={(event)=>{
                                            onChangePrice(event, 2);
                                        }} aria-label="Checkbox for following text input" checked={ checkFilter[2]===1? "checked" : null} />
                                        {/* <Form.Check label="label" type="checkbox" /> */}
                                    </InputGroup.Prepend>

                                    <InputGroup.Prepend style={{
                                        marginRight: '16px',
                                    }}>
                                        <InputGroup.Text>
                                            $$$$
                                </InputGroup.Text>
                                        <InputGroup.Checkbox onChange={(event)=>{
                                            onChangePrice(event, 3);
                                        }} aria-label="Checkbox for following text input" checked={ checkFilter[3]===1? "checked" : null} />
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