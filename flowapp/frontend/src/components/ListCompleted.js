import React from 'react'
import moment from 'moment'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, ListGroup, ListGroupItem} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import {Button} from 'antd';

const ListCompleted = ({activity}) => {  

  const date = moment(activity.date, 'YYYY-MM-DD').format('Do MMMM YYYY')

  const f_date = moment(date, 'Do MMMM YYYY').format('dddd')

  const f_time = moment(activity.time, "HH:mm:ss").format("hh:mm A");
    
  // const [urlUser, setUrlUser] = useState(null)

  // useEffect(() => {
        
  //   async function getUrlUserDetails() {
  //       const response = await fetch(`/api/user/${activity.created_by.id}`);
  //       const json = await response.json();
  //       setUrlUser(json)
  //       return json;
  //   }

  //   getUrlUserDetails()
    
  // }, [])

  let navigate = useNavigate();
    return (

      <Card className='rounded shadow-sm px-4' style={{backgroundColor: "#F8F5F2", borderWidth:0, marginBottom: "10px"}}>
          <Card.Body>
              
              <Card.Title><p class="lead"><b>{activity.name}</b></p></Card.Title>
              
          </Card.Body>
            <ListGroup style={{marginBottom: '10px'}}>
                <ListGroupItem style={{borderWidth: 0}}><b>Location:</b> {activity.location}</ListGroupItem>
                <ListGroupItem style={{borderWidth: 0}}><b>Date: </b>
                {f_date}, {date}
                </ListGroupItem>
                <ListGroupItem style={{borderWidth: 0}}><b>Time: </b> {f_time}</ListGroupItem>
                <ListGroupItem style={{borderWidth: 0}}>
                    <b>Created by: </b><a href={`/#/profile/${activity.created_by.id}/`}>{activity.created_by.username}</a>&emsp;
                    <b>Attended by: </b>{activity.participants.length}
                </ListGroupItem>
            </ListGroup>
          
      </Card>
    )

}

export default ListCompleted