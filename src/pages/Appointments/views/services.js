import React from "react";
import { Paper,IconButton, TextField,InputAdornment, Dialog, DialogTitle, DialogContent, Grid, Button} from '@mui/material'; 
import HTTPManager from "../../../utils/httpRequestManager";
import DialogComponent from "../../../components/Dialog";
import Iconify from '../../../components/Iconify';
const getIcon = (name) => <Iconify style={{color:'#d0d0d0', marginLeft:'5px'}} icon={name} width={22} height={22} />;

export default class AppointmentServices extends React.Component{
    httpManager = new HTTPManager()
    constructor(props){
        super(props);
        this.state = {
            technicians:[],
            categories:[],
            services:[],
            search:'',
            addservice: false,
            totalPrice:0,
            selectedUser:'',
            employeelist:[],
            selectTechnician: false,
            technicianId:'',
            duration:'',
            selectedService:{},
            technicianName:''
        }

        this.getCategories = this.getCategories.bind(this)
        this.getProductsByCategory = this.getProductsByCategory.bind(this)
        this.saveAppointment = this.saveAppointment.bind(this)
        this.selectDetails = this.selectDetails.bind(this)
    }

    saveAppointment(){
        this.httpManager.postRequest('merchant/appointment/save',this.props).then(res=>{
            this.props.data.closeAppointment()
        })
    }

    componentDidMount(){
        this.props.data.clearServices();
        this.getTechnicians()
    }

    getTechnicians(){
        this.httpManager.postRequest(`merchant/employee/get`,{data:"EMP LIST"}).then(response=>{
            // console.log(response)
            this.setState({employeelist: response.data, isLoading: false});
            this.getCategories();
        }) 
    }

    calculateTotal(){
        var total =  0;
        console.log(total)
        Object.keys(this.props.data.selectedServices).forEach((key, i)=>{
            var services = this.props.data.selectedServices[key];
            services.forEach(ser=>{
                total= Number(total)+Number(ser.mProductPrice)
                console.log(total)
            })
            if(i === Object.keys(this.props.data.selectedServices).length-1){
                this.setState({totalPrice: total})
            }
        })
    }  

    getCategories(){
        this.httpManager.postRequest('merchant/category/get',{data:"GET CATEGORY"}).then(res=>{
            this.setState({categories: res.data}, ()=>{
                if(this.state.categories.length > 0){
                    this.getProductsByCategory(this.state.categories[0].id)
                }
                else{
                    this.setState({services:[]})
                }
            })
        })
    }


    getProductsByCategory(catid){
        this.httpManager.postRequest('merchant/product/getbyCategory',{categoryId: catid}).then(res=>{
            this.setState({services: res.data})
        })
    }

    setGuest(i){
        this.setState({selectedUser:i},()=>{
            this.setState({addservice: true})
        })
    } 

