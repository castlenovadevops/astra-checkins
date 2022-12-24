import React from "react";
import PropTypes from 'prop-types'; 
// material
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import HTTPManager from '../../../utils/httpRequestManager';
import Spinner from "../../Spinner";
export default class FMultiSelect extends React.Component{
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
        else if(this.props.data !== '' && this.props.data.indexOf('https://') === -1){ 
          this.setState({isLoading: true},()=>{
              this.httpManager.getRequest(this.props.data).then(response=>{
                var options = [];  
                response.data.forEach(el=>{ 
                  console.log(el)
                    options.push({
                        label:this.getLabel(el),
                        value:this.getValue(el)
                    })
                    this.setState({options: options, isLoading:false})
                })
                if(response.data.length === 0){ 
                  this.setState({options: [], isLoading:false})
                }
              })
            });
        }
        else if(this.props.data !== ''){

          this.setState({isLoading: true},()=>{
              this.httpManager.postRequest(this.props.data,{data:"FROM CHECKBOX"}).then(response=>{
                var options = [];  
                response.data.forEach(el=>{ 
                  console.log(el)
                    options.push({
                        label:this.getLabel(el),
                        value:this.getValue(el)
                    })
                    this.setState({options: options, isLoading:false})
                })
                if(response.data.length === 0){ 
                  this.setState({options: [], isLoading:false})
                }
              })
            });
        }
    }

    getLabel(item){
        var labelkey = this.props.dataformat !== undefined ? this.props.dataformat.label : 'label';
        return item[labelkey];
    }

    getValue(item){  
        var valuekey = this.props.dataformat !== undefined ? this.props.dataformat.value : 'value';
        if(valuekey === 'all'){
          console.log(item)
          return item;
        }
        return item[valuekey];
    }

    render() {
        return (<>
          {this.state.isLoading && <Spinner/>}
          {!this.state.isLoading &&<FormControl 
          required={this.props.required} fullWidth>
            <InputLabel id="demo-simple-select-label">{this.props.label}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id={this.props.id}
              name={this.props.name}
              value={this.props.value||[]}
              label={this.props.label}
              onChange={this.props.onChange}
              onSelect={this.props.onChange}
              error={this.props.error}
              helperText={this.props.helperText}
              required={this.props.required}
              color={this.props.color}
              multiple={true}
            >
              {this.state.options.map((v, i) => (
                <MenuItem value={v.value} key={i}>
                    {v.label}
                </MenuItem>
              ))}
            </Select> 
          </FormControl>}
          </>
        );
      }
    }
FMultiSelect.propTypes = {
      label: PropTypes.string,
      name: PropTypes.string,
      id: PropTypes.string,
      error: PropTypes.bool,
      helperText: PropTypes.string,
      value: PropTypes.array,
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
      optionlist: PropTypes.array,
      onChange: PropTypes.string,
      multiple: PropTypes.bool,
      dataformat: PropTypes.object
    };
    