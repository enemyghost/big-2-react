import React, { Component } from 'react';
import Table from './Table';
import axios from 'axios';

class App extends Component {
  newGame(e) {
    e.preventDefault();
    axios.create({
          withCredentials: true
        })
      .post("https://arcane-forest-67352.herokuapp.com/v1/games/")
      .then(response => window.location.href ="/games/" + response.data)
  }

  render() {
    let pathParts = window.location.pathname.split("/");
    let gameId = pathParts[pathParts.length - 1]
    return (
      <div className="App">
        {
          gameId === "games"
          ? <button className="actionButton" onClick={(e) => this.newGame(e)}>Create New Game</button>
          : <Table gameId={gameId}/>
        }
      </div>
    );
  }
}

export default App;
