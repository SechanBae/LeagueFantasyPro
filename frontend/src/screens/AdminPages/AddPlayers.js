/**
 * Renders screen component for add players page
 */
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';

import { useCSVReader } from 'react-papaparse';
import { useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
var config;
const AddPlayers = () => {
  const [players,setPlayers]=useState();
  const [error,setError]=useState(false);
  const [confirm,setConfirm]=useState(false);
  const navigate=useNavigate();
  const { CSVReader } = useCSVReader();
  /**
   * Makes api call to add players based off csv file
   * @returns 
   */
  const addPlayers=async()=>{
    setPlayers(players.pop());
    let playersJSON=[];
    if(players[0][0]!=="gameName"&&players[0][1]!=="region"&&players[0][2]!=="position"&&players[0][3]!=="team"&&players[0][4]!=="avgKPG"&&players[0][5]!=="avgDPG"&&players[0][6]!=="avgAPG"&&players[0][7]!=="avgCSPG"){
        setError("File not in correct format");
        setConfirm(false);
        return;
    }
    for(let i=1;i<players.length;i++){
        playersJSON.push({
            [players[0][0]]:players[i][0],
            [players[0][1]]:players[i][1],
            [players[0][2]]:players[i][2],
            [players[0][3]]:players[i][3],
            [players[0][4]]:players[i][4],
            [players[0][5]]:players[i][5],
            [players[0][6]]:players[i][6],
            [players[0][7]]:players[i][7],
            scoreRating:(players[i][4]*300)+(players[i][5]*(-100))+(players[i][6]*150)+(players[i][7]*1)});
    }
    try{
        const {data}=await axios.post('/api/players/addPlayers',{
            playersJSON
        },config);
        if(data){
            setConfirm("Players successfully added.");
            setError(false);
        }
    }catch(error){
        setConfirm(false);
        setError(error.response.data.message);
    }
  }
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
  })
  return (
    <div className="container">
    {error && <Message variant='danger'>{error}</Message>}
    {confirm &&<Message variant="info">{confirm}</Message>}
        <h2>Add Players</h2>
        <p className='wrapText'>CSV File must follow the following format:
         first row - gameName,region,position,team,avgKPG,avgDPG,avgAPG,avgCSPG
        followed by the player information on each row</p>
        <CSVReader
            onUploadAccepted={(results) => {
                setPlayers(results.data);
            }}
            >
            {({
                getRootProps,
                acceptedFile,
                ProgressBar,
                getRemoveFileProps,
            }) => (
                <>
                <div>
                    <Button className='my-4' type='button' {...getRootProps()}>
                    Browse file
                    </Button>
                    <div>
                    {acceptedFile && acceptedFile.name}
                    </div>
                    <Button className='my-4' {...getRemoveFileProps()}>
                    Remove
                    </Button>
                </div>
                <ProgressBar />
                
                {acceptedFile&&
                <Button onClick={addPlayers}>
                    Add Players
                </Button>
                }
                </>
                
            )}
        </CSVReader>
        
    </div>
   
  )
}

export default AddPlayers