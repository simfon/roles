/* eslint-disable global-require */
import React, { Component } from 'react';
import axios from 'axios';
import { Route, Redirect } from 'react-router-dom';
// components
import Signup from './components/sign-up';
import LoginForm from './components/login-form';
import Navigation from './components/navbar';
import Home from './components/home';
import Game from './components/game';
import Signoff from './components/signoff';
import Account from './components/account';
import Role from './components/role';
import ViewRole from './components/view-role';
import Land from './components/land';
import Social from './components/social';
import Credits from './components/credits';
import Rules from './components/rules/rules';

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      me: '',
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleGetUser = this.handleGetUser.bind(this);
    this.handleUpdateUser = this.handleUpdateUser.bind(this);
  }

  componentWillMount() {
    this.handleGetUser();
  }

  componentDidMount() {
    this.handleGetUser();
  }

  handleGetUser() {
    axios.get('/api/user/').then((response) => {
      if (response.data.user) {
        this.setState(() => ({
          loggedIn: true,
          // eslint-disable-next-line no-underscore-dangle
          me: response.data.user._id,
        }));
      } else {
        this.setState(() => ({
          loggedIn: false,
        }));
      }
    });
  }

  handleUpdateUser(userObject) {
    this.setState(userObject);
  }

  render() {
    return (
      <div className="App">
        <Navigation updateUser={this.handleUpdateUser} loggedIn={this.state.loggedIn} />

        <Route exact path="/" component={Home} />
        <Route exact path="/signoff" render={() => <Signoff />} />
        <Route path="/login" render={() => <LoginForm handleUpdateUser={this.handleUpdateUser} />} />
        <Route path="/signup" render={() => <Signup />} />
        <Route path="/credits" render={() => <Credits />} />
        <Route path="/rules" render={() => <Rules />} />
        <Route path="/view/:id" component={ViewRole} />
        <PrivateRoute me={this.state.me} authenticated={this.state.loggedIn} path="/game" component={Game} />
        <PrivateRoute authenticated={this.state.loggedIn} path="/account" component={Account} />
        <PrivateRoute authenticated={this.state.loggedIn} path="/role/:id" component={Role} />
        <PrivateRoute authenticated={this.state.loggedIn} path="/land" component={Land} />
        <PrivateRoute authenticated={this.state.loggedIn} path="/social" component={Social} />
      </div>
    );
  }
}

function PrivateRoute({ component: PrivateComponent, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => (authenticated === true
        ? <PrivateComponent {...rest} {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)}
    />
  );
}

export default App;
