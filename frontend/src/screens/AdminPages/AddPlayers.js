import axios from 'axios';
import React, { useState } from 'react'
import { Button } from 'react-bootstrap';

import { useCSVReader } from 'react-papaparse';
import Message from '../../components/Message';
const AddPlayers = () => {
  const [players,setPlayers]=useState();
  const [error,setError]=useState(false);
  const [confirm,setConfirm]=useState(false);
  const addPlayers=async()=>{
    setPlayers(players.pop());
    let playersJSON=[];
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
    console.log(playersJSON);
    try{
        const {data}=await axios.post('/api/players/addPlayers',{
            playersJSON
        });
        if(data){
            setConfirm("Players successfully added.");
            setError(false);
        }
    }catch(error){
        setConfirm(false);
        setError(error.response.data.message);
    }
  }
  const { CSVReader } = useCSVReader();
  return (
    <div className="container">
    {error && <Message variant='danger'>{error}</Message>}
    {confirm &&<Message variant="info">{confirm}</Message>}
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
                    <Button type='button' {...getRootProps()}>
                    Browse file
                    </Button>
                    <div>
                    {acceptedFile && acceptedFile.name}
                    </div>
                    <Button {...getRemoveFileProps()}>
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