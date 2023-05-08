import { useEffect, useState } from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import { Nav, NavDropdown, Navbar, Container, Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap'
import {getAuth} from 'firebase/auth'
import { useAuthStatus } from "../hooks/useAuthStatus"
import React, { createElement, Fragment, useRef } from 'react';
import { render } from 'react-dom';

function Header() {
  const {loggedIn, checkingStatus} = useAuthStatus()
  //const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const plugins = React.useMemo(() => {
    return []; // add more plugins here
  }, []); 

  return (
        <Navbar bg="bg-white" expand="lg">
        <Container className={(window.location.pathname === '/') ? 'home header' : 'header'}>
            <Navbar.Brand href="/">Recipes</Navbar.Brand>
            <Navbar.Toggle aria-controls="main-navbar-container" />
            <Navbar.Collapse id="main-navbar-container">
            <Nav id="main-navbar">
                <Nav.Link href="/categories">Categories</Nav.Link>
                <NavDropdown id="profile-dropdown" title={loggedIn ? <i className="fa-solid fa-user"></i> : 'Sign In'}>
                  <NavDropdown.Item href={loggedIn ? '/sign-out' : '/sign-in'}>{loggedIn ? 'Sign Out' : 'Sign In' }</NavDropdown.Item>
                  <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                </NavDropdown>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
  )
}

export default Header