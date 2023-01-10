import React from "react";
import {Grid, Container, TextField,Stack, IconButton,InputAdornment, Button, DialogContent, Dialog, DialogActions, List, ListItem, ListItemIcon, ListItemButton, ListItemText} from '@mui/material';
import { ArrowCircleRightOutlined, Close } from "@mui/icons-material";
import HTTPManager from "../../utils/httpRequestManager";
import Loader from '../../components/Loader';
import { AccountCircleOutlined } from "@mui/icons-material"; 
import { CSSTransition, TransitionGroup } from "react-transition-group";
import MuiPhoneNumber from "material-ui-phone-number";
import { Star } from "@mui/icons-material";
import dayjs from 'dayjs';
import schemaObj from './schema.json'
import FormManager from "../../components/formComponents/FormManager";
export default class CheckInComponent extends React.Component{
    // static propTypes = {
    //     selectedSubreddit: PropTypes.string.isRequired,
    //     posts: PropTypes.array.isRequired,
    //     isFetching: PropTypes.bool.isRequired,
    //     lastUpdated: PropTypes.number,
    //     dispatch: PropTypes.func.isRequired
    //   };

    httpManager = new HTTPManager();
    constructor(props){
        super(props)
        this.state={
            searchPhone:'',
            searchName:'',
            asGuest:false,
            guestName:'',
            customerDetail:{},
            currentDivIndex: 'home',
            isNext: false,
            isLoading: false,
            showError: false,
            errorText:'',
            customersList:[],
            serviceList:[],
            selectedServiceList:[],
            employeelist:[],
            techDetail:{}
        }

        this.searchByPhone = this.searchByPhone.bind(this)
        this.searchByName = this.searchByName.bind(this)
        this.getServices = this.getServices.bind(this)
        this.getTechnicians = this.getTechnicians.bind(this)
        this.addorRemoveService = this.addorRemoveService.bind(this)
        this.saveCheckin = this.saveCheckin.bind(this)
        this.addCustomer = this.addCustomer.bind(this)
    }

    addCustomer(){
        var schemaobj = Object.assign({}, schemaObj);

        var properties = Object.assign([], schemaobj.properties);
        var props=[];
        properties.forEach((field,i)=>{
            delete field["value"];
            if(field.name === 'mCustomerLoyaltyPoints'){ 
                field.disabled = false;
            }
            else if(field.name === 'mCustomerDOB'){
                field.disabled = false;
            }
            props.push(field);
            if(i === properties.length-1){
                schemaobj.properties = props;
            }
        });

        this.setState({schema: schemaobj, isNext: true, currentDivIndex:'createCustomer'})
    }

    saveCheckin(){
        var appointments = []
        var obj = {
            customer:this.state.customerDetail.mCustomerId !== undefined ? this.state.customerDetail.mCustomerId : null,
            guestName:this.state.guestName,
            services:[],
        }

        var appointmentdate =  dayjs(new Date().toISOString()).add(10,'minutes').format("YYYY-MM-DD");
        var appointmenttime =  dayjs(new Date().toISOString()).add(10,'minutes').format("HH:mm"); 

        this.state.selectedServiceList.forEach((ser, i)=>{
            obj.services.push(
                {
                    service:ser.mProductId,
                    technician:this.state.techDetail.mEmployeeId,
                    duration:30, 
                })

            if(i === this.state.selectedServiceList.length-1){
                appointments.push(obj)
                var merchantdetail = window.localStorage.getItem('merchantdetail') || ''
                var merchantid = ''
                if(merchantdetail !== ''){
                    merchantid = JSON.parse(merchantdetail)["merchantId"];
                }
                this.httpManager.postRequest('/merchant/appointment/save',{data:{merchantId:merchantid, appointmentdate: appointmentdate, appointmenttime:appointmenttime,  appointments: appointments}}).then(res=>{
                    this.setState({searchPhone:'', searchName:'', guestName:'',techDetail:{}, customerDetail:{}, isNext:false, currentDivIndex:'home'})
                })
            }
        })
    }

    getTechnicians(){
        this.httpManager.postRequest(`merchant/employee/get`,{data:"EMP LIST"}).then(response=>{
            // console.log(response)
            this.setState({employeelist: response.data, isLoading: false}); 
        }) 
    }

