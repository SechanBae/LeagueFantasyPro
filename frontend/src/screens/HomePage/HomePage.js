import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LeagueList from '../../components/LeagueList';
import Message from '../../components/Message';
var config;
const HomePage = () => {
    const [leagues,setLeagues]=useState(false);
    const [error,setError]=useState(false);
    const navigate=useNavigate(); 
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
            getLeagues();
          }
    },[])
    const getLeagues=async()=>{
        try {
          const response=await axios.get('/api/leagues/',config);
          setLeagues(response.data.leagues);
        } catch (error) {
          setError(error.response.data.message);
        }
      }
    return (
        <div className='container'>
        {error && <Message variant='danger'>{error}</Message>}
            <h2>Your Leagues</h2>
            <h5 className='my-3'>Leagues - Waiting For Draft</h5>
            {leagues&&<LeagueList leagues={leagues.filter(league=>league.isDone===0&&league.draftStatus!=="FINISHED")}/>}
            <h5 className='my-3'>Leagues - Ongoing</h5>
            {leagues&&<LeagueList leagues={leagues.filter(league=>league.isDone===0&&league.draftStatus==="FINISHED")}/>}
            <h5 className='my-3'>Leagues - Finished</h5>
            {leagues&&<LeagueList leagues={leagues.filter(league=>league.isDone===1&&league.draftStatus==="FINISHED")}/>}
            <div className='row my-5 '>
                <div className='col d-flex justify-content-center'>
                    <Button variant="success"  href="/createLeague">Create Your Own League</Button>
                </div>
                <div className='col d-flex justify-content-center'> 
                    <Button variant='light' href="/joinLeague">Join Other Leagues</Button>
                </div>
            </div>
        </div>
    )
}

export default HomePage