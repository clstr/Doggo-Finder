import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Header } from "./Header"
import { Footer } from "./Footer";

export class Layout extends Component {
  displayName = Layout.name

  render() {
    return (
      <Container fluid>
        <Header />

        <div className="bodycontent">
          <Row>
            <Col sm={12}> {this.props.children} </Col>
          </Row>
        </div>

        <Footer />
      </Container >
    );
  }
}
