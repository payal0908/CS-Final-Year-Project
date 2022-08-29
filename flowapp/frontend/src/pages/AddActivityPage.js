import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";
import { message } from 'antd';

import {Form, Button, Container, Row, Col} from 'react-bootstrap';

const AddActivityPage = () => {
    let navigate = useNavigate();

    const [image, setImage] = useState("")
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [location, setLocation] = useState("")
    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState(new Date())
    const [ errors, setErrors ] = useState({})

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

    let handleSubmit = (e) => {
        message.info('Message Content!');
        e.preventDefault();
        AddActivityInfo()
        
        navigate('/activities/')
        window.location.reload()
        
    }

    

    const AddActivityInfo = async () => {
        const formfield = new FormData()
        
        formfield.append('name', name);
        formfield.append('description', description);
        formfield.append('location', location);
        formfield.append('date', date);
        formfield.append('time', time);
        if(image!==null){
            formfield.append('image', image);
        }

        fetch('/api/activities/', {
            method: 'post',
            body: formfield,
            headers: {
                'X-CSRFToken': csrftoken
              },
        }
        )
        
    }

  return (
    <Container>
    <Row>
            <Col>
                <h1 className="display-3">Add Activity</h1>
            </Col>
    </Row>
    <Button onClick={() => {
                                    navigate(-1)
                                }} ><i class="bi bi-arrow-left"></i> Back</Button>
    <Form style={{marginLeft: "30%", marginRight:"30%"}}>
        <Form.Group controlId="formBasicEmail">
            <Form.Label>Activity Name</Form.Label>
            <Form.Control 
                name='name' 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Description</Form.Label>
            <Form.Control 
                name='description' 
                as="textarea" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Location</Form.Label>
            <Form.Control 
                name='location' 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            <Form.Text className="text-muted">
            Kindly choose a location within your neighborhood so that users can discover your activity with ease!
            </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Date</Form.Label>
            <Form.Control 
                name='date' 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Time</Form.Label>
            <Form.Control 
                name='time' 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
            />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formImage">
            <Form.Label>Image</Form.Label>
            <Form.Control 
                name='image' 
                type="file" 
                src={image}
                onChange={(e) => setImage(e.target.files[0])}
            />
        </Form.Group>
        
        <div className='row' style={{flex: 1}}>
        <Button variant='outline-success' type='submit' onClick={handleSubmit}>Post Activity</Button>
        </div>
    </Form>
    </Container>
  )
}

export default AddActivityPage