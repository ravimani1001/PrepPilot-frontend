import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [update , setUpdate] = useState(0);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get('https://preppilot-api.onrender.com/api/interview/sessions', {
          withCredentials: true,
        });
        setSessions(res.data.sessions);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [sessions]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this session?");
    if (!confirm) return;

    try {
      await axios.delete(`https://preppilot-api.onrender.com/api/interview/${id}`, {
        withCredentials: true,
      });

      setSessions((prev) => prev.filter((s) => s._id !== id));
    //   let x = update
    //   setUpdate(x + 1)
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete session.");
        console.log(err.response?.data?.message)
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">📋 Your Interview Playbook</h1>

      {loading && <p className="text-center text-gray-500">Loading sessions...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      <div className="grid md:grid-cols-2 gap-6">
        {sessions.map((session) => (
          <div
            key={session._id}
            className="bg-white rounded-xl shadow p-5 border border-blue-100 hover:shadow-2xl transition"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-1">{session.role}</h2>
            <p className="text-sm text-gray-500 mb-2">
              Date: {new Date(session.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Total Questions: {session.questions?.length || 0}
            </p>
            <div className='flex justify-between'>
                <Link
                to={`/interview/session/${session._id}`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                View Session
                </Link>
                <button
                onClick={() => handleDelete(session._id)}
                className="text-red-600 hover:font-semibold px-4 py-2 rounded-3xl border border-red-600 transition duration-2000 ease-in-out"
                >
                🗑️ Del
                </button>
            </div>
            
          </div>
        ))}
      </div>

      {sessions.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-10">No sessions found yet.</p>
      )}
    </div>
  );
};

export default Dashboard;
