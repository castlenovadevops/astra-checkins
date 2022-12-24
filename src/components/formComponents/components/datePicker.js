import * as React from 'react';
import { TextField  } from '@mui/material';
import PropTypes from 'prop-types';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';  
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'; 

export default class FDatepicker extends React.Component{

    constructor(props){
        super(props);
        this.state={
            error:'',
            helperText:'',
            errorCustom:false
        }
    }

    componentDidMount(){
        console.log(this.props)
        if(this.props.error === true){
            this.setState({error: this.props.error, helperText: this.props.helperText})
        }
    }


  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.error !== prevState.error && !prevState.errorCustom) {
      return { error: nextProps.error, helperText: nextProps.helperText };
    }
    return null;
  }

    render(){
        return <><LocalizationProvider dateAdapter={AdapterDayjs}> 
          <DesktopDatePicker
            inputFormat={this.props.inputFormat} 
            label={this.props.label}
            name ={this.props.name}
            id={this.props.id}
            error={this.state.error}
            helperText={this.state.helperText} 
            type={this.props.type}
            value={this.props.value}
            minDate={this.props.minDate}
            required={this.props.required}
            fullWidth={this.props.fullWidth}
            InputProps={this.props.InputProps}
            onChange={this.props.onChange}
            style={this.props.style}
            placeholder={this.props.label}
            disabled={this.props.disabled}
            renderInput={(params) => {params.error=false; return <TextField fullWidth={this.props.fullWidth} {...params} />}}
          /> 
          </LocalizationProvider></> 
    }
}

FDatepicker.propTypes = {
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
    inputFormat: PropTypes.string
  };
