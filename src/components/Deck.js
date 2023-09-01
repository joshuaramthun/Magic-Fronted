import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Stack, Card, Form, Button, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import DecksDataService from "../services/DecksService";
import CardsDataService from "../services/CardService";
import "./MyStyles.css";
import Image from 'react-bootstrap/Image';

import { useSprings, animated, to as interpolate } from '@react-spring/web'
import { useDrag } from 'react-use-gesture'

import styles from './styles.module.css'

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
})
const from = (_i) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s) =>
  `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

const AnimatedDeck = ({cards}) => {
  const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out
  const [props, api] = useSprings(cards.length, i => ({
    ...to(i),
    from: from(i),
  })) // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2 // If you flick hard enough it should trigger the card to fly out
    const dir = xDir < 0 ? -1 : 1 // Direction should either point left or right
    if (!down && trigger) gone.add(index) // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
    api.start(i => {
      if (index !== i) return // We're only interested in changing spring-data for the current spring
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
      const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0) // How much the card tilts, flicking it harder makes it rotate faster
      const scale = down ? 1.1 : 1 // Active cards lift up a bit
      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
      }
    })
    if (!down && gone.size === cards.length)
      setTimeout(() => {
        gone.clear()
        api.start(i => to(i))
      }, 600)
  })
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
    <>
      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div className={styles.deck} key={i} style={{ x, y }}>
          {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
          <animated.div
            {...bind(i)}
            style={{
              transform: interpolate([rot, scale], trans),
              backgroundImage: `url(${cards[i]})`,
            }}
          />
        </animated.div>
      ))}
    </>
  )
}


const MTGDeck = () => {
    const [deck, setDeck] = useState({});
    const params = useParams();
    const [cardName, setCardName] = useState("");

    const onSearchCardNameChange = e => {
        const cardName = e.target.value;
        setCardName(cardName);
    }

    const retrieveDeck = useCallback(() => {
        DecksDataService.getDeck(params.deck)
        .then(response => {
            let data = {
                id: response.data._id,
                name: response.data.deck_name,
                userName: response.data.user_name,
                userId: response.data.user_id,
                date: response.data.date,
                cards: response.data.cards
            }
            setDeck(data);
        })
        .catch(e => {
            console.log(e);
        }); 
    }, [params]);

    useEffect(() => {
        retrieveDeck();
    }, [retrieveDeck]);

    const addCardToDeck = () => {
        CardsDataService.getCardByName(cardName)
        .then(response => {
            const existingCardIndex = deck.cards.findIndex(card => card.name === response.data.name);

            if (existingCardIndex !== -1) {
                const newQuantity = parseInt(deck.cards[existingCardIndex].quantity) + 1;
                deck.cards[existingCardIndex].quantity = newQuantity;

                setDeck({
                    ...deck,
                    cards: deck.cards
                });

                let data = {
                    _id: deck.id,
                    deck_name: deck.name,
                    user_name: deck.userName,
                    user_id: deck.userId,
                    cards: deck.cards
                }
                DecksDataService.updateDeck(data);
            } else {
                const newCard = {
                    id: response.data._id,
                    name: response.data.name,
                    quantity: 1,
                    imageurl: response.data.image_uris.small
                };

                let newCards =  [...deck.cards, newCard];
    
                setDeck({
                    ...deck,
                    cards: newCards
                });

                let data = {
                    _id: deck.id,
                    deck_name: deck.name,
                    user_name: deck.userName,
                    user_id: deck.userId,
                    cards: newCards
                }
                DecksDataService.updateDeck(data);
            }
        })
        .catch(e => {
            console.log(e);
        }); 
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const addToQuantity = (card) => {

        const updatedCards = deck.cards.map(c => {
            if (c.id === card.id) {
                return { ...c, quantity: c.quantity + 1 };
            }
            return c;
        });
        
        const updatedDeck = {
            ...deck,
            cards: updatedCards
        };
        
        setDeck(updatedDeck);

        let data = {
            _id: deck.id,
            deck_name: deck.name,
            user_name: deck.userName,
            user_id: deck.userId,
            cards: updatedCards
        }
        DecksDataService.updateDeck(data);
    }

    const subtractFromQuantity = (card) => {

        const updatedCards = deck.cards.map(c => {
            if (c.id === card.id) {
                const newQuantity = c.quantity - 1;
                if (newQuantity <= 0) {
                    return null;
                }
                return { ...c, quantity: newQuantity };
            }
            return c;
        }).filter(Boolean);
        
        const updatedDeck = {
            ...deck,
            cards: updatedCards
        };
        
        setDeck(updatedDeck);

        let data = {
            _id: deck.id,
            deck_name: deck.name,
            user_name: deck.userName,
            user_id: deck.userId,
            cards: updatedCards
        }
        DecksDataService.updateDeck(data);
    }

    return (
        <Stack className="centerContainer">
            {deck.cards && deck.cards.length > 0 ?
                <div className={styles.container}>
                    <AnimatedDeck cards={shuffleArray(deck.cards.flatMap(card => 
                        Array.from({ length: card.quantity }, () => card.imageurl.replace("small", "normal"))))} /> 
                        
                </div>
            : null
            }

            <Card className="p-2 m-2 deckcard">
                <Card.Title>{deck.name}</Card.Title>

                <Form>
                    <Stack>
                        <Form.Group className="mb-3">
                                <Form.Control
                                type="text"
                                placeholder="Add card by title"
                                onChange={onSearchCardNameChange}
                                />
                        </Form.Group>
                        <Button
                        variant="primary"
                        type="button"
                        onClick={addCardToDeck}
                        >
                            Search
                        </Button>
                    </Stack>     
                </Form>
            </Card>

            {
                deck.cards && deck.cards.length > 0 ? 
                <Table striped bordered hover className="m-4">
                <thead>
                    <tr>
                        <th>Card</th>
                        <th>Image</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody >
                    { 
                        deck.cards.map(card => {
                            return <tr  key={card.id}>
                                <td><div >{card.name}</div></td>
                                <td><Image className="image" src={card.imageurl.replace("small", "normal")} /></td>
                                <td>
                                <Button className="m-2" onClick={() => subtractFromQuantity(card)}> - </Button>
                                    {card.quantity}
                                <Button className="m-2" onClick={() => addToQuantity(card)}> + </Button>
                                
                                </td>
                            </tr>
                        })      
                    }
                </tbody>
            </Table>
            : null
            }
            
        </Stack>
    )
}

export default MTGDeck;