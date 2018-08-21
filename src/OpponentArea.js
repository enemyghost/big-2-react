import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import './playerArea.css';

class OpponentArea extends Component {
  render() {
    let opponentClassName = "opponent" + this.props.opponentNumber;
    let dealerDiv = this.props.handView.player.dealer ? <div>"(Dealer)"</div> : <div />;
    return (
      <div className={"oppenentContainer " + opponentClassName}>
        <ReactSVG path="../card/back.svg" svgStyle={{ width: 100, height: 140 }}/>
        <div className="nameContainer">{this.props.handView.player.name}</div>
        {dealerDiv}
        <div>({this.props.handView.cardCount})</div>
      </div>
    );
  }
}

export default OpponentArea;
