import React, { Component } from 'react';
import { Grid, Row, Col } from "react-bootstrap";
import PlayerArea from './PlayerArea';
import PlayerHand from './PlayerHand';
import OpponentArea from './OpponentArea';
import GameResults from './GameResults';
import './playerArea.css';
import axios from 'axios';
import constants from './constants';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameView: {
        id: '',
        nextGameId: null,
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
          withCredentials: true,
          headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem(constants.TOKEN_LOCALSTORAGE_NAME) }
        })
        .post(constants.hostname +"/games/" + this.props.gameId + "/plays", selectedCards)
        .then(response => { this.updateGameState(response.data) });
    }
  }

  onPass(e) {
    e.preventDefault();
    axios.create({
        withCredentials: true,
        headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem(constants.TOKEN_LOCALSTORAGE_NAME) }
      })
      .post(constants.hostname +"/games/" + this.props.gameId + "/plays", [])
      .then(response => { this.updateGameState(response.data) });
  }

  joinGame(e) {
    e.preventDefault();

    if (this.currentPlayerHand(this.state.gameView) === undefined) {
      axios.create({
          withCredentials: true,
          headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem(constants.TOKEN_LOCALSTORAGE_NAME) }
        })
        .post(constants.hostname +"/games/" + this.props.gameId + "/players")
        .then(response => { this.updateGameState(response.data) });
    }
  }

  startGame(e) {
    e.preventDefault();

    axios.create({
      withCredentials: true,
      headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem(constants.TOKEN_LOCALSTORAGE_NAME) }
    })
    .post(constants.hostname +"/games/" + this.props.gameId + "/status/START")
    .then(response => { this.updateGameState(response.data) });
  }

  fetchGameView() {
    axios.create({
        withCredentials: true,
        headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem(constants.TOKEN_LOCALSTORAGE_NAME) }
      })
      .get(constants.hostname +"/games/" + this.props.gameId)
      .then(response => this.updateGameState(response.data));
  }

  updateGameState(newState) {
    let gameView = newState;
    let handView = this.currentPlayerHand(gameView);
    let previouslySelected = this.state.selectedCards;
    let newlySelected = [];
    if (handView !== undefined && this.state.gameView.id === gameView.id) {
      handView.cards.forEach(card => {
        if (previouslySelected.find(c => c.rank.rank === card.rank.rank && c.suit.symbol === card.suit.symbol) !== undefined) {
          card.selected = true;
          newlySelected.push(card);
        }
      })
    }
    this.setState({
      gameView: gameView,
      selectedCards: newlySelected
    });
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

    let currentPlayerId = this.state.gameView.gameViewOwner.id;
    let currentHand = this.currentPlayerHand(this.state.gameView);
    let handViews = this.state.gameView.handViews;
    handViews.sort((a, b) => a.position - b.position);
    let opponentOpposite = <div />;
    let opponentLeft = <div />;
    let opponentRight = <div />;
    let myHand = (currentHand !== undefined)
        ? <PlayerArea
            handView={handViews[0]}
            onSelected={(card, e) => this.toggleSelected(card, e)}
            onPlay={(e) => this.onPlay(e)}
            onPass={(e) => this.onPass(e)}
            canPlay={this.state.gameView.gameState !== "COMPLETED" &&
                  this.state.gameView.nextToPlay.id === currentPlayerId}
          />
        : <OpponentArea key={handViews[0].player.id} handView={handViews[0]} opponentNumber={0} />;
    opponentLeft = <OpponentArea key={handViews[1].player.id} handView={handViews[1]} opponentNumber={1} />;
    if (handViews.length > 2) {
      opponentOpposite = <OpponentArea key={handViews[2].player.id} handView={handViews[2]} opponentNumber={2} />;
    }
    if (handViews.length > 3) {
      opponentRight = <OpponentArea key={handViews[3].player.id} handView={handViews[3]} opponentNumber={3} />;
    }

    let lastPlay = this.state.gameView.lastPlays.length > 0
      ? <PlayerHand
          cards={this.state.gameView.lastPlays[0].hand}
          playerName={this.state.gameView.lastPlays[0].player.name}
          played={true}
          onSelected={(e) => {} }/>
      : <div className="handContainer" />;

    // let handHistory = this.state.gameView.lastPlays.length > 0
    //   ? <HandHistory lastHands={this.state.gameView.lastPlays} />
    //   : <div />;
    return (
      <Grid>
        <Row>
          <Col xs={2} className="gridCell">{opponentLeft}</Col>
          <Col xs={2} className="gridCell">{opponentOpposite}</Col>
          <Col xs={2} className="gridCell">{opponentRight}</Col>
        </Row>
        <Row>
          <Col xsOffset={2} className="gridCell">{lastPlay}</Col>
        </Row>
        <Row>
          <Col className="gridCell">{myHand}</Col>
        </Row>
      </Grid>
    );
  }
}

export default Table;
