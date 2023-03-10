import { IconButton } from "@mui/material";
import React from "react";
// import AppointmentsCompoent from "../Appointments";
import CheckInComponent from "../Checkin";
import { Sync } from '@mui/icons-material'
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
            <div style={{position:'fixed',bottom:0, left:0, right:0, display:'flex', alignItems:'center', margin:'1rem 1rem 0 0', justifyContent:'flex-end'}}>
                <IconButton onClick={()=>{
                    window.location.href = "/syncData/progress"
                }}> 
                    <Sync style={{color:'#d0d0d0'}}/>
                </IconButton>
            </div>
        </div>
    }
}