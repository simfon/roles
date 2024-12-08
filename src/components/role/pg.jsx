/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import {
  Card, ListGroup, Button, Modal, Row, Col,
} from 'react-bootstrap';
import { uid } from 'react-uid';
// import castle from '../../statics/img/castle.jpg';

class PG extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pcModal: false,
    };

    this.blackStar = String.fromCharCode(9733);
    this.whiteStar = String.fromCharCode(9734);
    this.male = String.fromCharCode(9794);
    this.female = String.fromCharCode(9792);
    this.handleModal = this.handleModal.bind(this);
    this.onlineStatus = this.onlineStatus.bind(this);
  }

  onlineStatus() {
    const now = new Date().getTime();
    const lastSeen = now - this.props.data.lastActivity;
    if (lastSeen < 600000) {
      return 'success';
    }
    if (lastSeen > 600000 && lastSeen < 3600000) {
      return 'warning';
    }
    if (lastSeen > 3600000) {
      return 'danger';
    }

    return 'light';
  }

  handleModal() {
    this.setState(prevState => ({
      pcModal: !prevState.pcModal,
    }));
  }

  render() {
    return (
      // eslint-disable-next-line no-underscore-dangle
      <Card key={uid(this.props.data.name)} border={this.onlineStatus()} className="border-2 mx-auto mr-1 my-1 pg-cards" bg={this.props.mypg === this.props.data._id ? 'light' : 'secondary'} style={{ width: '9rem' }}>
        <PCModal
          show={this.state.pcModal}
          handleModal={this.handleModal}
          pg={this.props.data}
          avatar={this.state.avatar}
        />
        <Card.Header className="p-1" onClick={this.handleModal}>
          {this.props.data.name}
          {' '}
          {this.props.data.gender === 'Male' ? this.male : this.female}
        </Card.Header>
        <div
          className="hovereffect"
          onClick={this.handleModal}
        >
          <Card.Img
            className="p-1 avatar"
            alt="avatar placeholder"
            variant="top"
            src={`/api/avatars/${this.props.data.gender.toLowerCase()}/${this.props.data._id}`}
            onClick={this.handleModal}
          />
          <div className="overlay">
            <h2 className="special">Scheda</h2>
          </div>
        </div>

        <Card.Body className="p-1">
          <Card.Text className="p-1 text-center">
            <Hint
              owner={this.props.mypg === this.props.data._id}
              requestHint={this.props.requestHint}
            />
            <Stop
              owner={this.props.mypg === this.props.data._id}
              handleOpenStopModal={this.props.handleOpenStopModal}
              handleStopGame={this.props.handleStopGame}
              handleReportGame={this.props.handleReportGame}
            />
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

const PCModal = (props) => {
  const blackStar = String.fromCharCode(9733);
  const whiteStar = String.fromCharCode(9734);
  const male = String.fromCharCode(9794);
  const female = String.fromCharCode(9792);

  return (
    <Modal size="lg" show={props.show} onHide={props.handleModal}>

      <Modal.Header closeButton>
        <Modal.Title>
          {props.pg.name}
          {'   '}
          {props.pg.gender === 'Male' ? male : female}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <img
              alt="avatar"
              src={`/api/avatars/${props.pg.gender.toLowerCase()}/${props.pg._id}`}
              className="avatar mx-auto d-block"
            />
          </Col>
          <Col>
            <ListGroup variant="flush" className="text-left">
              {props.pg.sheet.map(cliche => (
                <ListGroup.Item className="p-1" key={uid(cliche.name)}>
                  <Icons category={cliche.category} />
                  {cliche.name}
                  {'  '}
                  {cliche.status > 0 ? blackStar.repeat(cliche.status) : undefined}
                  {whiteStar.repeat(cliche.level - cliche.status)}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <ListGroup>
              {'Tratti:'}
              {props.pg.traits.map((obj, index) => (
                <ListGroup.Item
                  key={uid(index)}
                >
                  {obj}
                </ListGroup.Item>
              ))}
            </ListGroup>
            <ListGroup>
              {'Desideri:'}
              {props.pg.desires.map((obj, index) => (
                <ListGroup.Item
                  key={uid(index)}
                >
                  {obj}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>

      </Modal.Footer>

    </Modal>
  );
};

const Hint = (props) => {
  if (props.owner) {
    return (<Button size="sm" variant="outline-success" className="mx-1" onClick={props.requestHint}>Hint</Button>
    );
  }
  return (
    <></>
  );
};

const Stop = (props) => {
  if (props.owner) {
    return (<Button size="sm" variant="outline-danger" className="mx-1" onClick={props.handleOpenStopModal}>Stop</Button>
    );
  }
  return (
    <></>
  );
};

const Icons = (props) => {
  const inStyle = { width: '32px', heigth: '32px' };

  if (props.category === 'Spada') {
    return <img src="/img/sword.svg" alt="Clichè Spada" title="Clichè Spada" style={inStyle} />;
  }

  if (props.category === 'Cappa') {
    return <img src="/img/cloak.svg" alt="Clichè Cappa" title="Clichè Cappa" style={inStyle} />;
  }

  if (props.category === 'Spirito') {
    return <img src="/img/spirit.svg" alt="Clichè Spirito" title="Clichè Spirito" style={inStyle} />;
  }

  return <img src="/img/sword.svg" alt="Clichè Sconosciuto" title="Clichè Sconosciuto" style={inStyle} />;
};


export default PG;