    searchByPhone(){
        this.setState({isLoading:true},()=>{
            this.httpManager.postRequest('/merchant/customers/searchByMobileLast', {value:this.state.searchPhone}).then(r=>{
                if(r.data.length > 0){
                    this.setState({customersList: r.data, isLoading: false},()=>{
                        if(this.state.customersList.length === 1){
                            this.setState({isNext: true,customerDetail: this.state.customersList[0]}, ()=>{
                                this.setState({currentDivIndex:'serviceSelection'})
                            })
                        }
                        else{
                            this.setState({isNext: true,currentDivIndex:'customerSelection'})
                        }
                    })
                }
                else{
                    this.setState({showError: true, errorText:"This name not registered.", isLoading: false})
                }
            }).catch(e=>{
                this.setState({showError: true, errorText:e.message, isLoading: false})
            })
        })
    }

    searchByName(){
        this.setState({isLoading:true},()=>{
            this.httpManager.postRequest('/merchant/customers/searchByName', {value:this.state.searchName}).then(r=>{
                if(r.data.length > 0){
                    this.setState({customersList: r.data, isLoading: false},()=>{
                        if(this.state.customersList.length === 1){
                            this.setState({isNext: true,currentDivIndex:'customerConfirmation', isLoading: false})
                        }
                        else{
                            this.setState({isNext: true,currentDivIndex:'customerSelection', isLoading: false})
                        }
                    })
                }
                else{
                    this.setState({showError: true, errorText:"This name not registered."})
                }
            }).catch(e=>{
                this.setState({showError: true, errorText:e.message})
            })
        })
    }

    componentDidMount(){
        this.getServices()
    }

    getServices(){ 
        this.setState({isLoading: true})
        this.httpManager.postRequest(`/merchant/customers/getActive`,{data:"GET PRODUCT"}).then(response=>{ 
            this.setState({serviceList: response.data, isLoading: false})
            this.getTechnicians()
        });
    }

    renderContent(){
        return <div
        style={{
            width:'100%',
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex", 
            flexDirection: "row",  
            flexWrap: "nowrap",
            overflow: "hidden"
          }}
        >
          {this.renderDivs()}
        </div>
      </div>
    }

    reloadData(msg, data){
        this.setState({customerDetail: data, currentDivIndex:'serviceSelection'})
    }


    renderDivs(){ 

        return (
          <div
            style={{
                width:'100%',
              display: "flex",
              flexDirection: "row"
            }}
          >
            {/* <TransitionGroup className="slide-group">
              <CSSTransition
                classNames="slide"
                timeout={{ enter: 500, exit: 500 }}
                key={`${this.state.currentDivIndex}`}
              >
                <div>
                    {this.state.currentDivIndex === 0 && this.renderHome()}
                    {this.state.currentDivIndex === 1 && this.renderName()}
                </div>
              </CSSTransition>
            </TransitionGroup> */}

            <TransitionGroup style={{width:'100%'}} childFactory={child => React.cloneElement(child, { classNames: this.state.isNext ? "right-to-left" : "left-to-right", timeout: 1000 })}>
                <CSSTransition key={`${this.state.currentDivIndex}`} classNames="right-to-left" timeout={500}>
                    <div style={{width:'100%'}}>
                        {this.state.currentDivIndex === 'home' && this.renderHome()}
                        {this.state.currentDivIndex === 'customerSelection' && this.renderCustomerSelection()} 
                        {this.state.currentDivIndex === 'serviceSelection' && this.renderServiceSelection() }
                        {this.state.currentDivIndex === 'techSelection' && this.renderTechSelection()}
                        {this.state.currentDivIndex === 'createCustomer' && this.renderCreateCustomer()}
                    </div>
                </CSSTransition>
            </TransitionGroup>

          </div>
        );
    }
    
    renderCreateCustomer(){
        return  <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
                    <Grid item xs={12}> 
                    <Stack spacing={3}> 
                        <FormManager formProps={this.state.schema}  reloadData={(msg,data)=>this.reloadData(msg,data)} closeForm={()=>this.setState({isNext:false, currentDivIndex:'home'})}/>
                    </Stack>
                </Grid>
            </Grid>
    }

