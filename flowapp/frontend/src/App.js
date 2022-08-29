import { 
  HashRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import "antd/dist/antd.css";
import { Box } from "@mui/material";
import ActivitiesListPage  from './pages/ActivitiesListPage'
import Navbar from './components/Navbar'
import ActivityInfoPage from "./pages/ActivityInfoPage";
import AddActivityPage from "./pages/AddActivityPage";
import SearchPage from "./pages/SearchPage";
import LandingPage from "./pages/LandingPage";

import ProfilePage from "./pages/ProfilePage";
import EventCalendar from "./components/EventCalendar";
import { useEffect, useState } from "react";

function App() {

  let [user, setUser] = useState(null)
  let [flowuser, setFlowUser] = useState(null)
  let [userID, setUserID] = useState(null)
  let [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    getUser();
    getFlowUser()
  }, []);

  let getFlowUser = async () => {
    let response = await fetch('/api/flowuser')
    let data = await response.json()
    setFlowUser(data)
  }

  let getUser = async () => {
    let response = await fetch('/api/curruser/')
    let data = await response.json()
    // setGeodata(data[3]['geodata'])
    // data.pop()

    if(data.username === '') {
      setLoggedIn(false)
      return
    } else {
      setUser(data.username)
      setUserID(data.id)
      setLoggedIn(true)
    }
}

  return (
    <Box>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={
              loggedIn ? (
                <Navigate to="/activities"/>
              ) : (
                <LandingPage />
              )
          }/>
          <Route exact path="/activities" element={
              loggedIn ? (
                  <ActivitiesListPage user={user} userID={userID} flowuser={flowuser}/>
              ) : (
                <Navigate to="/"/>
              )
          }/>
          

          <Route exact path='/profile/:id' element={<ProfilePage />} />

          <Route exact path='/activities/:id' element={<ActivityInfoPage user={user}/>} />

          {/* <Route exact path='/activities/:id' element={
            loggedIn ? (
              <ActivityInfoPage user={user} />
            ) : (
              <Navigate to='/' />
            )
          } /> */}
          
          <Route exact path='/activities/add' element={
            loggedIn ? (
              <AddActivityPage />
            ) : (
              <Navigate to='/' />
            )
          } />

          <Route exact path='/calendar' element={
            loggedIn ? (
              <EventCalendar />
            ) : (
              <Navigate to='/' />
            )
          } />
          <Route path='/search' element={<SearchPage />} />
          
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
