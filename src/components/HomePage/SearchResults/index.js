// The component that appears when you click 'Submit' on the main page.

import './style.css'
import React, { } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Card, Container, Row } from 'react-bootstrap'
import { IoIosStarHalf, IoIosStarOutline, IoIosStar } from 'react-icons/io'
import { FaDollarSign } from 'react-icons/fa'
import { MdLocalPhone, MdLocationOn } from 'react-icons/md'

const SearchResults = (props) => {
  // For navigation when you click 'More details'
  const history = useHistory()

  function restaurantDetails (item) {
    history.push('/yelper/details', {
      // Link to /details and pass in detailsObject as a prop, which contains item
      detailsObject: item
    })
  }

  // Find whether number is float or not
  function isFloat (n) {
    return Number(n) === n && n % 1 !== 0
  }

  /* Function that takes the rating and displays that many stars.
       If number is a float, round to the .5 - may not be necessary for the Yelp API.
    */
  const displayRating = (item) => {
    const max = item
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

  // Take the price value and display as the dollar signs
  const displayPrice = (item, key) => {
    const price = item
    const prices = []
    if (price != null) {
      prices.push(<span key={key}>Price: </span>)
      for (let i = 0; i < price.length; i++) {
        prices.push(<FaDollarSign color='green' />)
      }
    }
    return prices
  }

  // Take the address and display it along with the icon
  const displayAddress = (item, key) => {
    const addresses = []
    addresses.push(<MdLocationOn color='#e53935' />)
    // Sometimes address1 doesn't exist, so only push it if it exists
    if (item.address1 && item.address1 !== '') {
      addresses.push(` ${item.address1}, `)
    }
    addresses.push(` ${item.city}, ${item.state} ${item.zip_code}`)
    return addresses
  }

  // Map function to loop through the array of items and displays a card for each restaurant
  // Item - restaurant
  // Key - index
  const Restaurants = props.restaurantsList.map((item, key) =>
    <Card key={key} className='card-margin' height='300'>
      <Card.Img variant='top' src={item.image_url} height='250' />
      <Card.Body style={{
        height: '240'
      }}
      >
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>
          {displayAddress(item.location)}
        </Card.Text>
        <Card.Text>{displayPrice(item.price, key)}</Card.Text>
        <Card.Text>Rating: {displayRating(item.rating)}</Card.Text>
        <Card.Text><MdLocalPhone color='#e53935' />&nbsp;<a href={`tel:${item.phone}`}>{item.display_phone}</a></Card.Text>
      </Card.Body>
      {/* Make sure that the button will align
                to the bottom and won't cover up phone number */}
      <Button
        onClick={
          () => {
            restaurantDetails(item)
          }
        } variant='success' style={{
          margin: '4px'
        }}
      >More information
      </Button>
    </Card>
  )

  return (
    <div>
      <br />
      <Container>
        {/* Center row */}
        <Row className='justify-content-md-center'>
          {/* The cards that will display the restaurant information */}
          {Restaurants}
        </Row>
      </Container>
    </div>
  )
}

export default SearchResults
