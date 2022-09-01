import React from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Spinner, Modal, Form } from 'react-bootstrap';
import ListItem from '../components/ListItem';
import ListCompleted from '../components/ListCompleted';
import {myArray}  from '../data/ChoiceData'
import {Button} from 'antd';

const ProfilePage = () => {

    let navigate = useNavigate();
    const { id } = useParams()

    let [urlUser, setUrlUser] = useState(null)
    let [currUser, setCurrUser] = useState(null)
    let [activites, setActivities] = useState(null)
    let [completed, setCompleted] = useState(null)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [neighborhood, setNeighborhood] = useState("")
    const [display_img, setDisplayImg] = useState("")

    let getUser = async () => {
        let response = await fetch('/api/curruser/')
        let data = await response.json()
        // setGeodata(data[3]['geodata'])
        // data.pop()
        setCurrUser(data.id)
    }

    let getUserActivities = async () => {
        let response = await fetch(`/api/user/${id}/activities/`)
        let data = await response.json()
        setActivities(data)
    }

    let getUserCompletedActivities = async () => {
        let response = await fetch(`/api/user/${id}/completed-activities/`)
        let data = await response.json()
        setCompleted(data)
    }

    

    useEffect(() => {
        
        async function getUrlUserDetails() {
            const response = await fetch(`/api/user/${id}`);
            const json = await response.json();
            setUrlUser(json)
            return json;
        }

        async function fetchData() {
            const data = await getUrlUserDetails();
            setName(data.name)
            setEmail(data.email)
            setNeighborhood(data.neighborhood)
            setDisplayImg(data.display_img)
        }

        getUrlUserDetails()
        getUser()
        getUserActivities()
        getUserCompletedActivities()
        fetchData()
        
    }, [id])

    

    let handleSubmit = (e) => {
        e.preventDefault();
        updateUserInfo()
        
        handleClose()
        window.location.reload()
    }

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

    const updateUserInfo = async () => {
        const formfield = new FormData()
        
        formfield.append('name', name);
        formfield.append('email', email);
        formfield.append('neighborhood', neighborhood);
        formfield.append('display_img', display_img);

        fetch(`/api/user/${id}/update/`, {
            method: 'post',
            body: formfield,
            headers: {
                'X-CSRFToken': csrftoken
              },
        }
        )
        
    }


    const options = myArray.map((item) => {
        return (
          <option key={item} value={item}>
            {item}
          </option>
        )
      })


    if ((urlUser === null )| urlUser === '' | (activites === null) | ((completed === null))) {
        return ( <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>);
    } else {
    return (
        <div class="container">
            <div class="main-body mt-4" >
                <div class="row gutters-sm" style={{justifyContent: 'center'}}>
                    <div class="col-md-4 mb-3">
                        <div class="card shadow-sm p-3 rounded" style={{borderWidth: 0, backgroundColor: '#edf7f7'}}>
                            <div class="card-body">
                                <div class="d-flex flex-column align-items-center text-center">
                                    <img src={urlUser.display_img} alt="Admin" class="rounded-circle" width="150" />
                                    <div class="mt-3">
                                        <h4>{urlUser.name}</h4>
                                        {urlUser.user === currUser &&
                                        <Button onClick={() => {
                                            navigate('/calendar/')
                                        }} type="primary" shape='round'>View Calendar</Button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div class="card mt-3 shadow-sm rounded" style={{borderWidth: 0}}>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-4">
                                    <h6 class="mb-0">Name</h6>
                                </div>
                                <div class="col-sm-8 text-secondary">
                                    {urlUser.name}
                                </div>
                            </div>
                        <hr />
                        <div class="row">
                            <div class="col-sm-4">
                                <h6 class="mb-0">Email</h6>
                            </div>
                            <div class="col-sm-8 text-secondary">
                                {urlUser.email}
                            </div>
                        </div>
                        <hr />
                        <div class="row">
                            <div class="col-sm-4">
                                <h6 class="mb-0">Neighborhood</h6>
                            </div>
                            <div class="col-sm-8 text-secondary">
                                {urlUser.neighborhood}
                            </div>
                        </div>
                        <hr />
                        {urlUser.user === currUser &&
                            <div class="row">
                                <div class="col-sm-12">

                                    <Button type="primary" shape='round' onClick={handleShow}>Edit</Button>
                                    {/* <a class="btn btn-info " target="__blank" href="https://www.bootdey.com/snippets/view/profile-edit-data-and-skills">Edit</a> */}
                                </div>
                            </div>
                        }
                    </div>
                </div>
                
            </div>
            <div class="col-md-6">
                <div class="card mb-3 shadow-sm rounded" style={{borderWidth: 0}}>
                    <div class="card-body">
                        <div class="row">
                            <div class="col">
                                <div class="card h-100" style={{borderWidth: 0}}>
                                    <div class="card-body">
                            
                                        <p class="fs-2">Upcoming activites:</p>
                                        {activites.length < 1 ? (<p>No upcoming activites...</p>) : activites.map((activity, index) => (
                                            <ListItem key={index} activity={activity}/>
                                        ))}
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card mb-3 shadow-sm rounded" style={{borderWidth: 0}}>
                    <div class="card-body">
                        <div class="row">
                            <div class="col">
                                <div class="card h-100" style={{borderWidth: 0}}>
                                    <div class="card-body">
                            
                                        <p class="fs-2">Completed activites:</p>
                                        {completed.map((activity, index) => (
                                            <ListCompleted key={index} activity={activity}/>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Update your profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>    
                        <Form.Control
                            name='name' 
                            type="text" 
                            defaultValue={urlUser.name}
                            value = {name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className='mt-4'>Email</Form.Label>    
                        <Form.Control
                            name='email' 
                            type="email" 
                            defaultValue={urlUser.email}
                            value = {email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className='mt-4'>Neighborhood</Form.Label>    
                        <Form.Control name="neighborhood" as="select" defaultValue={urlUser.neighborhood} value={neighborhood} custom
                        onChange={(e) => setNeighborhood(e.target.value)}>
                            {options}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className='mt-4'>Image <img src={urlUser.display_img} class="rounded-circle" width="30" alt='img'></img></Form.Label>    
                        <Form.Control
                            name='display_image' 
                            type="file"
                            onChange={(e) => setDisplayImg(e.target.files[0])}
                        ></Form.Control>
                    </Form.Group>
                    
                </Form>
            </Modal.Body>
            <Modal.Footer style={{display: 'flex', justifyContent: 'space-between'}}>

            <Button type='link' href='/api/update-password/'>Update Password</Button>
            
            <div style={{flexDirection: 'row'}}>
            <Button type="default" shape='round' onClick={handleClose} style={{marginInline: 10}}>
                Close
            </Button>
            <Button type="primary" shape='round' onClick={handleSubmit}>
                Save Changes
            </Button>
            </div>
            </Modal.Footer>
        </Modal>
    </div>   
    )
    }
}

export default ProfilePage