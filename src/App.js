import React, { Component } from 'react';
import Table from './Table';
import Login from './Login';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Leaderboard from './Leaderboard';
import axios from 'axios';
import constants from './constants';
import hasValidAuthToken from './HasValidAuthToken';

class App extends Component {
  newGame(e) {
    e.preventDefault();
    axios.create({
          withCredentials: true,
          headers: { 'Authorization': 'Bearer ' + window.localStorage.getItem(constants.TOKEN_LOCALSTORAGE_NAME) }
        })
      .post(constants.hostname +"/games/")
      .then(response => window.location.href ="/games/" + response.data)
  }

  render() {
    return (
      <Router>
        <div>
          <Route path="/login/" exact render={(m) => <Login newUser={false} from={m.location.state === undefined ? undefined : m.location.state.from}/> } />
          <Route path="/register/" exact render={(m) => <Login newUser={true} from={m.location.state === undefined ? undefined : m.location.state.from}/> } />
          <PrivateRoute path="/games/" exact render={() =>
              (<button className="actionButton" onClick={(e) => this.newGame(e)}>Create New Game</button>)} />
          <PrivateRoute path="/games/:gameId" exact render={ props =>(<Table gameId={props.match.params.gameId}/>) } />
          <PrivateRoute path="/leaderboard" exact render={ props => (<Leaderboard />)} />
        </div>
      </Router>
    );
  }
};

const PrivateRoute = ({ render: renderFunc, ...rest }) => {
  return (
    <Route
      {...rest}
      render = {
        hasValidAuthToken()
              ? renderFunc
              : (props) => {
                  return (<Redirect to={{ pathname: '/login', state: { from: props.location } }} />);
              }
      }
    />
  )
};

export default App;
