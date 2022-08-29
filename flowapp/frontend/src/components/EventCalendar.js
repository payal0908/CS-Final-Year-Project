import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css"
import React, {useState, useEffect, useCallback, useRef} from 'react';
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { Spinner } from 'react-bootstrap';

const locales = {
    "en-US": require("date-fns/locale/en-US")
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
})

// const events = [
//     {
//         title: "test activity",
//         allDay: true,
//         start: new Date(2022,7, 0),
//         end: new Date(2022, 7, 0)
//     }
// ]

const EventCalendar = () => {

  const clickRef = useRef(null)

  const onSelectEvent = useCallback((calEvent) => {
    window.clearTimeout(clickRef?.current)
    clickRef.current = window.setTimeout(() => {
      window.alert(calEvent.title+' '+calEvent.start)
    }, 250)
  }, [])


  let [activites, setActivities] = useState(null)
  let [currUser, setCurrUser] = useState(null)
  let [event, setEvents] = useState([])

  

  let getUser = async () => {
    let response = await fetch('/api/curruser/')
    let data = await response.json()

    setCurrUser(data.id)
    return data.id
  }

  useEffect(() => {

    async function fetchData() {
        const data = await getUser();
        try {
          // let response = await fetch(`/api/user/${data}/activities/`)
          let response = await fetch('/api/attendees/activities/')
          let data1 = await response.json()
          // let data2 = await getAttendedActivities()
          // data2.map((item, index) => {
          //   data1.push(item)
          // })
          setActivities(data1)
          let li = []
          data1.map((item, index) => {
            let obj = {
              title: item.name,
              allDay: true, 
              start: item.date,
              end: item.date
            }
            li.push(obj)
            return li
          })
          setEvents(li)
        } catch(err) {
          console.log(err)
        }
    }

    fetchData()
    // getUserActivities()
    return () => {
      window.clearTimeout(clickRef?.current)
    }
    
}, [currUser])



if ((currUser === null )| currUser === '' | (activites === null)) {
  return ( 
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>);
} else {
  return (
    <div>
      <Calendar localizer={localizer} events={event} 
        startAccessor="start" endAccessor="end"
        onSelectEvent={onSelectEvent}
        style={{height: 500, margin: "50px"}}/>
    </div>
  )
}
}

export default EventCalendar