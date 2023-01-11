/* eslint-disable no-useless-constructor */
import React from 'react'; 
import {Box, Grid, Typography, Button} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import LoadingModal from '../../components/Loader';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import HTTPManager from '../../utils/httpRequestManager';
import socketIOClient from "socket.io-client"; 

const ENDPOINT = "http://localhost:1919";

export default class SyncProgress extends React.Component{
    httpManager = new HTTPManager();
    socket = socketIOClient(ENDPOINT);
    constructor(props){
        super(props);
        this.state = {
            progress: 0,
            isLoading: false,
            isFinished: false,
            downloadinMessage: '',
            isOnline: false,
            merchantDetail: {},
            mastertables: [],
            runningIndex:0
        }
    }

    componentDidMount(){
        this.socket.on("startSync", data => {
            this.setState({progress:10, runningIndex:0}, ()=>{
                this.syncAllData();
            })
        });

        this.socket.on("resetSync", data=>{
            window.location.href="/"
        })

        this.socket.on("stopSync", ()=>{
            window.location.href="/"
        })
        

        let detail = window.localStorage.getItem("merchantDetail");
        this.setState({ merchantDetail: JSON.parse(detail) })
        // console.log("did mount")
        this.setState({mastertables:[
            
            {
                name: "merchantEmployees",
                tablename: 'merchantEmployees',
                progressText: "Synchronizing Staff details...",
                progresscompletion: 7.75,
                url:  `/pos/syncData/employees`
            } ,
            {
                name: "mCustomers",
                tablename: 'mCustomers',
                progressText: "Synchronizing Customers...",
                progresscompletion: 7.75,
                url:  `/pos/syncData/getCustomers`
            },
            {
                name: "mCategory",
                tablename: 'mCategory',
                progressText: "Synchronizing Categories...",
                progresscompletion: 7.75,
                url:  `/pos/syncData/category`
            },
            {
                name: "mProducts",
                tablename: 'mProducts',
                progressText: "Synchronizing Products/Services...",
                progresscompletion: 7.75,
                url:  `/pos/syncData/products`
            } ,  
            {
                name: "mTax",
                tablename: 'mTax',
                progressText: "Synchronizing Taxes...",
                progresscompletion: 7.75,
                url:  `/pos/syncData/tax`
            } , 
        ]}, ()=>{
            
            var condition = navigator.onLine ? 'online' : 'offline';
            this.setState({ isOnline: (condition == "online") ? true : false }, function () {
                if (this.state.isOnline) {
                    this.syncAllData();
                }
            }) 
        })
    }
    
    syncAllData(){
        if(this.state.runningIndex< this.state.mastertables.length){
            this.setState({downloadinMessage: this.state.mastertables[this.state.runningIndex].progressText})
            this.httpManager.postRequest(this.state.mastertables[this.state.runningIndex].url, {data:"TAX"}).then(res=>{
                this.setState({runningIndex: this.state.runningIndex+1, progress: this.state.progress+this.state.mastertables[this.state.runningIndex].progresscompletion}, ()=>{
                    this.syncAllData();
                })
            }).catch(e=>{

            })
        }
        else{
            this.setState({progress:100}, ()=>{
                this.socket.emit('resetSync', {data:"Completed"})
                if(this.props.afterSyncComplete){
                    this.props.afterSyncComplete();
                }
            })
        }
    }

    renderOfflineContent() {
        return (<div style={{ height: '100%' }}>
            {/* {this.state.isLoading && <LoaderContent show={this.state.isLoading}></LoaderContent>} */}
             
            <div style={{ height: '100%' }}>
                 
                <Grid container spacing={3} style={{ height: 'calc(100% - 104px)', padding: 0 }}>
                    <Grid item xs={12} style={{ height: '100%', paddingRight: 0 }}>
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <img style={{ height: '100px' }} alt="offline" src="./static/icons/offline.png" />
                            <Typography variant="h4" style={{ color: "#ccc" }}>You are offline.</Typography>
                            <Typography variant="subtitle2" style={{ color: "#ccc", marginBottom: '1rem' }}>Please try again later.</Typography>
                            <Button variant="contained" onClick={()=>{
                                var condition = navigator.onLine ? 'online' : 'offline';
                                this.setState({ isOnline: (condition === "online") ? true : false }, function () {
                                    if (this.state.isOnline) {
                                        this.syncAllData();
                                    }
                                }) 
                                }}>Reload</Button>
                        </div>

                    </Grid>
                </Grid>

            </div></div>
        );
    }

    renderMain() {

        return (


            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>

                {this.state.isLoading && <LoadingModal show={this.state.isLoading}></LoadingModal>}


                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                    <Grid container spacing={2} >

                        <Grid item xs={2}> </Grid>
                        <Grid item xs={8}>
                            {/* <Grid item xs={12}><Typography variant="h6" noWrap >Please wait until finish..</Typography> </Grid> */}
                            <Grid item xs={12}></Grid>
                            <Grid item xs={12} style={{ marginTop: 20, display: 'flex' }}>
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress variant="determinate" value={this.state.progress} />
                                </Box>
                            </Grid>
                            <Grid item xs={12} style={{ marginTop: 10 }}><Typography variant="subtitle2" noWrap style={{ color: '#808080' }}> {this.state.downloadinMessage}...</Typography> </Grid>
                            <Grid item xs={12}><Typography variant="subtitle2" noWrap style={{ color: ' #808080' }}></Typography> </Grid>

                        </Grid>
                        <Grid item xs={2}> </Grid>
                    </Grid>

                </div>



            </div>
        )

    }

    render() {
        var content = this.renderMain()
        if (!this.state.isOnline) {
            content = this.renderOfflineContent()
        }

        return (<>
            {this.state.isOnline && this.renderMain()}
            {!this.state.isOnline && this.renderOfflineContent()}
            </>
        )
    }
}