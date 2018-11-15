import React, { Component } from 'react';
import { Button, Grid, Row, Col } from "react-bootstrap";
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
      <Grid>
        <Row>
          <Col>
            {listItems}
          </Col>
        </Row>
        <Row>
          <Col className={playerClassName}>{this.props.playerName}{this.props.canPlay ? ", it is your turn" : ""}</Col>
        </Row>
      </Grid>
    );
  }
}

export default PlayerHand;
