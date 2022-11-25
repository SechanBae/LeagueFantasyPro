import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Message from '../../components/Message';
var config;
const LeaguePage = () => {
    const {leagueId}=useParams();
    const [error,setError]=useState(false);
    const [leagueInfo,setLeagueInfo]=useState({});
    const [teams,setTeams]=useState([]);
    const [username,setUsername]=useState("");
    const navigate=useNavigate();
    useEffect(()=>{
      const userInfo=sessionStorage.getItem("userInfo");
      if(!userInfo){
          navigate("/");
      }
      else{
        setUsername(userInfo.username);
        config={
          headers:{
              Authorization:'Bearer '+JSON.parse(userInfo).token,
          },
        }
      }
      async function getLeague(){
          try {
            const response=await axios.get("/api/leagues/getLeagueInfo/"+leagueId,config);
            setLeagueInfo(response.data.league);
            setTeams(response.data.teams);
          } catch (error) {
            console.log(error);
            setError(error.response.data.message);
          }
      }
      getLeague();
    },[])
  return (
    <div className='container'>
    {error && <Message variant='danger'>{error}</Message>}
        {JSON.stringify(leagueInfo)}
        {JSON.stringify(teams)}
        {leagueInfo.host===username&&
        <p>Host Stuff</p>
        }
    </div>
  )
}

export default LeaguePage