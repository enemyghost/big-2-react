import React, { Component } from 'react';
import PlayingCard from './PlayingCard';
import './playerArea.css';

class PlayerHand extends Component {
  render() {
    const listItems = this.props.cards.map((card) =>
      <PlayingCard
        key={card.rank.symbol + card.suit.abbreviation.toUpperCase()}
        card={card}
        handleClick={(card, e) => this.props.onSelected(card, e)} />
    );
    let playerClassName = this.props.played
      ? "playedHand"
      : "playerHand";

    return (
      <div className="myHandRow">
        <div>
          {listItems}
        </div>
        <div className={playerClassName}>
          {this.props.playerName} {this.props.played || this.props.endOfGame ? "" : "(" + this.props.cards.length + ")"} {this.props.canPlay ? ", it's your turn" : ""}
        </div>
      </div>
    );
  }
}

export default PlayerHand;
