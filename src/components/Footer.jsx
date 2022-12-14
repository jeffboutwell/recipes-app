import {Link} from 'react-router-dom'
import {Container, Row, Col,Navbar} from 'react-bootstrap'

function Footer() {
  return (
      <footer>
        <Container>
          <Row>
            <Col>
              <Navbar.Brand href="/">Recipes</Navbar.Brand>
            </Col>
            <Col>
              <p className="contact"><a href='mailto:jeffboutwell@gmail.com'>jeffboutwell@gmail.com</a></p>
            </Col>
          </Row>
        </Container>
      </footer>
  )
}

export default Footer