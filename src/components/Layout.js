import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import { Header } from "./Header"
import { Footer } from "./Footer";

export class Layout extends Component {
  displayName = Layout.name

  constructor(props) {
    super(props);
    this.state = this.getInitialState()
  }

  getInitialState = () => {
    const initialState = {}
    return initialState
  }

  resetState = () => { this.setState(this.getInitialState()) }

  render() {
    return (
      <React.Fragment>
        <Header />
        <Container>
          {this.props.children}
        </Container>
        <Footer />
      </React.Fragment>
    )
  }
}