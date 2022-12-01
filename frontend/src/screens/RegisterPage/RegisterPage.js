import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import Spinner from '../../components/Spinner';

const RegisterPage = () => {
    const [error,setError]=useState(false);
    const [confirm,setConfirm]=useState(false);
    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [passwordConfirm,setPasswordConfirm]=useState("");
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();
    useEffect(()=>{
        const userInfo=sessionStorage.getItem("userInfo");
        if(userInfo){
            navigate("/");
        }
    })
    const submitHandler=async (e)=>{
        e.preventDefault();
        var passwordFormat=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
        
        setLoading(true);
        if(password!=passwordConfirm){
            setConfirm(false);
            setError("Passwords must match");
        }
        else if(!password.match(passwordFormat)){
            setConfirm(false);
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
        }
        setLoading(false)
    };
    return (
        <div className="container">
            <h1>Register</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {confirm &&<Message variant="info">{confirm}</Message>}
            {loading&&<Spinner></Spinner>}
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        required
                        type="text" 
                        placeholder="Enter username"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                        minLength="4"
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
                    <Form.Label>Password (length must be between 8-20,must contain at least 1 number,1 uppercase, and 1 lowercase)</Form.Label>
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
            <Row className="py-2">
                <Col>
                    <p>Already a user? <Link to="/login">Login Here</Link></p>
                </Col>
            </Row>
        </div>
    )
}

export default RegisterPage