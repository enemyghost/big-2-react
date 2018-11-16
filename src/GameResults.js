import React, { Component } from 'react';
import { Button } from "react-bootstrap";
import PlayerHand from './PlayerHand';
import axios from 'axios';
import constants from './constants';
import { Redirect } from "react-router-dom";

class GameResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: -1
    }
  }
  startNewGame = (event) => {
    event.preventDefault();
    axios.create({
        withCredentials: true,
        headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem(constants.TOKEN_LOCALSTORAGE_NAME) }
      })
      .post(constants.hostname +"/games/" + this.props.finalState.gameId + "/newGame");
  }

  startTimer = () => {
    clearInterval(this.start);
    this.decrement = setInterval(this.decrementTimer, 1000);
    this.setState({ timer: 10 })
  }

  decrementTimer = () => {
    let newValue = this.state.timer - 1;
    this.setState({ timer: newValue });
  }

  render() {
    if (this.props.finalState.nextGameId !== null) {
      if (this.state.timer === -1) {
        this.start = setInterval(this.startTimer, 1000);
      } else if (this.state.timer === 0) {
        clearInterval(this.decrement);
        return <Redirect to={"/games/" + this.props.finalState.nextGameId} />
      }
    }

    let hands = this.props.finalState.handViews.sort((a, b) => {
      return a.cards.length - b.cards.length;
    }).map((handView, idx) => {
      let winner = handView.cards.length === 0;
      let hand = winner ? this.props.finalState.lastPlays[0].hand : handView.cards;
      if (winner) {
        hand.forEach((card) => card.winner = true);
      }
      let newGameMessage = this.state.timer !== -1
          ? "New game starting in " + this.state.timer + " seconds."
          : "";
      return (<div key={handView.player.name + idx}>
        <h1>{handView.player.name + (winner ? " wins. " + newGameMessage : "")}{
          (winner
            && handView.player.id === this.props.finalState.gameViewOwner.id
            && this.state.timer === -1)
            ? <Button className="newGameButton" bsSize="medium" onClick={this.startNewGame}>Deal</Button>
            : <div />
        }</h1>

        <PlayerHand cards={hand} onSelected={(card, e) => { }}/>
      </div>)
    });
    return (<div className="resultsPanel">
      {hands}
    </div>)
  };
}

export default GameResults;
