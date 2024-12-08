import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const StopModal = props => (
  <Modal size="sm" centered show={props.show} onHide={props.handleCloseStopModal}>
    <Modal.Header closeButton>
      <Modal.Title>Chiusura Role</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {'Una Role può essere chiusa perché ritenuta Completa dalla maggioranza dei partecipanti,'}
      {' oppure perché si ritiene opportuno segnalare al Gioco comportamenti scorretti o sgradevoli.'}
      {'Le Role chiuse per Segnalazione non producono Punti Esperienza.'}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="success" onClick={props.handleStopGame}>
        {'Completa'}
      </Button>
      <Button variant="danger" onClick={props.handleReportGame}>
        {'Segnala'}
      </Button>
      <Button variant="warning" onClick={props.handleCloseStopModal}>
        {'Indietro'}
      </Button>
    </Modal.Footer>
  </Modal>
);
export default StopModal;
