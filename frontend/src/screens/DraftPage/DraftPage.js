import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import {Button, Card, Form, Table} from 'react-bootstrap';
import Pagination from '../../components/Pagination';
import Message from '../../components/Message';
import io from 'socket.io-client'
var config;
const ENDPOINT="http://localhost:5000";//change for deploy
var socket;
const DraftPage = () => {
    const {leagueId}=useParams();
    const [error,setError]=useState(false);
    const [players, setPlayers] = useState([]);
    const [pickOrder,setPickOrder]=useState([]);
    const [playersPerPage, setplayersPerPage] = useState(10);
    const [currentPage, setcurrentPage] = useState(1);
    const [playerChosen,setPlayerChosen]=useState(0);
    const [userId,setUserId]=useState(0);
    const [filter,setFilter]=useState("");
    const [chosenPlayersFilter,setChosenPlayersFilter]=useState([0]);
    const navigate=useNavigate();
    const [orderDirection,setOrderDirection]=useState("ASC");
    const lastPostIndex=currentPage*playersPerPage;
    const firstPostIndex=lastPostIndex-playersPerPage;
    const currentPlayers=players.filter(player=>player.gameName.toLowerCase().includes(filter.toLowerCase())).filter(player=>!chosenPlayersFilter.includes(player.playerId)).slice(firstPostIndex,lastPostIndex);
    const currentPick=pickOrder.find(pick=>pick.players==null);
    const getPlayers=async()=>{
        try{
            const playerResponse=await axios.get("/api/players/getPlayers/"+leagueId,config)
            setPlayers(playerResponse.data.players);
        }catch(error){ 
            setError(error.response.data.message);
        }
    }
    const getPickOrder=async()=>{
        try {
            const orderResponse=await axios.get("/api/drafts/getDraftOrder/"+leagueId,config) 
            setPickOrder(orderResponse.data.pickOrder)
            const filterArray=[];
            for(let i=0;i<orderResponse.data.pickOrder.length;i++){
                if(orderResponse.data.pickOrder[i].playerId){
                    filterArray.push(orderResponse.data.pickOrder[i].playerId)
                }
            }
            setChosenPlayersFilter(filterArray);
        } catch (error) {
            setError(error.response.data.message);
        }
    }
    useEffect(()=>{
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
            getPlayers();
            getPickOrder();
            socket=io(ENDPOINT);

            socket.on("draftPickBroadcast",(leagueIdBroadcast)=>{
                if(leagueIdBroadcast==leagueId){
                    console.log("Draft Pick");
                    getPickOrder();
                }
            })
          }
    },[])
    const finishDraft=async()=>{
        try {
            const response=await axios.put("/api/leagues/finishDraft",{
                leagueId:leagueId
            },config)
        } catch (error) {
            setError(error.response.data.message);
        }
    }
    const draftPlayer=async()=>{
        if(currentPick){
            try{
                console.log(currentPick.draftId);
                const response=await axios.put("/api/drafts/addPlayer",{
                    leagueId:leagueId,
                    playerId:playerChosen,
                    draftId:currentPick.draftId
                },config)
                if(response){
                    socket.emit("draftPickSubmit",(leagueId));
                    getPickOrder();
                    setError(false);
                    if(currentPick==null){
                        finishDraft();
                    }
                }
            }catch(error){
                setError(error.response.data.message);
            }
        }else{
            setError("You Must Select a Player");
        }
    }
    const sortingString=(col)=>{
        if(orderDirection==="ASC"){
            const sorted=[...players].sort((a,b)=>
              a[col].toLowerCase()>b[col].toLowerCase()?1:-1
              )
              setPlayers(sorted);
              setOrderDirection("DSC")
          }
          else{
            const sorted=[...players].sort((a,b)=>
            a[col].toLowerCase()<b[col].toLowerCase()?1:-1
            )
            setPlayers(sorted);
            setOrderDirection("ASC")
          }
    }
    const sortingNumber=(col)=>{
        if(orderDirection==="ASC"){
            const sorted=[...players].sort((a,b)=>
              Number(a[col])>Number(b[col])?1:-1
              )
              setPlayers(sorted);
              setOrderDirection("DSC")
          }
          else{
            const sorted=[...players].sort((a,b)=>
            Number(a[col])<Number(b[col])?1:-1
            )
            setPlayers(sorted);
            setOrderDirection("ASC")
          }
    }
  return (
    <div className='container'>
    {error && <Message variant='danger'>{error}</Message>}
    <Button onClick={()=>navigate('/league/'+leagueId)}>Back To League Page</Button>
    {currentPick&&
    currentPick.userId==userId&&<Message variant="warning">Your Turn To Pick</Message>
    }
        <h2>Draft Page</h2>
        <div className='pickorder'>
            <h3 className='text-center'>Order</h3>
            <ul className='list-group list-group-horizontal'>
                {pickOrder&&
                pickOrder.map((pick)=>(
                    <li key={pick.draftId}>
                        <Card style={{width:"10rem"}} className='me-2'>
                            <Card.Header as="h5">{pick.users.username}'s pick</Card.Header>
                            <Card.Body>
                                {currentPick&&(currentPick.draftId==pick.draftId)&&(pick.players==null)&&"Currently Picking"}
                                {currentPick&&(currentPick.draftId!=pick.draftId)&&(pick.players==null)&&"Waiting to Pick"}
                                {pick.players&& pick.players.gameName+" has been picked"}
                            </Card.Body>
                        </Card>
                    </li>
                ))
                }
            </ul>
        </div>
        <div className='playersList'>
            <h3 className='text-center'>Draft</h3>
            <Form.Control
                className='mb-5'
                type="text"
                value={filter}
                onChange={(e)=>setFilter(e.target.value)}
                placeholder="Search for players name"
            />
            <div className='playerTable'>
                <Table className='text-center draftTable' striped hover>
                    <thead>
                        <tr>
                            <th onClick={()=>sortingString("gameName")}>Game Name{'\u2195'}</th>
                            <th onClick={()=>sortingString("team")}>Team{'\u2195'}</th>
                            <th onClick={()=>sortingString("position")}>Position{'\u2195'}</th>
                            <th onClick={()=>sortingNumber("avgKPG")}>Avg KPG{'\u2195'}</th>
                            <th onClick={()=>sortingNumber("avgDPG")}>Avg DPG{'\u2195'}</th>
                            <th onClick={()=>sortingNumber("avgAPG")}>Avg APG{'\u2195'}</th>
                            <th onClick={()=>sortingNumber("avgCSPG")}>Avg CSPG{'\u2195'}</th>
                            <th onClick={()=>sortingNumber("scoreRating")}>Score Rating{'\u2195'}</th>
                        </tr>
                    </thead>
                    <tbody>
                    {currentPlayers?
                currentPlayers.map((player)=>(
                    <tr onClick={()=>{setPlayerChosen(player.playerId)}} key={player.playerId} className={playerChosen==player.playerId?'active':''}>
                        <td>{player.gameName}</td>
                        <td>{player.team}</td>
                        <td>{player.position}</td>
                        <td>{player.avgKPG}</td>
                        <td>{player.avgDPG}</td>
                        <td>{player.avgAPG}</td>
                        <td>{player.avgCSPG}</td>
                        <td>{player.scoreRating}</td>
                    </tr>
                )):
                <tr>
                    <td colSpan="8">Looks like there aren't any players added yet, wait for the admin to add them.</td>
                </tr>
                }
                    </tbody>
                </Table>
            </div>
            
            <Pagination
                totalPosts={players.filter(player=>player.gameName.toLowerCase().includes(filter.toLowerCase())).filter(player=>!chosenPlayersFilter.includes(player.playerId)).length}
                postsPerPage={playersPerPage}
                setCurrentPage={setcurrentPage}
                currentPage={currentPage}
            />
            <div className='d-flex justify-content-center my-3'>
                <Button disabled={((currentPick)&&(currentPick.userId!=userId)||!currentPick)} onClick={()=>{draftPlayer()}} variant='light'>Lock In</Button>
            </div>
        </div>
    </div>
  )
}

export default DraftPage