    getBackground(emp){
        if(emp.mEmployeeId === this.state.techDetail.mEmployeeId){
            return '#bee1f7'
        }
        return 'transparent;'
    }

    renderTechSelection(){
        return <Container maxWidth='lg' style={{maxHeight:'500px', overflow:'auto'}}>
            <Grid container style={{ padding:'1rem'}}>
                <Grid item xs={6}>
                    <h1>Select Technician</h1>
                </Grid>
                <Grid item xs={6}> 
                </Grid>
            </Grid>

            {this.state.employeelist.map( emp =>{
                return <Grid container style={{padding:'1rem 0',borderBottom:'1px solid #ccc', background:this.getBackground(emp), display:'flex', alignItems:'center'}}>
                    <Grid item xs={12} style={{ display:'flex', alignItems:'center'}} onClick={()=>{
                            this.setState({isNext: true,techDetail: emp}, ()=>{
                                // this.setState({isNext: false, currentDivIndex:'home'})
                            })
                        }}>
                        <AccountCircleOutlined />&nbsp;&nbsp;&nbsp;&nbsp;{emp.mEmployeeFirstName+" "+emp.mEmployeeLastName}
                    </Grid> 
                </Grid>
            }) }
            
            <div style={{display:'flex', flexDirection:'row'}}>
                <Button variant={'contained'} onClick={()=>{
                    this.saveCheckin()
                }}>Done</Button>
            </div>
            
        </Container>
    } 

    renderCustomerSelection(){
        return <Container maxWidth='lg' style={{maxHeight:'500px', overflow:'auto'}}>
            <Grid container style={{ padding:'1rem'}}>
                <Grid item xs={6}>
                    <h1>Select customer</h1>
                </Grid>
                <Grid item xs={6}> 
                </Grid>
            </Grid>

            {this.state.customersList.map( cust =>{
                return <Grid container style={{padding:'1rem 0',borderBottom:'1px solid #ccc', display:'flex', alignItems:'center'}}>
                    <Grid item xs={9} style={{ display:'flex', alignItems:'center'}}>
                        <AccountCircleOutlined />&nbsp;&nbsp;&nbsp;&nbsp;{cust.mCustomerName+"("+cust.mCustomerMobile+")"}
                    </Grid>
                    <Grid item xs={3}> 
                        <Button variant={'contained'} onClick={()=>{
                            this.setState({isNext: true,customerDetail: cust}, ()=>{
                                this.setState({currentDivIndex:'serviceSelection'})
                            })
                        }}>
                            Select
                        </Button>
                    </Grid>
                </Grid>
            }) }

            
        </Container>
    } 

    checkService(ser){
        var ids = this.state.selectedServiceList.map(r=>r.mProductId) 
        if(ids.indexOf(ser) !== -1){
            console.log("exist")
            return  <Star />
        } 
        return <></>;
    }

    addorRemoveService(ser){
        var ids = this.state.selectedServiceList.map(r=>r.mProductId)
        var services = Object.assign([], this.state.selectedServiceList)
        if(ids.indexOf(ser.mProductId) !== -1){
            services.splice(ids.indexOf(ser.mProductId), 1)
        }
        else{
           services.push(ser)
        }

        this.setState({selectedServiceList: services})
    }

