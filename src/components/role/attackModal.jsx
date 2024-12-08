import React, { Component } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { uid } from 'react-uid';

class AttackModal extends Component {
  constructor(props) {
    super(props);

    this.handleCombat = this.handleCombat.bind(this);
  }

  handleCombat(e) {
    e.preventDefault();
    const targetId = e.target.elements.target.value.trim();
    const cliche = e.target.elements.cliche.value.trim();
    this.props.handleCombatAttack({ targetId, cliche });
  }

  render() {
    return (

      <Modal show={this.props.show} onHide={this.props.handleCloseModal}>
        <Form onSubmit={this.handleCombat}>
          <Modal.Header closeButton>
            <Modal.Title>Tiro Contrapposto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="cliche">
              <Form.Label>Scegli un Archetipo</Form.Label>
              <Form.Control as="select">
                {this.props.cliches && this.props.cliches.map((arch) => {
                  if (parseInt(arch.status, 10) > 0) {
                    return <option key={uid(arch.name)}>{arch.name}</option>;
                  }
                  return <option disabled>{arch.name}</option>;
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="target">
              <Form.Label>Scegli un Bersaglio</Form.Label>
              <Form.Control as="select">
                {this.props.players && this.props.players.map(pg => (
                  <option
                    // eslint-disable-next-line no-underscore-dangle
                    key={uid(pg._id)}
                    // eslint-disable-next-line no-underscore-dangle
                    value={pg._id}
                  >
                    {pg.name.split(',')[0]}
                    {' '}
                    {pg.name.split(',')[1]}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.props.handleCloseModal}>
              {'Chiudi'}
            </Button>
            <Button variant="primary" type="submit">
              {'Conferma'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default AttackModal;
