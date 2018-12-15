import React, { Component } from 'react';
import './playerArea.css';

class HandHistory extends Component {
  render() {
    let handHistory = this.props.lastPlays.map(play =>
      (<tr>
        <td className="historyPlayer">
          {play.player.name}
        </td>
        <td className="historyPlay">
          {
            (play.hand.length === 0)
              ? "pass"
              : play.hand.map(card => card.rank.symbol + card.suit.symbol).join(" ")
          }
        </td>
        </tr>)
    );
    return (
      <div className="historyParent">
        <div className="historyHeader">Hand History</div>
        <table className="historyArea">
          <tbody>
            {handHistory}
          </tbody>
        </table>
      </div>
    );
  }
}

export default HandHistory;
