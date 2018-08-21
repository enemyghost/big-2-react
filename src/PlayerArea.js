import React, { Component } from 'react';
import PlayerHand from './PlayerHand';
import './playerArea.css';

class PlayerArea extends Component {
  render() {
    let navBar = this.props.canPlay
      ? <div>
          <button className="actionButton" onClick={(e) => this.props.onPlay(e)}>Play</button>
          <button className="actionButton" onClick={(e) => this.props.onPass(e)}>Pass</button>
          <h4>It is your turn.</h4>
        </div>
      : <div />
    return (
      <div className="playerContainer">
        <PlayerHand cards={this.props.handView.cards} onSelected={(card, e) => this.props.onSelected(card, e)}/>
        <h4>{this.props.handView.player.name}</h4>
        {navBar}
      </div>
    );
  }
}

export default PlayerArea;
