import React from 'react'; 

export default class Spinner extends React.Component{

    render(){
        return <div className="loaderContainer">
            <img src={'/static/icons/spinner.gif'} alt="Loading" style={{maxHeight:'40px'}}/>
        </div>
    }
}