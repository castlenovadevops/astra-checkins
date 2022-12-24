/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
// Sample events calendar build, explained and detailed over at
// https://justacoding.blog/react-calendar-component-example-with-events/

import { useState, useEffect, Fragment } from  'react' 
import './calendar.css';
import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker,  LocalizationProvider } from '@mui/x-date-pickers'; 
import DialogComponent from '../../components/Dialog';
import Services from './views/services';
import CustomerForm from './views/customer';
import HTTPManager from '../../utils/httpRequestManager';
import Iconify from '../../components/Iconify';
const getIcon = (name) => <Iconify style={{color:'#d0d0d0', marginLeft:'5px'}} icon={name} width={22} height={22} />;

const httpManager = new HTTPManager()
// Some config for convenience
const MOCK_LOADING_TIME = 1000

// Utilities/helpers
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const toStartOfDay = (date) => {
	const newDate = new Date(date)
  newDate.setHours(0)
  newDate.setMinutes(0)
  newDate.setSeconds(0)
  newDate.setMilliseconds(0)
  return newDate
}

const pad = (input) => {
	return input < 10 ? "0" + input : input
}

// I'm using default <input type="datepick-local">,
// so a specific date format is required
const dateToInputFormat = (date) => {
	if (!date) {
  	return null
  }
  
	const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  
  return `${date.getFullYear()}-${month}-${day}T${hours}:${minutes}`
}


// Could be used to filter out invalid events data also
// (ie. missing properties) or events that can't be parsed 
// to contain valid to/from dates
const parseEvents = (events) => {
  return events.map(event => {
  	const from = new Date(event.dateFrom)
    const to = new Date(event.dateTo)

    return {
      ...event,
      from,
      to
    }
  })
}

const findEventsForDate = (events, date) => {
	const dateTime = date.getTime()

  return events.filter(event => {
    const eventFromTime = toStartOfDay(event.from).getTime()
    const eventToTime = toStartOfDay(event.to).getTime()

    return (dateTime >= eventFromTime && dateTime <= eventToTime)
  })
}

// Top bar, contains the month/year combo as well as back/forward links
const Navigation = ({ date, setDate, setShowingCustomerForm }) => {
  return (
    <div className="navigation">
      <div style={{display:'flex', alignItems:'center'}}>
        <div className="back" onClick={() => {
            const newDate = new Date(date)
            newDate.setMonth(newDate.getMonth() - 1)
            setDate(newDate)
          }}>
            {"<<"} {MONTHS[date.getMonth() === 0 ? 11 : date.getMonth() - 1]}
        </div>
        <div className="monthAndYear">{MONTHS[date.getMonth()]} {date.getFullYear()}</div>
        <div className="forward" onClick={() => {
            const newDate = new Date(date)
            newDate.setMonth(newDate.getMonth() + 1)
            setDate(newDate)
          }}> 
            {MONTHS[date.getMonth() === 11 ? 0 : date.getMonth() + 1]} {">>"}
        </div>
      </div>
        
        <a href="javascript:;" className='booking' onClick={() => setShowingCustomerForm({ visible: true })}>+ Book</a>
    </div>
  )
}

// Week day headers: Mon, Tue, Wed etc
const DayLabels = () => {
  return DAYS_SHORT.map((dayLabel, index) => {
    return <div className="dayLabel cell" key={index}>{dayLabel}</div>
  })
}

// An individual event displayed within the calendar grid itself
// can be clicked to open the main event view
const MiniEvent = ({ event, setViewingEvent, setAppointments }) => {
  return (
    <div 
      className={`miniEvent ${event.type ? event.type.toLowerCase() : "standard"}`} 
      onClick={() => { 
      httpManager.postRequest(`merchant/appointment/getAppointmentsList`, {date: event.dateFrom}).then(res=>{
        setAppointments(res.data)
        setViewingEvent(event)
      })
  }}>
      <span>{event.name}</span>
    </div>
  )
}

