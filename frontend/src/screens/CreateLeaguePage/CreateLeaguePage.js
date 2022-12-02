/**
 * Renders component for create league page
 */
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
var config;
const CreateLeaguePage = () => {
  const [error,setError]=useState(false);
  const [name,setName]=useState("");
  const [teamName,setTeamName]=useState("");
  const [password,setPassword]=useState("");
  const [passwordConfirm,setPasswordConfirm]=useState("");
  const [region,setRegion]=useState("NA");
  const [privateLeague,setPrivateLeague]=useState(false);
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  /**
   * When component is mounted, redirect user if they are not logged in and set config headers for verify login
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
  },[])
  /**
   * make api call to create league based off user inputs
   * @param {*} e 
   */
  const submitHandler=async (e)=>{
    e.preventDefault();
    
    setLoading(true);
    try{
      if(privateLeague){
        if(password!=passwordConfirm){
          setError("Passwords must match");
        }
        else if(password.length<4){
          setError("Password must be at least 6 characters long");
        }
        else{
          const data=await axios.post("/api/leagues/create",{
            name:name,
            teamName:teamName,
            region:region,
            password:password
          },config)
          navigate("/league/"+data.data.team.leagueId);
        }
      }
      else{
        const data=await axios.post("/api/leagues/create",{
          name:name,
          teamName:teamName,
          region:region
        },config)
        navigate("/league/"+data.data.team.leagueId);
      }
    }catch(error){
      setError(error.response.data.message)
    }
    
    setLoading(false);
  }
  return (
    <div className='container'>
    {error && <Message variant='danger'>{error}</Message>}
    {loading&&<Spinner></Spinner>}
       <h1>Create your own League</h1>
       <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>
              League Name
            </Form.Label>
            <Form.Control
              placeholder='League Name'
              type="text"
              value={name}
              required
              onChange={(e)=>setName(e.target.value)}
              minLength="6"
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="teamName">
            <Form.Label>
              Team Name
            </Form.Label>
            <Form.Control
              type="text"
              required
              value={teamName}
              placeholder="Team Name"
              onChange={(e)=>setTeamName(e.target.value)}
              minLength="6"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="region">
            <Form.Label>
              Region
            </Form.Label>
            <Form.Select 
            onChange={(e)=>setRegion(e.target.value)}>
              <option>NA</option>
              <option>EU</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="isPublic">
            <Form.Label>
              Private?
            </Form.Label>
            <Form.Check
              type="checkbox"
              value={privateLeague}
              onChange={(e)=>setPrivateLeague(!privateLeague)}
            />
          </Form.Group>
          {privateLeague&&
          <> 
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password (length of at least 6)</Form.Label>
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
          </>
          }
          <Button variant="primary" type="submit">
            Submit
          </Button>

       </Form>
    </div>
  )
}

export default CreateLeaguePage