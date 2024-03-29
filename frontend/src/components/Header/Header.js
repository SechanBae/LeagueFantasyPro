/**
 * Header Component
 */
import React, { useEffect, useState } from 'react'
import {Navbar,Container,Nav,NavDropdown,Button,Form,FormControl} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
const Header = () => {
  const [loggedIn,setLoggedIn]=useState(false);
  const [username,setUsername]=useState("");
  const [isAdmin,setIsAdmin]=useState(false);
  const navigate=useNavigate(); 
  /**
   * When component is mounted, check if user has logged in which changes the header
   */
  useEffect(()=>{
    const userInfo=sessionStorage.getItem("userInfo");
    if(userInfo){
      setLoggedIn(true);
      setUsername(JSON.parse(userInfo).username);
      setIsAdmin(JSON.parse(userInfo).isAdmin);
    }
  },[]);
  const logout=()=>{
    sessionStorage.removeItem("userInfo");
    navigate("/");
    window.location.reload();
  }
  return (
    <Navbar bg="light" expand="lg">
    <Container>
      <Navbar.Brand href="/home">LoL Fantasy Pro</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/chat">Chat</Nav.Link>
          {loggedIn ?
            <NavDropdown title={username} id="basic-nav-dropdown">
            <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
            {isAdmin&&
            <>
              <NavDropdown.Divider/>
              <NavDropdown.Item href="/admin/addPlayers">
                Admin - Add Players 
              </NavDropdown.Item>
              <NavDropdown.Item href="/admin/addPerformances">
                Admin - Add Performances
              </NavDropdown.Item>
            </>
              
            }
            </NavDropdown>
          :
          <>
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/register">Register</Nav.Link>
          </>
          }
          
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}

export default Header