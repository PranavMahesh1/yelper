// The component that appears when you click 'Submit' on the main page.

import React, { } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, Container, Row } from 'react-bootstrap';
import { IoIosStarHalf, IoIosStarOutline, IoIosStar } from 'react-icons/io';
import { FaDollarSign } from 'react-icons/fa';
import { MdLocalPhone, MdLocationOn } from 'react-icons/md';
import './style.css';

const SearchResults = (props) => {
    let history = useHistory();
    
    function restaurantDetails(item) {
        history.push('/details', {
            // Link to /details and pass in detailsObject as a prop, which contains item
            detailsObject: item
        });
    }

    function isFloat(n) {
        return Number(n) === n && n % 1 !== 0;
      }
    
      /* Function that takes the rating and converts it to stars.
         Accounts for if the rating is between a whole number and that plus 0.5,
         but may not be necessary for the Yelp API.
      */
     const displayRating = (item) => {
        const max = item;
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

      const displayPrice = (item, key) => {
        const price = item;
        let prices = [];
        if (price != null) {
          prices.push(<span key={key}>Price: </span>);
          for (let i = 0; i < price.length; i++) {
            prices.push(<FaDollarSign color="green" />);
          }
        }
        return prices;
      }

      const displayAddress = (item, key) => {
          let addresses = [];
          addresses.push(<MdLocationOn color="#e53935" />);
        if (item.address1 && item.address1 !== "") {
            addresses.push(` ${item.address1}, `)
        }
        addresses.push(`${item.city}, ${item.state} ${item.zip_code}`);
        return addresses;
      }
    // Map function to loop through the array of items and displays a card for each restaurant
    let Restaurants = props.restaurantsList.map((item, key) =>
        <Card key={key} className="card-margin" height="300">
            <Card.Img variant="top" src={item.image_url} height="250" />
            <Card.Body style={{
                height: '240'
            }}>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                    {/* If item does not have address1, don't display it  */}
                    {displayAddress(item.location)}
                </Card.Text>
                <Card.Text>{displayPrice(item.price, key)}</Card.Text>
                <Card.Text>Rating: {displayRating(item.rating)}</Card.Text>
                <Card.Text><MdLocalPhone color="#e53935" />&nbsp;<a href={`tel:${item.phone}`}>{item.display_phone}</a></Card.Text>
                {/* Make sure in most cases that the button will align 
                to the bottom and won't cover up phone number */}
            </Card.Body>
            <Button onClick={
                () => {
                    restaurantDetails(item);
                }} variant="success" style={{
                    margin: '4px'
                }}>More information</Button>
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