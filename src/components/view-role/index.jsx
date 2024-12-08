import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { uid } from 'react-uid';
import PG from './pg';
import Message from './message';

class ViewRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo: null,
      gameLoaded: false,
      participants: [],
      messages: [],

    };
    // functions bindings
    this.socket = io();
    this.loadGame = this.loadGame.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.reloadPlayers = this.reloadPlayers.bind(this);

    const addMessage = (data) => {
      this.setState(prevState => ({ messages: [...prevState.messages, data] }));
    };

    // eslint-disable-next-line no-unused-vars
    const reloadGame = () => {
      axios.get(`/api/game/${this.props.match.params.id}`).then((response) => {
        this.setState(() => ({
          gameLoaded: true,
          participants: response.data.participants,
          messages: response.data.chat,
        }));
      }).catch((e) => {
        // eslint-disable-next-line no-console
        console.log('Error', e.response);
      });
    };

    // Socket-io
    this.socket.on('connection', () => {
      this.scrollToBottom = this.scrollToBottom.bind(this);
    });

    this.socket.on('RECEIVE_MESSAGE', (data) => {
      addMessage(data);
    });

    this.socket.on('updateUserList', () => {
      reloadGame();
    });

    this.socket.on('ATTACK_MESSAGE', (data) => {
      addMessage(data);
    });

    this.socket.on('ATTACK_END', () => {
      this.reloadPlayers();
    });
  }

  componentDidMount() {
    this.loadGame();
    const data = {
      game: this.props.match.params.id,
      limit: 25,
    };
    this.socket.emit('join', data);
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  scrollToBottom() {
    if (this.state.messages.length > 1 && !this.state.redirectTo) {
      this.el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  reloadPlayers() {
    axios.get(`/api/game/participants/${this.props.match.params.id}`).then((response) => {
      this.setState(prevState => ({
        game: { ...prevState.game, participants: response.data.participants },
      }));
    // eslint-disable-next-line no-console
    }).catch(e => console.log(e.response));
  }

  loadGame() {
    axios.get(`/api/game/${this.props.match.params.id}`).then((response) => {
      this.setState(() => ({
        gameLoaded: true,
        participants: response.data.participants,
        messages: response.data.chat,
      }));
    }).catch(e => e);
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={{ pathname: this.state.redirectTo }} />;
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <nav className="col-sm-3 col-md-2 d-none d-sm-block bg-dark sidebar">
            <div className="sidebar-sticky">
              <ul className="nav flex-column">
                {this.state.gameLoaded
                  && this.state.pg
                  && this.state.participants.map(pg => (
                    <PG
                      requestHint={this.requestHint}
                      handleOpenStopModal={this.handleOpenStopModal}
                      // eslint-disable-next-line no-underscore-dangle
                      key={uid(pg._id)}
                      data={pg}
                      mypg={this.state.pg}
                    />
                  ))}
              </ul>
            </div>
          </nav>
          <main role="main" className="col-md-10 ml-sm-auto col-lg-10 px-2 game_main">
            <div className="d-flex align-items-start flex-column game_chatDiv">
              {this.state.gameLoaded
              && this.state.messages.map((message, index) => (
                <Message
                  key={uid(index)}
                  index={index}
                  mypg={this.state.pg}
                  message={message}
                />
              ))}
              <div ref={(el) => { this.el = el; }} />
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default ViewRole;
