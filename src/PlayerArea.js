import React, { Component } from 'react';
import PlayerHand from './PlayerHand';
import './playerArea.css';

class PlayerArea extends Component {
  render() {
    let navBar = this.props.canPlay
      ? <div className="navigation">
          <button className="actionButton passButton" onClick={(e) => this.props.onPass(e)}>Pass</button>
          <button className="actionButton playButton" onClick={(e) => this.props.onPlay(e)}>Play</button>
        </div>
      : <div />
    return (
      <div className="playerContainer">
        <PlayerHand
            cards={this.props.handView.cards}
            playerName={this.props.handView.player.name}
            canPlay={this.props.canPlay}
            onSelected={(card, e) => this.props.onSelected(card, e)}/>
        {navBar}
      </div>
    );
  }
}

export default PlayerArea;
