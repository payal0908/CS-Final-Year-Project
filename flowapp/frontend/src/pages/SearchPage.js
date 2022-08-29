import React, {useState, useEffect} from 'react'
import ListItem from '../components/ListItem'
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import BackToTop from '../components/BackToTop';

const SearchPage = () => {

    const location = useLocation();
    const query = location.state.query;

    const [activites, setActivities] = useState([])

    useEffect(() => {
        
        getSearchResult()
    }, [getSearchResult])



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

    let getSearchResult = async () => {
        let response = await fetch(`/api/search/${query}/`)
        let data = await response.json()
        setActivities(data)
    }
    
    return (
    
    <Container>
        <Row >
            <Col>
                <h1 className="display-3">Search Result: </h1>

            </Col>
        </Row>
        <Row>
            <p>you searched for {query}</p>
            <div className='col-md-6'>
            {(activites.length > 0) ? 
                activites.map((activity, index) => (
                    <ListItem key={index} activity={activity}/>))
                : 
                <p> No Results</p>
            }
            </div>
            
        </Row>
        
        <BackToTop />
    </Container>
)
}

export default SearchPage