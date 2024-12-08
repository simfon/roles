import React, { Component } from 'react';
import {
  Jumbotron, Row, Button,
} from 'react-bootstrap';
import axios from 'axios';
import io from 'socket.io-client';
import { uid } from 'react-uid';

class Land extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: '',
      directions: {
        north: '',
        south: '',
        east: '',
        west: '',
      },
      name: '',
      text: '',
    };
    // functions bindings
    this.socket = io();
    this.getPosition = this.getPosition.bind(this);
    this.handleMovement = this.handleMovement.bind(this);
  }

  componentDidMount() {
    this.getPosition();
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  getPosition() {
    axios.get('/api/lands/directions')
      .then((body) => {
        const land = body.data;
        this.setState(() => ({
          name: land.name,
          text: land.text,
          directions: {
            north: land.north,
            south: land.south,
            east: land.east,
            west: land.west,
          },
          position: land._id,
        }));
      });
    console.log(this.state.position);
  }

  handleMovement(direction) {
    const data = { direction };
    if (this.state.directions[direction]) {
      axios.post('/api/lands/goTo', data)
        .then(() => {
          this.getPosition();
        }).catch(e => console.log(e));
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <Row>
          <Jumbotron>
            <p>{this.state.name}</p>
            <p>{this.state.text}</p>
            <Movement directions={this.state.directions} goTo={this.handleMovement} />
          </Jumbotron>
        </Row>
      </div>
    );
  }
}

const Movement = (props) => {
  const buttons = Object.keys(props.directions).map((direction) => {
    if (props.directions[direction]) {
      return (<Button variant="success" key={uid(direction)} onClick={() => props.goTo(direction)}>{direction}</Button>);
    }

    return (<Button variant="danger" key={uid(direction)}>{direction}</Button>);
  });


  return buttons;
};

export default Land;
