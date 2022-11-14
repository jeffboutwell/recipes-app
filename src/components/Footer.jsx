import {Link} from 'react-router-dom'
import {Container, Row, Col} from 'react-bootstrap'

function Footer() {
  return (
      <footer>
        <Container>
          <Row>
            <Col>
              <p>Recipes App</p>
            </Col>
            <Col>
              <p className="contact"><Link to='mailto:jeffboutwell@gmail.com'>jeffboutwell@gmail.com</Link></p>
            </Col>
          </Row>
        </Container>
      </footer>
  )
}

export default Footer