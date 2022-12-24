import PropTypes from 'prop-types';
import React from 'react';
// material
import MuiPhoneNumber from 'material-ui-phone-number';
import { gridFilterActiveItemsLookupSelector } from '@mui/x-data-grid';

export default class FPhoneNumber extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          helperText: '',
          error: false,
          errorCustom: gridFilterActiveItemsLookupSelector
        }
    }

    validationCheck = (e) => {
        this.setState({helperText: '', error: false });
        // MobileNumber 
        if (e.target.value.length < 15 && e.target.value !== '') {
            this.setState({helperText: 'Please enter valid phone number.', error: true,errorCustom: true});
        } else {
            this.setState({helperText: '', error: false, errorCustom:false});
        } 
    }
    static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.error !== prevState.error || nextProps.errorUpdate === true  || nextProps.helperText !== prevState.helperText) {
        console.log("PHONE, ", { error: nextProps.error, helperText: nextProps.helperText })
        return { error: nextProps.error, helperText: nextProps.helperText };
      }
      return null;
    }
    render() {
        return(
            <MuiPhoneNumber
              defaultCountry={'us'}
              onlyCountries={["us"]}
              fullWidth 
              label={this.props.label}
              regions={['america', 'asia']}
              name={this.props.name}
              id={this.props.id}
              error={this.state.error}
              helperText={this.state.helperText}
              value={this.props.value}
              variant="outlined"
              onChange={this.props.onChange}
              onBlur={this.validationCheck}
              required={this.props.required}
              disabled={this.props.disabled}
              disableDropdown='true'
              sx={{
                svg:{
                  height:"20px"
                }
              }}
              onKeyDown={(e)=>{  
                console.log(e)
                // if(e.target.value.toString().length > 2){
                //   if(e.target.value.toString().substr(0,2)==='+1' && (e.keyCode === 8  || e.keyCode === 46) ){
                //     e.preventDefault()
                //   }
                // }
                if(e.target.value.length === 2 && (e.keyCode === 8  || e.keyCode === 46)){
                  e.preventDefault();
                }
              }}
            />
        )
    }
}
MuiPhoneNumber.propTypes = {
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
    InputProps: PropTypes.object,
    style: PropTypes.object,
    defaultValue: PropTypes.number,
    rows: PropTypes.object,
    multiline:PropTypes.bool,
  };