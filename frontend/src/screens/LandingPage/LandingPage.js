import React, { useEffect } from 'react'
import {Button, Container,Row} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
const LandingPage = () => {
    
    const navigate=useNavigate(); 
    useEffect(()=>{
        const userInfo=sessionStorage.getItem("userInfo");
        if(userInfo){
            navigate("/home");
        }
    })
    return (
        
        <div className='container'>
            <h1 className='text-center my-3'>Welcome to League Fantasy Esports</h1>
            <p className='text-center my-3'>Test your knowledge against others on how well you know your LoL Esports in this Fantasy League</p>
            <Button onClick={()=>navigate('/rules')} className='d-flex mx-auto my-3' variant='secondary'>Read the Rules</Button>
            <div className='my-3 d-flex flex-row justify-content-center'>
                <Button onClick={()=>navigate('/register')} variant='success'className='mx-3'>JOIN NOW</Button>
                <Button onClick={()=>navigate('/login')}variant='success' className='mx-3'>LOGIN</Button>
            </div>
        </div>
    )
}

export default LandingPage