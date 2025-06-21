import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const InterviewSession = () => {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [questionIndex, setquestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate()

  let currentQA = sessionData?.questions?.[questionIndex];
    // const [currentQA , setCurrentQA] = useState(sessionData?.questions?.[questionIndex])

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(`https://preppilot-api.onrender.com/api/interview/session/${sessionId}`, {
          withCredentials: true,
        });
        setSessionData(res.data);
      } catch (err) {
        setError('Could not fetch interview session.');
      }
    };

    fetchSession();
  }, [sessionId]);

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsSubmitting(true);
    console.log(sessionData)
    try {
      const res = await axios.patch(
        `https://preppilot-api.onrender.com/api/interview/${sessionId}/${questionIndex}/answer`,
        { userAnswer },
        { withCredentials: true }
      );

      // Update feedback for current question
      const updated = { ...sessionData };
      updated.questions[questionIndex].userAnswer = userAnswer;
      updated.questions[questionIndex].feedback = res.data.feedback;

      setSessionData(updated);
      
      console.log(sessionData)
    //   setCurrentQA(updated?.questions?.[questionIndex])
      setUserAnswer('');
      setIsSubmitting(false);
    } catch (err) {
      setError('Failed to submit answer.');
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (questionIndex + 1 < sessionData.questions.length) {
      setquestionIndex(questionIndex + 1);
    }
  };

  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!sessionData) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h2 className="text-xl font-semibold mb-4">Question {questionIndex + 1} of {sessionData.questions.length}</h2>
      <div className="bg-white p-4 rounded shadow mb-4">
        <p className="text-lg">{currentQA.question}</p>
      </div>

      {!currentQA.feedback ? (
        <>
          <textarea
            placeholder="Your answer..."
            className="w-full border rounded p-2 mb-4 min-h-[100px]"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
          <button
            onClick={handleSubmitAnswer}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        </>
      ) : (
        <>
          <p className="mb-2"><strong>Your Answer:</strong> {currentQA.userAnswer}</p>
          <div className="bg-green-50 border border-green-300 text-green-700 p-3 rounded mb-4">
            <strong>AI Feedback:</strong> {currentQA.feedback}
          </div>
          {questionIndex + 1 < sessionData.questions.length && (
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Next Question
            </button>
          )}
          {questionIndex + 1 == sessionData.questions.length && (
            <>
            <button
              onClick={() => navigate('/interview/form')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Practice Again!
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-4 py-2 mx-4 rounded hover:bg-blue-700"
            >
              Dashboard
            </button>
            </>
          )}
        </>
      )}

      <hr className="my-8" />
      <h3 className="text-lg font-bold mb-2">Previous Q&A</h3>
      <div className="space-y-4">
        {sessionData.questions
          .slice(0, questionIndex)
          .map((q, i) => (
            <div key={i} className="border p-4 rounded bg-gray-50">
              <p><strong>Q{i + 1}:</strong> {q.question}</p>
              <p><strong>Your Answer:</strong> {q.userAnswer}</p>
              <p><strong>AI Feedback:</strong> {q.feedback}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default InterviewSession;
