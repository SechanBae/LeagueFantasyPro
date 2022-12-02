/**
 * Renders component for chat page
 */
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card, CloseButton, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'
import Message from '../../components/Message';
const ENDPOINT = "https://league-fantasy-pro.herokuapp.com/"; //change for deploy
var socket;
var config;
var userId;
var chosenChat;
const ChatPage = () => {
  
  const [leagues,setLeagues]=useState(false);
  const [error,setError]=useState(false);
  const [filter,setFilter]=useState("");
  const [messageContent,setMessageContent]=useState("");
  const [messages,setMessages]=useState(false);
  const navigate=useNavigate(); ;
  /**
   * When component is mounted, redirect user if they are not logged in and set config headers for verify login
   * set up websocket as well as getting the leagues(chatroom) of the user
   */
  useEffect(()=>{
    const userInfo=sessionStorage.getItem("userInfo");
    if(!userInfo){
        navigate("/");
    }
    else{
      userId=(JSON.parse(userInfo).userId);
        config={
          headers:{
              Authorization:'Bearer '+JSON.parse(userInfo).token,
          },
        }
        getLeagues();
        socket=io(ENDPOINT);
        socket.on("messageBroadcast",(leagueId)=>{
          console.log(leagueId);
          console.log(chosenChat);
          if(leagueId==chosenChat){
            setChosenChat(leagueId);
          }
        })
      }
},[])
/**
 * Set chat room to selected league and make api call to get messages for that league
 * @param {*} leagueId 
 */
const setChosenChat=async(leagueId)=>{
  console.log(leagueId);
  chosenChat=leagueId;
  console.log(chosenChat);
  try{
    const response=await axios.get("/api/messages/"+leagueId,config);
    setMessages(response.data.messages);
  }catch(error){
    setError(error.response.data.message);
  }
}
/**
 * Get leagues (chatrooms) for a user
 */
const getLeagues=async()=>{
  try {
    const response=await axios.get('/api/leagues/',config);
    setLeagues(response.data.leagues);
  } catch (error) {
    setError(error.response.data.message);
  }
}
/**
 * Makes api call to send message, sends socket info that message has been sent
 * @param {*} content 
 */
const submitMessage=async(content)=>{
  try {
    const response=await axios.post("/api/messages/sendMessage",{
      content:content,
      leagueId:chosenChat
    },config)
    if(response){
      socket.emit("messageSubmit",(chosenChat));
      setChosenChat(chosenChat);
    }
  } catch (error) {
    
  }
}
/**
 * When user presses enter to submit message
 * @param {event} e 
 */
const handleKeyUp=(e)=>{
  if(e.keyCode===13){
    submitMessage(e.target.value);
    setMessageContent("");
  }
}

  return (
    <div className="container">
      {error && <Message variant='danger'>{error}</Message>}
      <h2>Chat</h2>
      {!chosenChat&&
      <div className="chat col-12 border border-white rounded ">
        <h5 className='text-center mt-2'>My Chat Rooms</h5>
        <Form.Control
                className='my-3 d-flex mx-auto'
                type="text"
                value={filter}
                onChange={(e)=>setFilter(e.target.value)}
                placeholder="Search for League Name"
                style={{width:"60vw"}}
          />
          <div className='chatSelect'>
          {leagues?
            leagues.filter(league=>league.name.toLowerCase().includes(filter.toLocaleLowerCase())).map((league)=>(
              <Card role="button" onClick={()=>setChosenChat(league.leagueId)} key={league.leagueId} className='my-3 border border-white d-flex mx-auto' style={{width:"50vw"}}>
                  <Card.Body>
                    {league.name}
                  </Card.Body>
              </Card>
            )):
            <h3 className='text-center my-2'>Looks like you are not in any leagues yet</h3>
            }
            </div>
      </div>
      }
      {chosenChat&&
      <div className='chat col-12 border border-white rounded '>
        <CloseButton
          onClick={()=>setChosenChat(false)}
        />
        <div className='chatList'>
          <ul className="list-group">
            {messages&&
            messages.map((message)=>(
              <div key={message.messageId}>
              <li className={(message.users.userId===userId?'userMessage':'otherMessage')+' mt-3'}>
              {message.users.userId!==userId&&<p className='p-2 mb-0'>{message.users.username}:</p>}
              <p className={'d-inline border border-white rounded p-2 mb-0 messageContent'}>
                {message.content}
              </p>
              </li>
              <li className={(message.users.userId===userId?'userMessage':'otherMessage')+ " tiny"}>
                {message.createdAt&&new Date(message.createdAt).toDateString()+" "+new Date(message.createdAt).toLocaleTimeString('en-us')}
              </li>
              </div>
              
          ))}
          </ul>
        </div>
        <Form.Control
          className='mt-2 chatInput'
          type="text"
          value={messageContent}
          onChange={(e)=>setMessageContent(e.target.value)}
          onKeyUp={handleKeyUp}
          placeholder="Send Message"
        />
      </div>
      }
    </div>
  )
}

export default ChatPage