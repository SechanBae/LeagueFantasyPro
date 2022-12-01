import React from 'react'
import { Accordion } from 'react-bootstrap'

const RulesPage = () => {
  return (
    <div className='container'>
        <h2>About/Rules</h2>
        <h5>In this application, as a user you can create or join leagues.
             As you join a league you will create a team for each league,
            upto maximum of 6 teams per league. The host can start the draft
            anytime when there is at least 2 teams. Once the draft starts,
            each team starts picking in snake order to fill every role and 
            a substitute player. You are given points on your team based off the
            real life performances by the players on your team. The league will
            follow the regular season and finish at the final 9th week.</h5>
        <Accordion className='my-5'>
            <Accordion.Item eventKey="0">
            <Accordion.Header>How am I awarded points based on performances?</Accordion.Header>
            <Accordion.Body>
            Each performance by a player is rated a score of 300 points per kills - 100 points per deaths + 150 points per assists + 1 point per CS.
            <br></br>
            Note that a player on your bench will not count towards your team points.
            </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
            <Accordion.Header>Can my league start in the middle of a regular season?</Accordion.Header>
            <Accordion.Body>
            Yes, your league can start anytime during the league,but the performances are not counted retroactively
            so only the remaining weeks of the regular season will count.
            </Accordion.Body>
      </Accordion.Item>
        </Accordion>
    </div>
  )
}

export default RulesPage