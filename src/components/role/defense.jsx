import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { uid } from 'react-uid';

const Defense = props => (
  <div className="defense mx-auto m-2 p-2 text-center text-justify border border-secondary rounded-lg">
    <Form onSubmit={props.handleSubmitDefense}>
      <Form.Group controlId="cliche">
        <Form.Label>Rispondete con un vostro Archetipo</Form.Label>
        <Form.Control as="select">
          {props.cliches && props.cliches.map((cliche) => {
            if (parseInt(cliche.status, 10) > 0) {
              return <option key={uid(cliche.name)}>{cliche.name}</option>;
            }
            return <option key={uid(cliche.name)} disabled>{cliche.name}</option>;
          })}
        </Form.Control>
        <Button className="mt-3" variant="danger" type="submit">Conferma</Button>
      </Form.Group>
    </Form>
  </div>
);


export default Defense;
