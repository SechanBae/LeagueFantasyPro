/**
 * Renders component for forgotten password page
 */
import axios from 'axios';
import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import Message from '../../components/Message';

const ForgotPasswordPage = () => {
    const [email,setEmail]=useState("");
    const [confirm,setConfirm]=useState(false);
    const [error,setError]=useState(false);
    /**
     * make api call to password recovery
     * @param {*} e 
     */
    const submitHandler=async (e)=>{
        e.preventDefault();
        try{
            const response=await axios.post("/api/users/forgotPassword",{
                email:email
            });
            setError(false);
            setConfirm(response.data.message);
        }catch(error){
            
            setConfirm(false);
            setError(error.response.data.message);
        }
    }
  return (
    <div className='container'>
        <h2>Forgot your password?</h2>
        
        {error && <Message variant='danger'>{error}</Message>}
        {confirm &&<Message variant="info">{confirm}</Message>}
        <Form onSubmit={submitHandler}>
            <Form.Group className='my-3' controlId="email">
                <Form.Label>Please enter your email associated with your account</Form.Label>
                <Form.Control
                    required
                    type="email"
                    value={email}
                    placeholder="Enter your email"
                    onChange={(e)=>setEmail(e.target.value)}
                    />
            </Form.Group>
            <Button variant='primary' type='submit'>
                Submit
            </Button>
        </Form>
    </div>
  )
}

export default ForgotPasswordPage