import React, { Component } from 'react';
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import './playerArea.css';

class Lobby extends Component {
  render() {
    let playerData = this.props.gameView.handViews.map((handView) =>
     {
       return {
        id: handView.player.id,
        name: handView.player.name
      };
    });

    let lobby = (
      <BootstrapTable data={ playerData } keyField='id' tableContainerClass="text-center lobbyTable">
        <TableHeaderColumn dataField='name'>Players</TableHeaderColumn>
      </BootstrapTable>);

    let buttonContent =
        <div className="lobbyContent">{"You're the only one here. Waiting for players to join, share the link with your friends."}</div>

    if (!this.props.gameView.handViews.some((view) => view.player.id === this.props.gameView.gameViewOwner.id)) {
      buttonContent =
            <button className="lobbyContent lobbyButton" onClick={this.props.joinGame}>Join Game</button>;
    } else if (this.props.gameView.handViews.length >= 2) {
      buttonContent = (<div className="lobbyContent">
          <div>{this.props.gameView.handViews.length + " players in the game. Waiting for players to join..."}</div>
          <button className="lobbyButton" onClick={this.props.startGame}>Start Game</button>
        </div>);
    }

    return (
      <div className="text-center">
        <h1>Game Lobby</h1>
        {lobby}
        {buttonContent}
      </div>);
  }
}

export default Lobby;
