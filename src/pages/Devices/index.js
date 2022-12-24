import { styled } from '@mui/material/styles';
import {  Container, Grid } from '@mui/material';  
import { deviceDetect } from 'react-device-detect'; 
import React from 'react';
import HTTPManager from '../../utils/httpRequestManager';
const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
    justifyContent: 'start',
  },
})); 

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
})); 
export default class DevicesComponent extends React.Component{
    httpManager = new HTTPManager();
    constructor(props){
      super(props)
      this.state = {
        devices:[]
      }
    }

    componentDidMount(){
      console.log("DEVICES")
      this.httpManager.postRequest('pos/print/getDevices',{data:"FFMM"}).then(res=>{
        this.setState({devices: res.data})
      })
    }

    render(){
      return <>
        {this.state.devices.map(e=>{
          return (
              <Grid Container>
                <Grid item xs={4}>{e.name}</Grid>
                <Grid item xs={4}>{e.ip}</Grid>
                <Grid item xs={4}>{e.mac}</Grid>
              </Grid>
          )
        })}
      </>
    }
}
