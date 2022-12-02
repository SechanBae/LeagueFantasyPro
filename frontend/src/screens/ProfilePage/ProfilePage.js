/**
 * Renders component for profile page
 */
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
var config;
const ProfilePage = () => {
    const [error,setError]=useState(false);
    const [confirm,setConfirm]=useState(false);
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [passwordConfirm,setPasswordConfirm]=useState("");
    const [profile,setProfile]=useState({});
    const [changeField,setChangeField]=useState("");
    const [oldPassword,setOldPassword]=useState("");
    const navigate=useNavigate();
    /**
    * When component is mounted, redirect user if they are not logged in and set config headers for verify login,
    * make api call to get profile
    */
    useEffect(()=>{
        const userInfo=sessionStorage.getItem("userInfo");
        if(!userInfo){
            navigate("/");
        }
        else{
        config={
            headers:{
                Authorization:'Bearer '+JSON.parse(userInfo).token,
            },
        }
        }
        async function getProfile(){
            try{
                const response=await axios.get("/api/users/profile",config);
                setProfile(response.data.user);
            }catch(error){
                setError(error.response.data.message);
            }
        }
        getProfile()
    },[])
    /**
     * make api call to either change email or password
     * @param {*} e 
     */
    const submitHandler =async(e)=>{
        
        e.preventDefault();
        try{
            if(changeField==="email"){
                const response=await axios.put("/api/users/changeEmail",{
                    email:email
                },config)
                window.location.reload();
            }
            else if(changeField==="password"){
                    
                var passwordFormat=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
                if(password!=passwordConfirm){
                    setConfirm("");
                    setError("Passwords must match");
                }
                else if(!password.match(passwordFormat)){
                    setConfirm("");
                    setError("Password must be between 8 to 20 characters, 1 number, 1 uppercase, and 1 lowercase");
                }
                else{
                    const response=await axios.put("/api/users/changePassword",{
                        oldPassword:oldPassword,
                        password:password
                    },config)
                    setConfirm(response.data.message);
                }
            }
        }catch(error){
            setConfirm("");
            setError(error.response.data.message);
        }
    }
  return (
    <div className="container">
        {confirm &&<Message variant="info">{confirm}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        <h2>Profile</h2>
        <div className='my-3'>
            <h5>Username</h5>
            <p>{profile.username}</p>
        </div>
        <div className='my-3'>
            <h5>Email</h5>
            <p>{profile.email}</p>
            <Button variant='dark' onClick={()=>setChangeField("email")}>Change Email</Button>
        </div>
        <div className='my-3'>
            <h5>Password</h5>
            <Button variant='dark' onClick={()=>setChangeField("password")}>Change Password</Button>
        </div>
        {changeField==="email"&&
        <Form onSubmit={submitHandler}>
            <Form.Group className='my-3' controlId='email'>
                <Form.Label>New Email address</Form.Label>
                    <Form.Control
                        required
                        type="email" 
                        placeholder="Enter your new email" 
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />
            </Form.Group>
            <Button variant="primary" type="submit">
                    Change Email
            </Button>
        </Form>
        }
        {changeField==="password"&&
        <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="oldPassword">
                    <Form.Label>Enter your old password</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        placeholder="Enter your old password"
                        value={oldPassword}
                        onChange={(e)=>setOldPassword(e.target.value)}
                    />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
                    <Form.Label>New Password (length must be between 8-20,must contain at least 1 number,1 uppercase, and 1 lowercase)</Form.Label>
                    <Form.Control
                        required
                        type="password"
                        placeholder="Enter your new password"
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
                    Change Password
            </Button>
        </Form>
        }
    </div>
  )
}

export default ProfilePage