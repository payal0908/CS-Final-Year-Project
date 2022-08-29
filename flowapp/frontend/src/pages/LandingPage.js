import React from 'react'
import { Container, Col, Row, Button } from 'react-bootstrap'
import { useNavigate } from "react-router-dom";
import '../App.css'

const LandingPage = () => {
    let navigate = useNavigate();

  return (
    <div class="container my-5">
    <div class="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 shadow-lg">
      <div class="col-lg-7 p-3 p-lg-5 pt-lg-3">
        <h1 class="display-4 fw-bold lh-1">Welcome to Flow!</h1>
        <p class="lead">Connect with your neighbors and build meaningful friendships by taking part in activities you love! Host activities yourself and connect with likeminded people! Your chance to live in a neighborhood surrounded by friends.</p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
          <a class="btn btn-primary btn-lg px-4 me-md-2 fw-bold" href="/api/signup/">Register</a>
          <a class="btn btn-outline-secondary btn-lg px-4" href="/api/login/">Login</a>
        </div>
      </div>
      <div class="col-lg-4 offset-lg-1 p-0 overflow-hidden shadow-lg">
          <img class="rounded-lg-3" src='/media/posts/communitypark.jpg' alt="" width="720" />
      </div>
    </div>
  </div>    
  )
}

export default LandingPage