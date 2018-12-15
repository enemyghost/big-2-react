import React, { Component } from 'react';
import PlayerHand from './PlayerHand';
import './playerArea.css';

class PlayerArea extends Component {
  render() {
    let navBar = this.props.canPlay
      ? <div className="navigation">
          {
            this.props.canPass
              ? <button className="actionButton passButton" onClick={(e) => this.props.onPass(e)}>Pass</button>
              : <button className="actionButton passButton" disabled onClick={(e) => this.props.onPass(e)}>Pass</button>
          }
             <button className="actionButton playButton" onClick={(e) => this.props.onPlay(e)}>Play</button>
        </div>
      : <div className="navigation" />
    return (
      <div>
        <div>
            <PlayerHand
                cards={this.props.handView.cards}
                playerName={this.props.handView.player.name}
                canPlay={this.props.canPlay}
                onSelected={(card, e) => this.props.onSelected(card, e)}/>
        </div>
        {navBar}
      </div>
    );
  }
}

export default PlayerArea;
