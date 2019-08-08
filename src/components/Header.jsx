import React, { Component } from "react";
import pbsclogo from "../Images/pbsclogo.png";
import { NavMenu } from "./NavMenu";
import "../CSS/style.css"
import "../CSS/grids.css";

export class Header extends Component {
  displayName = Header.name;

  render() {
    return (
      <div>
        <div className="header-background">
          <div className="header-top">
            <div className="headercontainer">
              <div className="headercontent">
                <div className="left">
                  <a href="//www.palmbeachstate.edu">
                    <img src={pbsclogo} alt="Palm Beach State College" className="Smalllogo" />
                  </a>
                  {/* <span className="smalltitle">Guided Pathways</span> */}

                  <NavMenu />

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
