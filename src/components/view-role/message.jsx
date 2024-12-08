/* eslint-disable react/sort-comp */
/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import { uid } from 'react-uid';
import striptags from 'striptags';

class Message extends Component {
  constructor(props) {
    super(props);

    this.cleanMessage = this.cleanMessage.bind(this);
    this.standardMessage = this.standardMessage.bind(this);
    this.systemMessage = this.systemMessage.bind(this);
    this.attackMessage = this.attackMessage.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  cleanMessage(message) {
    const text = striptags(message);
    // eslint-disable-next-line no-useless-escape
    let formatted = text.replace(/\([^\)]*?\)/g, match => `<mark> - ${match.substring(1, match.length - 1)} - </mark>`);
    // eslint-disable-next-line no-useless-escape
    formatted = formatted.replace(/\-[^\-]*?\)/g, match => `<mark> - ${match.substring(1, match.length - 1)} - </mark>`);
    return { __html: formatted };
  }

  standardMessage() {
    return (
      <div key={uid(this.props.index)} className="mb-3 game_messages">
        <span>
          {this.props.message.sender}
          {' :'}
        </span>
        {' '}

        <p dangerouslySetInnerHTML={this.cleanMessage(this.props.message.text)} />
      </div>
    );
  }

  systemMessage() {
    return (
      <div key={uid(this.props.index)} className="m-2 p-2 text-center text-justify border border-secondary rounded-lg attack_message">
        <span className="text-justify" dangerouslySetInnerHTML={this.cleanMessage(this.props.message.text)} />
      </div>
    );
  }

  attackMessage() {
    return (
      <div key={uid(this.props.index)} className="m-2 mx-auto p-2 text-center text-justify border border-secondary rounded-lg attack_message">
        <span className="text-center" dangerouslySetInnerHTML={this.cleanMessage(this.props.message.text)} />
      </div>
    );
  }

  hintMessage() {
    return (
      <div key={uid(this.props.index)} className="m-2 p-2 text-justify border border-secondary rounded-lg hint">
        <span className="text-justify" dangerouslySetInnerHTML={this.cleanMessage(this.props.message.text)} />
      </div>
    );
  }

  render() {
    if (this.props.message.kind === 'chat') {
      return this.standardMessage();
    } if (this.props.message.kind === 'attack') {
      return this.attackMessage();
    } if (this.props.message.kind === 'attack_message') {
      return this.attackMessage();
    } if (this.props.message.kind === 'hint') {
      return this.hintMessage();
    }

    return this.standardMessage();
  }
}

export default Message;
