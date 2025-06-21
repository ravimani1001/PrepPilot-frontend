import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import InterviewForm from './pages/InterviewForm';
import InterviewSession from './pages/InterviewSession';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Dashboard from './pages/Dashboard';

function App() {
  const [isLoggedIn , setIsLoggedIn] = useState(false)
  
  // useEffect(async () => {
  //   const res = await axios.get()
  // }, [])
  useEffect(() => {
  axios.get('http://localhost:5000/api/test-auth', { withCredentials: true })
    .then((res) => {
      if(res.data.userId) {setIsLoggedIn(true)
        console.log("USER LOGGED IN")}
      })
    .catch((err) => {setIsLoggedIn(false);
      console.log("User NOT LOGGED IN")
    });
}, [isLoggedIn]);

  

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Signup isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/interview/form" element={<InterviewForm />} />
        <Route path="/interview/session/:sessionId" element={<InterviewSession />} />
        <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
