import React, { useState } from 'react'
import { Table } from 'react-bootstrap';
import {isEqual} from 'lodash';
const PlayerTable = ({setPlayerChosen,currentPlayers,setPlayers,players,playerChosen}) => {
    const [orderDirection,setOrderDirection]=useState("ASC");
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
            <tr onClick={()=>{setPlayerChosen(player)}} key={player.playerId} className={isEqual(playerChosen,player)?'active':''}>
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
            <td colSpan="8">Looks like there aren't any players here</td>
        </tr>
        }
            </tbody>
    </Table>
  )
}

export default PlayerTable