import React, { Component } from 'react';
import Table from './Table';
import Login from './Login';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios';
import constants from './constants';
import hasValidAuthToken from './HasValidAuthToken';

class App extends Component {
  newGame(e) {
    e.preventDefault();
    axios.create({
          withCredentials: true,
          headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem(constants.TOKEN_LOCALSTORAGE_NAME) }
        })
      .post(constants.hostname +"/games/")
      .then(response => window.location.href ="/games/" + response.data)
  }

  render() {
    return (
      <Router>
        <div>
          <Route path="/login/" exact render={() => <Login newUser={false}/> } />
          <Route path="/register/" exact render={() => <Login newUser={true}/> } />
          <Route path="/games/" exact render={() =>
              (<button className="actionButton" onClick={(e) => this.newGame(e)}>Create New Game</button>)} />
          <Route path="/games/:gameId" exact render ={ (match) => <Table gameId={match.params.gameId} /> } />
        </div>
      </Router>
    );
  }
}

export default App;
