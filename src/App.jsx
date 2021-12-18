import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json"

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [waveCount, setWaveCount] = useState(0);
  const [messageValue, setMessageValue] = useState("")
  /*
   * All state property to store all waves
   */
  const [allWaves, setAllWaves] = useState([]);
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0x8Ef22372aEe983be2131DfBdEbB4b7a9542e1154";
  const contractABI = abi.abi;

  const wCount = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    let count = await wavePortalContract.getTotalWaves()
    setWaveCount(count.toNumber())
  }

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();
        

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(messageValue, {gasLimit: 300000});
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    wCount();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
      <nav className="navbar">
                <div className="container-fluid justify-content-start">
                  <img src="https://ipfs.io/ipfs/QmNmKppas2P5DeqhUqu3F5Ro64va1CfKvQjEqHZF9hHiiC" height="32" width="32" />
                  <a className="navbar-brand justify-content-start">WavePortal</a>
                </div>

                  {!currentAccount && (
                   <div className="d-flex ">
                     <button type="button" className="walletConnectButton" onClick={connectWallet}>
                        <strong className="fs-15">Connect</strong>
                     </button>
                   </div>
                    )}
                    
                    {currentAccount && (
                      <div className="d-flex align-center justify-center">
                        <button type="button" className="walletConnectButton">
                            <strong className="fs-6">Connected</strong>
                      </button>
                    </div>
                    )}

                    
              </nav>
      <br />

        <div className="bio">
        <div className="messageFeedHeader"> About </div>
          My name is Darragh, I have a bachelors degree in softwave development from Munster institute of Technology (formerly Cork Institute of Technology). Now I am learning all I can about the blockchain and web3 world!
        </div>

        <div className="totalWaves">
          Total Waves: {waveCount}
        </div>
  

        {
          currentAccount ? (<textarea name="messageArea"
            placeholder="type your message"
            type="text"
            id="message"
            value={messageValue}
            onChange={e => setMessageValue(e.target.value)} />) : null
        }

        <button className="messageButton" onClick={wave}>
          Post a message!
        </button>

        <div className="messageHistory">
        <div className="messageFeedHeader"> Message Feed </div>
         {allWaves.map((wave, index) => {
          return (
            <div key={index} className="individualMessage">
              <div> <b>Address:</b> {wave.address}</div>
              <div> <b> Message: </b> {wave.message}</div>
              <div> <b> Time: </b> {wave.timestamp.toString()}</div>
            </div>)
        })}
        </div>


      
      </div>
    </div>
  );
}

export default App