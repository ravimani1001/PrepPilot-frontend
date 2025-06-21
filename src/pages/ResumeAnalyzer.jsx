import { useState } from 'react';
import axios from 'axios';

const ResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [role, setRole] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile || !role) {
      setError('Please upload a resume and enter the role.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('role', role);
      formData.append('jobDescription', jobDesc);

      const res = await axios.post(
        'https://preppilot-api.onrender.com/api/resume/analyze',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setResult(res.data.analysis);
    //   console.log(result)
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">Resume Analyzer</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-4 bg-white p-6 rounded shadow">
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileChange}
          className="block w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Role (e.g., Frontend Developer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          placeholder="Job Description (optional)"
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          className="w-full border rounded px-3 py-2 min-h-[100px]"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </form>
        <h1 className='text-2xl font-bold mb-4 text-center text-blue-700'>{ loading ? 'Your Resume Is Being Analyzed...' : 'Stop guessing. Start impressing with your resume!'}</h1>
      {result && (
        <div className="mt-8 bg-gray-50 p-6 rounded shadow space-y-4">
          <div>
            <h2 className="font-bold text-green-700">✅ Positives</h2>
            <p>{result.positives}</p>
          </div>
          <div>
            <h2 className="font-bold text-red-600">❌ Negatives</h2>
            <p>{result.negatives}</p>
          </div>
          <div>
            <h2 className="font-bold text-blue-600">💡 Suggestions</h2>
            <p>{result.suggestions}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
