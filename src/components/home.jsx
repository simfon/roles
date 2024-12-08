/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';

const Home = () => (
  <main role="main" className="container-fluid">
    <div className="pseudoHeader">
      <div className="overlay" />
      <video playsInline="playsinline" autoPlay="autoplay" muted="muted" loop="loop" poster={`${process.env.PUBLIC_URL}/img/poster.png`}>
        <source src={`${process.env.PUBLIC_URL}/webm/fire.webm`} type="video/mp4" />
      </video>
      <div className="container h-70">
        <div className="d-flex h-100 text-center align-items-center">
          <div className="w-100 text-white">
            <h1 className="display-3 special">ROLES</h1>
            <p className="lead mb-0 special">Uno, nessuno e centomila.</p>
          </div>
        </div>
      </div>
    </div>
  </main>
);

export default Home;
