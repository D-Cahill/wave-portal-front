import React from "react";
import { ethers } from "ethers";

export default class HeaderComponent extends React.Component {

  render() {
          return(
              <nav className="navbar navbar-expand-lg navbar-dark bg-dark align-center fixed-top">
                <div className="container-fluid justify-content-start">
                  <img src="https://ipfs.io/ipfs/QmNmKppas2P5DeqhUqu3F5Ro64va1CfKvQjEqHZF9hHiiC" height="32" width="32" />
                  <a className="navbar-brand justify-content-start">WavePortal</a>
                </div>

                    {!currentAccount && (
                    <div className="d-flex flex-column">
                      <button type="button" className="btn btn-warning" onClick={connectWallet}>
                        <div className="d-flex align-center">
                          <img          src="https://ipfs.io/ipfs/QmPnyedffTGaxGJQgC2nN1o1G82GVZH7Ec6fYP9o91Hmub"
                          height="16px"
                          width="16px" />
                          <strong>Connect Wallet</strong>
                        </div>
                      </button>
                    </div>
                    )}
              </nav>

              );
            };
  };