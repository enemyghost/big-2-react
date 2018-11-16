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
          <Col><ReactSVG path="../card/back.svg" svgStyle={{ width: 100, height: 140 }}/></Col>
        </Row>
        <Row>
          <Col xsAuto>
              <div className={"cardCount" + activeClassName}>
                  {playerName} ({this.props.handView.cardCount}) {this.props.handView.nextToPlay ? "🤔" : ""}</div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default OpponentArea;
