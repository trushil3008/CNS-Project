import { useEffect, useState } from 'react';

function Dashboard() {
  const [secondsLeft, setSecondsLeft] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    const timeout = setTimeout(() => {
      window.location.href = 'https://www.paypal.com/signin';
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="redirect-page">
      <div className="redirect-card">
        <h2>Oops! Something went wrong.</h2>
        <p>Redirecting in {secondsLeft} second{secondsLeft !== 1 ? 's' : ''}...</p>
      </div>
    </div>
  );
}

export default Dashboard;
