import React, { Component } from 'react';
import { Grid, Row, Col } from "react-bootstrap";
import ReactSVG from 'react-svg';
import './playerArea.css';

class OpponentArea extends Component {
  render() {
    let activeClassName = this.props.handView.nextToPlay ? " active" : "";
    let playerName = this.props.handView.player.name.length > 10
        ? this.props.handView.player.name.substring(0, 10) + "..."
        : this.props.handView.player.name;

    return (
      <Grid>
        <Row>
          <Col>
            <div className="opponentHandContainer">
              <div className="opponentCardCount opponentCard">
                {this.props.handView.cardCount}<br />
                {this.props.handView.nextToPlay ? "🤔" : ""}
              </div>
              <div className="opponentCardCount">
                <ReactSVG path="../card/back.svg" svgStyle={{ width: 100, height: 140 }}/>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
              <div className={"cardCount" + activeClassName}>{playerName}</div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default OpponentArea;
