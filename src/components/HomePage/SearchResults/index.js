// The component that appears when you click 'Submit' on the main page.

import React, { } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Row, Button, Card } from 'react-bootstrap';
import './style.css';

const SearchResults = (props) => {
    let history = useHistory();

    function restaurantDetails(item) {
        history.push('/details', {
            // Link to /details and pass in detailsObject/item as a prop
            detailsObject: item
        });
    }

    // Map function to loop through the array of items and displays a card for each restaurant
    let Restaurants = props.restaurantsList.map((item, key) =>
        <Card key={key} className="card-margin" height="300">
            <Card.Img variant="top" src={item.image_url} height="250"/>
            <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                    Location: {item.location.address1}, {item.location.city}, {item.location.state} {item.location.zip_code}
                </Card.Text>
                <Card.Text>Rating: {item.rating} / 5</Card.Text>
                <Card.Text>Phone: {item.display_phone}</Card.Text>
                {/* Make sure in most cases that the button will align 
                to the bottom and won't cover up phone number */}
                <br />
                <Button onClick={
                    () => {
                        restaurantDetails(item);
                    }} style={{position: "absolute", bottom: "1px", marginTop: "16px"}} variant="primary">More information</Button>
            </Card.Body>
        </Card>
    );

    return (
        <div>
            <br />
            <Container>
                {/* Center row */}
                <Row className="justify-content-md-center">
                    {/* The cards that will display the restaurant information */}
                    {Restaurants}
                </Row>
            </Container>
        </div>
    );
}

export default SearchResults;