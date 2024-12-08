import React from 'react';
import { Alert, Button } from 'react-bootstrap';

const AlertDismissable = props => (
  <>
    <Alert show={props.view} onClose={() => true} variant={props.variant}>
      <Alert.Heading>{props.heading}</Alert.Heading>
      <p>{props.message}</p>
      <hr />
      <div className="d-flex justify-content-end">
        <Button onClick={props.handleCloseAlert} variant="outline-success">
          {'Chiudi'}
        </Button>
      </div>
    </Alert>
  </>
);

export default AlertDismissable;
