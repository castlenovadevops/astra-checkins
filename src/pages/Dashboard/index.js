import React from "react";
// import AppointmentsCompoent from "../Appointments";
import CheckInComponent from "../Checkin";

export default class Dashboard extends React.Component{
    constructor(){
        super();
        this.state={
            userdetail:{}
        }
    }
    componentDidMount(){
        // console.log("DASHBOARD COMPONENT")
        var details = window.localStorage.getItem("userdetail") || ''
        if(details !== ''){
            this.setState({userdetail: JSON.parse(details)})
        }

        window.api.getPrinters().then(data=>{
            console.log("RESULT ::::: ", data)
        })
    }
    render(){
        return  <div>
            <CheckInComponent />
        </div>
    }
}