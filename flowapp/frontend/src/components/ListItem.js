import React from 'react'
import moment from 'moment'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, ListGroup, ListGroupItem} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import {Button} from 'antd';

const ListItem = ({activity}) => {  

  const date = moment(activity.date, 'YYYY-MM-DD').format('Do MMMM YYYY')

  const f_date = moment(date, 'Do MMMM YYYY').format('dddd')

  const f_time = moment(activity.time, "HH:mm:ss").format("hh:mm A");
  

  var timeAgo = moment(activity.created_at).fromNow();
  
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

      <Card className='rounded shadow-sm px-4' style={{backgroundColor: "#F8F5F2", borderWidth:0, marginBottom: "20px"}}>
          <Card.Body>
              
              <Card.Title><p class="lead"><b>{activity.name}</b></p></Card.Title>
              
              {/* <Card.Text>{activity.description}</Card.Text> */}
              {/* ( if (activity.image !== null) {
                  <img src={activity.image} class="image-fit-contain" alt="img" />
              }) */}
              
          </Card.Body>
          {activity.image === null ?
                    (<ListGroup>
                      <ListGroupItem style={{borderWidth: 0}}><b>Location:</b> {activity.location}</ListGroupItem>
                      <ListGroupItem style={{borderWidth: 0}}><b>Date: </b>
                        {f_date}, {date}
                      </ListGroupItem>
                      <ListGroupItem style={{borderWidth: 0}}><b>Time: </b> {f_time}</ListGroupItem>
                        <ListGroupItem style={{borderWidth: 0}}>
                          <b>Created by: </b><a href={`/#/profile/${activity.created_by.id}/`}>{activity.created_by.username}</a>&emsp;
                          <b>Attended by: </b>{activity.attendees.length}
                        </ListGroupItem>
                    </ListGroup>)
                    :
                    (<ListGroup>
                      <div class='row' style={{justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
                        <div class='col-md-4' style={{alignItems: 'center'}}><img width="170px" height="160px" src={activity.image} class="image-fit-contain" alt="img" /></div>
                        <div class='col-md-8'><ListGroupItem style={{borderWidth: 0}}><b>Location:</b> {activity.location}</ListGroupItem>
                        <ListGroupItem style={{borderWidth: 0}}><b>Date: </b>
                          {f_date}, {date}
                        </ListGroupItem>
                      <ListGroupItem style={{borderWidth: 0}}><b>Time: </b> {f_time}</ListGroupItem>
                      <ListGroupItem style={{borderWidth: 0}}>
                        <b>Created by: </b><a href={`/#/profile/${activity.created_by.id}/`}>{activity.created_by.username}</a>&emsp;
                        <b>Attended by: </b>{activity.attendees.length}
                      </ListGroupItem></div>
                      </div>
                  </ListGroup>)
          }
          
          <Card.Footer style={{display: "flex", backgroundColor: "#F8F5F2",justifyContent: 'space-between', alignItems: 'center'}}>
              <small className="text-muted align-self-end" style={{marginBottom: 5}}>{timeAgo}</small>
              {/* <Button size="sm" className="align-self-end" onClick={() => {navigate(`/activities/${activity.id}`)}}>More info</Button> */}
              <Button type='primary' shape='round' className="align-self-end" onClick={() => {navigate(`/activities/${activity.id}`)}}>More info</Button>
          </Card.Footer>
      </Card>
    )

}

export default ListItem