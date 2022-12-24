import DialogComponent from '../../../components/Dialog';
import { useState,Fragment } from 'react';
import { TextField, Button, FormControl, Box, Grid, Stack } from '@mui/material';
import FormManager from '../../../components/formComponents/FormManager';
import HTTPManager from '../../../utils/httpRequestManager';
import FPhoneNumber from '../../../components/formComponents/components/phonenumber';
import schemaObj from './schema.json'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker,  LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import Iconify from '../../../components/Iconify';
const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;


const CustomerForm = ({ShowingCustomerForm, setShowingCustomerForm, setShowingEventForm})=>{ 
    const [searched, setSearched] = useState('')
    const [error, setError] = useState(false)
    const [errorText, setErrorText] = useState('')
    const [addForm, setAddForm] = useState(false)
    const httpManager = new HTTPManager();
    const [schema, setSchema] = useState(schemaObj)
    const [numAdd, setNumAdd] = useState(false)
    const [value, setValue] = useState(dayjs(new Date()));
    const [datevalue, setDatevalue] = useState(dayjs(new Date()));
    const reloadData = (msg, data)=>{
        setShowingCustomerForm({visible:true, customerDetail: data, selectedGuestCount: 0})
        setAddForm(false)
    }

    return (<>
        {ShowingCustomerForm.customerDetail === undefined  && <> <DialogComponent className={'paymentpopup'} open={ShowingCustomerForm.visible} title={'Select Customer'}  
        // onClose={()=>{
        //     setShowingCustomerForm({visible:false})
        //  }}
          >
           {!addForm && <><div style={{display:'flex',position:'relative', flexDirection:'column',alignItems:'center', borderBottom:'1px solid #f0f0f0'}}>
               <br/><br/> {/* <TextField 
                fullWidth
                label="Search By Mobile"
                name="searched"
                value={searched}
                onChange={(e)=>{setSearched(e.target.value)}}
                error={error}
                helperText={errorText}
                />  */}

                    <FPhoneNumber 
                        label={"Search By Mobile"}
                        fullWidth 
                        name={"search"}
                        required 
                        value={searched}
                        onChange={(e)=>{setSearched(e);
                        
                            setError(false)
                            setErrorText('')}}
                        error={error}
                        helperText={errorText}
                    />

                <Button variant={"contained"} style={{width:'max-content', marginTop:'2rem',marginBottom:'2rem' }} onClick={()=>{
                    setError(false)
                    setErrorText('') 
                    if(searched.trim() !== '+1'){
                        httpManager.postRequest(`/merchant/customers/searchByMobile`,{value:searched}).then(res=>{
                            if(res.data !== undefined){
                                setShowingCustomerForm({visible:true, customerDetail:res.data, selectedGuestCount: 0})
                            }
                            else{ 
                                setError(true)
                                setErrorText(res.message)
                            }
                        })
                    }
                    else{
                        setError(true)
                        setErrorText("Please enter mobile number.")
                    }
                }}>Search</Button>
                <div style={{position:'absolute',bottom:'-13px', background:'#fff', display:'flex', alignItems:'center', fontWeight:'700', fontSize:'16px'}}>OR</div>
            </div>
            <div style={{display:'flex', flexDirection:'column',alignItems:'center', }}>
                <Button variant={"contained"} style={{marginTop:'2rem'}} onClick={()=>{
                    var schemaobj = Object.assign({}, schemaObj);

                    var properties = Object.assign([], schema);
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
                    setSchema(schemaobj)

                    setAddForm(true)
                }}>Create New Customer</Button>
            </div>
            </>}

            {addForm && <Box sx={{ width: '100%' }}> 
                <Grid container spacing={3}  alignItems="center"  justifyContent="center" style={{marginLeft:0, marginRight:0,width:'100%', fontWeight:'bold'}} > 
                     <Grid item xs={12}> 
                        <Stack spacing={3}> 
                            <FormManager formProps={schema}  reloadData={(msg,data)=>reloadData(msg,data)} closeForm={()=>setAddForm(false)}/>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>}
        </DialogComponent> </>}


{ShowingCustomerForm.customerDetail !== undefined && ShowingCustomerForm.completeselectedGuest  === undefined && <DialogComponent className='paymentpopup' open={true} title={'Hey '+ShowingCustomerForm.customerDetail.mCustomerName+', Bringing anyone with you?'}  
// onClose={()=>{
//             setShowingCustomerForm({visible:false})
//          }} 
         >
            <div style={{display:'flex', justifyContent:'flex-end', alignItems:'center'}}> 
                <div  onClick={() =>   setShowingCustomerForm({visible:false})}>{getIcon('mdi:close')}</div>
            </div>
            {!numAdd && <div style={{display:'flex', flexDirection:'row', width:'100%', justifyContent:'center',alignItems:'center', }}>
                    <Button variant={"contained"} style={{marginTop:'2rem', marginRight:'0.5rem'}} onClick={()=>{
                        setNumAdd(true)
                    }}>Yes</Button>
                    <Button variant={"outlined"} style={{marginTop:'2rem'}} onClick={()=>{
                        var obj = Object.assign({}, ShowingCustomerForm)
                        obj.completeselectedGuest = true
                        obj.selectedGuestCount = 0;
                        console.log(obj)
                        setShowingCustomerForm(obj)  
                    }}>No</Button>
                </div>}
            {numAdd && <div style={{display:'flex',width:'100%', alignItems:'flex-start',flexDirection:'column'}}> 
                <div style={{display:'flex', alignItems:'center',width:'100%',border:'1px solid #f0f0f0',padding:'5px', justifyContent:'space-between'}}>
                    <div style={{display:'flex', width:'90%'}}>
                        {getIcon('mdi:account-group')}&nbsp;&nbsp;Additional People
                    </div>
                    <div>
                    <FormControl fullWidth>  
                                    <TextField  
                                        type="number"  
                                        placeholder="" 
                                        value={ShowingCustomerForm.selectedGuestCount}
                                        color="secondary"   
                                        variant="outlined" 
                                        className='qtyfield'
                                        style={{textAlign:'center', border:0 }}
                                        InputProps={{
                                            startAdornment:<Button
                                                title="-1"
                                                aria-label="-1"
                                                size="medium" 
                                                style={{border:0, fontSize:'18px'}}
                                                onClick={()=>{
                                                    var qty = Number(ShowingCustomerForm.selectedGuestCount) > 0 ? Number(ShowingCustomerForm.selectedGuestCount)-1 : 0; 
                                                    var customer = Object.assign({}, ShowingCustomerForm)
                                                    customer.selectedGuestCount = qty;
                                                    setShowingCustomerForm(customer)
                                                }}
                                                variant="outlined"
                                            >
                                                -  
                                            </Button>,
                                            endAdornment: <Button
                                            title="+1"
                                            aria-label="+1"
                                            size="medium" 
                                            style={{border:0, fontSize:'18px'}}
                                            onClick={()=>{  
                                                var customer = Object.assign({}, ShowingCustomerForm)
                                                var qty = Number(customer.selectedGuestCount ) >= 0 ? Number(customer.selectedGuestCount )+1 : 0; 
                                                    customer.selectedGuestCount = qty;
                                                    setShowingCustomerForm(customer)
                                            }}
                                            variant="outlined"
                                        >
                                            +  
                                        </Button>
                                        ,
                                        }} 
                                    />

                            </FormControl>
                    </div>
                </div>
                <p style={{fontSize:'13px', color:'#ccc'}}>Number of people that are coming with you.</p>
                <div style={{display:'flex', flexDirection:'row', width:'100%', justifyContent:'center',alignItems:'center', }}>
                    <Button variant={"contained"} style={{marginTop:'2rem', marginRight:'0.5rem'}} onClick={()=>{
                        var obj = Object.assign({}, ShowingCustomerForm)
                        obj.completeselectedGuest = true 
                        obj.appointmentdate =  dayjs(new Date().toISOString()).add(10,'minutes').format("YYYY-MM-DD");
                        obj.appointmenttime =  dayjs(new Date().toISOString()).add(10,'minutes').format("HH:mm"); 
                        setShowingCustomerForm(obj)
                        setShowingEventForm({visible: false})
                    }} disabled={ShowingCustomerForm.selectedGuestCount === 0}>Next</Button> 
                    
                    <Button variant={"outlined"} style={{marginTop:'2rem', marginRight:'0.5rem'}} onClick={()=>{
                        setNumAdd(false)
                    }} >Cancel</Button> 
                </div>

            </div>}
        </DialogComponent>}


        {ShowingCustomerForm.customerDetail !== undefined && ShowingCustomerForm.completeselectedGuest  === false &&    <DialogComponent open={true} className={'eventModal'} title={'New Appointment'} 
            // onClose={() => setShowingEventForm({ visible: false })}
            >
            <div className="form" style={{marginTop:'2rem'}}>  
                {/* <label>Date to
                <input type="time" step='300' min="08:00" max="18:59" required   onChange={(e) => setEvent({ ...event, dateTo: e.target.value })} />
                </label>   */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={3}> 
                <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth >
                    <DesktopDatePicker
                        label="Appointment Date"
                        inputFormat="MM/dd/yyyy"
                        minDate= {new Date()}
                        maxDate={new Date('2045-12-31')}
                        style={{marginRight:'10px'}}
                        value={datevalue}
                        onChange={(e)=>{
                        console.log(e)
                            setDatevalue(e)
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider> 
                <TimePicker
                renderInput={(params) => <TextField {...params} />}
                value={value}
                label="Appointment Time"
                onChange={(newValue) => {
                    setValue(newValue);
                }}
                orientation="landscape"
                minTime={dayjs(new Date().toISOString().substring(0,10)+'T08:00')}
                maxTime={dayjs(new Date().toISOString().substring(0,10)+'T19:00')}
                /> 
                
            </Stack>
            </LocalizationProvider>

                <Fragment>
                    <Button style={{marginTop:'1rem'}} onClick={() => { 
                        var customer = Object.assign({},ShowingCustomerForm)
                        customer.appointmentdate =  dayjs(datevalue).format("YYYY-MM-DD");
                        customer.appointmenttime =  dayjs(value).format("HH:mm");
                        customer.completeselectedGuest = true
                        setShowingCustomerForm(customer)
                    }} disabled={dayjs(value).format("HH:mm").toString() <= dayjs(new Date()).add(30,'minute').format("HH:mm").toString()}>Add Appointment</Button> 
                </Fragment> 
            </div>
        </DialogComponent> }
        
</>
    )
  }

export default CustomerForm;