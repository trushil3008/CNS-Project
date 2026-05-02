import { useEffect } from 'react';

function Dashboard() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.location.href = 'https://www.paypal.com/signin';
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="redirect-page">
      <div className="redirect-card">
        <h2>Oops! Something went wrong.</h2>
        <p>We are trying to resolve things! Please retry....</p>
      </div>
    </div>
  );
}

export default Dashboard;
