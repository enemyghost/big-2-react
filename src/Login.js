import React, { Component } from 'react';
import axios from 'axios';
import constants from './constants';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import "./login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      displayName: '',
      password: '',
      confirmPassword: '',
      message: '',
      redirectToReferrer: false
    };
  }

  validateForm() {
    if (this.props.newUser) {
      return this.state.password === this.state.confirmPassword
        && this.state.password.length >= 6
        && this.state.displayName.length >= 4
        && this.state.displayName.length <= 20
        && this.validateEmail(this.state.email);
    } else {
      return this.state.password.length >= 6
        && this.validateEmail(this.state.email);
    }
  }

  validateEmail(email) {
    return (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.password.length < 6) {
      this.setState({ message: "Password must be at least 6 chars" });
      return;
    } else if (!this.validateEmail(this.state.email)) {
      this.setState({ message: "E-mail must be a valid e-mail address" });
      return;
    }

    if (this.props.newUser) {
      // validate and register
      if (this.state.password !== this.state.confirmPassword) {
        this.setState({ message: "Confirmation password does not match password." });
        return;
      } else if (this.state.displayName.length < 4 || this.state.displayName.length > 10) {
        this.setState({ message: "Display Name must be 4-20 chars" });
        return;
      }

      this.login("/auth/register");
    } else {
      this.login("/auth/login");
    }
    this.setState({ message: "" });
  }

  login(path) {
    axios.create({
      withCredentials: true
    })
    .post(constants.hostname + path, {
      userName: this.state.email,
      password: this.state.password,
      displayName: this.state.displayName
    })
    .then(response => {
      window.localStorage.setItem(constants.TOKEN_LOCALSTORAGE_NAME, response.data.token);
      this.setState({ redirectToReferrer: true });
     })
     .catch(error => {
       this.setState({ message: "Failed to log in, try again" });
     });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  render() {
    let { from } = this.props || { from: { pathname: "/games" } };
    let { redirectToReferrer } = this.state;

    if (redirectToReferrer) return (<Redirect to={from} />);

    return (
      <div className="Login">
        <div className="text-center">
          <h2>{this.props.newUser ? "Register" : "Login"}</h2>
          {
            !this.props.newUser
            ? <div><Link to={{pathname: "/register", state: { from: from }}} className="small">Register</Link></div>
            : <div><Link to="/login" className="small">Already registered?</Link></div>
          }
        </div>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          {
            this.props.newUser
            ? (
              <FormGroup controlId="displayName" bsSize="large">
                <ControlLabel>Display Name</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.displayName}
                  onChange={this.handleChange}
                />
              </FormGroup>)
            : <div />
          }
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          {
            this.props.newUser
            ? (
              <FormGroup controlId="confirmPassword" bsSize="large">
                <ControlLabel>Confirm Password</ControlLabel>
                <FormControl
                  value={this.state.confirmPassword}
                  onChange={this.handleChange}
                  type="password"
                />
              </FormGroup>)
            : <div />
          }
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    );
  }
}

export default Login;
