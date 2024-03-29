/**
 * renders component for login page
 */
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import axios from "axios";
import {Link, useNavigate} from 'react-router-dom';
import Message from '../../components/Message';
import Spinner from '../../components/Spinner';
const LoginPage = () => {
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState(false);
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate(); 
    /**
    * When component is mounted, redirect user if they are logged in 
    * 
    */
    useEffect(()=>{
        const userInfo=sessionStorage.getItem("userInfo");
        if(userInfo){
            navigate("/");
        }
    },[])

    /**
     * makes api call to log user in with data entered
     * @param {*} e 
     */
    const submitHandler=async (e)=>{
        e.preventDefault();
        try {

            setLoading(true);
            
            const {data}=await axios.post('/api/users/login',
            {
                username,
                password
            },
            );
            sessionStorage.setItem("userInfo",JSON.stringify(data));
            setLoading(false);
            window.location.reload();
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    };
    return (
        <div className="container">
            <h1>Login</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {loading&&<Spinner></Spinner>}
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
                    <Form.Label>Password </Form.Label>
                    <Form.Control 
                        required
                        type="password" 
                        value={password}
                        placeholder="Enter Password"
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
            <Row className="py-2">
                <Col>
                    <p>Not a user? <Link to="/register">Register Here</Link></p>
                </Col>
                <Col>
                    <p>Forgot your password? <Link to="/forgotPassword">Click Here</Link></p>
                </Col>
            </Row>
        </div>
    )
}

export default LoginPage