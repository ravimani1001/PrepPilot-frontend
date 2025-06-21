import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InterviewForm = () => {
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [numQuestions, setNumQuestions] = useState(5);
  const [error, setError] = useState('');
  const [isGenerating , setIsGenerating] = useState(false)

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsGenerating(true)

    try {
      const res = await axios.post(
        'https://preppilot-api.onrender.com/api/interview/generate',
        {
          role,
          skills: skills.split(',').map(skill => skill.trim()),
          difficulty,
          numQuestions,
        },
        { withCredentials: true }
      );
      
      const sessionId = res.data.sessionId; // Assuming backend returns sessionId
      setIsGenerating(false)
      navigate(`/interview/session/${sessionId}`);
    } catch (err) {
        setIsGenerating(false)
      setError(err.response?.data?.message || 'Failed to start interview.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded px-8 pt-6 pb-8 w-full max-w-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Start Interview Preparation</h2>

        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Role (e.g. Backend Developer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <input
          type="text"
          placeholder="Skills (comma-separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <input
          type="number"
          min="1"
          max="20"
          placeholder="Number of Questions"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
          required
          className="w-full mb-6 px-3 py-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isGenerating ? 'Framing Questions...' : 'Generate Questions'}
        </button>
      </form>
    </div>
  );
};

export default InterviewForm;
