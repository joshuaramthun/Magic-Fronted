import React, { useState, useCallback, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import DecksDataService from "../services/DecksService";
import { useNavigate } from "react-router-dom";
import "./MyStyles.css";
import { Image } from "react-bootstrap";

const DecksList = ({user}) => {
    const [decks, setDecks] = useState([]);
    const navigate = useNavigate();

    const retrieveDecks = useCallback(() => {
        if (user) {
            DecksDataService.getDecks(0, user.googleId) // TODO: change 0 to a page number
          .then(response => {
            setDecks(response.data.decks.map(deck => {
                return {
                    id: deck._id,
                    name: deck.deck_name,
                    userName: deck.user_name,
                    userId: deck.user_id,
                    date: deck.date,
                    cards: deck.cards,
                }
            }));
          })
          .catch(e => {
            console.log(e);
          });
        }
    }, [user]);

    useEffect(() => {
        retrieveDecks();
    }, [retrieveDecks]);

    const deleteDeck = useCallback((id) => {
        var data = {
            deck_id: id
        };
        DecksDataService.deleteDeck(data)
          .then(response => {
            setDecks(decks.filter(deck => deck.id !== id));
          })
          .catch(e => {
            console.log(e);
          });
    }, [decks]);


    return user === null 
        ? <div>Please sign in in order to see your decks</div>
        : 
        <Container>
              <Row>
                {
                    decks.map(deck => {
                        return (
                            <Card key={deck.id} className="p-2 m-2 deckcard">
                                { // if the deck is not empty, show first card as image
                                deck.cards.length !== 0 
                                    ? <Image src={deck.cards.at(0).imageurl.replace("small", "normal")} />
                                    : <Image src="/images/DeckPlaceholder.png" />
                                }
                                <Card.Title>{deck.name}</Card.Title>
                                <Stack>
                                    <Button 
                                        className="m-2" 
                                        href={deck.link} 
                                        variant="primary"
                                        onClick={() => navigate("/decks/" + deck.id)}>Open</Button>
                                    <Button 
                                        className="m-2" 
                                        variant="danger"
                                        onClick={() => deleteDeck(deck.id)}>Delete</Button>
                                </Stack>
                            </Card>
                        );
                    })
                }
            </Row>
            <Button 
                href="/decks/new" 
                variant="primary" 
                className="newdeckbutton">Add Deck</Button>
        </Container>
}

export default DecksList;