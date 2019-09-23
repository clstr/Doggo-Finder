import React, { Component } from 'react';
import { Route, Switch } from 'react-router';

import { Layout } from './components/Layout';
import { Home } from './components/Home';

export default class App extends Component {
  displayName = App.name

  constructor(props) {
    super(props);
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    const initialState = {}
    return initialState
  }

  resetState = () => { this.setState(this.getInitialState()) }

  NoMatch = () => { return <h1>Page does not exist</h1> }

  render() {
    return (
      <Layout>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route component={this.NoMatch} />
        </Switch>
      </Layout>
    )
  }
}