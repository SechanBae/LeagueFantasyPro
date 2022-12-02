import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';

import { useCSVReader } from 'react-papaparse';
import { useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
var config;
const AddPerformances = () => {
  const [performances,setPerformances]=useState();
  const [error,setError]=useState(false);
  const [confirm,setConfirm]=useState(false);
  const [week,setWeek]=useState(0);
  const [sure,setSure]=useState(false);
  const navigate=useNavigate();
  const addPerformances=async()=>{
    if(performances[0][0]!=="gameName"&&performances[0][1]!=="totalKills"&&performances[0][2]!=="totalDeaths"&&performances[0][3]!=="totalAssists"&&performances[0][4]!=="totalCS"){
        setError("File not in correct format");
        setConfirm(false);
        return;
    }
    if(week<10&&week>0){
        setPerformances(performances.pop());
        let performancesJSON=[];
        for(let i=1;i<performances.length;i++){
            performancesJSON.push({
                [performances[0][0]]:performances[i][0],
                [performances[0][1]]:performances[i][1],
                [performances[0][2]]:performances[i][2],
                [performances[0][3]]:performances[i][3],
                [performances[0][4]]:performances[i][4],
                week:week,
                totalScore:(performances[i][1]*300)+(performances[i][2]*(-100))+(performances[i][3]*150)+(performances[i][4]*1)
            })
        }
        try{
            const {data}=await axios.post('/api/performances/addPerformances',{
                performancesJSON,
                week:week
            },config);
            if(data){
                setConfirm("Performances successfully added.");
                setError(false);
            }
        }catch(error){
            setConfirm(false);
            setError(error.response.data.message);
        }
    }
    else{
        setConfirm(false);
        setError("Week Must Be In The Range 1-9");
    }
    
  }
  const finishHandler=async()=>{
    try {
        const response=await axios.put("/api/performances/finishSeason",{},config);
        if(response){
            setConfirm("Season has completed");
            setError(false);
        }
    } catch (error) {
        setConfirm(false);
        setError(error.response.data.message);
    }
  }
  const { CSVReader } = useCSVReader();
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
        <h2>Add Performances</h2>
        <p className='wrapText'>CSV File must follow the following format:
         first row - gameName,totalKills,totalDeaths,totalAssists,totalCS
        followed by the performance information on each row</p>
        {error && <Message variant='danger'>{error}</Message>}
        {confirm &&<Message variant="info">{confirm}</Message>}
        <div>
        <CSVReader
            onUploadAccepted={(results) => {
                setPerformances(results.data);
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
                <div>
                    <p>Week</p>
                    <input placeholder='Enter Week Number' className='my-3' type='number' value={week} onChange={(e)=>setWeek(e.target.value)} min="1" step="1" max="9"/>
                    <br></br>
                <Button onClick={addPerformances}>
                    Add Performances
                </Button>
                
                </div>
                
                
                }
                </>
                
            )}
        </CSVReader>
        
        </div>
        {sure?
        <div>
            <Button variant="danger" className='d-flex ms-auto my-3' onClick={()=>setSure(false)}>Cancel</Button>
            <Button variant="success" className='d-flex ms-auto my-3' onClick={()=>finishHandler()}>Confirm Finish</Button>
        </div>:
        <Button className='d-flex ms-auto' variant="success" onClick={()=>setSure(true)}>Finish Season</Button>
        }
    </div>
   
  )
}

export default AddPerformances