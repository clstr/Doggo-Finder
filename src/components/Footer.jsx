import React, { Component } from 'react';

export class Footer extends Component {
  displayName = Footer.name

  render() {
    return (

      <div className="footer">
        <div className="container">
          <div className="footercontent">
            <div className="left">
              <div className="footerbig">
                &copy; Palm Beach State College.  All rights reserved.  4200 Congress Ave., Lake Worth, FL 33461 | <span>561</span>-967-7222 | Toll Free: <span>866</span>-576-7222
                        </div>
              <div className="footersmall">
                &copy; Palm Beach State College.  All rights reserved.<br />
                4200 Congress Ave., Lake Worth, FL 33461<br />
                Phone: 561-967-7222 | Toll Free: 866-576-7222
                        </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}