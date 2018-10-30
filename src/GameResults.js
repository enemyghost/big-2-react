import React, { Component } from 'react';
import PlayerHand from './PlayerHand';

class GameResults extends Component {
  render() {
    let hands = this.props.finalState.handViews.sort((a, b) => {
      return a.cards.length - b.cards.length;
    }).map((handView, idx) => {
      let winner = handView.cards.length === 0;
      let hand = winner ? this.props.finalState.lastPlays[0].hand : handView.cards;
      if (winner) {
        hand.forEach((card) => card.selected = true);
      }
      return (<div key={handView.player.name + idx}>
        <h1>{handView.player.name + (winner ? " wins." : "")}</h1>
        <PlayerHand cards={hand} onSelected={(card, e) => { }}/>
      </div>)
    });
    return (<div className="resultsPanel">
      {hands}
    </div>)
  };
}

export default GameResults;
