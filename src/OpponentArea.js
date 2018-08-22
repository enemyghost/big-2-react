import React, { Component } from 'react';
import ReactSVG from 'react-svg';
import './playerArea.css';

class OpponentArea extends Component {
  constructor(props) {
    super(props)

    this.state = { wordToUse: "Thinking..." };
  }

  componentDidMount() {
    if (this.props.handView.nextToPlay) {
      let actions = [ "Whoring...", "Bathing...",
          "Wallowing...", "Tanning...", "Shitting...", "Lolling..." ];
      setTimeout(() => this.setState({ wordToUse: actions[Math.floor(Math.random() * actions.length)] }), 10000);
    } else {
      this.setState({ wordToUse: "Thinking..." });
    }
  }

  render() {
    let opponentClassName = " opponent" + this.props.opponentNumber;
    let activeClassName = this.props.handView.nextToPlay ? " active" : "";
    let waitingDiv = this.props.handView.nextToPlay
        ? <div className="dealer">{this.state.wordToUse}</div>
        : this.props.handView.dealer
            ? <div className="dealer">Dealer</div>
            : <div />;
    return (
      <div className={"oppenentContainer" + opponentClassName + activeClassName}>
        <ReactSVG path="../card/back.svg" svgStyle={{ width: 100, height: 140 }}/>
        <div className={"nameContainer" + activeClassName}>{this.props.handView.player.name}</div>
        {waitingDiv}
        <div>({this.props.handView.cardCount})</div>
      </div>
    );
  }
}

export default OpponentArea;
