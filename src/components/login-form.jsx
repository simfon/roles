/* eslint-disable jsx-a11y/media-has-caption */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Button, Form } from 'react-bootstrap';
import axios from 'axios';


class LoginForm extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      redirectTo: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    axios.post('/api/user/login', {
      username: this.state.username,
      password: this.state.password,
    })
      .then((response) => {
        if (response.status === 200) {
          // update App.js state
          this.props.handleUpdateUser({
            loggedIn: true,
            username: response.data.username,
          });
          // update the state to redirect to home
          this.setState({
            redirectTo: '/game',
          });
        }
      }).catch((error) => {
        // eslint-disable-next-line no-alert
        alert('login error', error);
      });
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />;
    }
    return (
      <main role="main" className="container-fluid">
        <div className="pseudoHeader">
          <div className="overlay" />
          <video playsInline="playsinline" autoPlay="autoplay" muted="muted" loop="loop" poster={`${process.env.PUBLIC_URL}/img/poster.png`}>
            <source src={`${process.env.PUBLIC_URL}/webm/fire.webm`} type="video/mp4" />
          </video>
          <div className="container h-70">
            <div className="d-flex h-100 text-center align-items-center">
              <div className="w-100 text-white">
                <Container className="col-sm-5">
                  <h4>Login</h4>
                  <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="username">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        autoFocus
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        placeholder="(email)"
                        name="username"
                        autoComplete="username"
                      />
                    </Form.Group>
                    <Form.Group controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        value={this.state.password}
                        onChange={this.handleChange}
                        type="password"
                        name="password"
                        autoComplete="current-password"
                      />
                    </Form.Group>
                    <Button
                      block
                      variant="secondary"
                      type="submit"
                    >
                      {'Login'}
                    </Button>
                  </Form>
                </Container>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default LoginForm;
