/* eslint-disable */

import React, { Component } from 'react';
import {
  Row, Button, Col, Navbar, ToggleButton
} from 'react-bootstrap';
import axios from 'axios';
import WebPush from './web-push/webpush';
import { payloadFromSubscription } from './web-push/utility';

const applicationServerPublicKey = process.env.VAPID_PUBLIC;

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subscriveUserEnabled: false,
      // eslint-disable-next-line react/no-unused-state
      subscription: { endpoint: '' },
      notify: false,
      nick: '',
      points: 0,
    };

    this.onWebPushToggle = this.onWebPushToggle.bind(this);
    this.onUpdateSubscriptionOnServer = this.onUpdateSubscriptionOnServer.bind(this);
    this.onSubscriptionFailed = this.onSubscriptionFailed.bind(this);
    this.handleUpdateNotify = this.handleUpdateNotify.bind(this);
  }

  componentDidMount() {
    this.handleUpdateNotify();
  }

  componentWillUnmount() {

  }

  onWebPushToggle() {
    this.setState({
      subscriveUserEnabled: !this.state.subscriveUserEnabled,
    })
  }

  onUpdateSubscriptionOnServer(subscription) {
    // console.log("onUpdateSubscriptionOnServer:", subscription)
    if (this.state.notify) {
      axios.delete('/api/subscribe').then(() => {
        this.setState({ notify: false });
      }).catch(e => console.error(e.message));
    } else {
      var payload = payloadFromSubscription(subscription)
      // console.log("payload:", JSON.stringify(payload))
      axios.post('/api/subscribe/', payload).then(() => {
        this.setState({ subscription: subscription,
        notify: true, })
      }).catch(e => console.log(e));
    }
  }

  onSubscriptionFailed(error) {
    console.log("onSubscriptionFailed:", error)
  }

  handleUpdateNotify() {
    axios.get('/api/user/').then((res) => {
      // console.log(res.data.user);
      this.setState(() => ({
        notify: res.data.user.notify,
        nick: res.data.user.nickname,
        points: res.data.user.points,
      }))
    });
  }

  render() {
    return (
      <>
        <WebPush
          subscriveUserEnabled={this.state.subscriveUserEnabled}
          applicationServerPublicKey={applicationServerPublicKey}
          onSubscriptionFailed={this.onSubscriptionFailed}
          onUpdateSubscriptionOnServer={this.onUpdateSubscriptionOnServer}
        />
        <main role="main" className="container-fluid">
          <p className="text-center lead mb-0 special text-black">Opzioni</p>
          <div class="panel panel-default">
          <div class="panel-body">
          <p>{'Notifiche Push'} - <NotifyButton notify={this.state.notify} onWebPushToggle={this.onWebPushToggle}/></p>
          <p>{`Nickname - ${this.state.nick}`}</p>
          <p>{`Esperienza - ${this.state.points}`}</p>
          </div>
          </div>
        </main>
        <footer className="fixed-bottom">
          <Navbar bg="dark" variant="dark">
            <Navbar.Collapse className="justify-content-start">

            </Navbar.Collapse>
          </Navbar>
        </footer>
      </>
    )
  }
}

const NotifyButton = (props) => {
  if (props.notify) {
    return (
      <Button variant="danger" onClick={() => { props.onWebPushToggle() }}>Disabilita Notifiche</Button>
    )
  }

  return (
    <Button variant="secondary" onClick={() => { props.onWebPushToggle() }}>Abilita Notifiche</Button>
  )
}

export default Account;
