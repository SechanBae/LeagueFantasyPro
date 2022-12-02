import React, { useEffect } from 'react'
import { Button, Card } from 'react-bootstrap'

const LeagueList = ({leagues}) => {
    useEffect(() => {
    }, [])
    
  return (
    <div className='d-flex flex-row overflowx'>
        {leagues.length?  
            (leagues.map((league)=>(
                <Card key={league.leagueId} style={{minWidth:"15rem"}} className="me-3">
                    <Card.Header as="h5">{league.region} League: {league.name}</Card.Header>
                    <Card.Body>
                        <Card.Title>Team Name: {league.teamName}</Card.Title>
                        <Card.Text>
                        Your team currently has {league.points} points.
                        </Card.Text>
                        <Button variant="info" href={"/league/"+league.leagueId}>Go to League Page</Button>
                    </Card.Body>
                </Card>
            )))
            :(<h6 className='text-center'>You do not have any leagues here</h6>)
            }
    </div>
  )
}

export default LeagueList