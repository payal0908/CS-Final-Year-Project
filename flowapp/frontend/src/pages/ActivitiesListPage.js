import React, {useState, useEffect} from 'react'
import ListItem from '../components/ListItem'
import Geodata from '../components/Geodata';
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, ButtonGroup, ToggleButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import BackToTop from '../components/BackToTop';
import { Alert, Button as ButtonA } from 'antd';

const ActivitiesListPage = ({user, userID, flowuser}) => {
    let navigate = useNavigate();

    // let [user, setUser] = useState(null)
    let [activities, setActivities] = useState([])
    let [geodata, setGeodata] = useState([])
    let [alertm, setAlert] = useState(false)

    const [radioValue, setRadioValue] = useState('1');

    const radios = [
        { name: 'Neighborhood', value: '2' },
        { name: 'All', value: '1' },
      ];

      let getGeodata = async () => {
            let response = await fetch('api/activities/geodata/')
            let data = await response.json()
            let a = JSON.parse(data)
            await setGeodata(a)
        }

        let getGeodata2 = async () => {
            let response = await fetch('/api/activities/neighborhood/geodata/')
            let data = await response.json()
            let a = JSON.parse(data)
            await setGeodata(a)
        }
    
    let changeFilter = async (val) => {
        setRadioValue(val)
        if(val === '2'){
            if(flowuser.neighborhood === '' | flowuser === null) {
                setAlert(true)
                setRadioValue('1')
            } else {
                let res = await fetch('/api/activities/neighborhood/')
                let data = await res.json()
                if(data.length > 0) {
                
                    if (data[0]['Neighborhood'] === 'None'){
                        setActivities([])
                        
                    } else {
                        setActivities(data)
                        await getGeodata2()
                    }
                  
                }
            }
            
        } else {
            
            let res = await fetch('/api/activities/')
            let data = await res.json()
            
            await setActivities(data)
            await getGeodata()
        }
    }

    useEffect(() => {
        getActivities()
        getGeodata()
    }, [])

    let getActivities = async () => {
        let response = await fetch('/api/activities/')
        let data2 = await response.json()
        
        
        setActivities(data2)
    }
    
    return (
    
    <Container>
        <Row >
            {alertm ? (
                <><Alert
                message="No neighborhood selected!"
                description="Head over to your profile and update your neighborhood information to see the activties in your neighborhood!"
                type="error"
                closable
                action={
                    <ButtonA onClick={() => {navigate(`/profile/${userID}`)}} size="small" type="primary">
                      Go to profile
                    </ButtonA>
                  }
              /></>
            ) : null}
            <Col>
                <h1 className="display-3">Activities</h1>

                <p>Hello {user}! </p>
            </Col>
            <Col className='text-center' style={{marginTop: 10}}>
            <p class="fs-5">Filter By: </p>
            <ButtonGroup>
                {radios.map((radio, idx) => (
                <ToggleButton
                    key={idx}
                    id={`radio-${idx}`}
                    type="radio"
                    variant={idx % 2 ? 'outline-success' : 'outline-danger'}
                    name="radio"
                    value={radio.value}
                    checked={radioValue === radio.value}
                    onChange={(e) => changeFilter(e.currentTarget.value)}
                >
                    {radio.name}
                </ToggleButton>
                ))}
            </ButtonGroup>
            </Col>
            <Col className='text-center text-md-right' >
            <Button 
            className="shadow-sm"
            style={{marginTop: "20px", marginLeft: "75%", backgroundColor: "#E6FAAE", color:"#001858", borderWidth: 0}}
                onClick={() => {
                    navigate(`/activities/add`)
                }} >Add activity    <i className="bi bi-plus-square"></i></Button>
            
            </Col>
        </Row>
        <Row>
            <Col>
                {activities.length > 0 ? (activities.map((activity, index) => (
                    <ListItem key={index} activity={activity}/>
                ))) : (<p class='lead'>No activites to show..</p>)}
            </Col>
            <Col style={{marginLeft: "6%"}}>
                <Geodata geodata={geodata}/>
            </Col>
        </Row>
        
        <BackToTop />
    </Container>
)
}

export default ActivitiesListPage