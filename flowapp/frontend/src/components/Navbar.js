import React, {useState, useEffect} from 'react'
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from "react-router-dom";
import { Button, FormControl, Form } from 'react-bootstrap';


const Navbar = () => {
  let navigate = useNavigate();

  let [user, setUser] = useState(null)
  let [id, setID] = useState(null)
  let [searchText, setSearchText] = useState('')

  useEffect(() => {
    getUser()
  }, [])

  let handleSearchSubmit = (e) => {
    e.preventDefault();
    
    navigate('/search', {state: {query: searchText}})
    window.location.reload()
}

  let getUser = async () => {
      let response = await fetch('/api/curruser/')
      let data = await response.json()
      // setGeodata(data[3]['geodata'])
      // data.pop()
      setUser(data.username)
      setID(data.id)
  }

  if (user === ''| user === null) {
    return (
      <nav className="navbar navbar-expand-lg" style={{backgroundColor: "#F8F5F2"}}>
        <div className="container-fluid">
        <img width="80px" height="70px" src="/media/posts/logo.jpg" style={{position:"relative", marginRight: "10px"}} alt='img'/>
        <a className="navbar-brand" href="/">
            Flow
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">

              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/api/login/">Login</a>
              </li>

            </ul>
            
          </div>
        </div>
      </nav>
    )
  } else {
    return (
      <nav className="navbar navbar-expand-lg" style={{backgroundColor: "#F8F5F2"}}>
        <div className="container-fluid">
        <img width="80px" height="70px" src="/media/posts/logo.jpg" style={{position:"relative", marginRight: "10px"}} alt='img'/>
        <a className="navbar-brand" href="/#/activities/">
            Flow
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link disabled" href='/' aria-current="page">{user}</a>
              </li>
            </ul>
          </div>
          <form class="form-inline my-2 my-lg-0" style={{marginRight: "20px"}}>
            <div style={{display: "flex", flexDirection: "row"}}>
              <Form inline style={{display: "flex", flexDirection: "row"}}>
                <FormControl
                  type="text"
                  placeholder="Search"
                  className="mr-sm-2"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <Button onClick={handleSearchSubmit} variant="outline-info">
                  Search
                </Button>
              </Form>
              
              <ul className="navbar-nav">
                  <NavDropdown title="Account" id="basic-nav-dropdown" style={{marginLeft: 10, borderWidth: 0}}>
                    <NavDropdown.Item href={`/#/profile/${id}`}><i class="bi bi-person-lines-fill"></i> Home</NavDropdown.Item>
                    <NavDropdown.Item href='/#/calendar/'>Calendar</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/api/logout/">
                    <i class="bi bi-box-arrow-left"></i> Logout
                    </NavDropdown.Item>
                  </NavDropdown>
              </ul>
            </div>
          </form>
        </div>
      </nav>

    )
  }
  
}

export default Navbar