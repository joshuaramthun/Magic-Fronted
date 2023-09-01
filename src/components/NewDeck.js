import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from "react-bootstrap/Container";
import "./MyStyles.css";
import DecksDataService from "../services/DecksService";
import { useNavigate } from "react-router-dom";


const NewDeck = ({
    user
}) => {
    const [deckName, setDeckName] = useState("");
    const navigate = useNavigate();
    

    const onChangeDeckName = e => {
        const deckName = e.target.value;
        setDeckName(deckName);
    }

    const createDeck = async () => {
        const data = { 
            deck_name: deckName,
            user_name: user.name,
            user_id: user.googleId,
            cards: []
        }
 
        DecksDataService.createNewDeck(data).then(response => {
            navigate("/decks/" + response.data.response.insertedId);
        })
    }

    return user === null 
    ? <div>Not signed in</div>
    : (

        <Container className="newDeck">
            <Form>
                <Form.Group className="mb-3" controlId="temp">
                    <Form.Label>Enter Deck Name</Form.Label>
                    <Form.Control 
                        placeholder="Enter Deck Name"
                        type="text"
                        onChange={onChangeDeckName}/>
                </Form.Group>
                

                <Button onClick={createDeck} variant="primary" >
                    Submit
                </Button>
            </Form>
        </Container>

    )
}

export default NewDeck;