import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Navbar, Form, FormControl, Button,
} from 'react-bootstrap';
import axios from 'axios';
import io from 'socket.io-client';
import { uid } from 'react-uid';
import AttackModal from './attackModal';
import StopModal from './stopModal';
import PG from './pg';
import Message from './message';
import Defense from './defense';
import Closure from './closure';

class Role extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo: null,
      gameLoaded: false,
      inputDisabled: false,
      id: '',
      participants: [],
      gameName: '',
      pg: '',
      name: '',
      sheet: [],
      messages: [],
      actions: [],
      closure: {},
      attackModal: false,
      stopModal: false,
      pendingAttack: false,
      voteCasted: false,
    };
    // functions bindings
    this.socket = io();
    this.loadGame = this.loadGame.bind(this);
    this.pickPG = this.pickPG.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenStopModal = this.handleOpenStopModal.bind(this);
    this.handleCloseStopModal = this.handleCloseStopModal.bind(this);
    this.handleCombatAttack = this.handleCombatAttack.bind(this);
    this.handleSubmitDefense = this.handleSubmitDefense.bind(this);
    this.handleStopGame = this.handleStopGame.bind(this);
    this.handleReportGame = this.handleReportGame.bind(this);
    this.handleSubmitMedals = this.handleSubmitMedals.bind(this);
    this.reloadActions = this.reloadActions.bind(this);
    this.reloadPlayers = this.reloadPlayers.bind(this);
    this.requestHint = this.requestHint.bind(this);

    //
    const addMessage = (data) => {
      this.setState(prevState => ({ messages: [...prevState.messages, data] }));
    };

    // eslint-disable-next-line no-unused-vars
    const reloadGame = () => {
      axios.get(`/api/game/${this.props.match.params.id}`).then((response) => {
        this.setState(() => ({
          gameLoaded: true,
          id: response.data._id,
          participants: response.data.participants,
          gameName: response.data.gameName,
          messages: response.data.chat,
          actions: response.data.actions,
          closure: response.data.closure,
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

    this.socket.on('hint', (data) => {
      addMessage(data);
    });

    this.socket.on('updateUserList', () => {
      reloadGame();
    });

    this.socket.on('ATTACK_START', (data) => {
      this.setState(prevState => ({
        inputDisabled: true,
        pendingAttack: true,
        actions: [...prevState.actions, data],
      }));
    });

    this.socket.on('ATTACK_MESSAGE', (data) => {
      addMessage(data);
    });

    this.socket.on('ATTACK_END', () => {
      this.setState(() => ({
        inputDisabled: false,
        pendingAttack: false,
      }));
      this.reloadActions();
      this.reloadPlayers();
      this.pickPG();
    });
  }

  componentDidMount() {
    this.loadGame();
    this.pickPG();
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

  handleOpenModal() {
    this.reloadPlayers();
    this.setState(() => ({
      attackModal: true,
    }));
  }

  handleCloseModal() {
    this.setState(() => ({
      attackModal: false,
    }));
  }

  handleOpenStopModal() {
    this.setState(() => ({
      stopModal: true,
    }));
  }

  handleCloseStopModal() {
    this.setState(() => ({
      stopModal: false,
    }));
  }

  handleCombatAttack(e) {
    if (!this.state.pendingAttack) {
      this.socket.emit('ATTACK_INIT', {
        sender: {
          id: this.state.pg,
          name: this.state.name,
          with: e.cliche,
          roll: 0,
        },
        target: {
          id: e.targetId,
          with: '',
          roll: 0,
        },
        game: this.props.match.params.id,
      });
    } else {
      // eslint-disable-next-line no-alert
      alert('Un confronto attende di essere deciso dai dadi, invio non possibile');
    }

    this.handleCloseModal();
  }

  handleSubmitDefense(e) {
    e.preventDefault();
    const cliche = e.target.elements.cliche.value.trim();
    const message = this.state.actions[this.state.actions.length - 1];
    message.target.with = cliche;
    this.socket.emit('ATTACK_DEFEND', message);
  }

  handleStopGame() {
    this.handleCloseStopModal();
    this.socket.emit('requestStop', {
      // eslint-disable-next-line no-underscore-dangle
      game: this.state.id,
    });
  }

  handleReportGame() {
    this.handleCloseStopModal();
    this.socket.emit('requestReport', {
      // eslint-disable-next-line no-underscore-dangle
      game: this.state.id,
    });
  }

  handleSubmitMedals(e) {
    if (this.state.closure.closed) {
      this.socket.emit('Medals', { gameId: this.state.id, votes: e });
      this.componentWillUnmount();
      this.setState(() => ({
        voteCasted: true,
        redirectTo: '/game',
      }));
    }
  }

  sendMessage(e) {
    e.preventDefault();
    if (!this.state.pendingAttack) {
      const message = e.target.elements.message.value.trim().substring(0, 20000);
      if (message) {
        this.socket.emit('SEND_MESSAGE', {
          // eslint-disable-next-line no-underscore-dangle
          game: this.state.id,
          sender: this.state.name,
          gameName: this.state.gameName,
          text: message,
        });
        e.target.elements.message.value = '';
      }
    } else {
      // eslint-disable-next-line no-alert
      alert('Un confronto attende di essere deciso dai dadi, invio non possibile');
    }
  }

  reloadActions() {
    axios.get(`/api/game/actions/${this.props.match.params.id}`).then((response) => {
      this.setState(() => ({
        actions: response.data.actions,
      }));
    // eslint-disable-next-line no-console
    }).catch(e => console.log(e.response));
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
        id: response.data._id,
        participants: response.data.participants,
        gameName: response.data.gameName,
        messages: response.data.chat,
        actions: response.data.actions,
        closure: response.data.closure,
      }));
      if (this.state.actions
        && this.state.actions
        && !this.state.actions[this.state.actions.length - 1].resolved) {
        this.setState(() => ({
          inputDisabled: true,
          pendingAttack: true,
        }));
      }
    }).catch(e => e);
  }

  pickPG() {
    axios.post(`/api/game/pg/${this.props.match.params.id}`).then((response) => {
      this.setState(() => ({
        // eslint-disable-next-line no-underscore-dangle
        pg: response.data._id,
        name: response.data.name,
        sheet: response.data.sheet,
      }));
    }).catch((e) => {
      // eslint-disable-next-line no-console
      console.log('Error', e.response);
    });
  }

  requestHint() {
    this.socket.emit('requestHint', {
      // eslint-disable-next-line no-underscore-dangle
      game: this.state.id,
    });
  }

  render() {
    const widthStyle = { width: '100%' };

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
              {this.state.pendingAttack
              && this.state.actions
              && this.state.actions[this.state.actions.length - 1].target.id === this.state.pg
              && (
              <Defense
                handleSubmitDefense={this.handleSubmitDefense}
                cliches={this.state.sheet}
              />
              )}
              <div ref={(el) => { this.el = el; }} />
            </div>
          </main>
        </div>
        <Closure
          // eslint-disable-next-line max-len
          show={this.state.closure.closed && this.state.participants.length > 1 && !this.state.voteCasted}
          participants={this.state.participants}
          me={this.state.pg}
          handleSubmitMedals={this.handleSubmitMedals}
        />
        <AttackModal
          show={this.state.attackModal}
          handleCloseModal={this.handleCloseModal}
          handleCombatAttack={this.handleCombatAttack}
          cliches={this.state.sheet}
          players={this.state.participants
            // eslint-disable-next-line no-underscore-dangle
            && this.state.participants.filter(pg => pg._id !== this.state.pg)}
        />
        <StopModal
          show={this.state.stopModal}
          handleCloseStopModal={this.handleCloseStopModal}
          handleStopGame={this.handleStopGame}
          handleReportGame={this.handleReportGame}
        />
        <footer className="fixed-bottom">
          <Navbar bg="dark" variant="dark">
            <Form inline className="mx-auto mr-sm-2" onSubmit={this.sendMessage}>
              <Navbar.Collapse className="justify-content-between">
                <Button variant="outline-info" onClick={() => this.handleOpenModal()}>Azione</Button>
                <FormControl
                  disabled={this.state.inputDisabled}
                  autoComplete="off"
                  maxLength="20000"
                  type="text"
                  name="message"
                  className="cell ml-sm-2 mr-sm-2"
                  style={widthStyle}
                />
                <Button variant="outline-info" type="submit">Invia</Button>
              </Navbar.Collapse>
            </Form>
          </Navbar>
        </footer>
      </div>
    );
  }
}

export default Role;
