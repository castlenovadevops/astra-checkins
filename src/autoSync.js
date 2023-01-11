import React from 'react'
import Schedule from 'react-schedule-job'
import 'react-schedule-job/dist/index.css'
import HTTPManager from './utils/httpRequestManager';
import SyncProgress from './pages/syncData/syncProgressWithoutRefresh';  
import 'react-js-cron/dist/styles.css'

const styles = {
  text: {
    margin: '70px',
    color: 'skyblue'
  }
}

const HelloMsg = () => {
  return <h1 style={styles.text}>Hello!</h1>
}

const AutoSync = () => {
  const [open, setOpen] = React.useState(false) 
  const sayHello = () => {
    console.log("Hello msg", new Date())
    if(!open)
        setOpen(true)
  } 
 

  const jobs = [
    {
      fn: sayHello,
      id: '1',
      schedule: '0,15,30,45 * * * *'
      // this runs every 15 minutes
    },    
  ]

  console.log(jobs)

  return (
    <div>
      <Schedule
        jobs={jobs}
        timeZone='local'
        // "UTC", "local" or "YOUR PREFERRED TIMEZONE",
        dashboard={{
          hidden: true
          // if true, dashboard is hidden
        }}
      /> 
      
      {open && <div style={{'visibility':'hidden', height:'0'}}><SyncProgress afterSyncComplete={()=>{
                      setOpen(false)
                    }} /></div>}
    </div>
  )
}

export default AutoSync