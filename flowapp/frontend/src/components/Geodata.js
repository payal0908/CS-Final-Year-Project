import React, {useState, useEffect, useRef} from 'react'
import { Card, Container } from 'react-bootstrap'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

const Geodata = ({geodata}) => {
    // let [geodata, setGeodata] = useState([])

    // useEffect(() => {
    //     getGeodata()
    // }, [])

    const popupElRef = useRef(null);

    // const hideElement = () => {
    //     if (!popupElRef.current || !map) return;
    //     // popupElRef.current._close();
    //     map.closePopup();
    // };

    // let getGeodata = async () => {
    //     let response = await fetch('api/activities/geodata/')
    //     let data = await response.json()
    //     let a = JSON.parse(data)
    //     setGeodata(a)
    // }

  return (
    <Container>
        <Card>
            <Card.Header style={{textAlign: "right", borderBottomWidth: 0, backgroundColor: "#F8F5F2"}}>See it on the map! <i class="bi bi-geo-alt-fill"></i></Card.Header>
            <Card.Body>
                
                <MapContainer center={[1.352083, 103.819839]}  zoom={11} scrollWheelZoom={false} style={{width:"600px", height:"400px"}}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {geodata.map((activity, index) => (
                            <Marker position={[activity[1], activity[2]]} key={index}>
                                <Popup ref={popupElRef} closeButton={false}>
                                {/* <Button onClick={hideElement}>Close popup</Button> */}
                                {activity[0]} <br /> {activity[3]}
                                </Popup>
                            </Marker>
                        ))}
                    
                    
                </MapContainer>
            </Card.Body>
        </Card>

    </Container>
  )
}

export default Geodata