    renderServiceSelection(){
        return <Container style={{position:'absolute', top:0, bottom:0, left:0, right:0, padding:0}}>
            <Grid container style={{height:'100%'}}>
                <Grid item xs={3} style={{borderRight:'1px solid #d0d0d0'}}>
                <List
                    sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    aria-label="contacts"
                    >
                    {this.state.serviceList.map(ser=>{
                            return <ListItem disablePadding style={{borderBottom:'1px solid #d0d0d0'}}>
                        <ListItemButton onClick={()=>{
                            this.addorRemoveService(ser)
                        }}>
                        <ListItemIcon>
                           {this.checkService(ser.mProductId)}
                        </ListItemIcon>
                        <ListItemText primary={ser.mProductName} />
                        </ListItemButton>
                    </ListItem> 
                    })}

                    </List>
                </Grid>

                <Grid item xs={9} style={{display:'flex', alignItems:'baseline', flexDirection:'column', padding:'1rem'}}>
                    <h4>{this.state.guestName !== '' ? this.state.guestName : this.state.customerDetail.mCustomerName}</h4>
                    <div style={{padding:'5px', background:'#d0d0d0', margin:'10px', color:'#000', width:'100%'}}>Requested Services</div>
                    <div style={{height:'250px', overflow:'auto', display:'flex', alignItems:'baseline', flexWrap:'wrap' }}> 
                            {this.state.selectedServiceList.map(ser=>{
                                    return  <div style={{background:'#f0f0f0', padding:'8px', display:'flex',margin:'8px', alignItems:'center'}}>
                                        <div>
                                            {ser.mProductName}
                                        </div>
                                        <div>
                                            <IconButton onClick={()=>{
                                                this.addorRemoveService(ser)
                                            }}><Close /></IconButton>
                                        </div>
                                    </div>
                            })}  
                    </div>
                    <div>
                        <Button variant={'contained'} fullWidth onClick={()=>{
                            this.setState({selectedServiceList: []})
                        }}>
                            Clear All
                        </Button> 
                        <Button variant={'contained'} fullWidth onClick={()=>{
                            this.setState({isNext:true, currentDivIndex:'techSelection'})
                        }}>
                            Next
                        </Button>
                    </div>

                </Grid>
            </Grid>
        </Container>
    }

    renderName(){
        return <div>Name div 
            <Button onClick={()=>{
                this.setState({isNext: false, currentDivIndex:0})
            }}>Back</Button>
        </div>
    }

