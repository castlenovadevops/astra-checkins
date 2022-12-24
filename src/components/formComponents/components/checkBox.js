import React from "react";
import PropTypes from 'prop-types'; 
// material
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import RadioGroup from '@mui/material/RadioGroup';
import HTTPManager from "../../../utils/httpRequestManager";
import {  Typography } from "@mui/material";
import Spinner from '../../Spinner';

export default class FCheckBox extends React.Component{
  httpManager = new HTTPManager();
    constructor(props){
        super(props);
        this.state={
          options:[],
          isLoading: false
        }
        this.getLabel = this.getLabel.bind(this);
        this.getValue = this.getValue.bind(this);
    }
    componentDidMount(){ 
        if(this.props.data instanceof Array){
            this.setState({options: this.props.data})
        }
        else if(this.props.data !== ''){ 
          this.setState({isLoading: true},()=>{
            this.httpManager.postRequest(this.props.data,{data:"FROM CHECKBOX"}).then(response=>{
              var options = [];  
              response.data.forEach(el=>{ 
                options.push({
                  label:this.getLabel(el),
                  value:this.getValue(el)
                })
                this.setState({options: options, isLoading: false})
              })
              if(response.data.length === 0){ 
                this.setState({options: [], isLoading:false})
              }
            }).catch(e=>{
              console.log("ERROR::::", e)
            })
          })
        }
    }

    getChecked(item){  
      var val = item['value'] !== undefined ? item['value'].toString() : ''; 
      return this.props.value ? (this.props.value.indexOf(val) !== -1 ? true : false) : false;
    }

    getLabel(item){
        var labelkey = this.props.dataformat !== undefined ? this.props.dataformat.label : 'label';
        return item[labelkey];
    }

    getValue(item){  
        var valuekey = this.props.dataformat !== undefined ? this.props.dataformat.value : 'value';
        return item[valuekey];
    }
    render() {
        return (<>
          {this.state.isLoading && <Spinner/>}
          {!this.state.isLoading && <FormControl fullWidth> 
          {this.props.label && <Typography variant="body2" style={{fontWeight:'bold', fontSize:'500'}} >
            {this.props.label}
          </Typography> }
            <RadioGroup row aria-label="card" name="row-radio-buttons-group">
              {this.state.options.map(el=>{
                 return <FormControlLabel 
                    id={this.props.id}
                    name={this.props.name}
                    value={this.props.value}
                    label={el.label} 
                    disabled={this.props.disabled}
                    checked={this.getChecked(el)} 
                    fullWidth={this.props.fullWidth}
                    style={this.props.style}
                    control={<Checkbox value={el.value} onClick={this.props.onChange} />} 
                />
              })}
            </RadioGroup>
          </FormControl>}
          {!this.state.isLoading && this.state.options.length === 0 && <Typography variant="subtitle" style={{fontSize:'13px',color:'#999' }} >
            {this.props.emptyMsg}
          </Typography>}
          </>
        );
    }
}

FCheckBox.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.string,
    checked: PropTypes.string,
    style: PropTypes.object,
    fullWidth: PropTypes.bool,
    color: PropTypes.oneOf([
      'default',
      'primary',
      'secondary',
      'info',
      'success',
      'warning',
      'error'
    ]),
    onChange: PropTypes.string 
  };