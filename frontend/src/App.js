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
import ProfilePage from './screens/ProfilePage/ProfilePage';
import LeaguePage from './screens/LeaguePage/LeaguePage';
import ForgotPasswordPage from './screens/ResetPasswordPages/ForgotPasswordPage';
import PasswordResetPage from './screens/ResetPasswordPages/PasswordResetPage';
import DraftPage from './screens/DraftPage/DraftPage';
import TeamPage from './screens/TeamPage/TeamPage';
import AddPerformances from './screens/AdminPages/AddPerformances';
import TradePage from './screens/TradePage/TradePage';
const App=()=> (
  <BrowserRouter>
    <Header/>
    <main className='mt-5'>
      <Routes>
        <Route path="/" element={<LandingPage/>} exact/>
        <Route path="/login" element={<LoginPage/>} exact/>
        <Route path="/register" element={<RegisterPage/>} exact/>
        <Route path="/forgotPassword" element={<ForgotPasswordPage/>} exact/>
        <Route path="/passwordReset">
          <Route path=":token" element={<PasswordResetPage/>} exact/>
        </Route>
        <Route path="/home" element={<HomePage/>} exact/>
        <Route path="/admin">
          <Route path="addPlayers" element={<AddPlayers/>} exact/>
          <Route path="addPerformances" element={<AddPerformances/>} exact/>
        </Route>
        <Route path="/createLeague" element={<CreateLeaguePage/>} exact/>
        <Route path="/joinLeague" element={<JoinLeaguePage/>} exact/>
        <Route path="/profile" element={<ProfilePage/>} exact/>
        <Route path="/league">
          <Route path=":leagueId"element={<LeaguePage/>}exact/>
          <Route path="draft/:leagueId" element={<DraftPage/>}exact/>
        </Route>
        <Route path='/team'>
          <Route path=':teamId' element={<TeamPage/>}exact/>
          <Route path="trade/:teamId" element={<TradePage/>}exact/>
        </Route>
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
    </main>
     <Footer/>
  </BrowserRouter>
);




export default App;
