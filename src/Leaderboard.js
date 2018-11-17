import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import axios from 'axios';
import constants from './constants';
import './playerArea.css';

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaderboard: []
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

    return (
      <div className="text-center">
        <h1>Leaderboard</h1>
        <BootstrapTable data={ data } keyField='id' tableContainerClass="text-center leaderboardTable">
          <TableHeaderColumn dataField='name'>Player</TableHeaderColumn>
          <TableHeaderColumn dataField='score'>Score</TableHeaderColumn>
          <TableHeaderColumn dataField='gamesWon'>Games Won</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}

export default Leaderboard;
