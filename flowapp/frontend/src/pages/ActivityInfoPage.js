import { useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import moment from 'moment'
import { useNavigate } from "react-router-dom";
import { Spinner, Button, Card, Container, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import {Button as AButton} from  'antd';

const ActivityInfoPage = ({user}) => {
    let navigate = useNavigate();

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [location, setLocation] = useState("")
    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState(new Date())
    const [image, setImage] = useState(null)

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const { id } = useParams()

    let [activity, setActivity] = useState(null)

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim()
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


    var csrftoken = getCookie('csrftoken');

    
    

    useEffect(() => {

        async function getActivity() {
            const response = await fetch(`/api/activities/${id}`);
            const json = await response.json();
            setActivity(json)
            return json;
        }

        async function fetchData() {
            const data = await getActivity();
            setName(data.name)
            setDescription(data.description)
            setLocation(data.location)
            setDate(data.date)
            setTime(data.time)
            setImage(data.image)
        }
        
        getActivity()
        fetchData()
    }, [id])

    let handleAttend = () => {
        fetch(`/api/activities/${id}/attend/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
              },
        })
        navigate(`/activities`)
        window.location.reload()
    }

    let handleDelete = (e) => {
        fetch(`/api/activities/${id}/delete/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
              },
        }
        )
        navigate(`/activities`)
        window.location.reload()
    }

    let handleSubmit = (e) => {
        e.preventDefault();
        updateActivityInfo()
        
        handleClose()
        window.location.reload()
    }

    const updateActivityInfo = async () => {
        const formfield = new FormData()
        
        formfield.append('name', name);
        formfield.append('description', description);
        formfield.append('location', location);
        formfield.append('date', date);
        formfield.append('time', time)
        if(image!=null){
            formfield.append('image', image);
        }
        fetch(`/api/activities/${id}/update/`, {
            method: 'POST',
            body: formfield,
            headers: {
                'X-CSRFToken': csrftoken
              },
        }
        )
        
    }


    if (activity === null) {
        return ( <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>);
    } else if (String(user) === String(activity.created_by.username)) {

        const date = moment(activity.date, 'YYYY-MM-DD').format('Do MMMM YYYY')
        const f_date = moment(date, 'Do MMMM YYYY').format('dddd')
        const f_time = moment(activity.time, "HH:mm:ss").format("hh:mm A");

        return (
            <Container className="mt-4">
                <Button onClick={() => {
                                    navigate(-1)
                                }} ><i class="bi bi-arrow-left"></i> Back</Button>
                <div class="row align-items-center justify-content-center">
                <div className="card w-50 rounded shadow" style={{borderWidth: 0}}>
                    <div style={{display: "flex", flex: 1}}>
                        <div className="img-square-wrapper">
                        {activity.image != null &&
                            <img width="170px" height="160px" class="image-fit-contain mt-5" src={activity.image} alt="" />
                        }
                        </div>
                        <div className="card-body">
                            <h4 className="card-title">{activity.name}</h4>
                            <p className="card-text">{activity.description}</p>
                            <br></br>
                            <p className="card-text"><b>Location</b></p>
                            <p>{activity.location}</p>
                            <p className="card-text"><b>Date & Time</b></p>
                            <p>{f_date}, {date} at {f_time}</p>
                            <p className="card-text"><b>Attended by:</b> {activity.attendees.length}</p>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="row" style={{display: "flex", justifyContent: "space-between"}}>
                            <small className="text-muted">Created by {activity.created_by.username}</small>
                            <Button size="sm" variant="outline-secondary" className="align-self-end" 
                                    onClick={handleShow}><i class="bi bi-pencil-square"></i> Edit</Button>
                        </div>
                    </div>
                    </div>
                </div>
                <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Update your activity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form >
                        <Form.Group>
                            <Form.Label>Activity Name</Form.Label>
                            <Form.Control 
                                name='name' 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                name='description' 
                                as="textarea" 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Location</Form.Label>
                            <Form.Control 
                                name='location' 
                                type="text" 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Date</Form.Label>
                            <Form.Control 
                                name='date' 
                                type="date" 
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Time</Form.Label>
                            <Form.Control 
                                name='time' 
                                type="time" 
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group >
                            <Form.Label>Image</Form.Label>
                            <Form.Control 
                                name='image' 
                                type="file" 
                                src={image}
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </Form.Group>
                    
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <AButton shape="round" onClick={handleClose}>
                    Close
                </AButton>
                <AButton type="primary" shape='round' onClick={handleSubmit}>
                    Save Changes
                </AButton>
                <AButton  shape='round' danger onClick={handleDelete}>
                    Delete
                </AButton>
                </Modal.Footer>
            </Modal>
            </Container> 
        )
    } else {
        const date = moment(activity.date, 'YYYY-MM-DD').format('Do MMMM YYYY')
        const f_date = moment(date, 'Do MMMM YYYY').format('dddd')
        const f_time = moment(activity.time, "HH:mm:ss").format("hh:mm A");
        return (
            <Container className="mt-4">
              <Button onClick={() => {
                                    navigate(-1)
                                }} ><i class="bi bi-arrow-left"></i> Back</Button>
                <div class="row align-items-center justify-content-center">
                <div className="card w-50 rounded shadow" style={{borderWidth: 0}}>
                    <div style={{display: "flex", flex: 1}}>
                        <div className="img-square-wrapper">
                        {activity.image != null &&
                            <img src="//placehold.it/200" alt="" />
                        }
                        </div>
                        <div className="card-body">
                            <h4 className="card-title">{activity.name}</h4>
                            <p className="card-text">{activity.description}</p>
                            <br></br>
                            <p className="card-text"><b>Location</b></p>
                            <p>{activity.location}</p>
                            <p className="card-text"><b>Date & Time</b></p>
                            <p>{f_date}, {date} at {f_time}</p>
                            <p className="card-text"><b>Attended by:</b> {activity.attendees.length}</p>
                        </div>
                        </div>
                        <div className="card-footer">
                        <div className="row" style={{display: "flex", justifyContent: "space-between"}}>
                            <small className="text-muted">Created by {activity.created_by.username}</small>
                            <Button size="sm" variant="outline-success" className="align-self-end" 
                                    onClick={handleAttend}><i class="bi bi-check2-square"></i> Attend</Button>
                        </div>
                    </div>
                        </div>
                    </div>
            </Container>
          )
    }  
}

export default ActivityInfoPage