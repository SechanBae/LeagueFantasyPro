import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Message from '../../components/Message';

const HomePage = () => {
    const [leagues,setLeagues]=useState(false);
    const [error,setError]=useState(false);
    const navigate=useNavigate(); 
    useEffect(()=>{
        async function getNotes(){
            try{
                const userInfo=sessionStorage.getItem("userInfo");
                if(!userInfo){
                    navigate("/");
                }
                else{
                    const config={
                        headers:{
                            Authorization:'Bearer '+JSON.parse(userInfo).token,
                        },
                    }
                    const response=await axios.get('/api/leagues/',config);
                    setLeagues(response.data.leagues);
                }
            }
            catch(error){
                console.log(error);
                setError(error.response.data.message);
            }
        }
        getNotes();
    },[])
    return (
        <div className='container'>
        {error && <Message variant='danger'>{error}</Message>}
            <h2>Your Leagues</h2>
            {leagues?
            
            leagues.map((league)=>(
                <Card key={league.leagueId}>
                    <Card.Header as="h5">League: {league.name}</Card.Header>
                    <Card.Body>
                        <Card.Title>Team Name: {league.teamName}</Card.Title>
                        <Card.Text>
                        Your team currently has {league.points} points.
                        </Card.Text>
                        <Button variant="info" href={"/league/"+league.leagueId}>Go to League Page</Button>
                    </Card.Body>
                </Card>
            ))
            :<h5>You are currently not in any leagues</h5>
            }
            <div className='row mt-5 '>
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