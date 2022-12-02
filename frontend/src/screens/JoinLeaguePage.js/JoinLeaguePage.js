/*
 * Renders component for join league page
*/ 
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
var config;
const JoinLeaguePage = () => {
  const [error,setError]=useState(false);
  const [leagues,setLeagues]=useState([]);
  const [orderDirection,setOrderDirection]=useState("ASC");
  const [filter,setFilter]=useState("");
  const [teamName,setTeamName]=useState("");
  const [password,setPassword]=useState("");
  const [join,setJoin]=useState("");
  const navigate=useNavigate(""); 
  /**
   * When component is mounted, redirect user if they are not logged in and set config headers for verify login,
   * make api call to get list of leagues to join
   */
  useEffect(()=>{
    async function getData(){
      try{
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
            const response=await axios.get('/api/leagues/getAllLeagues',config);
            
            setLeagues(response.data.leagues);
          
        }
      }catch(error){
        setError(error.response.data.message);
      }
      
    }
    getData();
  },[])
  /**
   * sort table by column
   * @param {*} col 
   */
  const sorting=(col)=>{
    if(orderDirection==="ASC"){
      const sorted=[...leagues].sort((a,b)=>
        a[col].toLowerCase()>b[col].toLowerCase()?1:-1
        )
        setLeagues(sorted);
        setOrderDirection("DSC")
    }
    else{
      const sorted=[...leagues].sort((a,b)=>
      a[col].toLowerCase()<b[col].toLowerCase()?1:-1
      )
      setLeagues(sorted);
      setOrderDirection("ASC")
    }
  }
  /**
   * sort table by column (public/private)
   * @param {*} col 
   */
  const sortingPublic=()=>{
    if(orderDirection==="ASC"){
      const sorted=[...leagues].sort((a,b)=>
        a["isPublic"]-b["isPublic"]
      )
      setLeagues(sorted);
      setOrderDirection("DSC")
    }
    else{
      
      const sorted=[...leagues].sort((a,b)=>
        b["isPublic"]-a["isPublic"]
      )
      setLeagues(sorted);
      setOrderDirection("ASC")
    }
  }
  /**
   * sort by capacity of leagues
   */
  const sortingCapacity=()=>{
    if(orderDirection==="ASC"){
      const sorted=[...leagues].sort((a,b)=>
        a["capacity"]-b["capacity"]
      )
      setLeagues(sorted);
      setOrderDirection("DSC")
    }
    else{
      
      const sorted=[...leagues].sort((a,b)=>
        b["capacity"]-a["capacity"]
      )
      setLeagues(sorted);
      setOrderDirection("ASC")
    }
  }
  /**
   * Cancel join process
   */
  const cancelJoin=()=>{
    setTeamName("");
    setPassword("");
    setJoin("");
  }
  /**
   * make api to join league with user inputs
   * @param {*} e 
   */
  const submitHandler= async (e)=>{
    e.preventDefault();
    try{
      if(!join.isPublic){
        setPassword("");
      }
      const response=await axios.post("/api/leagues/join",{
        teamName:teamName,
        leagueId:join.leagueId,
        password:password
      },config);
      navigate("/league/"+join.leagueId);
    }catch(error){
      setError(error.response.data.message);
    }
  }
  return (
    <div className='container'>
    <h2>Join Leagues</h2>
      {error && <Message variant='danger'>{error}</Message>}
      {join
        &&
        <Form onSubmit={submitHandler}>
          <Form.Group className='mb-3' controlId='teamName'>
            <Form.Label>Team Name</Form.Label>
            <Form.Control
              required
              type="text"
              value={teamName}
              placeholder="Enter your Team Name"
              onChange={(e)=>setTeamName(e.target.value)}
              minLength="6"
            />
          </Form.Group>
          {!join.isPublic
          &&
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
          }
          <div className='d-flex justify-content-end'>
            <Button variant="primary" type="submit">
                      Submit
            </Button>
            <Button className='mx-1' variant="danger" onClick={()=>cancelJoin()}>
                      Cancel
            </Button>
          </div>
        </Form>
      }
      <p className='mt-5'>Search</p>
      <Form.Control
      className='mb-5'
      type="text"
      value={filter}
      onChange={(e)=>setFilter(e.target.value)}
      placeholder="Filter the leagues by league name"
      />
      <div className='overflowx'>
      <Table className='text-center w-100' striped bordered hover>
        <thead>
          <tr>
            <th onClick={()=>sorting("name")}>League Name{'\u2195'}</th>
            <th onClick={()=>sorting("region")}>Region{'\u2195'}</th>
            <th onClick={()=>sorting("host")}>Hosted By{'\u2195'}</th>
            <th onClick={()=>sortingPublic()}>Public{'\u2195'}</th>
            <th onClick={()=>sortingCapacity()}>Capacity{'\u2195'}</th>
            <th className='joinCol'></th>
          </tr>
        </thead>
        <tbody>
          {leagues?
          leagues.filter(league=>league.name.toLowerCase().includes(filter)).map((league)=>(
              <tr key={league.leagueId}>
                <td>{league.name}</td>
                <td>{league.region}</td>
                <td>{league.host}</td>
                <td>{league.isPublic?'\u2713':'\u2715'}</td>
                <td>{league.capacity}/6</td>
                <td><Button onClick={()=>setJoin(league)}>Join</Button></td>
              </tr>
          ))
          :
          <tr>
            <td colSpan={6}>There are currently no joinable leagues</td>
          </tr>
          }
        </tbody>
      </Table>
      </div>
      
    </div>
  )
}

export default JoinLeaguePage