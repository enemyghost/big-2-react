import React, { PureComponent } from 'react';
import ReactSVG from 'react-svg';
import './playerArea.css';

class PlayingCard extends PureComponent {
  clickCard(card, e) {
    e.preventDefault();
    this.props.handleClick(card, e);
  }

  render() {
    let cardClass = this.props.card.selected
      ? "cardSelected"
      : this.props.card.winner
        ? "lastWinnerHand"
        : "cardUnselected";
    return (
      <div className={"cardContainer "  + cardClass}>
        <ReactSVG
            path={"../card/" + this.props.card.rank.symbol + this.props.card.suit.abbreviation.toUpperCase() + ".svg"}
            alt={this.props.card.rank.symbol + this.props.card.suit.symbol}
            svgStyle={{ width: 100, height: 140 }}
            svgClassName={cardClass}
            onClick={(e) => this.clickCard(this.props.card, e)}
            />
      </div>
    );
  }
}

export default PlayingCard;
