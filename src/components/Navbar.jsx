import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({isLoggedIn , setIsLoggedIn}) => {
  const location = useLocation();
  const navigate = useNavigate()

  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  if (isAuthPage) return null; // Don't show navbar on login/signup

  const getLinkClasses = (path) => {
    let baseClasses = 'hover:text-blue-600 hover:shadow px-2 py-1'
    if(location.pathname === path){
      baseClasses += ' text-blue-600 font-semibold'
    }
    return baseClasses
  }

  const handleLogout = async () => {
    try {
      const res = await axios.post('https://preppilot-api.onrender.com/api/auth/logout')
      console.log(res.data.message)
      setIsLoggedIn(!isLoggedIn)
      navigate('/')
    } catch (error) {
      console.log("Error : ", error.message)
    }
  }

  return (
    <nav className="bg-white shadow px-10 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        PrepPilot
      </Link>
      <div className="space-x-10">
        <Link to="/dashboard" className={getLinkClasses('/dashboard')}>Dashboard</Link>
        <Link to="/interview/form" className={getLinkClasses('/interview/form')}>Interview</Link>
        <Link to="/resume-analyzer" className={getLinkClasses('/resume-analyzer')}>Resume Analyzer</Link>
        <Link to="/login" className={`hover:text-blue-600 hover:shadow px-2 py-1 ${ isLoggedIn ? 'hidden' : '' }`}>Login</Link>
        <Link to="/signup" className={`hover:text-blue-600 hover:shadow px-2 py-1 ${ isLoggedIn ? 'hidden' : '' }`}>Signup</Link>
        <button onClick={handleLogout} className={`rounded-full border border-blue-600 px-3 py-1 text-blue-600 ${!isLoggedIn ? 'hidden' : ''}  `}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
