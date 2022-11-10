import e from 'cors';
import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import axios from "axios";


const LoginPage = () => {
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState(false);
    const [loading,setLoading]=useState(false);

    const submitHandler=async (e)=>{
        e.preventDefault();
        console.log(username,password);
        try {

            setLoading(true);
            
            const {data}=await axios.post('http://localhost:5000/api/users/login',
            {
                username,
                password
            },
            );
            console.log(data);
            localStorage.setItem("userInfo",JSON.stringify(data));
            setLoading(false)
        } catch (error) {
            setError(error.response.data.message);
        }
    };
    return (
        <div>
            <h1>Login</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text" 
                        value={username}
                        placeholder="Enter Username" 
                        onChange={(e)=>setUsername(e.target.value)}
                     />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
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