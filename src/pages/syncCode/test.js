import React from 'react'; 
import HTTPManager from '../../utils/httpRequestManager';
import {Button} from '@mui/material';

export default class TestComponent extends React.Component{
    httpManager = new HTTPManager();
    constructor(props){
        super(props)
    }


    componentDidMount(){
        this.checkConnection();
    }

    checkConnection(){
        this.httpManager.postRequest(`checkconnection`,{data:"SDASDASDASD"}).then(res=>{
            console.log(res);
        })
    }


    insertdata(){
        this.httpManager.postRequest(`insertdata`,{data:"SDASDASDASD"}).then(res=>{
            console.log(res);
        })
    }
    render(){
        return <div>
            TestComponent

            <Button onClick={()=>{
                this.checkConnection();
            }}>Click</Button>



<Button onClick={()=>{
                this.insertdata();
            }}>Insert</Button>
            </div>
    }
}