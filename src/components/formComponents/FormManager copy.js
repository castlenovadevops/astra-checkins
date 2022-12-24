import * as React from 'react';
import Loader from '../Loader';
import { Navigate, Link as RouterLink  } from 'react-router-dom'; 
import { Grid, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Button, Link, InputAdornment } from '@mui/material';
import './forms.css';
import FTextField from './components/textField';
import FButton from './components/button';
import FSelect from './components/select';
import FMultiSelect from './components/multiselect';
import FPhoneNumber from './components/phonenumber'; 
import FDatepicker from './components/datePicker';
import FRadio from './components/radio';
import FCurrency from './components/currency';
import FCheckBox from './components/checkBox';
import HTTPManager from '../../utils/httpRequestManager';
import parse from 'html-react-parser'

export default class FormManager extends React.Component{
    httpManager = new HTTPManager(); 
    constructor(props){
        super(props);
        this.state={
            formName:'',
            properties:[],
            buttons:[],
            required:[],
            onSubmit:{},
            isLoading: false,
            isDisabled: true,
            redirect: false,
            redirectURL: '', 
            formError:'',
            showFormError: false,
            openDialog: false,
            showMsg:'',
            showTitle:'',
            isChanged: false,
            showFormActionError: false,
            formActionError:'',
            onError:{}
        }
        this.getFormFields = this.getFormFields.bind(this);
        this.renderFields = this.renderFields.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this); 
        this.renderErrorActionButtons = this.renderErrorActionButtons.bind(this);
    }

    handleCloseDialog(){
        this.setState({openDialog: false, showFormError: false, formError:'', showFormActionError: false,onError:{}})
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        //console.log(nextProps.formProps.properties)
        if (nextProps.formProps.properties !== undefined && nextProps.formProps.properties !== prevState.properties) { 
            var obj={}
            console.log("CHANGES")
            const formProps = Object.assign({}, nextProps.formProps);
            if(!prevState.isChanged || nextProps.formProps.force === true){
                console.log(nextProps.formProps)
                formProps.properties.forEach(field=>{
                    if(field.name!==undefined){
                        if(field.component === 'Select' && field.multiple !== undefined && field.multiple){
                            if(field.value !== undefined){
                                obj[field.name]=field.value 
                            }
                            else{ 
                                obj[field.name]=[]
                            }
                        }
                        else if(field.component === 'Checkbox'){
                            if(field.value !== undefined){
                                obj[field.name]=field.value 
                            }
                            else{
                                obj[field.name]=[]
                            }
                        }
                        else{
                            console.log(field.name, field.value)
                            if(field.value !== undefined){
                                obj[field.name]=field.value 
                            }
                            else{
                                obj[field.name]=''
                            }
                        }
                    }
                }) 

                obj["required"] = formProps.required||[]
                obj["isDisabled"]=false;
                Object.keys(obj).forEach(field=>{  
                    if(obj.required.indexOf(field) !== -1){
                        if(obj[field] instanceof Array){
                            if(obj[field].length === 0 || obj[field] === undefined || obj[field] === null){
                            ////console.log("#####", field);
                                obj["isDisabled"]=true;
                            }
                        }
                        else if(obj[field] instanceof Object){
                            if(Object.keys(obj[field]).length === 0 || obj[field] === undefined || obj[field] === null){
                            ////console.log("#####", field);
                                obj["isDisabled"]=true;
                            }
                        }
                        else{  
                            if((obj[field] !== null && obj[field].toString().trim() === '') || obj[field] === undefined || obj[field] === null){
                                ////console.log("$$$$$", field);
                                obj["isDisabled"]=true;
                            }
                        }
                    } 
                }) 
            }
            obj["buttons"] = formProps.buttons
            console.log(obj) 
            return { properties: nextProps.formProps.properties, ...obj };
        }
        return null;
    }

    renderFields(){
        var formFields = [];

        this.state.properties.forEach((field, tabindex)=>{
            const {component,error,multiple, helperText, type, format,data, style,minLength, validations,label,placeholder, maxLength, grid, name, value, disabled} = field;
           
            var required = false;
            if(this.state.required.indexOf(name) !== -1){
                required=true
            }
            
            if(component === 'TextField'){
                var fieldtype = type;
                if(format === 'password'){
                    fieldtype = 'password';
                }  
                var inputprops={} 
                if(format === 'phone'){
                    formFields.push(<Grid item xs={grid}>
                        <FPhoneNumber 
                        label={label}
                        fullWidth 
                        name={name}
                        required
                        disabled={disabled}
                        value={value}
                        onChange={(e) => { 
                            var stateVariable = Object.assign({}, this.state);
                            stateVariable[name]=e
                            stateVariable["isChanged"]=true;
                            this.setState(stateVariable, ()=>{
                                if(field.onChange !== undefined && field.onChange !== ''){
                                    this.props.formFunctions[field.onChange](stateVariable);
                                }
                                this.handleChangeValidation();
                            });
                        }}
                    /></Grid>)
                }
                else if(format === 'date'){  
                    formFields.push(<Grid item xs={grid} style={{display: (fieldtype === 'hidden' ? 'none':'block')}}>
                        <FDatepicker disabled={disabled} inputFormat={field.inputFormat} required={required} onBlur={(props)=>{
                            if(field.onBlur !== undefined && field.onBlur !== ''){
                                this.props.formFunctions[field.onBlur](props);
                            }
                        }} fullWidth InputProps={inputprops} error={error} helperText={helperText} type={fieldtype} format={format} minLength={minLength} maxLength={maxLength} validations={validations} label={label} placeholder={placeholder} name={name} value={this.state[name]} onChange={e=>{
                            //console.log("DATEPICKETLLLLL", e)
                            var stateVariable = Object.assign({}, this.state);
                            if(format === 'date'){
                                stateVariable[name]=e;
                            }
                            else{
                                stateVariable[name]=e.target.value;
                            }
                            stateVariable["isChanged"]=true;
                            this.setState(stateVariable, ()=>{
                                if(field.onChange !== undefined && field.onChange !== ''){
                                    this.props.formFunctions[field.onChange](stateVariable);
                                }
                                
                                this.handleChangeValidation();
                            });
                            ////console.log(this.state);
                        }}/>
                    </Grid>)
                }
                else if(format === 'percentage'){  
                    formFields.push(<Grid item xs={grid} style={{display: (fieldtype === 'hidden' ? 'none':'block')}}>
                        <FTextField tabindex={tabindex} required={required} onBlur={(props)=>{
                            if(field.onBlur !== undefined && field.onBlur !== ''){
                                this.props.formFunctions[field.onBlur](props, this.getFormFields());
                            }
                        }} fullWidth InputProps={{
                            endAdornment: <InputAdornment position="start">%</InputAdornment>,
                        }}  error={error} helperText={helperText} type={fieldtype} format={format} minLength={minLength} maxLength={maxLength} validations={validations} label={label} placeholder={placeholder} name={name} value={this.state[name]}  disabled={disabled} onChange={e=>{
                            var stateVariable = Object.assign({}, this.state);
                            stateVariable[name]=e.target.value;
                            stateVariable["isChanged"]=true; 

                            var newField = Object.assign({}, field);
                            newField.value = e.target.value

                            this.setState(stateVariable, ()=>{
                                if(field.onChange !== undefined && field.onChange !== ''){
                                    this.props.formFunctions[field.onChange](stateVariable);
                                } 
                                if(field.onBlur !== undefined && field.onBlur !== ''){ 
                                    this.props.formFunctions[field.onBlur](newField, this.getFormFields());
                                }     
                                this.handleChangeValidation();
                            });
                            ////console.log(this.state);
                        }}/>
                    </Grid>)
                }
                else if(format === 'currency'){  
                    formFields.push(<Grid item xs={grid} style={{display: (fieldtype === 'hidden' ? 'none':'block')}}>
                        <FCurrency required={required} onBlur={(props)=>{
                            if(field.onBlur !== undefined && field.onBlur !== ''){
                                this.props.formFunctions[field.onBlur](props, this.getFormFields());
                            }
                        }} fullWidth InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}  error={error} helperText={helperText} type={fieldtype} format={format} minLength={minLength} maxLength={maxLength} validations={validations} label={label} placeholder={placeholder} name={name} value={this.state[name]}  disabled={disabled} onChange={e=>{
                            var stateVariable = Object.assign({}, this.state);
                            stateVariable[name]=e.target.value;
                            stateVariable["isChanged"]=true; 

                            var newField = Object.assign({}, field);
                            newField.value = e.target.value

                            this.setState(stateVariable, ()=>{
                                if(field.onChange !== undefined && field.onChange !== ''){
                                    this.props.formFunctions[field.onChange](stateVariable);
                                } 
                                if(field.onBlur !== undefined && field.onBlur !== ''){ 
                                    this.props.formFunctions[field.onBlur](newField, this.getFormFields());
                                }     
                                this.handleChangeValidation();
                            });
                            ////console.log(this.state);
                        }}/>
                    </Grid>)
                }
                else{  
                    if(format === 'email')
                        console.log(name,"----", value)
                    formFields.push(<Grid item xs={grid} style={{display: (fieldtype === 'hidden' ? 'none':'block')}}>
                        <FTextField required={required} onBlur={(props)=>{
                            if(field.onBlur !== undefined && field.onBlur !== ''){
                                this.props.formFunctions[field.onBlur](props, this.getFormFields());
                            }
                        }} fullWidth InputProps={inputprops} error={error} helperText={helperText} type={fieldtype} format={format} minLength={minLength} maxLength={maxLength} validations={validations} label={label} placeholder={placeholder} name={name} value={this.state[name]}  disabled={disabled} onChange={e=>{
                            var stateVariable = Object.assign({}, this.state);
                            stateVariable[name]=e.target.value;
                            stateVariable["isChanged"]=true; 

                            var newField = Object.assign({}, field);
                            newField.value = e.target.value

                            this.setState(stateVariable, ()=>{
                                if(field.onChange !== undefined && field.onChange !== ''){
                                    this.props.formFunctions[field.onChange](stateVariable);
                                } 
                                if(field.onBlur !== undefined && field.onBlur !== ''){ 
                                    this.props.formFunctions[field.onBlur](newField, this.getFormFields());
                                }     
                                this.handleChangeValidation();
                            });
                            ////console.log(this.state);
                        }}/>
                    </Grid>)
                }
            }
            else if(component === 'Select'){
                if(multiple !== undefined && multiple){
                    formFields.push(<Grid item xs={grid}>
                        <FMultiSelect required={required} disabled={disabled}  fullWidth dataformat={field.dataformat} label={label} multiple={true} data={data} placeholder={placeholder} name={name} value={this.state[name]} onChange={e=>{
                            //console.log(e.target.value)
                            var stateVariable = Object.assign([], this.state);
                            stateVariable[name]=e.target.value;
                            stateVariable["isChanged"]=true;
                            this.setState(stateVariable, ()=>{
                                if(field.onChange !== undefined && field.onChange !== ''){
                                    this.props.formFunctions[field.onChange](stateVariable);
                                }
                                this.handleChangeValidation();
                            }); 
                        }}/>
                    </Grid>)
                }
                else{ 
                    formFields.push(<Grid item xs={grid}>
                        {field.type !== 'hidden' && <FSelect fullWidth disabled={disabled}  required={required} dataformat={field.dataformat}  label={label} data={data} placeholder={placeholder} name={name} value={this.state[name]} onChange={e=>{
                            var stateVariable = Object.assign({}, this.state);
                            stateVariable[name]=e.target.value;
                            stateVariable["isChanged"]=true;
                            this.setState(stateVariable, ()=>{
                                if(field.onChange !== undefined && field.onChange !== ''){
                                    this.props.formFunctions[field.onChange](stateVariable);
                                }
                                this.handleChangeValidation();
                            });
                            ////console.log(this.state);
                        }}/> }
                    </Grid>)
                }
            }

            else if(component === 'Radio'){ 
                formFields.push(<> {field.type !== 'hidden' &&<Grid item xs={grid}>
                     <FRadio fullWidth disabled={disabled}  required={required} dataformat={field.dataformat}  label={label} data={data} placeholder={placeholder} name={name} value={this.state[name]} onChange={e=>{
                        //console.log("NCHANGE CALLED",e.target.value) 
                        var stateVariable = Object.assign({}, this.state);
                        stateVariable[name]=e.target.value;
                        stateVariable["isChanged"]=true;
                        this.setState(stateVariable, ()=>{
                            if(field.onChange !== undefined && field.onChange !== ''){
                                this.props.formFunctions[field.onChange](this.getFormFields());
                            }
                            this.handleChangeValidation();
                        });
                        ////console.log(this.state);
                    }}/> 
                </Grid>}</>) 
            }

            else if(component === 'Checkbox'){ 
                formFields.push(<> {field.type !== 'hidden' &&<Grid item xs={grid}> 
                     <FCheckBox disabled={disabled}  fullWidth required={required} style={{width:field.checkboxWidth ? field.checkboxWidth :'auto'}} dataformat={field.dataformat}  label={label} data={data} placeholder={placeholder} name={name} value={this.state[name]} onChange={e=>{
                        
                        var stateVariable = Object.assign({}, this.state);
                        var values = stateVariable[name];
                        //console.log(values)
                        if(e.target.checked){
                            values.push(e.target.value.toString())
                        }
                        else{
                            var idx = values.indexOf(e.target.value.toString());
                            values.splice(idx,1);
                        }
                        //console.log(values);
                        stateVariable[name]=values;//e.target.value;
                        stateVariable["isChanged"]=true;
                        this.setState(stateVariable, ()=>{
                            if(field.onChange !== undefined && field.onChange !== ''){
                                this.props.formFunctions[field.onChange](stateVariable);
                            }
                            this.handleChangeValidation();
                        });
                        ////console.log(this.state);
                    }}/>
                </Grid>}</>) 
            }

            else  if(component === 'Link'){ 
                formFields.push(<Grid item xs={grid}>
                    <div style={style}>
                        <Link variant="subtitle2" to={field.url} component={RouterLink}>{field.label}</Link>    
                    </div>
                </Grid>)
            }
            else{ 
                formFields.push(<Grid item xs={grid}>
                    <div style={style}>{field.text}</div>
                </Grid>)
            }
        })
        return formFields;
    }

    renderButtons(){
        var buttonfields = [];
        this.state.buttons.forEach(btn=>{
            const {label, type, grid, variant, disabled} = btn;

            buttonfields.push(<Grid item xs={grid}>
                <FButton fullWidth size="large" variant={variant} disabled={type==='submit' ? this.state.isDisabled : (type==='closeWithAction' ? (this.state[disabled] === null || this.state[disabled] === '' || this.state[disabled] === undefined ? true : false) : false)} label={label} onClick={()=>{
                    if(type==='submit'){
                        this.submitForm()
                    }
                    if(type==='close'){
                        this.props.closeForm();
                    }
                    if(type === 'closeWithAction'){
                        this.props.closeForm(label, this.getFormFields())
                    }
                }
                }/>
            </Grid>)
        });
        return buttonfields;
    }

    handleChangeValidation(){
        var stateVariable = this.getFormFields()
        var requiredFields = Object.assign([], this.state.required); 
        this.setState({isDisabled:false}, ()=>{
            //console.log(stateVariable)
            Object.keys(stateVariable).forEach(field=>{
                if(requiredFields.indexOf(field) !== -1){
                    if(stateVariable[field] instanceof Array){
                        if(stateVariable[field].length === 0 || stateVariable[field] === undefined || stateVariable[field] === null){
                          ////console.log("#####", field);
                            this.setState({isDisabled: true})
                        }
                    }
                    else if(stateVariable[field] instanceof Object){
                        if(Object.keys(stateVariable[field]).length === 0 || stateVariable[field] === undefined || stateVariable[field] === null){
                          ////console.log("#####", field);
                            this.setState({isDisabled: true})
                        }
                    }
                    else{ 

                        if((stateVariable[field] !== null && stateVariable[field].toString().trim() === '') || stateVariable[field] === undefined || stateVariable[field] === null){
                            ////console.log("$$$$$", field);
                          this.setState({isDisabled: true})
                        }
                    }
                } 
            })
        })
    }

    submitForm(){
        this.setState({showFormError: false, formError:''});
        var props=[];
        console.log(this.getFormFields())
        this.state.properties.forEach((el, idx)=>{
            delete el["error"];
            delete el["helperText"];
            props.push(el);
            if(idx === this.state.properties.length-1){
                this.setState({properties: props});
            }
        })
        console.log(this.state.onSubmit)
        this.successCallback(this.state.onSubmit);
    }

    getFormFields(){
        ////console.log(this.state)
        var stateVariable = Object.assign({}, this.state);
        delete stateVariable["formName"];
        delete stateVariable["properties"];
        delete stateVariable["buttons"];
        delete stateVariable["required"];
        delete stateVariable["onSubmit"];
        delete stateVariable["isLoading"];
        delete stateVariable["isDisabled"];
        delete stateVariable["redirect"];
        delete stateVariable["redirectURL"];
        delete stateVariable["showFormError"];
        delete stateVariable["formError"];
        delete stateVariable["openDialog"];
        delete stateVariable["showTitle"];
        delete stateVariable["showMsg"];
        delete stateVariable["isChanged"]
        
        return stateVariable;
    }


    renderRedirect = () => {
        if (this.state.redirect) {
            return  <Navigate to={this.state.redirectURL} />
        }
        else {
        return <div></div>
        }
    }

    successCallback(obj, response={}){
        const {action, method, url, onSuccess} = Object.assign({}, obj);  
        console.log(obj)
        if(action !== undefined){
            this.setState({showFormError: false, formError: '', isLoading: true})
            switch(action.toLowerCase()){
                case 'api': 
                    if(method.toLowerCase() === 'post'){  
                        this.httpManager.postRequest(url, this.getFormFields()).then(response=>{
                            if(onSuccess !== undefined && onSuccess instanceof Object){
                                this.successCallback(onSuccess, response);
                            }
                            this.setState({isLoading: false})
                        }).catch(e=>{
                            ////console.log(e)
                            this.setState({isLoading: false})
                            this.setFormErrorBlocks(e, obj)
                        })
                    } 
                    else if(method.toLowerCase() === 'get'){
                        this.httpManager.getRequest(url).then(response=>{
                            console.log(response.data)
                        })
                    }
                    break;
                case 'savelocalstorage':
                    var options = obj.options;
                    options.forEach(opt=>{
                        if(response[opt.key] !== undefined){
                            if(response[opt.key] instanceof Object || response[opt.key] instanceof Array){
                                window.localStorage.setItem(opt.key, JSON.stringify(response[opt.key]));
                            }
                            else{
                                window.localStorage.setItem(opt.key, response[opt.key]);
                            }
                        }
                    })
                    this.setState({isLoading: false})
                    this.successCallback(onSuccess)
                    break;
                case 'showpopup': 
                    this.setState({isLoading: false})
                    this.setState({ redirectURL: url,showTitle: response.title, showMsg: response.message, openDialog: true })
                    break;
                case 'redirect':
                    this.setState({isLoading: false})
                    this.setState({redirect: true, redirectURL: url})
                    break;
                case 'reloaddata':
                    this.setState({isLoading: false})
                    this.props.reloadData(response.message);
                    break;
                default:
                    ////console.log(response);
                    break;
            }
        }
    }

    setFormErrorBlocks(error, obj){
        if(obj.onError){ 
            this.setState({showFormActionError: true, formActionError: error.message, onError: obj.onError})
        }
        else if(error.field !== undefined && error.field !== ''){
            var props=[];
            this.state.properties.forEach((el, idx)=>{
                if(el.name === error.field){
                    el.error = true
                    el.helperText = error.message
                    ////console.log(el)
                }
                props.push(el);
                if(idx === this.state.properties.length-1){
                    this.setState({properties: props});
                }
            })
        }
        else{
            this.setState({showFormError: true, formError: error.message})
        }
    }  

    componentDidMount(){
        if(this.props.formProps !== undefined){
            this.setState({isLoading: true})
            const formProps = Object.assign({}, this.props.formProps);
            if(formProps.properties instanceof Array){
                formProps.properties.forEach(field=>{
                    if(field.name!==undefined){
                        if(field.component === 'Select' && field.multiple !== undefined && field.multiple){
                            if(field.value !== undefined){
                                this.setState({[field.name]:field.value})
                            }
                            else{
                                this.setState({[field.name]:[]})
                            }
                        }
                        else if(field.component === 'Checkbox'){
                            if(field.value !== undefined){
                                this.setState({[field.name]:field.value})
                            }
                            else{
                                this.setState({[field.name]:[]})
                            }
                        }
                        else{
                            if(field.value !== undefined){
                                this.setState({[field.name]:field.value})
                            }
                            else{
                                this.setState({[field.name]:''})
                            }
                        }
                    }
                })
            }
            this.setState(formProps, ()=>{ 
                this.handleChangeValidation();
                this.setState({isLoading: false})
            })
        }
    }

    renderErrorActionButtons(){
        var buttons = []
        if(this.state.onError.actionButtons){
            this.state.onError.actionButtons.forEach(btn=>{
                const {label, type,  variant} = btn;

                buttons.push( 
                    <FButton  style={{marginRight:'10px', width:'max-content'}} fullWidth size="large" variant={variant} label={label} onClick={()=>{
                        
                        if(type === 'closeWithAction'){
                            this.props.closeForm(label, this.getFormFields())
                        }
                    }
                    }/>
                )
            })
        }
        return buttons;
    }

    render(){
        return <div className="formContainer">
            {this.state.isLoading && <Loader />}
            {this.renderRedirect()}
            <form name={this.state.formName} className={this.state.formClass !== undefined ? this.state.formClass : ''}>
                <Grid container spacing={3}  alignItems="center"  justifyContent="center" className='formGrid' > 
                    {/* <Grid item xs={9}>
                        <Grid container spacing={3}  alignItems="center"  justifyContent="center">  */}
                            {this.renderFields()}
                            {this.props.formProps.formName !== 'syncCode' && <Grid container spacing={12}  alignItems="center" sx={{mt:2}}  justifyContent="center">  
                                {this.renderButtons()}
                            </Grid>}
                            {this.props.formProps.formName === 'syncCode'&& this.renderButtons()} 
                        {/* </Grid>
                    </Grid> */}
                    <Grid item xs={3}></Grid>
                </Grid>                   
            </form>
            <Dialog
                    open={this.state.openDialog}
                    onClose={this.handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                    {this.state.showTitle}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.state.showMsg}
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button> <Link to={this.state.redirectURL} component={RouterLink} underline="none">OK</Link> </Button> 
                    </DialogActions>
                </Dialog>


                {/* {this.state.showFormError && <p style={{color:'red'}}>{this.state.formError}</p>} */}

            <Dialog
                    open={this.state.showFormError}
                    onClose={this.handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Error
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {this.state.formError}
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={()=>{
                            this.setState({showFormError: false, formError:''})
                        }}>OK </Button> 
                    </DialogActions>
                </Dialog>


                <Dialog
                    fullWidth
                    maxWidth="lg"
                    open={this.state.showFormActionError}
                    onClose={this.handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Error
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description" style={{margin:'10px'}}>
                        {parse(this.state.formActionError)}
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                            {this.renderErrorActionButtons()}
                            <Button variant="outlined" style={{marginRight:'10px'}} onClick={()=>{
                                this.setState({showFormActionError: false, formActionError:'', onError:{}})
                            }}>Cancel </Button> 
                        </div>
                    </DialogActions>
                </Dialog>

        </div>
    }
}