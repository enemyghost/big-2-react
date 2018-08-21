import React, { Component } from 'react';
import PlayerArea from './PlayerArea';
import PlayerHand from './PlayerHand';
import OpponentArea from './OpponentArea';
import GameResults from './GameResults';
import './playerArea.css';
import axios from 'axios';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameView: {
        gameState: "WAITING_FOR_PLAYERS",
        gameViewOwner: { },
        handViews: [ ],
        lastPlays: [ ]
      },
      selectedCards: []
    }
    this.fetchGameView = this.fetchGameView.bind(this);
    this.currentPlayerHand = this.currentPlayerHand.bind(this);
    this.updateGameState = this.updateGameState.bind(this);
  }

  toggleSelected(card, e) {
    e.preventDefault();
    let gameView = this.state.gameView;
    let cards = this.currentPlayerHand(gameView).cards;
    let myCard = cards.find(c => c.rank.rank === card.rank.rank && c.suit.symbol === card.suit.symbol)
    let selected = !myCard.selected;
    let selectedCards = this.state.selectedCards;
    if (!selected) {
      let selectedCard = selectedCards.find(c => c.rank.rank === myCard.rank.rank && c.suit.symbol === myCard.suit.symbol);
      if (selectedCard !== undefined) {
        selectedCards.splice(selectedCards.indexOf(selectedCard), 1);
      }
    }
    myCard.selected = selected;
    if (selected) {
      selectedCards.push(myCard);
    }

    this.setState({
      gameView: gameView,
      selectedCards: selectedCards
    });
  }

  onPlay(e) {
    e.preventDefault();
    let handView = this.currentPlayerHand(this.state.gameView);
    let selectedCards = handView.cards.filter((card) => card.selected);
    if (selectedCards.length > 0 && selectedCards.length <= 5) {
      axios.create({
          withCredentials: true
        })
        .post("https://arcane-forest-67352.herokuapp.com/v1/games/" + this.props.gameId + "/plays", selectedCards)
        .then(response => { this.updateGameState(response.data) });
    }
  }

  onPass(e) {
    e.preventDefault();
    axios.create({
        withCredentials: true
      })
      .post("https://arcane-forest-67352.herokuapp.com/v1/games/" + this.props.gameId + "/plays", [])
      .then(response => { this.updateGameState(response.data) });
  }

  joinGame(e) {
    e.preventDefault();

    if (this.currentPlayerHand(this.state.gameView) === undefined) {
      axios.create({
          withCredentials: true
        })
        .post("https://arcane-forest-67352.herokuapp.com/v1/games/" + this.props.gameId + "/players")
        .then(response => { this.updateGameState(response.data) });
    }
  }

  startGame(e) {
    e.preventDefault();

    axios.create({
      withCredentials: true
    })
    .post("https://arcane-forest-67352.herokuapp.com/v1/games/" + this.props.gameId + "/status/START")
    .then(response => { this.updateGameState(response.data) });
  }

  fetchGameView() {
    if (!this.isGameOver(this.state.gameView) && !this.isMyTurn(this.state.gameView)) {
      axios.create({
          withCredentials: true
        })
        .get("https://arcane-forest-67352.herokuapp.com/v1/games/" + this.props.gameId)
        .then(response => this.updateGameState(response.data));
    }
  }

  updateGameState(newState) {
    let gameView = newState;
    let handView = this.currentPlayerHand(gameView);
    let previouslySelected = this.state.selectedCards;
    if (handView !== undefined) {
      handView.cards.forEach(card => {
        if (previouslySelected.find(c => c.rank.rank === card.rank.rank && c.suit.symbol === card.suit.symbol) !== undefined) {
          card.selected = true;
        }
      })
    }
    this.setState({ gameView: gameView });
  }

  componentDidMount() {
    this.fetchGameView();
    setInterval(this.fetchGameView, 2500);
  }

  currentPlayerHand(gameView) {
    return gameView.handViews.find((view) => view.player.id === gameView.gameViewOwner.id);
  }

  opponentHands(gameView) {
    return gameView.handViews.filter((view) => view.player.id !== gameView.gameViewOwner.id);
  }

  isMyTurn(gameView) {
    return gameView.nextToPlay !== undefined
        && gameView.nextToPlay != null
        && gameView.nextToPlay.id === gameView.gameViewOwner.id;
  }

  isGameOver(gameView) {
    return gameView.gameState === "COMPLETED";
  }

  render() {
    if (this.state.gameView.gameState === "WAITING_FOR_PLAYERS") {
      if (this.currentPlayerHand(this.state.gameView) === undefined) {
        return (<button onClick={(e) => this.joinGame(e)}>Join Game</button>);
      } else if (this.state.gameView.handViews.length >= 2) {
        return (
          <div>
            <div>{this.state.gameView.handViews.length + " players in the game. Waiting for players to join..."}</div>
            <button onClick={(e) => this.startGame(e)}>Start Game</button>
          </div>);
      } else {
        return (
          <div>
            <div>{"You're the only one here. Waiting for players to join, share the link with your friends."}</div>
          </div>
        );
      }
    } else if (this.isGameOver(this.state.gameView)) {
      return (<GameResults finalState={this.state.gameView} />);
    }

    let indexMapThreePlayers = {
      0: [1, 2],
      1: [2, 0],
      2: [0, 1]
    }

    let indexMapFourPlayers = {
      0: [1, 2, 3],
      1: [2, 3, 0],
      2: [3, 0, 1],
      3: [0, 1, 2]
    }

    let currentPlayerId = this.state.gameView.gameViewOwner.id;
    let currentHand = this.currentPlayerHand(this.state.gameView);
    let opponentHands = this.opponentHands(this.state.gameView);
    let opponentOpposite = <div />;
    let opponentLeft = <div />;
    let opponentRight = <div />;
    if (opponentHands.length === 1) {
      opponentOpposite = <OpponentArea key={opponentHands[0].player.id} handView={opponentHands[0]} opponentNumber={1} />;
    } else if (opponentHands.length === 2) {
      let myHandIndex = this.state.gameView.handViews.indexOf(currentHand);
      let indexOrder = indexMapThreePlayers[myHandIndex];
      let handView0 = this.state.gameView.handViews[indexOrder[0]];
      opponentLeft = <OpponentArea key={handView0.player.id} handView={handView0} opponentNumber={1} />;
      let handView1 = this.state.gameView.handViews[indexOrder[1]];
      opponentOpposite = <OpponentArea key={handView1.player.id} handView={handView1} opponentNumber={2} />;
    } else if (opponentHands.length === 3) {
      let myHandIndex = this.state.gameView.handViews.indexOf(currentHand);
      let indexOrder = indexMapFourPlayers[myHandIndex];
      let handView0 = this.state.gameView.handViews[indexOrder[0]];
      opponentLeft = <OpponentArea key={handView0.player.id} handView={handView0} opponentNumber={1} />;
      let handView1 = this.state.gameView.handViews[indexOrder[1]];
      opponentOpposite = <OpponentArea key={handView1.player.id} handView={handView1} opponentNumber={2} />;
      let handView2 = this.state.gameView.handViews[indexOrder[2]];
      opponentRight = <OpponentArea key={handView2.player.id} handView={handView2} opponentNumber={3} />;
    }

    let lastPlay = this.state.gameView.lastPlays.length > 0
      ? <PlayerHand
          cards={this.state.gameView.lastPlays[0].hand}
          onSelected={(e) => {} }/>
      : <div />;

    return (
      <div className="tableContainer">
        <table width="800px" height="600px">
          <tbody>
            <tr>
              <td className="cardCell outsideCell"></td>
              <td className="cardCell">{opponentOpposite}</td>
              <td className="cardCell outsideCell"></td>
            </tr>
            <tr>
              <td className="cardCell outsideCell">{opponentLeft}</td>
              <td className="cardCell">{lastPlay}</td>
              <td className="cardCell outsideCell">{opponentRight}</td>
            </tr>
            <tr>
              <td className="cardCell outsideCell"></td>
              <td className="cardCell">
                <PlayerArea
                  handView={currentHand}
                  onSelected={(card, e) => this.toggleSelected(card, e)}
                  onPlay={(e) => this.onPlay(e)}
                  onPass={(e) => this.onPass(e)}
                  canPlay={this.state.gameView.gameState !== "COMPLETED" &&
                        this.state.gameView.nextToPlay.id === currentPlayerId}
                />
              </td>
              <td className="cardCell outsideCell"></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
