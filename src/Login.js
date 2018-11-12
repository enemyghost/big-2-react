import React, { Component } from 'react';
import axios from 'axios';
import constants from './constants';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', displayName: '', password: '', confirmPassword: '', message: '' };

    this.emailChanged = this.emailChanged.bind(this);
    this.displayNameChanged = this.displayNameChanged.bind(this);
    this.passwordChanged = this.passwordChanged.bind(this);
    this.passwordConfirmChanged = this.passwordConfirmChanged.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateEmail(email) {
    return (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email));
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.props.newUser) {
      // validate and register
      if (this.state.password !== this.state.confirmPassword) {
        this.setState({ message: "Confirmation password does not match password." });
        return;
      } else if (this.state.password.length < 6) {
        this.setState({ message: "Password must be at least 6 chars" });
        return;
      } else if (this.state.displayName.length < 4) {
        this.setState({ message: "Display Name must be at least 4 chars" });
        return;
      } else if (!this.validateEmail(this.state.email)) {
        this.setState({ message: "E-mail must be a valid e-mail address" });
        return;
      }

      axios.create({
        allowCredentials: true
      })
      .post(constants.hostname + "/auth/register", {
        userName: this.state.email,
        password: this.state.password,
        displayName: this.state.displayName
      })
      .then(response => {
        alert(response.data.token);
        window.localStorage.setItem(constants.TOKEN_LOCALSTORAGE_NAME, response.data.token);
        window.location.href ="/games/";
       })
       .catch(error => {
         this.setState({ message: "Failed to register new user, try again" });
       });
    } else {
      // Login
      axios.create({
        withCredentials: true
      })
      .post(constants.hostname + "/auth/login", {
        userName: this.state.email,
        password: this.state.password
      })
      .then(response => {
        window.localStorage.setItem(constants.TOKEN_LOCALSTORAGE_NAME, response.token);
        window.location.href ="/games/";
       })
       .catch(error => {
         this.setState({ message: "Failed to log in, try again" });
       });
    }
    this.setState({ message: "" });
  }

  emailChanged(event) {
    this.setState({ email: event.target.value });
  }

  displayNameChanged(event) {
    this.setState({ displayName: event.target.value });
  }

  passwordChanged(event) {
    this.setState({ password: event.target.value });
  }

  passwordConfirmChanged(event) {
    this.setState({ confirmPassword: event.target.value });
  }

  render() {
    return (
      <div>
        <h2>{this.props.newUser ? "Register New User" : "Login"}</h2>
        <form onSubmit={this.handleSubmit}>
          <table>
            <tbody>
            <tr>
              <td>
                <label>E-mail Address</label>
              </td>
              <td>
                <input type="text" value={this.state.email} onChange={this.emailChanged} />
              </td>
            </tr>
            {
              this.props.newUser
                ? (<tr>
                    <td>
                      <label>Display Name</label>
                    </td>
                    <td>
                      <input type="text" value={this.state.displayName} onChange={this.displayNameChanged} />
                    </td>
                  </tr>)
                : <div />
            }
            <tr>
              <td>
                <label>Password</label>
              </td>
              <td>
                <input type="password" value={this.state.password} onChange={this.passwordChanged} />
              </td>
            </tr>
            {
              this.props.newUser
                ? (<tr>
                    <td>
                      <label>Confirm Password</label>
                    </td>
                    <td>
                      <input type="password" value={this.state.confirmPassword} onChange={this.passwordConfirmChanged} />
                    </td>
                  </tr>)
                : <div />
            }
            <tr>
              <td colSpan="2">
                <input type="submit" value="Submit" />
              </td>
            </tr>
            </tbody>
          </table>
        </form>
        <div>
          {this.state.message}
        </div>
      </div>
    );
  }
}

export default Login;
