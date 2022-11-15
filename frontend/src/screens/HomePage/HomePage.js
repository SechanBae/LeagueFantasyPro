import axios from 'axios';
import React, { useEffect, useState } from 'react'

const HomePage = () => {
    const [leagues,setLeagues]=useState([]);
    useEffect(()=>{
        async function getNotes(){
            try{
                const userInfo=localStorage.getItem("userInfo");
                const config={
                    headers:{
                        Authorization:'Bearer '+JSON.parse(userInfo).token,
                    },
                }
                const response=await axios.get('/api/leagues/',config);
                console.log(response);
                setLeagues(response.data.leagues);
            }
            catch(error){
                console.log(error);
            }
        }
        getNotes();
    },[])
    return (
        <div className='container'>
            <h1>Home</h1>
            {leagues&&
            leagues.map((league)=>(
                <p>{league.name}</p>
            ))
            }
        </div>
    )
}

export default HomePage