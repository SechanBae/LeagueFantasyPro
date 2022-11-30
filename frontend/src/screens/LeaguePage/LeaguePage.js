import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Accordion, Badge, Button, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom'
import Message from '../../components/Message';
import PerformanceTable from '../../components/PerformanceTable';
var config;
var host;
const LeaguePage = () => {
    const {leagueId}=useParams();
    const [error,setError]=useState(false);
    const [confirm, setconfirm] = useState(false);
    const [leagueInfo,setLeagueInfo]=useState({});
    const [draftStatus,setDraftStatus]=useState("");
    const [teams,setTeams]=useState([]);
    const [username,setUsername]=useState("");
    const [performances, setPerformances] = useState(false);
    const [detailedPerformances, setDetailedPerformances] = useState(false);
    const [selectedTeam,setSelectedTeam]=useState(false);
    const navigate=useNavigate();
    useEffect(()=>{
      const userInfo=sessionStorage.getItem("userInfo");
      if(!userInfo){
          navigate("/");
      }
      else{
        setUsername(JSON.parse(userInfo).username.toLowerCase());
        config={
          headers:{
              Authorization:'Bearer '+JSON.parse(userInfo).token,
          },
        }
      }
      async function getLeague(){
          try {
            const response=await axios.get("/api/leagues/getLeagueInfo/"+leagueId,config);
            setLeagueInfo(response.data.league);
            setTeams(response.data.teams);
            setDraftStatus(response.data.league.draftStatus);
            host=await response.data.league.host.toLowerCase();
          } catch (error) {
            console.log(error);
            setError(error.response.data.message);
          }
      }
      
      getLeague();
    },[])
    const getMatchHistory=async(teamId)=>{
      try {
        const response=await axios.get("/api/performances/getPerformances/"+teamId,config);
        setPerformances(response.data.teamPerformances);
      } catch (error) {
        setError(error.response.data.message);
      }
    }
    const getDetailedMatchHistory=async(top,jg,mid,adc,sup)=>{
      try {
        const response=await axios.post("/api/performances/getDetailedPerformances/",{
          top,jg,mid,adc,sup
        },config);
        setDetailedPerformances(response.data.detailedPerformances)
        console.log(response.data.detailedPerformances);
      } catch (error) {
        setError(error.response.data.message);
      }
    }
    const startDraftHandler=async()=>{
      try{
        const response=await axios.put("/api/leagues/startDraft/",{
          leagueId:leagueId
        },config);
        setDraftStatus("ONGOING");
      }catch(error){
        setError(error.response.data.message);
      }
    }
    const leaveHandler=async()=>{
      try{
        const response=await axios.delete("/api/teams/leaveLeague/"+leagueId,config);
        if(response){
          navigate('/');
        }
      }catch(error){
        setError(error.response.data.message);
      }
    }
  return (
    <div className='container'>
      
    {confirm &&<Message variant="info">{confirm}</Message>}
    {error && <Message variant='danger'>{error}</Message>}
    <div className='d-flex flex-row'>
      <Button onClick={()=>navigate('/league/draft/'+leagueId)} className='my-3 ms-3' variant='success'>Draft Page</Button>
    </div>
      
        {
          draftStatus==="PENDING"&&
          <Message variant='warning'>Waiting for host ({leagueInfo.host}) to start draft...</Message>
        }
        {
          draftStatus==="ONGOING"&&
          <Message variant='primary'>Draft has started! go to the draft page</Message>
        }
        {(host===username&&draftStatus==="PENDING")&&
          <Button onClick={startDraftHandler} className='mx-auto d-flex' variant='primary'>Start Draft</Button>
        }
        <div className='row'>
          <div className="teams container col-md-6 col-sm-12">
            <h2 className='text-center'>Teams in League</h2>
            {teams&&
            teams.map((team)=>(
              <div  className='d-flex flex-row row justify-content-around' key={team.teamId}>
                <Card style={{ width: '18rem' }} className='my-2 col-9' >
                  <Card.Header className='text-center' as="h3">{team.teamName}</Card.Header>
                  <Card.Body>
                    <Card.Text className='text-center'>
                      User: {team.users.username}
                    </Card.Text>
                    <Button className='mx-auto d-flex'size='sm' onClick={()=>navigate('/team/'+team.teamId)}>Go To Team Page</Button>
                  </Card.Body>

                </Card>
                <Button variant='outline-light' size='sm' className='col-3' onClick={()=>getMatchHistory(team.teamId)}>
                    <h3>{team.points} - PTS</h3>
                </Button>
              </div>
            ))
            }
          </div>
          <div className="matches col-md-6 col-sm-12">
            <h2 className='text-center'>League Match History</h2>
            <Accordion >
            {performances?
            performances.map((performance)=>(
              <Accordion.Item  eventKey={performance.teamPerformanceId} key={performance.teamPerformanceId}>
                <Accordion.Header onClick={()=>getDetailedMatchHistory(performance.top,performance.jungle,performance.middle,performance.adc,performance.support)}>Week {performance.week} {performance.score} Points</Accordion.Header>
                <Accordion.Body className='weeklyPerformance'>
                  <PerformanceTable performances={detailedPerformances}/>
                </Accordion.Body>
              </Accordion.Item>))
            :
            <h5>Click on the points on one of the teams to see their match history</h5>}
              </Accordion>
            
          </div>
        </div>
        {draftStatus==="PENDING"&&
          <Button onClick={leaveHandler} className='ms-auto d-flex mt-5' variant='danger'>Leave League</Button>
        }
    </div>
  )
}

export default LeaguePage