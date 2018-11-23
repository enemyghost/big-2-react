import React, { Component } from 'react';
import { Button } from "react-bootstrap";
import PlayerHand from './PlayerHand';

class GameResults extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let hands = this.props.finalState.handViews.sort((a, b) => {
      return a.cards.length - b.cards.length;
    }).map((handView, idx) => {
      let winner = handView.cards.length === 0;
      let hand = winner ? this.props.finalState.lastPlays[0].hand : handView.cards;
      if (winner) {
        hand.forEach((card) => card.winner = true);
      }
      let newGameMessage = this.props.timer !== -1
          ? "New game starting in " + this.props.timer + " seconds."
          : "";
      let score = this.props.finalState.scores[handView.player.id];
      return (<div key={handView.player.name + idx}>
        <h1>{handView.player.name + (winner ? " wins +" + score + ". " + newGameMessage : " " + score)}{
          (winner
            && handView.player.id === this.props.finalState.gameViewOwner.id
            && this.props.timer === -1)
            ? <Button className="newGameButton" bsSize="large" onClick={this.props.startNewGame}>Deal</Button>
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
