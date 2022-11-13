import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import Message from '../../components/Message';

const RegisterPage = () => {
    const [error,setError]=useState(false);
    const [confirm,setConfirm]=useState(false);
    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [passwordConfirm,setPasswordConfirm]=useState("");
    const navigate=useNavigate();
    useEffect(()=>{
        const userInfo=localStorage.getItem("userInfo");
        if(userInfo){
            navigate("/");
        }
    })
    const submitHandler=async (e)=>{
        e.preventDefault();
        var passwordFormat=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
        if(password!=passwordConfirm){
            setError("Passwords must match");
        }
        else if(!password.match(passwordFormat)){
            setError("Password must be between 8 to 20 characters, 1 number, 1 uppercase, and 1 lowercase");
        }
        else{
            setError(false);
            try {
                const{data}=await axios.post("/api/users/signup",{
                    username,
                    email,
                    password
                });
                setError(false);
                setConfirm("Your account has been created");
            } catch (error) {
                
                setConfirm(false);
                setError(error.response.data.message);
            }
            console.log("pass");
        }
    };
    return (
        <div>
            <h1>Register</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {confirm &&<Message variant="info">{confirm}</Message>}
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        required
                        type="text" 
                        placeholder="Enter username"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                      />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        required
                        type="email" 
                        placeholder="Enter email" 
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                     />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="passwordConfirm">
                    <Form.Label>Password Confirm</Form.Label>
                    <Form.Control
                        required
                        type="password" 
                        placeholder="Enter password again" 
                        value={passwordConfirm}
                        onChange={(e)=>setPasswordConfirm(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default RegisterPage