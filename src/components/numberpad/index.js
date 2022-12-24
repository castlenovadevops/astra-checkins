import React from 'react'; 
import { Typography,Container, Box, Grid } from '@material-ui/core'; 
import BackspaceOutlined from '@mui/icons-material/BackspaceOutlined';
import Done from '@mui/icons-material/Done';
import CodeInput from './CodeInput' 

 const numStyle = {
    cursor: 'pointer',
    border: '2px solid #134163',
    borderRadius:'50%', 
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
 }

 const hightlightNmStyle = {
    cursor: 'pointer',
    border: '2px solid #134163',
    borderRadius:'50%',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    background: '#134163',
    color: '#ffffff'
 }
 const doneButtonStyle = {
    cursor: 'pointer',
    border: '2px solid #f0f0f0',
    borderRadius:'50%',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 40,
    background: '#134163', 
    color: '#ffffff'
 }
 const disableddoneButtonStyle = {
    cursor: 'pointer',
    border: '2px solid #f0f0f0',
    borderRadius:'50%',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 40,
    background: '#f0f0f0',
    color: '#D2D2D2'
 } 
 
 class NumberPad extends React.Component{

    child = React.createRef(<CodeInput/>);
    timer;
    constructor(props){ 
        super(props);
        this.state={
            codeLength : props.codeLength,
            textLabel: props.textLabel,
            codeValue : '',
            codeValueArray: [],
            submitCode: '',
            disabled: true,
            highLightedButton : -1, 
            isReload: false,
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmitPasscode = this.onSubmitPasscode.bind(this)
        this.child = React.createRef(); 
        this.clearPasscode = this.clearPasscode.bind(this)
    }


    // static getDerivedStateFromProps(nextProps, prevState) { 
    //     if (nextProps.numbercode !== prevState.codeValue) {
    //         if(nextProps.numbercode.length === 0 && prevState.codeValue.length === prevState.codeLength  )
    //             return { codeValue: nextProps.numbercode, codeValueArray: nextProps.numbercode.split("") }; 
    //     }
    //     return null;
    // }

    componentDidMount(){
        // if(this.props.numbercode != undefined){
        //     this.setState({codeValue: this.props.numbercode, codeValueArray: this.props.numbercode.split("") })
        // }

        this.props.clearPasscode(this.clearPasscode);

    }

    clearPasscode() {
        // // console.log("passcode to be clear..")

        this.setState({
            codeValue : '',
            codeValueArray: [],
            highLightedButton : -1, 
            disabled: true
        }, function () {
            this.child.current.updateValue([]);
        })

    }

    onChange(e){
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
           this.setState({codeValue: e.target.value}, function() {
            this.props.handleChangeCode(this.state.codeValue)
           })
        }
     }

    clearHighlight(){ 
        clearTimeout(this.timer); 
        this.timer =  setTimeout(() => {
            this.setState({highLightedButton:-1})
        }, 300); 
    }
    getValue(value) {
        // // console.log("getValue",value)

        this.setState({highLightedButton: value}, function(){   
            this.clearHighlight();
        })
        var codeValueCheck = '';
        var tcodeValueArray = this.state.codeValueArray
        if(this.state.codeValue.length <= this.state.codeLength - 1){
            if (value !== 'remove' && value !== 'enter'){
                codeValueCheck =  this.state.codeValue + value   
                tcodeValueArray.push( value )
                this.setState( {codeValue : codeValueCheck, codeValueArray: tcodeValueArray},function() {
                    this.child.current.updateValue(this.state.codeValueArray);
                }) 
            } 
        }
        if (value === 'remove'){
            this.setState( {codeValue : "", codeValueArray: []}, function() {
                this.child.current.updateValue(this.state.codeValueArray);
                this.props.handleChangeCode(value)
            })

        }
        if (value === 'enter'){
            codeValueCheck = this.state.codeValue.substring(0,this.state.codeValue.length-1); 
            tcodeValueArray.splice(tcodeValueArray.length-1, 1);
            
            this.setState( {codeValue : codeValueCheck, codeValueArray: tcodeValueArray,disabled: true},function(){

                this.child.current.updateValue(this.state.codeValueArray);
                if(tcodeValueArray.length<this.state.codeLength){
                    this.props.handleChangeCode('remove')
                }
            })
        }
        
    };

    onSubmitPasscode(value) {
        //// console.log("submitcode ")
        this.setState({submitCode: value, disabled: false},function() {
            this.props.handleChangeCode(value)
        }) 
    } 


    render() {
        // // console.log("render::",this.state.disabled)
        var content =  <span style={doneButtonStyle}><Done style={{fontSize:"30px"}}/></span>
        if(this.state.disabled) {
            content =  <span style={disableddoneButtonStyle}><Done style={{fontSize:"30px"}}/></span>
        } 

        return(
            <div>
            <Container maxWidth="sm">
            <div style={{backgroundColor: 'transparent'}}>
                <div>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                        <CodeInput ref={this.child} codeLength={this.state.codeLength} onSubmitPasscode={this.onSubmitPasscode} 
                            codeValueArray={this.state.codeValueArray}></CodeInput>
                           
                        </Box>
                        <div  style={{marginTop:20,padding:5}}>
                            <Grid container spacing={3}> 

                            <Grid item xs={12}>
                                    <Grid container justifyContent="center" spacing={4}>
                                    <Grid key={1} item xs={4}>
                                            <Typography variant="subtitle2" style={{display:'flex', color: '#134163',alignItems: 'center',justifyContent: 'center',MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center" onClick={() => this.getValue(1)}><span style={(this.state.highLightedButton===1) ? hightlightNmStyle:numStyle}> {1}</span></Typography>
                                    </Grid>
                                    <Grid key={2} item xs={4}>
                                            <Typography variant="subtitle2" style={{display:'flex', color: '#134163',alignItems: 'center',justifyContent: 'center',MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center" onClick={() => this.getValue(2)}><span style={(this.state.highLightedButton===2) ? hightlightNmStyle:numStyle}> {2}</span></Typography>
                                    </Grid>
                                    <Grid key={3} item xs={4}>
                                        <Typography variant="subtitle2" style={{display:'flex', color: '#134163',alignItems: 'center',justifyContent: 'center',MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center" onClick={() => this.getValue(3)}><span style={(this.state.highLightedButton===3) ? hightlightNmStyle:numStyle}> {3}</span></Typography>
                                    </Grid>
                                    </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                    <Grid container justifyContent="center" spacing={4}>
                                    <Grid key={4} item xs={4}>
                                            <Typography variant="subtitle2" style={{display:'flex', color: '#134163',alignItems: 'center',justifyContent: 'center',MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center" onClick={() => this.getValue(4)}><span style={(this.state.highLightedButton===4) ? hightlightNmStyle:numStyle}> {4}</span></Typography>
                                    </Grid>
                                    <Grid key={5} item xs={4}>
                                        <Typography variant="subtitle2" style={{display:'flex', color: '#134163',alignItems: 'center',justifyContent: 'center',MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center" onClick={() => this.getValue(5)}><span style={(this.state.highLightedButton===5) ? hightlightNmStyle:numStyle}> {5}</span></Typography>
                                    </Grid>
                                    <Grid key={6} item xs={4}>
                                        <Typography variant="subtitle2" style={{display:'flex', color: '#134163',alignItems: 'center',justifyContent: 'center',MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center" onClick={() => this.getValue(6)}><span style={(this.state.highLightedButton===6) ? hightlightNmStyle:numStyle}> {6}</span></Typography>
                                    </Grid>
                                    </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                    <Grid container justifyContent="center" spacing={4}>
                                    <Grid key={7} item xs={4}>
                                            <Typography variant="subtitle2" style={{display:'flex', color: '#134163',alignItems: 'center',justifyContent: 'center',MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center" onClick={() => this.getValue(7)}><span style={(this.state.highLightedButton===7) ? hightlightNmStyle:numStyle}> {7}</span></Typography>
                                    </Grid>
                                    <Grid key={8} item xs={4}>
                                        <Typography variant="subtitle2" style={{display:'flex', color: '#134163',alignItems: 'center',justifyContent: 'center',MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center" onClick={() => this.getValue(8)}><span style={(this.state.highLightedButton===8) ? hightlightNmStyle:numStyle}> {8}</span></Typography>
                                    </Grid>
                                    <Grid key={9} item xs={4}>
                                        <Typography variant="subtitle2" style={{display:'flex', color: '#134163',alignItems: 'center',justifyContent: 'center',MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center" onClick={() => this.getValue(9)}><span style={(this.state.highLightedButton===9) ? hightlightNmStyle:numStyle}> {9}</span></Typography>
                                    </Grid>
                                    </Grid>
                            </Grid>


                            <Grid item xs={12}>
                                    
                                    <Grid container justifyContent="center" spacing={4}>
                                       

                                        <Grid key={'enter'} item xs={4}>
                                            <Typography variant="subtitle2" style={{display:'flex', alignItems: 'center',color: '#134163',justifyContent: 'center',MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center" onClick={() => this.getValue('enter')}><span style={(this.state.highLightedButton==="enter") ? hightlightNmStyle:numStyle}><BackspaceOutlined style={{fontSize:"20px"}}/></span></Typography>
                                        </Grid>
                                   
                                        <Grid key={'0'} item xs={4}>
                                            <Typography variant="subtitle2" style={{display:'flex', alignItems: 'center',color: '#134163',justifyContent: 'center',MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center" onClick={() => this.getValue(0)}><span style={(this.state.highLightedButton===0) ? hightlightNmStyle:numStyle}> 0 </span></Typography>
                                        </Grid>
                                        

                                        <Grid key={'submit'} item xs={4}>
                                            <Typography variant="subtitle2"  style={{display:'flex', color: '#134163', alignItems: 'center', justifyContent: 'center',  
                                            MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none', userSelect: 'none'}} align="center" 
                                            onClick={() => {
                                                if(!this.state.disabled) {
                                                    this.props.onSubmit(this.state.submitCode)
                                                }
                                                
                                            }} >

                                            {content}

                                            </Typography>
  
                                        </Grid>
                                   
                                        
                                    </Grid>
                                  
                                  
                            </Grid>

                            </Grid>
                        </div>


                </div>
            </div>
            </Container>
        </div>
        )
    }
 }
 export default NumberPad;

