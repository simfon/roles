/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import { Container } from 'react-bootstrap';

const Signoff = () => (

  <div className="pseudoHeader">
    <div className="overlay" />
    <video playsInline="playsinline" autoPlay="autoplay" muted="muted" loop="loop" poster={`${process.env.PUBLIC_URL}/img/poster.png`}>
      <source src={`${process.env.PUBLIC_URL}/webm/fire.webm`} type="video/mp4" />
    </video>
    <div className="container h-70">
      <div className="d-flex h-100 text-center align-items-center">
        <div className="w-100 text-white">
          <Container className="col-sm-5">
            <h4>Grazie per aver giocato con Noi.</h4>
            <a href="/">Back</a>
          </Container>
        </div>
      </div>
    </div>
  </div>

);

export default Signoff;
