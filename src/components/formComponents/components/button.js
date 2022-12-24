import * as React from 'react';
import { Button  } from '@mui/material';
import PropTypes from 'prop-types';

export default class FButton extends React.Component{

    constructor(props){
        super(props);
        this.state={

        }
    }

    render(){
        const {color, fullWidth, variant, size, onClick, label, disabled, component, to, startIcon, className, style} = this.props;
        return <Button
        variant={variant}
        color={color}
        size={size}
        style={style}
        onClick={onClick}
        disabled={disabled}
        component={component}
        to={to}
        startIcon={startIcon}
        className={className}
        fullWidth={fullWidth}
      >
        {label}
      </Button>
    }
}

FButton.propTypes = {
    color: PropTypes.oneOf([
      'default',
      'primary',
      'secondary',
      'info',
      'success',
      'warning',
      'error'
    ]),
    variant: PropTypes.oneOf(['contained', 'outlined', 'ghost']),
    size: PropTypes.oneOf(['small', 'large', 'medium']),
    onClick: PropTypes.func,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    component: PropTypes.object,
    to: PropTypes.string,
    startIcon: PropTypes.object,
    className:PropTypes.string,
    fullWidth: PropTypes.bool,
    style:PropTypes.object
  };