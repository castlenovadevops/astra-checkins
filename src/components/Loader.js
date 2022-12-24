import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Dialog, DialogContent} from '@mui/material';

export default class Loader extends React.Component{

    render(){
        return <div className="loaderContainer">
            <Dialog
                open={true}
                style={{width: '100%',height: '100%',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',}}
                title= 'Loading'
                disablePortal={false}
                PaperProps={{
                    style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    },
                }}
            >
                <DialogContent style={{background: '#ffffff00'}}>
                    <CircularProgress className='loader'
                    size={50} ></CircularProgress>
                </DialogContent>
            </Dialog>
        </div>
    }
}