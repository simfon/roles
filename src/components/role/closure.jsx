import React, { Component } from 'react';
import {
  Modal, Button, ButtonGroup,
} from 'react-bootstrap';
import { uid } from 'react-uid';

class Closure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participants: [],
    };
    this.handleSubmitMedals = this.handleSubmitMedals.bind(this);
    this.handleVote = this.handleVote.bind(this);
  }

  componentWillReceiveProps() {
    const participants = this.props.participants.filter(p => p._id !== this.props.me)
      .map(p => ({
        id: p._id,
        vote: 0,
      }));
    this.setState(() => ({
      participants,
    }));
  }

  handleSubmitMedals() {
    this.props.handleSubmitMedals(this.state.participants);
  }

  // eslint-disable-next-line class-methods-use-this
  handleVote(id, v) {
    // eslint-disable-next-line prefer-destructuring
    const participants = this.state.participants;
    const pgIndex = this.state.participants.findIndex(p => p.id === id);
    participants[pgIndex].vote = v;
    this.setState(() => ({
      participants,
    }));
  }

  render() {
    return (
      <Modal centered show={this.props.show}>
        <Modal.Header>
          <Modal.Title>Chiusura Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>
              {'Siamo arrivati al momento dei Premi. Quanto pensi che gli altri giocatori abbiano '}
              {' interpretato correttamente il gioco, quanto sono stati attinenti al proprio personaggio '}
              {' e quanto si sono avvicinati al loro obbiettivo?'}
            </p>
          </div>
          <Participants
            participants={this.props.participants.filter(p => p._id !== this.props.me)}
            handleVote={this.handleVote}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => this.handleSubmitMedals()}>
            {'Conferma'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const bronze = '/img/medals/bronze.svg';
const silver = '/img/medals/silver.svg';
const gold = '/img/medals/gold.svg';
const inStyle = { width: '32px', heigth: '32px' };

const Participants = props => (
  props.participants.map(p => (
    <div key={uid(p._id)}>
      {p.name}
      {'   '}
      <ButtonGroup aria-label="Basic example">
        <Button variant="secondary" onClick={() => props.handleVote(p._id, 1)}><img src={bronze} alt="Bronzo" title="Bronzo" style={inStyle} /></Button>
        <Button variant="secondary" onClick={() => props.handleVote(p._id, 2)}><img src={silver} alt="Argento" title="Argento" style={inStyle} /></Button>
        <Button variant="secondary" onClick={() => props.handleVote(p._id, 3)}><img src={gold} alt="Oro" title="Oro" style={inStyle} /></Button>
      </ButtonGroup>
    </div>
  ))
);

export default Closure;
