import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import LandingPage from './screens/LandingPage/LandingPage';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from './screens/LoginPage/LoginPage';
import RegisterPage from './screens/RegisterPage/RegisterPage';
import HomePage from './screens/HomePage/HomePage';
const App=()=> (
  <BrowserRouter>
    <Header/>
    <main>
      <Routes>
        <Route path="/" element={<LandingPage/>} exact/>
        <Route path="/login" element={<LoginPage/>} exact/>
        <Route path="/register" element={<RegisterPage/>} exact/>
        <Route path="/home" element={<HomePage/>} exact/>
      </Routes>
    </main>
     <Footer/>
  </BrowserRouter>
);




export default App;