    getGuestsBlock(){
        var objs = []
        var indexes = []
        for(var i=0;i<this.props.data.showingCustomerForm.selectedGuestCount;i++){
            // const tml = this.getGuestsBlock(i)
            // console.log(tml) 
            indexes.push("Guest "+(i+1))
            if(i === this.props.data.showingCustomerForm.selectedGuestCount-1){
                indexes.forEach(e=>{
                    objs.push(<Grid item xs={6} style={{ padding:'10px'}}>
                    <Paper style={{border:'1px solid #f0f0f0', height:'250px'}}>
                        <div style={{display:'flex', alignItems:'center', flexDirection:'column', width:'100%'}}>
                            <div style={{background:'#134163', color:'#fff', padding:'5px', width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                                <div>{e}</div>
                                <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                    <div>
                                        <Button style={{color:'#fff'}} onClick={()=>{
                                            this.setGuest(e)
                                        }}>+</Button>
                                    </div>
                                    <div>
                                        <div style={{ width:'25px', height:'25px',display:'flex', alignItems:'center',justifyContent:'center'   }} onClick={()=>{
                                            this.props.data.removeGuest(e)
                                        }}>
                                        <Iconify style={{color:'#fff' }} icon={'mdi:close'} width={22} height={22} />
                                            </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{height:'200px', width:'100%' , overflow:'auto'}}>
                                {this.renderServices('customer', e, this.props.data.selectedServices)}
                            </div>
                        </div>
                    </Paper>
                    </Grid>)
                })
            }
        }
        return objs;
    }

    renderServices(type, user, list){
        console.log(list)
        var services = list[user] || []
        if(services.length === 0){
            return <p>No services added.</p>
        }
        else{
            const servicehtml = services.map(s=>{
                return <Grid item xs={4} style={{padding:'5px'}}>
                    <div className='serviceLbl' style={{height:'65px'}}> <p>{s.mProductName}<br/>
                    <span style={{fontSize:'12px', fontWeight:'500'}}>{s.technicianName}</span></p>
                    </div></Grid>
            })
            return  <Grid container>{servicehtml}</Grid>
        } 
    }

    selectDetails(){
        var obj = Object.assign({}, this.state.selectedService);
        obj.technicianId = this.state.technicianId;
        obj.duration = this.state.duration;
        obj.technicianName = this.state.technicianName
        this.props.data.onSelectService(obj, this.state.selectedUser);
        setTimeout(() => {
            this.setState({selectedService:{}, technicianId:'', duration:'', selectTechnician: false})
            this.calculateTotal();
        }, 1000);
    }

    render(){
        return <Dialog
        open={true}
        onClose={()=>{
            this.props.data.closeAppointment()
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{zIndex:'99999'}}
        className="paymentpopup"
    >
        <DialogTitle id="alert-dialog-title"> 
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <div>Book Appointment</div>
                <div onClick={()=>{
                    this.props.data.closeAppointment()
                }}>{getIcon('mdi:close')}</div>
            </div>
        </DialogTitle>
        <DialogContent>
            <Grid container style={{height:'auto', paddingBottom:'100px'}}>
                <Grid item xs={  12} style={{borderRight:this.state.addservice?'1px solid #f0f0f0':'0', height:'100%'}}>
                    <Grid container>
                    <Grid item xs={  12}>
                        <div style={{display:'flex', justifyContent:'flex-end'}}>
                            <Button variant="contained" onClick={()=>{ 
                                this.props.data.addGuest()
                            }}>+ Add Guest</Button>
                        </div>
                        </Grid>
                        {this.props.data.showingCustomerForm.customerDetail.mCustomerId !== undefined && <Grid item xs={this.props.data.showingCustomerForm.selectedGuestCount===0 ? 12: 6} style={{ padding:'10px'}}>
                                <Paper style={{border:'1px solid #f0f0f0', height:'250px'}}>
                                    <div style={{display:'flex', alignItems:'center', flexDirection:'column', width:'100%'}}>
                                        <div style={{background:'#134163', color:'#fff', padding:'5px', width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                            <div>{this.props.data.showingCustomerForm.customerDetail.mCustomerName}</div>
                                            <div>
                                                <Button style={{color:'#fff'}} onClick={()=>{
                                                    this.setState({selectedUser: this.props.data.showingCustomerForm.customerDetail.mCustomerId},()=>{
                                                        this.setState({addservice: true})
                                                    })
                                                }}>+</Button>
                                            </div>
                                        </div>
                                        <div style={{height:'200px', width:'100%' , overflow:'auto'}}>
                                            {this.renderServices('customer', this.props.data.showingCustomerForm.customerDetail.mCustomerId, this.props.data.selectedServices)}
                                        </div>
                                    </div>
                                </Paper>
                        </Grid>}

                        {this.props.data.showingCustomerForm.selectedGuestCount > 0 && this.getGuestsBlock()}
                    </Grid>
                </Grid>    

                <DialogComponent className="servicepopup" open={this.state.addservice} title={'Select Service'} onClose={()=>{
                    this.setState({addservice: false})
                }}>
                    <div style={{display:'flex', justifyContent:'flex-end'}}>
                        <div onClick={()=>{
                            this.setState({addservice: false})
                        }}>{getIcon('mdi:close')}</div>
                    </div>

                    <Grid item xs={12} style={{  width:'100%', display:'flex', flexDirection:'row'}} className='searchfld'>
                        <TextField
                                fullWidth
                                variant="standard"
                                value={this.state.search}
                                onChange={(e)=>{
                                    this.setState({search:e.target.value})
                                }}
                                placeholder=" Search…" 
                                InputProps={{
                                startAdornment: getIcon('mdi:magnify'),
                                endAdornment: (
                                    <IconButton
                                    title="Clear"
                                    aria-label="Clear"
                                    size="medium"
                                    style={{ visibility: this.state.search ? 'visible' : 'hidden', padding:'5px' }}
                                    onClick={()=>{
                                        this.setState({search:''})
                                    }}
                                    >
                                    {getIcon("mdi:close")}
                                    </IconButton>
                                )
                                }} 
                            />
                    </Grid>
                    <Grid item xs={12} style={{height:'calc(100% - 45px)', width:'100%', display:'flex', flexDirection:'row'}}>
                        <Grid item xs={4} className='sideMenu' style={{ height:'100%', overflow:'auto'}}>
                            
                                <Grid container>
                                    {this.state.categories.map(cat=>{ 
                                        return <Grid item xs={12} onClick={()=>{
                                            this.getProductsByCategory(cat.id)
                                        }}>
                                            {cat.mCategoryName}
                                        </Grid> }) 
                                    }
                                </Grid> 
                        </Grid>
                        <Grid item xs={8} style={{borderLeft:'1px solid #dfdfdf', height:'100%', overflow:'auto'}}>
    
                            {!this.state.selectTechnician && <Grid container style={{flexWrap:'wrap'}}>
                                {this.state.services.length > 0 && this.state.services.map(service=>{ 
                                    return <Grid item xs={4} className='servicebox' onClick={()=>{ 
                                        // this.setState({addservice: false})
                                        this.setState({selectTechnician: true, selectedService: service})
                                        // 
                                        // setTimeout(() => {
                                            
                                        //     this.calculateTotal()
                                        // }, 1000);
                                    }}>
                                        <div className='serviceLbl'> 
                                            <div>{service.mProductName}</div>
                                        </div>
                                    </Grid> }) 
                                }
                                {this.state.services.length === 0 && <Grid item xs={12} className='servicebox'>
                                        <div  style={{display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px'}}> 
                                            No services found.
                                        </div>
                                    </Grid>  
                                }
                            </Grid> }
                            {this.state.selectTechnician && <Grid container style={{display:'flex', flexWrap:'wrap'}}>
                                <Grid item xs={12}><h5 style={{width:'100%',padding:'5px'}}>Select Technician</h5></Grid>
                                <Grid item xs={12} style={{display:'flex', padding:'1rem'}}>
                                {this.state.employeelist.length > 0 && this.state.employeelist.map(emp=>{ 
                                    return <Grid item xs={4} className='servicebox' onClick={()=>{  
                                        this.setState({technicianId: emp.mEmployeeId, technicianName:emp.mEmployeeFirstName+" "+emp.mEmployeeLastName }) 
                                    }}>
                                        <div className='serviceLbl' style={{background:this.state.technicianId === emp.mEmployeeId ? '#bee1f7' : 'transparent'}}> 
                                            <div>{emp.mEmployeeFirstName+" "+emp.mEmployeeLastName}</div>
                                        </div>
                                    </Grid> })}
                                </Grid>
                                <Grid item xs={12} style={{padding:'1rem'}}>
                                    <Grid item xs={4}>
                                    <TextField  
                                        required 
                                        type="number" 
                                        placeholder="Enter Duration" 
                                        value={this.state.duration}
                                        name="variable_price"
                                        color="secondary"   
                                        variant="standard" 
                                        style={{background: 'white'}}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">mins</InputAdornment>,
                                        }}
                                        onChange={(e)=>{
                                            this.setState({duration: e.target.value})
                                        }}
                                        onKeyDown={(e)=>{
                                            if(e.key === 'e'  || e.key === "+" || e.key === "-"){
                                                e.preventDefault();
                                            }
                                            if(e.key === "." && (e.target.value==="" || e.target.value.length===0) ) {
                                            
                                                e.preventDefault();
                                            
                                            }
                                        }

                                        }
                                    />
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} style={{padding:'1rem'}}>
                                        <Button variant={'contained'} onClick={()=>{
                                            this.selectDetails();
                                        }}>Add</Button>
                                </Grid>

                            </Grid>}
                        </Grid>
                    </Grid>
                </DialogComponent>  

                <Grid item xs={12} style={{height:'80px', padding:'1rem', borderTop:'1px solid #f0f0f0',display:'flex', justifyContent:'space-between', alignItems:'center', position:'absolute', bottom:0, left:0, right:0, background:'#fff'}}>
                    <div style={{fontSize:'16px', fontWeight:'700'}}>Approx Total:&nbsp;&nbsp;${Number(this.state.totalPrice).toFixed(2)}</div>
                    <div>
                        <Button variant={'contained'} onClick={()=>{
                            this.saveAppointment()
                        }}>Book Appointment</Button>
                    </div>
                </Grid>
            </Grid>    
        </DialogContent> 
    </Dialog>  
    }
}