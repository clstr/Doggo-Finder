import React, { Component } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export class NavMenu extends Component {
  displayName = NavMenu.name

  render() {
    return (
      <Navbar collapseOnSelect fixed={"top"} sticky={"top"} expand="md" bg={"light"} variant={"light"}>

        <Navbar.Brand>
          <Link to={'/'}>Guided Pathways</Link>
        </Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse>
          <Nav>

            <LinkContainer to={'/'} exact>
              <Nav.Link>
                Home
              </Nav.Link>
            </LinkContainer>

          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