    renderHome(){
        return  <Container maxWidth='100%'>
            <h2 style={{fontStyle:'italic', width:'100%', textAlign:'center'}}>Welcome</h2> 
            <Grid container>
                <Grid item xs={2} style={{display:'flex', alignItems:'center', flexDirection:'row'}}>
                    <div style={{padding:'1rem'}}>
                        <h1>Sign-In:</h1>
                        <h4 style={{fontStyle:'italic', fontSize:'12px'}}>Member of the salon...</h4>
                    </div>
                </Grid>

                <Grid item xs={5} style={{display:'flex', alignItems:'center', flexDirection:'row'}}>
                    <div style={{padding:'1rem', width:'100%'}}>
                        <h4>Enter Phone #</h4> 
                        <MuiPhoneNumber
                            InputProps={{
                                endAdornment: <InputAdornment position="start">
                                    <IconButton style={{width:'40px',height:'40px'}} onClick={()=>{
                                        // this.setState({isNext:true, currentDivIndex:1})
                                        this.searchByPhone();
                                    }}>
                                        <ArrowCircleRightOutlined  style={{width:'40px',height:'40px'}}/>
                                    </IconButton>
                                </InputAdornment>,
                            }}
                            defaultCountry={'us'}
                            onlyCountries={["us"]}
                            fullWidth 
                            label={''}
                            regions={['america', 'asia']}
                            name={'searchPhone'}
                            id={'searchPhone'} 
                            value={this.state.searchPhone}
                            variant="outlined"
                            onChange={(e)=>{
                                this.setState({searchPhone: e})
                            }} 
                            disableDropdown='true'
                            sx={{
                                svg:{
                                height:"20px"
                                }
                            }}
                            onKeyDown={(e)=>{  
                                console.log(e) 
                                if(e.target.value.length === 2 && (e.keyCode === 8  || e.keyCode === 46)){
                                e.preventDefault();
                                }
                            }}
                            />
                    </div>
                </Grid>
                {/* <Grid item xs={5} style={{display:'flex', alignItems:'center', flexDirection:'row'}}>
                    <div style={{padding:'1rem', width:'100%'}}>
                        <h4>Last 4 digits of Phone #</h4>
                        <TextField fullWidth 
                        value={this.state.searchPhone}
                        onChange={(e)=>{ 
                            if(e.target.value.length  <= 4){
                                this.setState({searchPhone: e.target.value})
                            }
                        }}
                        onKeyDown={(e)=>{
                            const pattern = /^[0-9]$/;  
                            if(!pattern.test(e.key) && e.keyCode !== 9 && e.keyCode !== 37 && e.keyCode !== 39  && e.keyCode !== 8 && e.keyCode !== 46){
                                e.preventDefault();
                            }
                        }}
                        InputProps={{
                        endAdornment: <InputAdornment position="start">
                            <IconButton style={{width:'40px',height:'40px'}} onClick={()=>{
                                // this.setState({isNext:true, currentDivIndex:1})
                                this.searchByPhone();
                            }}>
                                <ArrowCircleRightOutlined  style={{width:'40px',height:'40px'}}/>
                            </IconButton>
                        </InputAdornment>,
                        }}/>
                    </div>
                </Grid> */}
                {/* <Grid item xs={5} style={{display:'flex', alignItems:'center', flexDirection:'row'}}> 
                    <div style={{padding:'1rem', width:'100%'}}>
                        <h4>Search By Name</h4>
                        <TextField fullWidth 
                        value={this.state.searchName}
                        onChange={(e)=>{
                            console.log(e)
                            if(e.target.value.length  < 50 ){
                                this.setState({searchName: e.target.value})
                            }
                        }}
                         InputProps={{
                        endAdornment: <InputAdornment position="start">
                            <IconButton style={{width:'40px',height:'40px'}} onClick={()=>{
                                this.searchByName()
                            }}>
                                <ArrowCircleRightOutlined  style={{width:'40px',height:'40px'}}/>
                            </IconButton>
                        </InputAdornment>
                        }}/>
                    </div>
                </Grid> */}
            </Grid>

            <Grid container>
                <Grid item xs={2} style={{display:'flex', alignItems:'center', flexDirection:'row'}}>
                    <div style={{padding:'1rem'}}>
                        <h1>Walk-In:</h1>
                        <h4 style={{fontStyle:'italic', fontSize:'12px'}}>Visiting for the first time...</h4>
                    </div>
                </Grid>
                <Grid item xs={5} style={{display:'flex', alignItems:'center', flexDirection:'row'}}>
                    <div style={{padding:'1rem', width:'100%'}}>
                        <h4>Your Name</h4>
                        <TextField value={this.state.guestName} 
                        onChange={(e)=>{
                            this.setState({guestName: e.target.value})
                        }}
                        fullWidth InputProps={{
                        endAdornment: <InputAdornment position="start">
                            <IconButton style={{width:'40px',height:'40px'}} onClick={()=>{
                                this.setState({isNext:true, currentDivIndex:'serviceSelection'})
                            }}>
                                <ArrowCircleRightOutlined  style={{width:'40px',height:'40px'}}/>
                            </IconButton>
                        </InputAdornment>,
                        }}/>
                    </div>
                </Grid>
                <Grid item xs={5} style={{display:'flex', alignItems:'center', flexDirection:'row'}}> 
                     
                </Grid>
            </Grid>

            <Grid container>
                <Grid item xs={2} style={{display:'flex', alignItems:'center', flexDirection:'row'}}>
                    <div style={{padding:'1rem'}}>
                        <h1>Register:</h1>
                        <h4 style={{fontStyle:'italic', fontSize:'12px'}}>New customer register</h4>
                    </div>
                </Grid>
                <Grid item xs={5} style={{display:'flex', alignItems:'center', flexDirection:'row'}}>
                    <div style={{padding:'1rem', width:'100%'}}>
                        <Button variant={'outlined'} onClick={()=>{
                            this.addCustomer()
                        }} fullWidth style={{fontSize:'24px', color:'blue'}}>Start</Button>
                    </div>
                </Grid>
                <Grid item xs={5} style={{display:'flex', alignItems:'center', flexDirection:'row'}}> 
                     
                </Grid>
            </Grid>
        </Container>
    }

    render(){
        return <div style={{display:'flex',width:'100%', alignItems:'center',flexDirection:'column', justifyContent:'center', padding:'4rem 0'}}>
            
            {this.state.isLoading && <Loader />}
            {this.renderContent()}
            <Dialog open={this.state.showError} onClose={()=>{
                this.setState({showError: false, errorText:''})
            }}>
                <DialogContent>
                    {this.state.errorText}
                </DialogContent>
                <DialogActions>
                    <Button variant="Outlined" onClick={()=>{
                        this.setState({showError: false, errorText:''})
                    }}>OK</Button>
                </DialogActions>
            </Dialog>
        </div>
    }
}