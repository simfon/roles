/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Card, Modal } from 'react-bootstrap';
import axios from 'axios';

class GameCard extends Component {
  constructor(props) {
    super(props);
    this.handleDeleteGame = this.handleDeleteGame.bind(this);
    this.handleJoinGame = this.handleJoinGame.bind(this);
    this.renderRedirect = this.renderRedirect.bind(this);
    this.renderBorder = this.renderBorder.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleModal = this.handleModal.bind(this);

    this.state = {
      error: undefined,
      go: false,
      show: false,
      share: false,
    };
  }

  handleModal(m) {
    this.setState(prevState => ({
      [m]: !prevState[m],
    }));
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleDeleteGame() {
    // eslint-disable-next-line no-underscore-dangle
    const game = this.props.game._id;
    const error = this.props.deleteGame(game);

    this.setState(() => ({ error }));

    if (this.state.error) {
      // console.log('Card error', error);
    }
  }

  handleJoinGame() {
    // eslint-disable-next-line no-underscore-dangle
    axios.post(`/api/game/pg/${this.props.game._id}`).then((response) => {
      if (response && response.status === 200) {
        this.setState(() => ({
          go: true,
        }));
      }
    }).catch((error) => {
      if (error.response.status === 404) {
        // console.log(error.response);
        // eslint-disable-next-line no-alert
        alert('Questa Role è stata eliminata dal propietario');
      } else if (error.response.status === 500) {
        // console.log(error.response)
        // eslint-disable-next-line no-alert
        alert('Strano problema. Riprova, mentre controlliamo.');
      }
    });
  }

  renderRedirect() {
    if (this.state.go) {
      // eslint-disable-next-line no-underscore-dangle
      return <Redirect to={`/role/${this.props.game._id}`} />;
    }
    return <></>;
  }

  renderBorder() {
    // eslint-disable-next-line max-len
    const times = this.props.game.activity.filter(obj => obj > this.props.game.myLastActivity);
    if (times.length > 0) {
      return 'success';
    }
    return 'light';
  }

  render() {
    return (
      // eslint-disable-next-line no-underscore-dangle
      <Card className="border-2 mx-auto m-2" border={this.renderBorder()} style={{ width: '12rem', height: '20rem' }} key={`C${this.props.game._id}`}>
        <Card.Header>{this.props.game.gameName}</Card.Header>
        {this.renderRedirect()}
        <div
          className="hovereffect"
          onClick={() => this.handleModal('share')}
        >
          <Card.Img variant="top" src={`${process.env.PUBLIC_URL}/img/${this.props.game.img}`} />
          <div className="overlay" name="share">
            <i name="share" className="fas fa-share-square text-white">Condividi</i>
          </div>
        </div>
        <Card.Body>
          <Card.Text style={{ fontSize: '0.8rem' }}>
            <i>{this.props.game.gameLocation}</i>
            <br />
            <b>{this.props.game.name}</b>
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <Button onClick={this.handleJoinGame} variant="dark">Entra</Button>
          <Leave
            owner={this.props.game.owner}
            handleShow={this.handleShow}
            handleDeleteGame={this.handleDeleteGame}
            handleClose={this.handleClose}
            show={this.state.show}
          />
          <Share
            show={this.state.share}
            handleModal={this.state.handleModal}
            id={this.props.game._id}
          />
        </Card.Footer>
      </Card>
    );
  }
}

export default GameCard;

const Leave = (props) => {
  const ownerVariant = props.owner ? 'danger' : 'warning';

  return (
    <>
      <Confirm
        show={props.show}
        handleClose={props.handleClose}
        handleDeleteGame={props.handleDeleteGame}
      />
      <Button className="ml-2" variant={ownerVariant} onClick={props.handleShow}>Esci</Button>
    </>
  );
};

const Share = props => (
  <Modal show={props.show} onHide={props.handleModal}>
    <Modal.Header closeButton>
      <Modal.Title>Abbandona la Role</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>
        {'Visualizzazione'}
        <br />
        {`https://www.roles.pw/view/${props.id}`}
      </p>
      <p>
        {'Partecipante'}
        <br />
        {`https://www.roles.pw/join/${props.id}`}
      </p>
    </Modal.Body>
    <Modal.Footer>

    </Modal.Footer>
  </Modal>
);

const Confirm = props => (
  <Modal show={props.show} onHide={props.handleClose} name="share">
    <Modal.Header closeButton>
      <Modal.Title>Abbandona la Role</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {'Il Personaggio verrà cancellato. Sei sei il creatore della Role, tutto verrà cancellato.'}
      {'Ne sei proprio sicuro?'}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="danger" onClick={props.handleDeleteGame}>
        {'Si'}
      </Button>
      <Button variant="success" onClick={props.handleClose}>
        {'No'}
      </Button>
    </Modal.Footer>
  </Modal>
);
