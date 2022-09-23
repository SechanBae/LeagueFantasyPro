import React from 'react'
import {Container,Row} from 'react-bootstrap'
const LandingPage = () => {
  return (
    <div className='main'>
        <Container>
            <Row>
                <div className='col'>Draft Your Team</div>
            </Row>
            <Row>
                <div className='col'><button className='btn-primary'>Signup</button></div>
            </Row>
            <Row>
                <div className='col'><button className='btn-primary'>Login</button></div>
            </Row>
        </Container>
    </div>
  )
}

export default LandingPage