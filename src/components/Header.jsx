import { useEffect } from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import { Nav, NavDropdown, Navbar, Container } from 'react-bootstrap'
import {getAuth} from 'firebase/auth'

function Header() {
    const navigate = useNavigate()
    const location = useLocation()

    const auth = getAuth()
    console.log(auth.currentUser)

  return (
        <Navbar bg="bg-white" expand="lg">
        <Container>
            <Navbar.Brand href="/">Recipes</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
{/*                 <Nav.Link href="/">Cuisine Type</Nav.Link>
                <Nav.Link href="/">Favorites</Nav.Link>
                <Nav.Link href="/new">Create New Recipe</Nav.Link>
                <Nav.Link href="/">Search</Nav.Link> */}
                <Nav.Link href="/profile">Profile</Nav.Link>
                {auth.currentUser
                  ? <Nav.Link href="/sign-out">Sign Out</Nav.Link>
                  : <Nav.Link href="/sign-in">Sign In</Nav.Link>
                }
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
  )
}

export default Header