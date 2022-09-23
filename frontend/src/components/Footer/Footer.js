import React from 'react'
import {Container,Row} from 'react-bootstrap'
const Footer = () => {
  return (
    <div className="footer">
      <Container>
        <Row>
          <div className='col'>
            <a href="#about">About</a>
          </div>
          <div className='col'>
            <a href="#rules">Rules</a>
          </div>
          <div className='col'>
            <a href="https://www.github.com/SechanBae">Made By Sechan Bae</a>
          </div>
        </Row>
      </Container>
    </div>
  )
}

export default Footer