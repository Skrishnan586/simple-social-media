import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./login.module.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  clickLogin = () => {
    console.log("ada");
    this.props.history.push("/chat");
  };

  submitted = (e) => {
    e.preventDefault();
  };

  render() {
    return (
      <form onSubmit={this.submitted}>
        <div class="container">
          <label for="uname">
            <b>Username</b>
          </label>
          <input type="text" placeholder="Enter Username" name="uname" />

          <label for="psw">
            <b>Password</b>
          </label>
          <input type="password" placeholder="Enter Password" name="psw" />

          <button
            className="button__login"
            type="submit"
            onClick={this.clickLogin}
          >
            Login
          </button>
        </div>

        <div class="container" style={{ backgroundColor: "#f1f1f1" }}>
          <button className="cancelbtn" type="button">
            Register
          </button>
        </div>
      </form>
    );
  }
}
