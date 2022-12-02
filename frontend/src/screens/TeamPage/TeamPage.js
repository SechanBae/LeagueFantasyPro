/**
 * Renders component for team page
 */
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import { Accordion, Button, Table } from 'react-bootstrap';
import Message from '../../components/Message';
var config;
const TeamPage = () => {
    const {teamId}=useParams();
    const [error,setError]=useState(false);
    const [confirm, setConfirm] = useState(false);
    const [team, setTeam] = useState(false);
    const [players,setPlayers]=useState(false);
    const [userId, setUserId] = useState(false);
    const [performance,setPerformance]=useState(false);
    const [selectedIndex,setSelectedIndex]=useState(-1);
    const positions=["Top","Jungle","Middle","ADC","SUPPORT","SUB"];
    const navigate=useNavigate();
    /**
     * make api call to get team data
     */
    const getTeam=async()=>{
        try{
            const response=await axios.get("/api/teams/getTeam/"+teamId,config);
            console.log(response.data);
            setTeam(response.data.team);
            setPlayers(response.data.teamPlayers);
        }catch(error){
            setConfirm(false);
            setError(error.reponse.data.message);
        }
    }
    /**
     * Make api call to get performance of a specific player in a team
     * @param {*} playerId 
     * @param {*} index 
     */
    const getPerformance=async(playerId,index)=>{
        try{
            const response=await axios.get("/api/performances/getPlayerPerformance/"+playerId+"/"+teamId,config);
            setPerformance(response.data.performance);
            setSelectedIndex(index)
        }
        catch(error){
            setConfirm(false);
            setError(error.reponse.data.message);
        }
    }
    /**
     * Make api call to substitute player
     */
    const substitutePlayer=async()=>{
        if(players[5]){
            try{
                const response=await axios.put("/api/teams/substitutePlayer",{
                    teamId:teamId
                },config)
                if(response){
                    setSelectedIndex(-1);
                    setError(false);
                    setConfirm("Players have been substituted");
                    getTeam();
                }
            }catch(error){
                setError(error.reponse.data.message);
                setConfirm(false);
            }
        }
        else{
            setError("You do not have a substitute yet");
            setConfirm(false);
        }
        
    }
    /**
    * When component is mounted, redirect user if they are not logged in and set config headers for verify login,
    * and call getTeam method
    */
    useEffect(() => {
        const userInfo=sessionStorage.getItem("userInfo");
        if(!userInfo){
            navigate("/");
        }
        else{
          setUserId(JSON.parse(userInfo).userId);
          config={
            headers:{
                Authorization:'Bearer '+JSON.parse(userInfo).token,
            },
          }
        }
        getTeam();
    },[])
    
  return (
    <div className='container'>
        {error && <Message variant='danger'>{error}</Message>}
        {confirm &&<Message variant="info">{confirm}</Message>}
        <Button onClick={()=>navigate('/league/'+team.leagueId)}>Back To League Page</Button>
        {userId==team.userId&&
        <Button className="my-3 ms-3" onClick={()=>navigate('/team/trade/'+teamId)}>Trades Page</Button>
        }
        <h2>{team.teamName}  - {team.points} POINTS</h2>
        <div className='overflowx'>
            <Table striped hover>
            <thead>
                <tr>
                    <th></th>
                    <th>Player Name</th>
                    <th>Position</th>
                    <th>AVG KPG</th>
                    <th>AVG DPG</th>
                    <th>AVG APG</th>
                    <th>AVG CSPG</th>
                    <th>Score Rating</th>
                </tr>
            </thead>
            <tbody>
                {players?
                players.map((player,index)=>([
                    <tr role="button" onClick={()=>getPerformance(player.playerId,index)} key={player.playerId}  className='my-5'>
                        <td>{positions[index]}</td>
                        <td>{player.gameName}</td>
                        <td>{player.position}</td>
                        <td>{player.avgKPG}</td>
                        <td>{player.avgDPG}</td>
                        <td>{player.avgAPG}</td>
                        <td>{player.avgCSPG}</td>
                        <td>{player.scoreRating}</td>
                    </tr>,
                    selectedIndex==index&&
                    <tr key={player.playerId*13} >
                        <td colSpan={8}>
                            <Table variant='dark' striped hover bordered>
                                <thead>
                                    <tr>
                                        <th>Week</th>
                                        <th>Kills</th>
                                        <th>Deaths</th>
                                        <th>Assists</th>
                                        <th>CS</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {performance?
                                    performance.map((performance)=>(
                                        <tr key={performance.performanceId}>
                                            <td>{performance.week}</td>
                                            <td>{performance.totalKills}</td>
                                            <td>{performance.totalDeaths}</td>
                                            <td>{performance.totalAssists}</td>
                                            <td>{performance.totalCS}</td>
                                            <td>{performance.totalScore}</td>
                                        </tr>
                                    ))
                                    :
                                    <tr><td colSpan={6}>No matches has been played for this player on this team</td></tr>}
                                </tbody>
                            </Table>
                        </td>
                    </tr>
                ]
                    
                ))
                :
                <tr><td colSpan={7}>Nobody is in this team yet</td></tr>}
            </tbody>
        </Table>
        </div>
        
        {(team&&team.userId==userId)&&
        <div className='d-flex justify-content-center'>
            <Button onClick={substitutePlayer} variant='info'>Substitute Player</Button>
        </div>
        }
    </div>
  )
}

export default TeamPage