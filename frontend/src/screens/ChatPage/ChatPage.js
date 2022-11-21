import React, { useEffect } from 'react'
import io from 'socket.io-client'
const ENDPOINT="http://localhost:5000";//change for deploy
var socket;
const ChatPage = () => {
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.on("connected");
    
      }, []);

  return (
    <div className="container">
        <h2>Chats</h2>
        <div className="row">
            <div className="chatLeagues col">

            </div>
            <div className="chatBox col">
                
            </div>
        </div>
    </div>
  )
}

export default ChatPage