// The main event view, opens in a modal and contains all information
// about the event in question
const Event = ({ event, setViewingEvent,  appointments }) => {
   
  
  return (
    <DialogComponent className="appointmentpopup" open={true} onClose={() => setViewingEvent(null)} title={`Appointments`} >
      <div style={{display:'flex', flexDirection:'column'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{display:'flex', flexDirection:'column'}}> 
            <p>Date: <b>{event.dateFrom}</b></p>
          </div>
          <div  onClick={() => setViewingEvent(null)}>{getIcon('mdi:close')}</div>
        </div>
        
        <div style={{display:'flex', width:'100%', background:'#ccc', color:'#000', padding:'10px'}}>
          <div style={{width:'40%'}}>Appointment Time</div>
          <div style={{width:'60%'}}>Customer Name</div>
        </div>
        {appointments.map(app=>{
          return <div style={{display:'flex', width:'100%', padding:'10px', borderBottom:'1px solid #f5f5f5'}}>
            <div style={{width:'40%'}}>{dayjs(app.appointmentDate+" "+app.appointmentTime).format('hh:mm A')}</div>
            <div style={{width:'60%'}}>{(app.customerName !== '' && app.customerName !== null && app.customerName !== undefined) ? app.customerName : app.guestName}</div>
          </div>  
        })}
      </div>
    </DialogComponent>
  )
}

// Form to add new events or edit existing events
// In a real implementation, we'd have some frontend
// validation and also the equivalent in our 
// backend service...
const EventForm = ({ setShowingEventForm, selectCustomerStep,  withEvent, setViewingEvent, preselectedDate, showingCustomerForm }) => {
  const newEvent = withEvent || {}
  if (!withEvent && !!preselectedDate) {
    newEvent.dateFrom = dateToInputFormat(preselectedDate)
  }
  const [event, setEvent] = useState(newEvent)
  const [value, setValue] = useState(dayjs(new Date()));
  const [datevalue, setDatevalue] = useState(dayjs(new Date()));
  console.log(preselectedDate)

  return (<></>

    // <DialogComponent open={true} className={'eventModal'} title={'New Appointment'} 
    // // onClose={() => setShowingEventForm({ visible: false })}
    // >
    //  <div className="form" style={{marginTop:'2rem'}}>  
    //     {/* <label>Date to
    //       <input type="time" step='300' min="08:00" max="18:59" required   onChange={(e) => setEvent({ ...event, dateTo: e.target.value })} />
    //     </label>   */}
    //      <LocalizationProvider dateAdapter={AdapterDayjs}>
    //   <Stack spacing={3}> 
    //     <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth >
    //         <DesktopDatePicker
    //             label="Appointment Date"
    //             inputFormat="MM/dd/yyyy"
    //             minDate= {new Date()}
    //             maxDate={new Date('2045-12-31')}
    //             style={{marginRight:'10px'}}
    //             value={datevalue}
    //             onChange={(e)=>{
    //               console.log(e)
    //                  setDatevalue(e)
    //             }}
    //             renderInput={(params) => <TextField {...params} />}
    //         />
    //     </LocalizationProvider> 
    //     <TimePicker
    //       renderInput={(params) => <TextField {...params} />}
    //       value={value}
    //       label="Appointment Time"
    //       onChange={(newValue) => {
    //         setValue(newValue);
    //       }}
    //       orientation="landscape"
    //       minTime={dayjs('2018-01-01T08:00')}
    //       maxTime={dayjs('2018-01-01T18:45')}
    //     /> 
         
    //   </Stack>
    // </LocalizationProvider>

    //     	<Fragment>
    //         <button style={{marginTop:'1rem'}} onClick={() => selectCustomerStep(datevalue, value)}>Add Appointment</button>
    //         <a className="close" href="javascript:;" onClick={() => setShowingEventForm({ visible: false })}>Cancel (go back to calendar)</a>
    //       </Fragment> 
    //   </div>
    // </DialogComponent>
  )
}

// Generic component - modal to present children within
const Modal = ({ children, onClose, title, className }) => {
  return (
    <Fragment>
      <div className="overlay" onClick={onClose} />
      <div className={`modal ${className}`}>
        <h3>{title}</h3>
        <div className="inner">
          {children}
        </div>
      </div>
    </Fragment>
  )
}

// Generic component - a nicely animated loading spinner
const Loader = () => {
  return (
    <Fragment>
      <div className="overlay" />
      <div className="loader">
        <div className="lds-roller">
          <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>  
        </div>
      </div>
    </Fragment>
  )
}

// Generic component - simple feedback after an action has taken place
const Feedback = ({ message, type }) => {
  return (
    <div className={`feedback ${type}`}>{message}</div>
  )
}

// The grid of days, renders a month's worth of days and
// also populates the events on the relevant dates
const Grid = ({ date, events, setViewingEvent, setAppointments, actualDate }) => {
  const ROWS_COUNT = 6
  const currentDate = toStartOfDay(new Date())

	// Finds the closest Monday relative to the first day of
  // the target month/year combination
  // Then increment upon this day until we have a full set
  // of date objects to work with
  const startingDate = new Date(date.getFullYear(), date.getMonth(), 1)
  startingDate.setDate(startingDate.getDate() - (startingDate.getDay() - 1))

  const dates = []
  for (let i = 0; i < (ROWS_COUNT * 7); i++) {
    const date = new Date(startingDate)
    dates.push({ date, events: findEventsForDate(events, date) })
    startingDate.setDate(startingDate.getDate() + 1)
  }

  return (
    <Fragment>
      {dates.map((date, index) => {
        return (
          <div 
            key={index}
            className={`cell ${date.date.getTime() == currentDate.getTime() ? "current" : ""} ${(date.date.getTime() < currentDate.getTime()) || (date.date.getMonth() !== actualDate.getMonth()) ? "otherMonth" : ""}`
						}>
            <div className="date">
              {date.date.getDate()}
              {/* {date.date.getTime() >= currentDate.getTime() && <a href="javascript:;" className="addEventOnDay" onClick={() => setShowingEventForm({ visible: true, preselectedDate: date.date })}>+</a>} */}
            </div>
            {date.events.map((event, index) => 
							<MiniEvent key={index} event={event} setAppointments={setAppointments} setViewingEvent={setViewingEvent} />
						)}
          </div>
        )
      })}
    </Fragment>
  )
}



// The "main" component, our actual calendar
 const Calendar = ({ month, year, preloadedEvents = [] }) => {

  const selectedDate = new Date();//year, month - 1)

  const [date, setDate] = useState(selectedDate)
  const [viewingEvent, setViewingEvent] = useState(false)
  const [showingEventForm, setShowingEventForm] = useState({ visible: false })
  const [showingCustomerForm, setShowingCustomerForm] = useState({ visible: true })
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState()
  const [servicesList, setServicesList] = useState({})
  const parsedEvents = parseEvents(preloadedEvents)
  const [events, setEvents] = useState(parsedEvents)
  const [appointments, setAppointments] = useState([])
  console.log(preloadedEvents)
  useEffect(() => {
  	// You could retrieve fresh events data here
    // So whenever the calendar month is toggled,
    // make a request and populate `events` with the
    // new results
    
    // Would be better to cache these results so you
    // don't make needless network requests
    // So you could maintain an array of `date`s
    // and simply consult this before you fire off
    // any new network requests
  	console.log("Date has changed... Let's load some fresh data")
  }, [date, showingEventForm, showingCustomerForm, parsedEvents])
 


  const showFeedback = ({ message, type, timeout = 2500 }) => {
    setFeedback({ message, type })
    setTimeout(() => {
      setFeedback(null)
    }, timeout)
  }

  const selectCustomerStep = (date, time)=> {
    console.log("DATE TIME", dayjs(date).format("YYYY-MM-DD"), dayjs(time).format("HH:mm"))
    // var eventform = showingEventForm
    // eventform.visible = false
    // eventform.date = dayjs(date).format("YYYY-MM-DD");
    // eventform.time = dayjs(time).format("HH:mm")
    // setShowingEventForm(eventform) 
    var customer = showingCustomerForm
    customer.completeselectedGuest = true
    setShowingCustomerForm(customer)

    // setTimeout(() => {
    //     console.log(customer)
    //     console.log(showingCustomerForm, showingEventForm)
    // }, 1000);
  }  

  return (
    <div className="calendar">
      {isLoading && <Loader />} 
      {feedback &&  <Feedback 
          message={feedback.message} 
          type={feedback.type} /> }

      <Navigation 
        date={date} 
        setDate={setDate} 
        setShowingCustomerForm={setShowingCustomerForm} 
      />

      <DayLabels />

      <Grid
        date={date}
        events={events}
        setAppointments={setAppointments}
        setShowingEventForm={setShowingEventForm} 
        setViewingEvent={setViewingEvent} 
        actualDate={date}
      />

      {viewingEvent && 
        <Event 
          event={viewingEvent}  
          setViewingEvent={setViewingEvent} 
          appointments={appointments} 
        />
      }

      {showingEventForm && showingEventForm.visible &&
        <EventForm 
          withEvent={showingEventForm.withEvent}
          preselectedDate={showingEventForm.preselectedDate}
          setShowingEventForm={setShowingEventForm} 
          selectCustomerStep={selectCustomerStep} 
          setViewingEvent={setViewingEvent}
          showingCustomerForm={showingCustomerForm}
        />
      }
asdadsasdsa
      {showingCustomerForm && showingCustomerForm.visible && (!showingCustomerForm.completeselectedGuest || showingCustomerForm.completeselectedGuest === undefined) &&
        <CustomerForm 
          ShowingCustomerForm = {showingCustomerForm}
          setShowingCustomerForm = {setShowingCustomerForm} 
          setShowingEventForm = {setShowingEventForm}
        />}
        {showingCustomerForm && showingCustomerForm.completeselectedGuest &&
        <Services  data={{
          showingCustomerForm: showingCustomerForm,
          selectedServices: servicesList,
          clearServices:()=>{
            setServicesList({})
          },
          removeGuest:(i)=>{
              var obj = servicesList;
              delete obj[i];
              console.log(servicesList)
              setServicesList(obj)
              var qty = Number(showingCustomerForm.selectedGuestCount) > 0 ? Number(showingCustomerForm.selectedGuestCount)-1 : 0; 
              var customer = Object.assign({}, showingCustomerForm)
              customer.selectedGuestCount = qty;
              setShowingCustomerForm(customer)
          },
          addGuest:()=>{
            var qty = Number(showingCustomerForm.selectedGuestCount) > 0 ? Number(showingCustomerForm.selectedGuestCount)+1 : 1; 
            var customer = Object.assign({}, showingCustomerForm)
            customer.selectedGuestCount = qty;
            setShowingCustomerForm(customer)
          },
          onSelectService: (service, user)=>{ 
                  var services = servicesList[user]
                  if(services !== undefined){
                    services.push(service)
                    var obj = Object.assign({}, servicesList) 
                    obj[user] = services 
                    setServicesList(obj)
                  }
                  else{
                    services = []
                    services.push(service)
                    var obj1 = Object.assign({}, servicesList) 
                    obj1[user] = services 
                    setServicesList(obj1)
                  } 
          },
          closeAppointment:()=>{
            setShowingCustomerForm({visible: true})
            setShowingEventForm({visible: false})
          }
        }}
        />}
 
    </div>
  )
}
 
export default Calendar;