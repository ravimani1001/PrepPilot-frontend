import { Link } from 'react-router-dom';

const Home = ({isLoggedIn , setIsLoggedIn}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-5xl font-bold text-blue-600 mb-4">
        Crack Your Dream Interview with AI 💡
      </h1>
      <p className="text-lg mb-6 max-w-xl text-gray-600">
        Practice real interview questions, get smart feedback, and level up your resume — all powered by AI.
      </p>
      <div className="space-x-4">
        <Link
          to="/signup"
          className={` ${isLoggedIn ? 'hidden' : ''} px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700`}
        >
          Get Started
        </Link>
        <Link
          to="/interview/form"
          className={` ${isLoggedIn ? '' : 'hidden'} px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700`}
        >
          Let's Practice!
        </Link>
        <Link
          to="/resume-analyzer"
          className="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
        >
          Try Resume Analyzer
        </Link>
      </div>
    </div>
  );
};

export default Home;
