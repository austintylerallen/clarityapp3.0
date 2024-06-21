import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/elections');
        setElections(response.data.elections);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Upcoming Elections</h1>
      {elections.map((election, index) => (
        <div key={index}>
          <h2>{election.name}</h2>
          <p>{election.electionDay}</p>
        </div>
      ))}
    </div>
  );
};

export default Elections;
