import e from 'cors';
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import Message from '../../components/Message';
const LoginPage = () => {
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState(false);
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate(); 
    useEffect(()=>{
        const userInfo=localStorage.getItem("userInfo");
        if(userInfo){
            navigate("/");
        }
    })

    const submitHandler=async (e)=>{
        e.preventDefault();
        console.log(username,password);
        try {

            setLoading(true);
            
            const {data}=await axios.post('/api/users/login',
            {
                username,
                password
            },
            );
            localStorage.setItem("userInfo",JSON.stringify(data));
            setLoading(false)
        } catch (error) {
            console.log(error);
            setError(error.response.data.message);
        }
    };
    return (
        <div>
            <h1>Login</h1>
            {error && <Message variant='danger'>{error}</Message>}
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        required
                        type="text" 
                        value={username}
                        placeholder="Enter Username" 
                        onChange={(e)=>setUsername(e.target.value)}
                     />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        required
                        type="password" 
                        value={password}
                        placeholder="Password"
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default LoginPage