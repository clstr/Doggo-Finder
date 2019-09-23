import React, { Component } from 'react';

export class Home extends Component {
  displayName = Home.name

  constructor(props) {
    super(props);
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    const initialState = {}
    return initialState
  }

  resetState = () => { this.setState(this.getInitialState()) }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <h1>Home</h1>
        <h2>Hello World</h2>
        <h3>Hello World</h3>
        <h4>Hello World</h4>
      </div>
    )
  }
}
