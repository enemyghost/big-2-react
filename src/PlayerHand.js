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
    return (
      <div className="handContainer">
        {listItems}
      </div>
    );
  }
}

export default PlayerHand;
