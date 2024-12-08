import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import dice from '../statics/dice.svg';

class Navigation extends Component {
  constructor() {
    super();
    this.state = {
      redirectTo: null,
      // eslint-disable-next-line react/no-unused-state
      loggedIn: false,
    };
    this.logout = this.logout.bind(this);
  }

  logout(event) {
    event.preventDefault();
    axios.post('/api/user/logout').then((response) => {
      if (response.status === 200) {
        this.props.updateUser({
          loggedIn: false,
          username: null,
        });
        this.setState({
          redirectTo: '/signoff',
        });
      }
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
    });
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />;
    }

    return (
      <header className="fixed-top">
        <Navbar collapseOnSelect expand="md" className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <LinkContainer to="#">
            <Navbar.Brand className="ml-2 special">
              <img src={dice} width="30" height="30" className="d-inline-block align-top" alt="logo" />
              {' Roles '}
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">

            {this.props.loggedIn ? (
              <Nav className="mr-auto">
                <LinkContainer to="#">
                  <Nav.Link to="#" className="btn btn-link text-secondary" onClick={this.logout}>
                    {'logout'}
                  </Nav.Link>
                </LinkContainer>
                <NavDropdown title="gioco" className="text-center" id="collasible-nav-dropdown">
                  <LinkContainer to="/game">
                    <NavDropdown.Item>One-Shot</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/land">
                    <NavDropdown.Item>Land</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
                <LinkContainer to="/account">
                  <Nav.Link to="#" className="btn btn-link text-secondary">
                    {'account'}
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/rules">
                  <Nav.Link to="/rules" className="btn btn-link text-secondary">
                    {'documenti'}
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/social">
                  <Nav.Link to="#" className="btn btn-link text-secondary">
                    {'social'}
                  </Nav.Link>
                </LinkContainer>
              </Nav>
            ) : (
              <Nav className="mr-auto">
                <LinkContainer to="/">
                  <Nav.Link className="btn btn-link">
                    {'home'}
                  </Nav.Link>
                </LinkContainer>

                <NavDropdown title="accesso" className="text-center" id="collasible-nav-dropdown">
                  <LinkContainer to="/login">
                    <NavDropdown.Item>Login</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/signup">
                    <NavDropdown.Item>Registrati</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
                <LinkContainer to="/rules">
                  <Nav.Link to="/rules" className="btn btn-link">
                    {'documenti'}
                  </Nav.Link>
                </LinkContainer>
                <NavDropdown title="privacy" className="text-center" id="collasible-nav-dropdown">
                  <NavDropdown.Item target="_blank" href="https://www.iubenda.com/privacy-policy/99619316">Privacy Policy</NavDropdown.Item>
                  <NavDropdown.Item target="_blank" href="https://www.iubenda.com/privacy-policy/99619316/cookie-policy">Cookie Policy</NavDropdown.Item>
                </NavDropdown>
                <LinkContainer to="/credits">
                  <Nav.Link to="/credits" className="btn btn-link">
                    {'credits'}
                  </Nav.Link>
                </LinkContainer>
              </Nav>
            )}
          </Navbar.Collapse>
          <Navbar.Collapse className="text-center mr-2 justify-content-end">
            <Navbar.Text>info@roles.pw - Ver. Alpha</Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      </header>
    );
  }
}

export default Navigation;
