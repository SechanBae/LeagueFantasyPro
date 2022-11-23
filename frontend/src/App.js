import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import LandingPage from './screens/LandingPage/LandingPage';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from './screens/LoginPage/LoginPage';
import RegisterPage from './screens/RegisterPage/RegisterPage';
import HomePage from './screens/HomePage/HomePage';
import AddPlayers from './screens/AdminPages/AddPlayers';
import ChatPage from './screens/ChatPage/ChatPage';
import CreateLeaguePage from './screens/CreateLeaguePage/CreateLeaguePage';
import JoinLeaguePage from './screens/JoinLeaguePage.js/JoinLeaguePage';
import NotFoundPage from './screens/NotFoundPage/NotFoundPage';
const App=()=> (
  <BrowserRouter>
    <Header/>
    <main className='mt-5'>
      <Routes>
        <Route path="/" element={<LandingPage/>} exact/>
        <Route path="/login" element={<LoginPage/>} exact/>
        <Route path="/register" element={<RegisterPage/>} exact/>
        <Route path="/home" element={<HomePage/>} exact/>
        <Route path="/admin/addPlayers" element={<AddPlayers/>} exact/>
        <Route path="/createLeague" element={<CreateLeaguePage/>} exact/>
        <Route path="/joinLeague" element={<JoinLeaguePage/>} exact/>
        <Route path="/chats" element={<ChatPage/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
    </main>
     <Footer/>
  </BrowserRouter>
);




export default App;
