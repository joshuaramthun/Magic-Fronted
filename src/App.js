import { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import { Navbar, Nav } from "react-bootstrap";

import CardsList from "./components/CardsList";
import MTGCard from "./components/MTGCard";
import MTGDeck from "./components/Deck";
import DecksList from "./components/DecksList";
import NewDeck from "./components/NewDeck";

import './App.css';
import Login from "./components/Login";
import Logout from "./components/Logout";


function App() {

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const [user, setUser] = useState(null);
  useEffect(() => {
    let loginData = JSON.parse(localStorage.getItem("login"));
    if (loginData) {
      let loginExp = loginData.exp;
      let now = Date.now()/1000;
      if (now < loginExp) {
        // Not expired
        setUser(loginData);
      } else {
        // Expired
        localStorage.setItem("login", null);
      }
    }
  }, []);

  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="App">
        <Navbar bg="primary" expand="lg" sticky="top" variant="dark">
          <Container className="container-fluid">
            <Navbar.Brand href="/">
              
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link as={Link} to="/cards">
                  Cards
                </Nav.Link>
                {
                  // Display a link to deck
                  user ? (
                    <Nav.Link as={Link} to="/decks">
                      Decks
                    </Nav.Link>
                  ): null
                }
              </Nav>
            </Navbar.Collapse>
            { user ? (
                <Logout setUser={setUser} clientId={clientId}/>
              ) : (
                <Login setUser={setUser}/>
              )}
          </Container>
        </Navbar>

        <Routes>
          <Route exact path="/" element={
            <CardsList />}
          />
          <Route exact path="/cards" element={
            <CardsList />}
          />
          <Route exact path="/cards/:id" element={
            <MTGCard />}
          />
          <Route exact path="/decks" element={
            <DecksList user={user} />}
          />
          <Route exact path="/decks/:deck" element={
            <MTGDeck />}
          />
          <Route exact path="/decks/new" element={
            <NewDeck user={user}/>}
          />
        </Routes>
      </div>
    </GoogleOAuthProvider>
  );
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
