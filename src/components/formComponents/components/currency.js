import * as React from 'react';
import { TextField  } from '@mui/material';
import PropTypes from 'prop-types';
import {NumericFormat} from "react-number-format";

function NumberFormatCustom(props) {
    const { inputRef, onChange, ...other } = props;
  
    return (
      <NumericFormat
        {...other}
        maxLength={props.maxLength} 
        getInputRef={inputRef}
        onChange={
            event =>{
                  onChange({
                        target: {
                        name: props.name,
                        value: event.target.value
                        }
                    });
            }
        }
        // onValueChange={values => {
        //   onChange({
        //     target: {
        //       name: props.name,
        //       value: values.value
        //     }
        //   });
        // }}
        allowLeadingZeros thousandSeparator="," 
        // isNumericString
      />
    );
  }
  
/* eslint-disable no-useless-escape */
export default class FCurrency extends React.Component{

    constructor(props){
        super(props);
        this.state={
            error:'',
            helperText:'',
            errorCustom:false
        }
    }

    componentDidMount(){ 
        if(this.props.error === true){
            this.setState({error: this.props.error, helperText: this.props.helperText})
        }
    }


  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.value !== prevState.value){
        //console.log("VALUE", nextProps.value, prevState.value)
        return {value: nextProps.value}
    }
    if (nextProps.error !== prevState.error && !prevState.errorCustom ) {
      return { error: nextProps.error, helperText: nextProps.helperText };
    }
    return null;
  }

    render(){
        return <TextField
            label={this.props.label}
            name ={this.props.name}
            id={this.props.id}
            error={this.state.error}
            helperText={this.state.helperText} 
            type={this.props.type}
            value={this.props.value}
            disabled={this.props.disabled}
            required={this.props.required}
            fullWidth={this.props.fullWidth}
            InputProps={{
                autoComplete: 'off',
                ...this.props.InputProps,
                inputComponent: NumberFormatCustom
            }}
            onChange={this.props.onChange}
            style={this.props.style}
            placeholder={this.props.label}
            tabindex={this.props.tabindex}
            onKeyDown={(e)=>{ 
                console.log(e)
                if(this.props.maxLength !== undefined && Number(this.props.maxLength) > 0){
                    if(e.keyCode !== 8 && e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 46 && e.target.value.length >= Number(this.props.maxLength)){
                        e.preventDefault();
                    }
                }
                if((this.props.format === 'number' ) && e.keyCode !== 8 && e.keyCode !== 46){
                    const pattern = /^[0-9]$/;  
                    if(!pattern.test(e.key) && e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 39){
                        e.preventDefault();
                    }
                }
                else if((this.props.format === 'numberdecimal' || this.props.format === 'currency') && e.target.value.toString().indexOf('.') === -1 && e.keyCode !== 8 && e.keyCode !== 9 && e.keyCode !== 46 ){
                    const pattern = /^[0-9.]$/; 
                    //console.log(e)
                    if(!pattern.test(e.key) && e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 39){
                        e.preventDefault();
                    }
                }
                else if((this.props.format === 'numberdecimal' || this.props.format === 'currency') && e.target.value.toString().indexOf('.') !== -1 && e.keyCode !== 8 && e.keyCode !== 9 && e.keyCode !== 46 ){
                    // const pattern =; 
                    //console.log(e)
                    if(! /^[0-9]$/.test(e.key) && e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 39){
                        e.preventDefault();
                    }
                }

                if(this.props.format === 'percentage' && e.target.value.toString().indexOf('.') === -1 && e.keyCode !== 8 && e.keyCode !== 9 && e.keyCode !== 46 ){
                    const pattern = /^[0-9.]$/; 
                    //console.log(e)
                    if(!pattern.test(e.key) && e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 39){
                        e.preventDefault();
                    }
                    if(Number((e.target.value+e.key)) > 100){
                        e.preventDefault()
                    }
                }
                else if(this.props.format === 'percentage' && e.target.value.toString().indexOf('.') !== -1 && e.keyCode !== 8 && e.keyCode !== 9 && e.keyCode !== 46 ){
                    // const pattern =; 
                    //console.log(e)
                    if(! /^[0-9]$/.test(e.key) && e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 39){
                        e.preventDefault();
                    }
                    if(Number((e.target.value+e.key)) > 100){
                        e.preventDefault()
                    }
                }


                if(this.props.format==='text' || this.props.format==='string'){
                    var k ;
                    document.all ? k = e.keyCode : k = e.which;
                    console.log(k)
                    if(((k > 64 && k < 91) || (k > 96 && k < 123)|| k===39 || k===37 || k ===9  || k === 8 || k === 32)){
                        console.log("IF")
                    }
                    else{
                        console.log("ELSE")
                        e.preventDefault();
                    }
                } 
                else if(this.props.format === 'email'){
                    var m;
                    document.all ? m = e.keyCode : m = e.which; 
                    if(((m > 64 && m < 91) || (m > 96 && m < 123) || m===39 || m===37 || m===9 || m === 8 || m === 32 || m === 50 || m === 190)){
                        console.log("IF")
                    }
                    else{
                        console.log("ELSE")
                        e.preventDefault();
                    }
                }
            }}
            onBlur={()=>{
                this.setState({error:false, helperText:'',errorCustom:false}) 
                if(this.props.format === 'email'){
                    var validRegex =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; ///^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                    if (this.props.value.match(validRegex)) {
                        //console.log("TRUE")
                    }
                    else{
                        //console.log("ERROR")
                        this.setState({errorCustom:true,helperText:"Please enter valid email", error: true})
                    }
                }
                else if(this.props.required && this.props.value === ''){
                    this.setState({errorCustom:true,helperText:"Field is required", error: true})
                } 
                if(this.props.onBlur){
                    //console.log(this.props.onBlur)
                    this.props.onBlur(this.props)
                }

                //console.log("TAB ::::: ", this.props)
            }}
        />
    }
}

FCurrency.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    error: PropTypes.bool,
    disabled:PropTypes.bool,
    helperText: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    required: PropTypes.bool,
    color: PropTypes.oneOf([
      'default',
      'primary',
      'secondary',
      'info',
      'success',
      'warning',
      'error'
    ]),
    fullWidth: PropTypes.bool,
    inputProps: PropTypes.object,
    onChange: PropTypes.func,
    onKeypress:PropTypes.func,
    onBlur:PropTypes.func,
    InputProps: PropTypes.object,
    style: PropTypes.object,
    defaultValue: PropTypes.number,
    rows: PropTypes.object,
    multiline:PropTypes.bool,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    format: PropTypes.string,
    tabindex: PropTypes.number
  };
