import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../components/Representatives.css'; // Import your CSS file
import '../../src/styles.css'; // Import your global styles

const Representatives = () => {
  const [reps, setReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReps = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/representatives', {
          withCredentials: true,
        });
        setReps(response.data.results);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchReps();
  }, []);

  if (loading) return <div className="representatives-container">Loading...</div>;
  if (error) return <div className="representatives-container">Error: {error.message}</div>;

  return (
    <div>
      <h1 className="page-header">Representatives</h1>
      <div className="container">
        {reps.map((rep, index) => (
          <div key={index} className="card">
            {rep.image && <img src={rep.image} alt={`${rep.name}`} className="card-img-top" />}
            <div className="card-body">
              <h5 className="card-title">{rep.name}</h5>
              <p className="card-text">{rep.current_role.title}</p>
              <p className="card-text">{rep.party}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Representatives;
