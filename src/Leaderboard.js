import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Button } from "react-bootstrap";
import Iframe from 'react-iframe'
import axios from 'axios';
import constants from './constants';
import './playerArea.css';

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaderboard: [],
      live: true
    }
  }

  componentDidMount() {
    axios.create({
        withCredentials: true,
        headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem(constants.TOKEN_LOCALSTORAGE_NAME) }
      })
      .get(constants.hostname + "/leaderboard")
      .then(response => this.setState({leaderboard: response.data}));
  }

  toggleLive = (isLive) => {
    this.setState({live: isLive});
  }

  render() {
    let data = this.state.leaderboard.map((entry) =>
     {
       return {
        id: entry.player.id,
        name: entry.player.name,
        score: entry.score,
        gamesWon: entry.gamesWon
      };
    });

    let table = this.state.live
      ? <BootstrapTable data={ data } keyField='id' tableContainerClass="text-center leaderboardTable">
          <TableHeaderColumn dataField='name'>Player</TableHeaderColumn>
          <TableHeaderColumn dataField='score'>Score</TableHeaderColumn>
          <TableHeaderColumn dataField='gamesWon'>Games Won</TableHeaderColumn>
        </BootstrapTable>
      : <div>
          <Iframe url="https://datastudio.google.com/embed/reporting/8abca7c6-5c10-47b1-a3ce-d4c6f91bb0dc/page/sZSRB"
            width="80%"
            height="600px"
            id="chartFrame"
            display="inline"
            position="relative"
            frameBorder="0"
            className="chartFrame"
            allowFullScreen={true}/>
        </div>

    return (
      <div className="text-center">
        <h1>Leaderboard</h1>
          <div>
            <Button bsStyle="link" className={ "leaderboardButton" + (this.state.live ? " leaderboardButtonSelected" : "")}
              onClick={() => this.toggleLive(true)}>Live</Button>
            <Button bsStyle="link" className={ "leaderboardButton" + (!this.state.live ? " leaderboardButtonSelected" : "")}
              onClick={() => this.toggleLive(false)}>Detailed</Button>
          </div>
        {table}
        {!this.state.live ? <div> Detailed data is delayed up to 12 hours.</div> : <div/>}
      </div>
    );
  }
}

export default Leaderboard;
