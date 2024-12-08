/* eslint-disable */
import React from 'react';
import { uid } from 'react-uid';
import { Tabs, Tab } from 'react-bootstrap';

const Rules = (props) => {
const rules = require('./gameRules.json');
const rulesSections = Object.keys(rules);

  return  (
        <main role="main" className="container">
        <Tabs defaultActiveKey="rules" id="doc-tab">
          <Tab eventKey="roles" title="Roles">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </Tab>
          <Tab eventKey="rules" title="Regole">
            {rulesSections.map(s => <Section key={uid(s)} title={s} text={rules[s].text}/>)}
          </Tab>
        </Tabs>
        </main>
  );

}

const Section = (props) => {
  return(
    <section>
      <p className="lead mb-0 special">{props.title}</p>
      {props.text.split('\n').map((item,i) => <p key={uid(i)}>{item}</p>)}
    </section>
  )
}

export default Rules;