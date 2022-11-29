import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Card, Tab } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
var config;
const TradePage = () => {
    const {teamId}=useParams();
    const [error,setError]=useState(false);
    const [confirm, setConfirm] = useState(false);
    const [selected,setSelected]=useState("received");
    const [received, setReceived] = useState(false);
    const [sent, setSent] = useState(false);
    const navigate=useNavigate();
    const getTrades=async()=>{
        try {
            const response=await axios.get("/api/trades/getTrades/"+teamId,config);
            setReceived(response.data.receivedTrades);
            setSent(response.data.sentTrades);
            console.log(response.data);
        } catch (error) {
            setError(error.reponse.data.message);
            setConfirm(false);
        }
    }
    const getAvailablePlayers=async()=>{
        try {
            const response=await axios.get("/api/trades/getAvailablePlayers/"+teamId,config);
            console.log(response.data);
        } catch (error) {
            setError(error.reponse.data.message);
            setConfirm(false);
            
        }
    }
    const getTeamPlayers=async()=>{
        try{
            const response=await axios.get("/api/teams/getTeam/"+teamId,config);
            console.log(response.data)
        } catch (error) {
            setError(error.reponse.data.message);
            setConfirm(false);
            
        }
    }
    useEffect(() => {
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
        getTrades();
        getAvailablePlayers();
        getTeamPlayers();
    },[])
    
  return (
    <div className='container'>
        <h2>Trades</h2>
            <h3 className='text-center'>Trade Offers</h3>
            <div className="container d-flex justify-content-center">
                <Button onClick={()=>setSelected("received")} variant="outline-secondary" style={{ width: '10rem' }} className='p-2 m-2' active={selected==="received"?true:false}>Received Offers</Button>
                <Button onClick={()=>setSelected("sent")}variant="outline-secondary" style={{ width: '10rem' }} className='p-2 m-2' active={selected!=="received"?true:false}>Sent Offers</Button>
            </div>
            {(selected=="received")&&(received)?
            received.map((offer)=>(
                <Card key={offer.tradeId}>
                    <Card.Body>

                    </Card.Body>
                </Card>
            ))
            :
            <h5 className='text-center'>You do not have any offers</h5>
            }
        <div>
            <Table>
                <thead>

                </thead>
            </Table>
        </div>
    </div>
  )
}

export default TradePage