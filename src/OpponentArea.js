import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import './playerArea.css';

class OpponentArea extends Component {
  render() {
    let opponentClassName = " opponent" + this.props.opponentNumber;
    let activeClassName = this.props.handView.nextToPlay ? " active" : "";
    let waitingDiv = this.props.handView.nextToPlay ? <div className="cardCount">🤔</div> : <div />;
    return (
      <div className={"oppenentContainer" + opponentClassName + activeClassName}>
        <ReactSVG path="../card/back.svg" svgStyle={{ width: 100, height: 140 }}/>
        <div className={"cardCount" + activeClassName}>{this.props.handView.player.name} ({this.props.handView.cardCount})</div>
        {waitingDiv}
      </div>
    );
  }
}

export default OpponentArea;
