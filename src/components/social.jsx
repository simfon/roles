import React, { Component } from 'react';
import {
  Navbar, Form, FormControl, Button,
} from 'react-bootstrap';
import io from 'socket.io-client';
import { uid } from 'react-uid';
import axios from 'axios';

class Social extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      nick: '',
    };

    this.socket = io();
    this.sendMessage = this.sendMessage.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);

    const addMessage = (data) => {
      this.setState(prevState => ({ messages: [...prevState.messages, data] }));
    };
    const addMessages = (data) => {
      this.setState(() => ({ messages: data }));
    };
    this.socket.on('RECEIVE_MESSAGE', (data) => {
      addMessage(data);
    });
    this.socket.on('JOIN_SOCIAL', (data) => {
      // console.log('data', data);
      if (data) {
        addMessages(data);
      }
    });
  }

  componentDidMount() {
    axios.get('/api/user/account/me').then((user) => {
      this.setState(() => ({
        nick: user.data.nickname,
      }));
    });
    const data = {
      game: 'supersocialroom',
      limit: 25,
    };
    this.socket.emit('join', data);
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    const data = {
      game: 'supersocialroom',
    };
    this.socket.emit('leave', data);
    this.socket.disconnect();
  }

  sendMessage(e) {
    e.preventDefault();

    const message = e.target.elements.message.value.trim().substring(0, 5000);
    this.socket.emit('SOCIAL_MESSAGE', {
      sender: this.state.nick,
      text: message,
    });
    e.target.elements.message.value = '';
  }


  scrollToBottom() {
    this.el.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    const widthStyle = { width: '100%' };

    return (
      <div className="container-fluid">
        <div className="row">
          <main role="main" className="col-md-12 ml-sm-auto col-lg-12 px-2 social_main">
            <div className="d-flex align-items-start flex-column game_chatDiv">
              {this.state.messages.length > 0
                && this.state.messages.map((message, index) => (
                  <Message
                    key={uid(index)}
                    index={index}
                    message={message}
                  />
                ))}
              <div ref={(el) => { this.el = el; }} />
            </div>
          </main>

          <footer className="fixed-bottom">
            <Navbar bg="dark" variant="dark">
              <Form inline className="mx-auto mr-sm-2" onSubmit={this.sendMessage}>
                <Navbar.Collapse className="justify-content-between">
                  <FormControl autoFocus autoComplete="off" maxLength="20000" type="text" name="message" className="cell ml-sm-2 mr-sm-2" style={widthStyle} />
                  <Button variant="outline-info" type="submit">Invia</Button>
                </Navbar.Collapse>
              </Form>
            </Navbar>
          </footer>
        </div>
      </div>
    );
  }
}
const Message = props => (
  <div key={uid(props.index)} className="m-2 p-2 text-justify border border-secondary socialMessage rounded-lg">
    <span className="text-justify">
      <b>{props.message.sender}</b>
      {' '}
      {props.message.text}
    </span>
  </div>
);
export default Social;
