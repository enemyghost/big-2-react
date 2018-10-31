import React, { Component } from 'react';
import './playerArea.css';

class HandHistory extends Component {
  render() {
    let handHistory = this.props.lastHands.map(play =>
        <tr>
          <td>{play.player.name}</td>
          <td>{play.hand.map(card => card.rank.symbol + card.suit.symbol).join(" ")}</td>
        </tr>
    );
    return (
      <table>
        <tr className="historyHeader">Recent Plays</tr>
        {handHistory}
      </table>
    );
  }
}

export default HandHistory;
