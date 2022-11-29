import axios from 'axios';
import React, { useState } from 'react'
import { Button } from 'react-bootstrap';

import { useCSVReader } from 'react-papaparse';
import Message from '../../components/Message';
const AddPerformances = () => {
  const [performances,setPerformances]=useState();
  const [error,setError]=useState(false);
  const [confirm,setConfirm]=useState(false);
  const [week,setWeek]=useState(0);
  const addPerformances=async()=>{
    if(week<10&&week>0){
        setPerformances(performances.pop());
        let performancesJSON=[];
        console.log(performances);
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
            });
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
  const { CSVReader } = useCSVReader();
  return (
    <div className="container">
        <h2>Add Performances</h2>
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
                    <input placeholder='Enter Week Number' className='my-3' type='number' value={week} onChange={(e)=>setWeek(e.target.value)}/>
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
        
    </div>
   
  )
}

export default AddPerformances