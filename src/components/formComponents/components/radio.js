import React from "react";
import PropTypes from 'prop-types'; 
// material
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import HTTPManager from "../../../utils/httpRequestManager";
import Spinner from "../../Spinner";
export default class FRadio extends React.Component{
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
              this.httpManager.postRequest(this.props.data,{data:"FROM CHECKBOX"}).then(response=>{
                var options = [];  
                response.data.forEach(el=>{ 
                  options.push({
                    label:this.getLabel(el),
                    value:this.getValue(el)
                  })
                  this.setState({options: options, isLoading:false})
                })
                if(response.data.length === 0){ 
                  this.setState({options: [], isLoading:false})
                }
              }).catch(e=>{
                console.log("ERROR::::", e)
              })
            });
      }
        else if(this.props.data !== ''){ 

          this.setState({isLoading: true},()=>{
              this.httpManager.getRequest(this.props.data).then(response=>{
                var options = [];  
                response.data.forEach(el=>{ 
                  options.push({
                    label:this.getLabel(el),
                    value:this.getValue(el)
                  })
                  this.setState({options: options, isLoading:false})
                })
                if(response.data.length === 0){ 
                  this.setState({options: [], isLoading:false})
                }
              }).catch(e=>{
                console.log("ERROR::::", e)
              })
            });
        }
    }

    getChecked(item){ 
      var key = item['value'] !== undefined ? item['value'].toString() :'';
      var val =  this.props.value !== undefined ? this.props.value.toString() : '';
      return key === val ? true : false;
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
        {!this.state.isLoading &&<FormControl fullWidth>
            <RadioGroup row aria-label="card" name="row-radio-buttons-group">
              {this.state.options.map(el=>{
                 return <FormControlLabel 
                    id={this.props.id}
                    name={this.props.name}
                    value={this.props.value}
                    label={el.label} 
                    checked={this.getChecked(el)} 
                    control={<Radio value={el.value} onClick={this.props.onChange} />} 
                />
              })}
            </RadioGroup>
          </FormControl>}
          </>
        );
    }
}

FRadio.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    value: PropTypes.string,
    checked: PropTypes.string,
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