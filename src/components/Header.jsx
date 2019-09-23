import React, { Component } from "react";
import { NavMenu } from "./NavMenu";

export class Header extends Component {
  displayName = Header.name;

  render() {
    return (
      <NavMenu />
    )
  }
}
