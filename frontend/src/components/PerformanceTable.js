/**
 * Renders table of performances for a given list of performances
 */
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'

const PerformanceTable = ({performances}) => {
    const players=[];
    const [array, setArray] = useState(0)
    useEffect(() => {
        if(performances&&players.length==0){
            players.push(performances.find(p=>p.playerPerformances.position==="top"));
            players.push(performances.find(p=>p.playerPerformances.position==="jungle"));
            players.push(performances.find(p=>p.playerPerformances.position==="middle"));
            players.push(performances.find(p=>p.playerPerformances.position==="adc"));
            players.push(performances.find(p=>p.playerPerformances.position==="support"));
        }
        setArray(players);
    }, [performances])
  return (
    <Table striped hover>
        <thead>
            <tr>
                <th>Player Name</th>
                <th>Position</th>
                <th>Kills</th>
                <th>Deaths</th>
                <th>Assists</th>
                <th>CS</th>
                <th>Score</th>
            </tr>
        </thead>
        <tbody>
            {array?array.map(player=>(
                <tr key={player.performanceId}>
                    <td>{player.playerPerformances.gameName}</td>
                    <td>{player.playerPerformances.position}</td>
                    <td>{player.totalKills}</td>
                    <td>{player.totalDeaths}</td>
                    <td>{player.totalAssists}</td>
                    <td>{player.totalCS}</td>
                    <td>{player.totalScore}</td>
                </tr>
            )):<tr><td colSpan={7}>No Records</td></tr>}
        </tbody>
    </Table>
  )
}

export default PerformanceTable