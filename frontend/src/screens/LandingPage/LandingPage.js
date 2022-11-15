import React, { useEffect } from 'react'
import {Container,Row} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
const LandingPage = () => {
    
    const navigate=useNavigate(); 
    useEffect(()=>{
        const userInfo=localStorage.getItem("userInfo");
        if(userInfo){
            navigate("/home");
        }
    })
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