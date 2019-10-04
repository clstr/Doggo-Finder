import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container'
import { Header } from "../components/header/Header"
import { Footer } from "../components/footer/Footer";

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

Layout.propTypes = {
  children: PropTypes.node.isRequired
};