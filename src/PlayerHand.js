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
      <div className="handContainer">
        {listItems}
        <div className={playerClassName}>{this.props.playerName}{this.props.canPlay ? ", it is your turn" : ""}</div>
      </div>
    );
  }
}

export default PlayerHand;
