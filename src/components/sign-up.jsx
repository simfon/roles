/* eslint-disable jsx-a11y/media-has-caption */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Container, Button, Form,
} from 'react-bootstrap';
import axios from 'axios';
import Alerts from './utils/Alerts';


class Signup extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      passwordtwo: '',
      privacyBox: false,
      // confirmPassword: '',
      redirectTo: null,
      alert: {
        s: false, // view status
        m: '', // message
        h: '', // header
        v: '', // bootstrap variant
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleCloseAlert = this.handleCloseAlert.bind(this);
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0
    && this.state.password === this.state.passwordtwo && this.state.privacyBox;
  }

  handleChange(event) {
    if (event.target.type === 'checkbox') {
      this.setState({
        [event.target.name]: event.target.checked,
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  }

  handleCloseAlert() {
    this.setState(() => ({
      alert: {
        s: false, // view status
        m: '', // message
        h: '', // header
        v: '', // bootstrap variant
      },
    }));
  }

  handleSubmit(event) {
    event.preventDefault();
    axios.post('/api/user/', {
      username: this.state.username,
      password: this.state.password,
      privacy: this.state.privacyBox,
    })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ // redirect to login page
            alert: {
              s: true,
              m: 'A breve riceverete una e-mail con le istruzioni per confermare il vostro account.',
              h: 'Registrazione Avvenuta',
              v: 'success',
            },
          });
        } else {
          throw new Error(response.status);
        }
      }).catch(() => {
        this.setState({ // redirect to login page
          alert: {
            s: true,
            m: 'Questa e-mail risulta già utilizzata.',
            h: 'Registrazione fallita',
            v: 'danger',
          },
        });
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
          <Alerts
            handleCloseAlert={this.handleCloseAlert}
            view={this.state.alert.s}
            message={this.state.alert.m}
            header={this.state.alert.h}
            variant={this.state.alert.v}
          />
          <video playsInline="playsinline" autoPlay="autoplay" muted="muted" loop="loop" poster={`${process.env.PUBLIC_URL}/img/poster.png`}>
            <source src={`${process.env.PUBLIC_URL}/webm/fire.webm`} type="video/mp4" />
          </video>
          <div className="container h-70">
            <div className="d-flex h-100 text-center align-items-center">
              <div className="w-100 text-white">
                <Container className="col-sm-5">
                  <h4>Registrati</h4>
                  <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="username">
                      <Form.Control
                        autoFocus
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        placeholder="Indirizzo e-mail"
                        name="username"
                        autoComplete="off"
                      />
                    </Form.Group>
                    <Form.Group controlId="password">
                      <Form.Control
                        value={this.state.password}
                        onChange={this.handleChange}
                        type="password"
                        name="password"
                        autoComplete="off"
                        placeholder="Password"
                      />
                    </Form.Group>
                    <Form.Group controlId="passwordtwo">
                      <Form.Control
                        value={this.state.passwordtwo}
                        onChange={this.handleChange}
                        type="password"
                        name="passwordtwo"
                        autoComplete="off"
                        placeholder="Conferma Password"
                      />
                    </Form.Group>
                    <Form.Group id="privacyBox">
                      <Form.Check type="checkbox">
                        <Form.Check.Input type="checkbox" name="privacyBox" onChange={this.handleChange} />
                        <Form.Check.Label>
                          <small>
                            {'Dichiaro di avere più di 16 anni e di accettare i '}
                            <a href="https://www.iubenda.com/privacy-policy/99619316" target="blank">
                              {'termini di utilizzo e l’informativa sulla privacy '}
                            </a>
                            {'o di avere il consenso genitoriale.'}
                          </small>
                        </Form.Check.Label>
                      </Form.Check>
                    </Form.Group>
                    <Button
                      variant="secondary"
                      block
                      disabled={!this.validateForm()}
                      type="submit"
                    >
                      {'Registrati'}
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

export default Signup;
