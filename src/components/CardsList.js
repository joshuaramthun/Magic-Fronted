import React, { useCallback, useEffect, useState } from "react";
import CardService from "../services/CardService.js";
import Card  from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Row from "react-bootstrap/Row";


const CardsList = () => {
    const [cards, setCards] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const retrieveCards = useCallback(() => {
        CardService.getAll(currentPage)
          .then(response => {
            setCards(response.data.cards.map(card => {
                return {
                    id: card._id,
                    name: card.name,
                    imageurl: card.image_uris.normal,
                    purchaseurl: card.purchase_uris.cardhoarder 
                }
            }));
          })
          .catch(e => {
            console.log(e);
          });
    }, [currentPage]);

    useEffect(() => {
        retrieveCards();
    }, [retrieveCards]);
    
    return (
        <Container>
            <Row>
            {
                cards.map(card => {
                    return (
                        <Card key={card.id} style={{ width: '18rem' }} className="m-2">
                            <Card.Body>
                            <Card.Title>{ card.name }</Card.Title>
                            <Card.Img src={card.imageurl} />
                            <Stack>
                                <Button 
                                    href={"/cards/" + card.id} 
                                    variant="primary"
                                    className="m-2">View
                                </Button>
                                <Button 
                                    href={card.purchaseurl} 
                                    target="_blank" 
                                    variant="primary"
                                    className="m-2">Purchase Now
                                </Button>
                            </Stack>
                            </Card.Body>
                        </Card>
                    )
                })
            }
            </Row>
            {
                currentPage === 0 ? null : 
                <Button
                variant="link"
                onClick={() => { setCurrentPage(currentPage - 1)} }
                >
                  Get previous 20 results
                </Button>
            }
            Showing page: { currentPage + 1}
            <Button
                  variant="link"
                  onClick={() => { setCurrentPage(currentPage + 1)} }
                  >
                    Get next 20 results
            </Button>
        </Container>
    )
}


export default CardsList;