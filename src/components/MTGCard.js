import React, { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import CardDataService from '../services/CardService';
import { useParams } from "react-router-dom";
import "./MyStyles.css";
import { Container } from "react-bootstrap";


const MTGCard = () => {
    let params = useParams();
    const [card, setCard] = useState({
        id: null,
        name: "",
        imageurl: "",
        purchaseurl: "" 

    });

    useEffect(() => {
      const getCard = id => {
        CardDataService.getCardByID(id)
        .then(response => {
          setCard({
            id: response.data._id,
            name: response.data.name,
            imageurl: response.data.image_uris.normal,
            purchaseurl: response.data.purchase_uris.cardhoarder
          });
        })
        .catch( e => {
          console.log(e);
        });
      }

      getCard(params.id);
    }, [params.id]);
    
    return (
      <Container className="cardSize">
        <Card className="deckCard">
          <Card.Body>
            <Card.Title>{ card.name }</Card.Title>
            <Card.Img src={card.imageurl} />
            <Button className="m-2" href={card.purchaseurl} target="_blank" variant="primary">Purchase Now</Button>
          </Card.Body>
        </Card>
      </Container>
    )
}

export default MTGCard;