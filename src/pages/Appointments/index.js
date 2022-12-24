import React from 'react'
import Calendar from './Calendar'
import HTTPManager from '../../utils/httpRequestManager'
import Loader from '../../components/Loader'
const SAMPLE_META = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." 
export default class AppointmentsCompoent extends React.Component{
    httpManager = new HTTPManager()
    constructor(props){
        super(props)
        this.state = {
            isLoading: false,
            appointments:[]
        }
    }

    componentDidMount(){ 
    }

    render(){
        return <>
        {this.state.isLoading && <Loader />}
        
        {!this.state.isLoading && <Calendar 
                month={12} 
                year={2022} 
                preloadedEvents={this.state.appointments} 
            />}
        </>
    }
}

// [
//     {
//         id: 1,
//         name: "Holiday",
//         dateFrom: "2021-09-29T12:00",
//         dateTo: "2022-12-03T08:45",
//         meta: SAMPLE_META,
//         type: "Holiday"
//     },
//     {
//         id: 2,
//         name: "Meeting",
//         dateFrom: "2022-12-01T09:45",
//         dateTo: "2022-12-04T22:00",
//         meta: SAMPLE_META,
//         type: "Standard"
//     },
//     {
//         id: 3,
//         name: "Away",
//         dateFrom: "2022-12-01T01:00",
//         dateTo: "2022-12-01T23:59",
//         meta: SAMPLE_META,
//         type: "Busy"
//     },
//     {
//         id: 4,
//         name: "Inspection",
//         dateFrom: "2022-12-19T07:30",
//         dateTo: "2022-12-21T23:59",
//         meta: SAMPLE_META,
//         type: "Standard"
//     },
//     {
//         id: 5,
//         name: "Holiday - Greece",
//         dateFrom: "2022-12-14T08:00",
//         dateTo: "2022-12-16T23:59",
//         meta: SAMPLE_META,
//         type: "Holiday"
//     },
//     {
//         id: 6,
//         name: "Holiday - Spain",
//         dateFrom: "2022-12-29T08:00",
//         dateTo: "2022-12-31T23:59",
//         meta: SAMPLE_META,
//         type: "Holiday"
//     }
//     ]