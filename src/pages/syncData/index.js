
import React from "react";
import socketIOClient from "socket.io-client";
import SyncProgress from "./syncProgress";
const ENDPOINT = "http://localhost:1919";


export default class SyncDataComponent extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        syncRunning: false
      }
    }
    componentDidMount(){ 
      const socket = socketIOClient(ENDPOINT);
      socket.emit("startSync", {data:"startWhole"})
      // console.log("SSSSS")

      socket.on("startSync", data => {
          // console.log("START SYNC", data)
          this.setState({syncRunning: true})
      });
    }

    render(){
      return <div>
        {this.state.syncRunning && <SyncProgress/>}
      </div>
    }
}

