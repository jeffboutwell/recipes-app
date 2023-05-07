import {Link} from 'react-router-dom'
import {Container, Row, Col,Navbar,ListGroup} from 'react-bootstrap'

function Footer() {
  return (
      <footer>
        <Container fluid>
          <Row>
            <Col>
              <Navbar.Brand href="/">Recipes</Navbar.Brand>
            </Col>
            <Col>
              <ListGroup horizontal id='social-icons'>
                <a href='mailto:jeffboutwell@gmail.com' title='Email me'><i className="fa-solid fa-envelope fa-2xl"></i></a>
                <a href='https://www.instagram.com/jeffb79/' title='Find me on Instagram' target='_blank'><i className="fa-brands fa-square-instagram fa-2xl"></i></a>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </footer>
  )
}

export default Footer