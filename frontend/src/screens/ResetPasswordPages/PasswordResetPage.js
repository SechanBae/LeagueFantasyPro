import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Message from "../../components/Message";

const PasswordResetPage = () => {
    const [error,setError]=useState(false);
    const [confirm,setConfirm]=useState(false);
    const [password,setPassword]=useState("");
    const [passwordConfirm,setPasswordConfirm]=useState("");
    const {token}=useParams();
    const submitHandler=async(e)=>{
        e.preventDefault();
        try{
            var passwordFormat=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
            if(password!=passwordConfirm){
                setConfirm(false);
                setError("Passwords must match");
            }else if(!password.match(passwordFormat)){
                setConfirm(false);
                setError("Password must be between 8 to 20 characters, 1 number, 1 uppercase, and 1 lowercase");
            }
            else{
                const response=await axios.put("/api/users/resetPassword",{
                    token:token,
                    password:password
                })
                setError(false);
                setConfirm(response.data.message);
            }
        }catch(error){
            setConfirm(false);
            setError(error.response.data.message);
        }
    }
  return (
    <div className="container">
      {error && <Message variant="danger">{error}</Message>}
      {confirm && <Message variant="info">{confirm}</Message>}
      <h2>Password Reset</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>
            New Password (length must be between 8-20,must contain at least 1
            number,1 uppercase, and 1 lowercase)
          </Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="passwordConfirm">
          <Form.Label>Password Confirm</Form.Label>
          <Form.Control
            required
            type="password"
            placeholder="Enter password again"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default PasswordResetPage;
