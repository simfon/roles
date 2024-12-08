/* eslint-disable */
import React from 'react';
import { Row, Col } from 'react-bootstrap';

const Credits = () => (
  <main role="main" className="container-fluid">
    <div className="pseudoHeader">
      <div className="overlay" />
      <video playsInline="playsinline" autoPlay="autoplay" muted="muted" loop="loop" poster={`${process.env.PUBLIC_URL}/img/poster.png`}>
        <source src={`${process.env.PUBLIC_URL}/webm/fire.webm`} type="video/mp4" />
      </video>
      <div className="container h-100">
        <Row className="fix-row overflow-fixed game_background">
          <Col md="4" className="text-center mx-auto" />
          <Col md="4" className="text-center mx-auto" />
          <Col md="4" className="text-center mx-auto">
            <p className="lead mb-0 special text-white">Credits</p>
            <p>
              <div className="text-white">
                Regolamento di base ispirato a Risus<br />
                <a href="https://www.drivethrurpg.com/product/170294/Risus-The-Anything-RPG" target="_blank" rel="noopener noreferrer">
                  <img src="/img/risus.png" alt="Risus logo" />
                </a><br />
                di S. John Ross
              </div>
            </p>
            <p>
              <div className="text-white">
                Icons made by <a href="https://www.freepik.com/" title="Freepik">Freepik</a><br />
                from <a href="https://www.flaticon.com/" title="Flaticon" rel="noopener noreferrer">
                  www.flaticon.com</a><br />is licensed by
                <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener noreferrer">
                  CC 3.0 BY
                </a>
              </div>
            </p>
            <p>
              <div className="text-white">
                Il fantastico <a href="https://github.com/thomascgray/fantasy-content-generator" target="_blank" rel="noopener noreferrer">
                  Fantasy Content Generator </a>
                sul quale è basato il nostro generatore,<br />
                di <a href="https://github.com/thomascgray">Tom Gray</a>
              </div>
            </p>
          </Col>
        </Row>
      </div>
    </div>
  </main>
);

export default Credits;
