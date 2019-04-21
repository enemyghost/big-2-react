import React, { Component } from 'react';
import { Grid, Row, Col } from "react-bootstrap";
import PlayerArea from './PlayerArea';
import PlayerHand from './PlayerHand';
import OpponentArea from './OpponentArea';
import GameResults from './GameResults';
import HandHistory from './HandHistory';
import Lobby from './Lobby';
import './playerArea.css';
import axios from 'axios';
import constants from './constants';
import SockJsClient from 'react-stomp';
import { Redirect } from "react-router-dom";

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
      selectedCards: [],
      timer: -1
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
        .then(response => {
          this.sendUpdate();
          this.updateGameState(response.data);
        });
    }
  }

  onPass(e) {
    e.preventDefault();
    axios.create({
        withCredentials: true,
        headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem(constants.TOKEN_LOCALSTORAGE_NAME) }
      })
      .post(constants.hostname +"/games/" + this.props.gameId + "/plays", [])
      .then(response => {
        this.sendUpdate();
        this.updateGameState(response.data);
      });
  }

  joinGame(e, isBot) {
    e.preventDefault();
    if (this.currentPlayerHand(this.state.gameView) === undefined || isBot) {
      axios.create({
          withCredentials: true,
          headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem(constants.TOKEN_LOCALSTORAGE_NAME) }
        })
        .post(constants.hostname +"/games/" + this.props.gameId + "/players" + (isBot ? "?isBot=true" : ""))
        .then(response => {
          this.sendUpdate();
          this.updateGameState(response.data);
        });
    }
  }

  startGame(e) {
    e.preventDefault();

    axios.create({
      withCredentials: true,
      headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem(constants.TOKEN_LOCALSTORAGE_NAME) }
    })
    .post(constants.hostname +"/games/" + this.props.gameId + "/status/START")
    .then(response => {
      this.sendUpdate();
      this.updateGameState(response.data);
    });
  }

  startNewGame = (event) => {
    event.preventDefault();
    axios.create({
        withCredentials: true,
        headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem(constants.TOKEN_LOCALSTORAGE_NAME) }
      })
      .post(constants.hostname +"/games/" + this.props.gameId + "/newGame")
      .then(response => {
        this.sendUpdate();
      });;
  }

  fetchGameView(gameId) {
    if (gameId === undefined) {
      gameId = this.props.gameId;
    }
    axios.create({
        withCredentials: true,
        headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem(constants.TOKEN_LOCALSTORAGE_NAME) }
      })
      .get(constants.hostname +"/games/" + gameId)
      .then(response => this.updateGameState(response.data));
  }

  updateGameState(newState) {
    let gameView = newState;
    let handView = this.currentPlayerHand(gameView);
    let previouslySelected = this.state.selectedCards;
    let newlySelected = [];
    if (this.props.gameId === gameView.gameId) {
      if (handView !== undefined) {
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
  }

  sendUpdate = (msg) => {
    if (this.clientRef !== undefined && this.clientRef.state.connected) {
      this.clientRef.sendMessage('/topics/games/' + this.props.gameId, msg);
    }
  }

  componentDidMount() {
    this.fetchGameView();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.gameId !== this.props.gameId) {
      this.fetchGameView(nextProps.gameId);
    }
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

  startTimer = () => {
    clearInterval(this.start);
    this.decrement = setInterval(this.decrementTimer, 1000);
    this.setState({ timer: 10 })
  }

  decrementTimer = () => {
    let newValue = this.state.timer - 1;
    if (newValue >= 0) {
      this.setState({ timer: newValue });
    } else {
      clearInterval(this.decrement);
      this.setState({ timer: -1})
    }
  }

  render() {
    if (this.state.gameView.nextGameId !== null) {
      if (this.state.timer === 0 && this.state.gameView.nextGameId !== this.props.gameId) {
        return (<Redirect to={"/games/" + this.state.gameView.nextGameId} />);
      } else if (this.state.timer === -1) {
        this.start = setInterval(this.startTimer, 1000);
      }
    }

    let socks = this.state.gameView.nextGameId === null
      ? <SockJsClient
          url={constants.hostname + "/games/push/" + this.props.gameId}
          headers={{ 'Authorization': 'Bearer ' + window.localStorage.getItem(constants.TOKEN_LOCALSTORAGE_NAME) }}
          topics={['/topics/games/' + this.props.gameId]}
          onMessage={ (msg) => { this.fetchGameView() }}
          debug={true}
          ref={ (client) => { this.clientRef = client }} />
      : <div />;
    if (this.state.gameView.gameState === "WAITING_FOR_PLAYERS") {
      return (<div>{socks}<Lobby gameView={this.state.gameView}
            joinGame={(e) => this.joinGame(e, false)}
            addBot={(e) => this.joinGame(e, true)}
            startGame={(e) => this.startGame(e)} /></div>);
    } else if (this.isGameOver(this.state.gameView)) {
      return (<div>
            {socks}
            <GameResults finalState={this.state.gameView} startNewGame={this.startNewGame} timer={this.state.timer}/>
          </div>);
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
            canPass={this.state.gameView.gameState !== "COMPLETED" &&
                  this.state.gameView.nextToPlay.id === currentPlayerId &&
                  this.state.gameView.lastPlays.length > 0}
          />
        : <OpponentArea key={handViews[0].player.id} handView={handViews[0]} opponentNumber={0} />;
    opponentLeft = <OpponentArea key={handViews[1].player.id} handView={handViews[1]} opponentNumber={1} />;
    if (handViews.length > 2) {
      opponentOpposite = <OpponentArea key={handViews[2].player.id} handView={handViews[2]} opponentNumber={2} />;
    }
    if (handViews.length > 3) {
      opponentRight = <OpponentArea key={handViews[3].player.id} handView={handViews[3]} opponentNumber={3} />;
    }

    let lastPlay = this.state.gameView.lastPlays.find((play) => play.hand.length > 0);
    let lastPlayElement = lastPlay !== undefined &&
        lastPlay.player.id !== this.state.gameView.nextToPlay.id
      ? <PlayerHand
          cards={lastPlay.hand}
          playerName={lastPlay.player.name}
          played={true}
          onSelected={(e) => {} }/>
      : <div className="handContainer" />;
    let handHistory = this.state.gameView.lastPlays.length > 0
      ? <HandHistory lastPlays={this.state.gameView.lastPlays} />
      : <div />;
    return (
      <Grid>
        <Row>
          {socks}
          <Col xs={2} className="gridCell">{opponentLeft}</Col>
          <Col xs={2} className="gridCell">{opponentOpposite}</Col>
          <Col xs={2} className="gridCell">{opponentRight}</Col>
        </Row>
        <Row>
          <Col xsOffset={2} xs={4} className="gridCell">{lastPlayElement}</Col>
        </Row>
        <Row>
          <Col className="myHand">{myHand}</Col>
        </Row>
        <Row>
          <Col xs={6} className="gridCell">
            {handHistory}
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Table;
