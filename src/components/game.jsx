/* eslint-disable */

import React, { Component } from 'react';
import {
  Row, Button, Col, Navbar, Form, ToggleButton
} from 'react-bootstrap';
import axios from 'axios';
import { uid } from 'react-uid';
import GameCard from './gamecard';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      games: [{}],
      fetching: true,
      gamesCount: 0,
      gamesInterval: undefined,
      subscriveUserEnabled: false,
      // eslint-disable-next-line react/no-unused-state
      subscription: { endpoint: '' },
    };

    this.searchGame = this.searchGame.bind(this);
    this.newGame = this.newGame.bind(this);
    this.getGames = this.getGames.bind(this);
    this.getGamesCount = this.getGamesCount.bind(this);
    this.fetching = this.fetching.bind(this);
    this.deleteGame = this.deleteGame.bind(this);
    this.leaveGame = this.leaveGame.bind(this);
    this.handleDeleteGame = this.handleDeleteGame.bind(this);
  }

  componentDidMount() {
    this.getGames();
    this.getGamesCount();
    const gamesInterval = setInterval(this.getGamesCount, 60000);
    // store intervalId in the state so it can be accessed later:
    this.setState({ gamesInterval });
  }

  componentWillUnmount() {
    clearInterval(this.state.gamesInterval);
    this.setState(() => ({ gamesInterval: undefined }));
  }

  getGames() {
    this.fetching();
    axios.get('/api/game/games').then((response) => {
      if (response.data) {
        this.setState(() => ({
          games: response.data,
          fetching: false,
        }));
      }
    });
  }

  getGamesCount() {
    // // console.log('checking games');
    axios.get('/api/game/games/count').then((games) => {
      if (games.status === 200) {
        this.setState(() => ({
          gamesCount: games.data,
        }));
      }
    });
  }

  handleDeleteGame(target) {
    /* eslint-disable-next-line no-underscore-dangle */
    const game = this.state.games.find(obj => obj._id === target);
    if (game.owner) {
      this.deleteGame(target);
    } else {
      this.leaveGame(target);
    }
    this.getGamesCount();
  }

  leaveGame(target) {
    axios.post(`/api/game/leave/${target}`).then((data) => {
      if (data.status === 200) {
        this.setState(prevState => ({
          /* eslint-disable-next-line no-underscore-dangle */
          games: prevState.games.filter(obj => obj._id !== target),
        }));
      }
    // eslint-disable-next-line no-console
    }).catch(e => console.log('Error delete', e.response));
    this.getGamesCount();
  }

  newGame(e) {
    e.preventDefault();
    // modificato
    if (this.state.games.length < 5) {
      axios.post('/api/game/createGame', {
        maxPlayers: e.target.elements.players.value,
      }).then((game) => {
        this.setState(prevState => ({
          games: prevState.games.concat(game.data),
        }));
      })
      // eslint-disable-next-line no-console
        .catch(err => console.log(err.response));
      // this.getGames();
      this.getGamesCount();
    } else {
      // eslint-disable-next-line no-alert
      alert('Non puoi avere più di 5 Role attive.');
    }
  }

  searchGame() {
    if (this.state.games.length < 5) {
      axios.post('/api/game/joinSimple').then((game) => {
        this.setState(prevState => ({
          games: prevState.games.concat(game.data),
        }));
      }).catch((e) => {
        if (e.response.status === 404) {
          // eslint-disable-next-line no-alert
          alert('Nessuna Role disponibile, avviane una nuova!');
        } else if (e.response.status === 500) {
          // eslint-disable-next-line no-alert
          alert('Che errore antipatico!');
        }
      });
    } else {
      // eslint-disable-next-line no-alert
      alert('Non puoi avere più di 5 Role attive.');
    }
  }

  fetching() {
    this.setState(prevState => ({
      fetching: !prevState,
    }));
  }


  deleteGame(target) {
    axios.delete(`/api/game/${target}`).then((data) => {
      if (data.status === 200) {
        this.setState(prevState => ({
          // eslint-disable-next-line no-underscore-dangle
          games: prevState.games.filter(obj => obj._id !== target),
        }));
      }
    // eslint-disable-next-line no-console
    }).catch(e => console.log('Error delete', e.response));
    this.getGamesCount();
  }


  render() {
    return (
      <>
        <main role="main" className="p-0 container-fluid page">
          <Row className="m-0 fix-row overflow-fixed">
          
            <Col md="12" className="text-center mx-auto game_cards">
              <p className="lead mb-0 special text-white">Roles One-Shot in Corso</p>
              <CurrentGames
                me={this.props.me}
                games={this.state.games}
                fetching={this.state.fetching}
                handleDeleteGame={this.handleDeleteGame}
              />
              <div className="mx-auto d-flex flex-column" />
            </Col>
          </Row>
        </main>
        <footer className="fixed-bottom">
          <Navbar bg="dark" variant="dark">
            <Navbar.Collapse className="justify-content-start">
              <Form inline onSubmit={this.newGame}>
                <Button variant="secondary" className="m-1" type="submit">Crea una Role</Button>
                <Form.Group controlId="players">
                  <Form.Control as="select">
                    <option value="2">2 Giocatori</option>
                    <option value="3">3 Giocatori</option>
                    <option value="4">4 Giocatori</option>
                  </Form.Control>
                </Form.Group>
              </Form>

            </Navbar.Collapse>
            <Navbar.Collapse className="justify-content-end">
              <Button
                variant="secondary "
                onClick={this.searchGame}
                disabled={this.state.gamesCount === 0}
              >
                {'Cerca una Role '}
                {this.state.gamesCount > 0 ? this.state.gamesCount : <Spinner />}
              </Button>
            </Navbar.Collapse>
          </Navbar>
        </footer>
      </>
    );
  }
}

const CurrentGames = props => (
  <Row className="m-3 d-flex flex-row" key="standardGameCard">
    {props.fetching && <Spinner />}
    {props.games.length > 0 && !props.fetching
                // eslint-disable-next-line no-underscore-dangle
                && props.games.map(game => game._id
                    && (
                    <GameCard
                      // eslint-disable-next-line no-underscore-dangle
                      key={uid(game._id)}
                      me={props.me}
                      deleteGame={props.handleDeleteGame}
                      game={game}
                    />
                    ))}
  </Row>
);

const Spinner = () => (
  <div className="spinner-border spinner-border-sm" role="status">
    <span className="sr-only">Loading...</span>
  </div>
);

export default Game;
